import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react";
import ePub, { Book, Contents, Location, NavItem, Rendition } from "epubjs";
import Section from "epubjs/types/section";
import Spine from "epubjs/types/spine";
import { useTheme } from "next-themes";
import { getReaderTheme } from "@/lib/get-reader-theme";
import { useAtom } from "jotai";
import { computedReaderStylesAtom } from "@/atoms/computed-reader-styles";
import { getChapterFromCfi, getPageFromCfi } from "@/lib/epub-utils";
import { readerOverridesAtom } from "@/atoms/reader-preferences";
// TODO: fit cover page with no padding
// TODO: add highlights UI
// TODO: add notes UI

const defaultConfig = {
  highlight: {
    className: "epub-highlight",
    style: {
      fill: "yellow",
      fillOpacity: "0.5",
      mixBlendMode: "multiply",
    },
  },
  underline: {
    className: "epub-underline",
    style: {
      stroke: "yellow",
      strokeWidth: "1",
    },
  },
  note: {
    className: "epub-note",
    style: {
      fill: "lightblue",
      fillOpacity: "0.4",
      mixBlendMode: "multiply",
    },
  },
  searchResult: {
    className: "epub-search-highlight",
    style: {
      fill: "red",
      fillOpacity: "0.3",
      mixBlendMode: "multiply",
    },
  },
  selectedSearchResult: {
    style: {
      fill: "yellow",
      fillOpacity: "100",
      mixBlendMode: "multiply",
    },
  },
};

export type Highlight = {
  id?: string;
  cfi: string;
  text: string;
  type?: HighlightType;
  color?: string;
  rect?: DOMRect;
};

type HighlightType = "highlight" | "underline";

type Bookmark = {
  cfi: string;
  label?: string;
  createdAt: string;
  chapter: string | null;
  page: number | null;
};

type Note = {
  cfi: string;
  text: string;
  note: string;
};

type SearchResult = {
  cfi: string;
  excerpt: string;
  href: string;
  chapterTitle: string;
  chapterIndex: number;
};

type EnhancedNavItem = NavItem & {
  page?: number;
  subitems?: EnhancedNavItem[];
};

interface ExtendedSpine extends Spine {
  spineItems: Section[];
}

interface IUseEpubReaderReturn {
  location: string | null;
  goNext: () => void;
  goPrev: () => void;
  goToHref: (href: string) => void;
  goToCfi: (cfi: string) => void;
  toc: EnhancedNavItem[];
  viewerRef: React.RefObject<HTMLDivElement | null>;
  addHighlight: (args: Highlight) => void;
  highlights: Highlight[];
  bookmarks: Bookmark[];
  addBookmark: () => void;
  goToBookmark: (cfi: string) => void;
  removeBookmark: (cfiToRemove: string) => void;
  removeAllBookmarks: () => void;
  searchResults: SearchResult[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  removeHighlight: (cfi: string, type: HighlightType) => void;
  removeAllHighlights: () => void;
  addNote: (note: Note) => void;
  notes: Note[];
  currentPage: number;
  totalPages: number;
  error: Error | null;
  isLoading: boolean;
  progress: number;
  bookTitle: string | null;
  bookCover: string | null;
  selection: { cfi: string; text: string; rect: DOMRect } | null;
  setSelection: React.Dispatch<React.SetStateAction<{ cfi: string; text: string; rect: DOMRect } | null>>;
}

export function useEpubReader(url: string): IUseEpubReaderReturn {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const bookRef = useRef<Book | null>(null);
  const previousSearchHighlights = useRef<string[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  const [toc, setToc] = useState<EnhancedNavItem[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [spine, setSpine] = useState<ExtendedSpine | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [bookTitle, setBookTitle] = useState<string | null>(null);
  const [bookCover, setBookCover] = useState<string | null>(null);
  const [selectedCfi, setSelectedCfi] = useState<string>("");
  const [previousSelectedCfi, setPreviousSelectedCfi] = useState<string | null>(null);
  const [selection, setSelection] = useState<{ cfi: string; text: string; rect: DOMRect } | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [computedStyles] = useAtom(computedReaderStylesAtom);
  const [overrides] = useAtom(readerOverridesAtom);

  const STORAGE_KEY_LOC = `epub-location-${url}`;
  const STORAGE_KEY_HIGHLIGHTS = `epub-highlights-${url}`;
  const STORAGE_KEY_BOOKMARK = `epub-bookmarks-${url}`;
  const STORAGE_KEY_NOTES = `epub-notes-${url}`;
  const STORAGE_KEY_TOC = `epub-toc`;

  const addHighlight = useCallback(
    ({ cfi, text, type = "highlight", color = "yellow" }: Highlight) => {
      const config = {
        ...defaultConfig[type],
        style: { ...defaultConfig[type].style, fill: color, stroke: color },
      };
      const newHighlight = { cfi, text, color, type };

      renditionRef.current?.annotations.add(type, cfi, { text }, undefined, config.className, config.style);

      setHighlights((prev) => {
        const updated = [...prev, newHighlight];
        localStorage.setItem(STORAGE_KEY_HIGHLIGHTS, JSON.stringify(updated));
        return updated;
      });

      setSelection(null);
    },
    [STORAGE_KEY_HIGHLIGHTS],
  );

  const removeHighlight = (cfi: string, type: HighlightType) => {
    try {
      renditionRef.current?.annotations.remove(cfi, type);

      const rendition = renditionRef.current;
      if (rendition && rendition.getContents) {
        try {
          const contents = rendition.getContents();
          if (contents && typeof contents === "object") {
            const contentsArray = Array.isArray(contents) ? contents : [contents];
            contentsArray.forEach((content) => {
              if (content && content.document) {
                const highlightElements = content.document.querySelectorAll(`[data-cfi="${cfi}"]`);
                highlightElements.forEach((el: Element) => el.remove());

                const classElements = content.document.querySelectorAll(".epub-highlight");
                classElements.forEach((el: Element) => {
                  if (el.getAttribute("data-cfi") === cfi) {
                    el.remove();
                  }
                });
              }
            });
          }
        } catch (domError) {
          console.warn("Error removing highlight from DOM:", domError);
        }
      }
    } catch (error) {
      console.warn("Error removing highlight annotation:", error);
    }

    if (renditionRef.current && location) {
      requestAnimationFrame(() => {
        renditionRef.current?.display(location);
      });
    }

    setHighlights((prev) => {
      const updated = prev.filter((h) => h.cfi !== cfi);
      localStorage.setItem(STORAGE_KEY_HIGHLIGHTS, JSON.stringify(updated));
      return updated;
    });
  };

  const removeAllHighlights = () => {
    highlights.forEach((highlight) => {
      try {
        renditionRef.current?.annotations.remove(highlight.cfi, "highlight");
      } catch (error) {
        console.warn("Error removing highlight annotation:", error);
      }
    });

    if (renditionRef.current && location) {
      requestAnimationFrame(() => {
        renditionRef.current?.display(location);
      });
    }

    localStorage.removeItem(STORAGE_KEY_HIGHLIGHTS);
    setHighlights([]);
  };

  const addBookmark = useCallback(async () => {
    const book = bookRef.current;
    if (!location || !book) {
      console.warn("addBookmark: not a valid location to add a bookmark. location", location);
      return;
    }

    const chapter = await getChapterFromCfi(book, location);
    const page = getPageFromCfi(book, location);

    const newBookmark: Bookmark = {
      cfi: location,
      createdAt: new Date().toISOString(),
      chapter,
      page,
    };

    setBookmarks((prev) => {
      const updated = [...prev, newBookmark];
      localStorage.setItem(STORAGE_KEY_BOOKMARK, JSON.stringify(updated));
      return updated;
    });
  }, [location, STORAGE_KEY_BOOKMARK]);

  const goToBookmark = useCallback((cfi: string) => {
    if (!cfi) {
      console.warn("goToBookmark: not a valid CFI to go. CFI", cfi);
      return;
    }

    renditionRef.current?.display(cfi);
  }, []);

  const removeBookmark = useCallback(
    (cfiToRemove: string) => {
      setBookmarks((prev) => {
        const updated = prev.filter((b) => b.cfi !== cfiToRemove);
        localStorage.setItem(STORAGE_KEY_BOOKMARK, JSON.stringify(updated));
        return updated;
      });
    },
    [STORAGE_KEY_BOOKMARK],
  );

  const removeAllBookmarks = useCallback(() => {
    setBookmarks(() => {
      localStorage.removeItem(STORAGE_KEY_BOOKMARK);
      return [];
    });
  }, [STORAGE_KEY_BOOKMARK]);

  const goNext = useCallback(() => {
    renditionRef.current?.next();
  }, []);

  const goPrev = useCallback(() => {
    renditionRef.current?.prev();
  }, []);

  const goToHref = useCallback((href: string) => {
    renditionRef.current?.display(href);
  }, []);

  const goToCfi = useCallback((cfi: string) => {
    setSelectedCfi(cfi);
    renditionRef.current?.display(cfi);
  }, []);

  const addNote = useCallback(
    ({ cfi, text, note }: Note) => {
      const newNote: Note = { cfi, text, note };

      // visually annotate
      renditionRef.current?.annotations.add("highlight", cfi, { text }, undefined, defaultConfig.note.className, defaultConfig.note.style);

      // update state + localStorage
      setNotes((prev) => {
        const updated = [...prev, newNote];
        localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updated));
        return updated;
      });
    },
    [STORAGE_KEY_NOTES],
  );

  const enhanceTocWithPages = useCallback(async (tocItems: NavItem[], book: Book): Promise<EnhancedNavItem[]> => {
    const enhanceItem = async (item: NavItem, index: number): Promise<EnhancedNavItem> => {
      let page: number | undefined;

      try {
        if (book.locations?.length() > 0) {
          page = Math.floor((index / tocItems.length) * book.locations.length()) + 1;

          if (page < 1) page = 1;
          if (page > book.locations.length()) page = book.locations.length();
        }
      } catch (error) {
        console.warn("Error estimating page for TOC item:", error);
      }

      const enhancedItem: EnhancedNavItem = {
        ...item,
        page,
      };

      if (item.subitems && item.subitems.length > 0) {
        enhancedItem.subitems = await Promise.all(item.subitems.map((subitem, subIndex) => enhanceItem(subitem, index + subIndex + 1)));
      }

      return enhancedItem;
    };

    return Promise.all(tocItems.map((item, index) => enhanceItem(item, index)));
  }, []);

  const searchBook = useCallback(
    async (query: string) => {
      const book = bookRef.current;
      if (!query || !book || !spine) {
        console.warn(`Invalid searchBook call`);
        setSearchResults([]);
        return;
      }

      const trimmedQuery = query.trim().toLowerCase();
      if (!trimmedQuery) {
        setSearchResults([]);
        return;
      }

      const results: SearchResult[] = [];
      const spineItems = (spine as ExtendedSpine)?.spineItems ?? [];
      if (!Array.isArray(spineItems) || spineItems.length === 0) {
        setSearchResults([]);
        return;
      }
      const contextLength = 30;

      const promises = spineItems.map(async (item, chapterIndex) => {
        try {
          await item.load(book.load.bind(book));
          const doc = item.document;
          if (!doc) return;

          const walker = doc.createTreeWalker(doc, NodeFilter.SHOW_TEXT);
          const textNodes: Node[] = [];
          let node: Node | null;
          while ((node = walker.nextNode())) textNodes.push(node);

          const fullText = textNodes
            .map((n) => n.textContent || "")
            .join("")
            .toLowerCase();

          let pos = fullText.indexOf(trimmedQuery);
          while (pos !== -1) {
            let offset = pos;
            let nodeIndex = 0;

            // Find the matching node and offset
            while (nodeIndex < textNodes.length) {
              const nodeText = textNodes[nodeIndex].textContent || "";
              if (offset < nodeText.length) break;
              offset -= nodeText.length;
              nodeIndex++;
            }

            if (nodeIndex < textNodes.length) {
              try {
                const range = doc.createRange();
                range.setStart(textNodes[nodeIndex], offset);
                range.setEnd(textNodes[nodeIndex], offset + trimmedQuery.length);

                const cfi = item.cfiFromRange(range);
                const excerpt = fullText.substring(Math.max(0, pos - contextLength), pos + trimmedQuery.length + contextLength);

                const chapterTitle = await getChapterFromCfi(book, cfi);

                results.push({
                  cfi,
                  excerpt: `...${excerpt}...`,
                  href: item.href,
                  chapterTitle: chapterTitle || "",
                  chapterIndex,
                });
              } catch (e) {
                console.warn("Invalid range during search", e);
              }
            }

            pos = fullText.indexOf(trimmedQuery, pos + 1);
          }

          item.unload?.();
        } catch (error) {
          console.error("Error searching spine item:", error);
        }
      });

      await Promise.all(promises);
      setSearchResults(results);
    },
    [bookRef, spine],
  );

  // SEARCH EFFECT
  useEffect(() => {
    if (deferredSearchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    if (deferredSearchQuery.length >= 3) {
      searchBook(deferredSearchQuery);
    }
  }, [deferredSearchQuery, searchBook]);

  // HIGHLIGHT SEARCH RESULTS EFFECT
  useEffect(() => {
    if (!renditionRef.current) return;

    // Clear previous search highlights
    for (const cfi of previousSearchHighlights.current) {
      renditionRef.current?.annotations.remove(cfi, "highlight");
    }
    previousSearchHighlights.current = [];

    // Add new highlights
    for (const result of searchResults) {
      renditionRef.current.annotations.add("highlight", result.cfi, { text: result.excerpt }, undefined, defaultConfig.searchResult.className, defaultConfig.searchResult.style);
      previousSearchHighlights.current.push(result.cfi);
    }
  }, [searchResults]);

  // HIGHLIGHT SELECTED SEARCH EFFECT
  useEffect(() => {
    if (!selectedCfi || !renditionRef.current) return;

    // Remove the previous highlight
    if (previousSelectedCfi) renditionRef.current.annotations.remove(previousSelectedCfi, "highlight");

    // Add the new highlight with inline styles
    renditionRef.current.annotations.add(
      "highlight",
      selectedCfi,
      {}, // data
      undefined, // cb
      undefined, // no className
      defaultConfig.selectedSearchResult.style,
    );
    setPreviousSelectedCfi(selectedCfi);
  }, [previousSelectedCfi, selectedCfi]);

  // Effect for book initialization and cleanup
  useEffect(() => {
    if (!viewerRef.current) return;

    setError(null); // Clear previous errors
    setIsLoading(true); // Set loading to true at the start

    try {
      const book = ePub(url);
      const rendition = book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
        allowScriptedContent: true,
      });

      bookRef.current = book;
      renditionRef.current = rendition;

      book.ready.then(async () => {
        const metadata = await book.loaded.metadata;
        setBookTitle(metadata.title);

        const coverUrl = await book.coverUrl();
        setBookCover(coverUrl);
        const originalToc = book.navigation?.toc || [];
        setSpine(book.spine as ExtendedSpine);
        await book.locations.generate(5000);

        setTotalPages(book.locations.length());

        try {
          const enhancedToc = await enhanceTocWithPages(originalToc, book);
          setToc(enhancedToc);
          localStorage.setItem(STORAGE_KEY_TOC, JSON.stringify(enhancedToc));
        } catch (error) {
          console.warn("Error enhancing TOC with pages:", error);
          setToc(originalToc as EnhancedNavItem[]);
          localStorage.setItem(STORAGE_KEY_TOC, JSON.stringify(originalToc));
        }

        const savedLocation = localStorage.getItem(STORAGE_KEY_LOC);
        rendition.display(savedLocation || undefined);

        const initialCfi = savedLocation || book.rendition.currentLocation().cfi;
        if (initialCfi) {
          const initialPage = getPageFromCfi(book, initialCfi) || 1;
          setCurrentPage(initialPage);
        }

        if (savedLocation) {
          setCurrentPage(getPageFromCfi(book, savedLocation) || 1);
        }
        setIsLoading(false);
      });

      bookRef.current = book;
      renditionRef.current = rendition;

      return () => {
        book.destroy();
        rendition.destroy();
      };
    } catch (err) {
      console.error("Error initializing EPUB reader:", err);
      setError(err as Error);
      setIsLoading(false);
    }
  }, [url, STORAGE_KEY_LOC, STORAGE_KEY_TOC, enhanceTocWithPages]);

  // Effect for theming
  useEffect(() => {
    const rendition = renditionRef.current;
    if (!rendition) return;

    const themeObject = getReaderTheme(isDark, {
      ...computedStyles,
      ...overrides,
    });

    if (rendition?.themes) {
      rendition.themes.register("custom-theme", themeObject);
      rendition.themes.default({ override: true });
      rendition.themes.select("custom-theme");
    } else {
      console.warn("Rendition themes not initialized");
    }

    rendition.hooks.content.register(() => {
      // This hook is for content that is newly rendered or re-rendered
      // We still want to ensure the theme is applied here for new content
      if (rendition?.themes) {
        rendition.themes.select("custom-theme");
      }
    });
  }, [isDark, computedStyles, renditionRef, overrides]);

  // Effect for handling location changes
  useEffect(() => {
    const rendition = renditionRef.current;
    if (!rendition) return;

    const handleRelocated = (location: Location) => {
      const cfi = location.start.cfi;
      setLocation(cfi);
      localStorage.setItem(STORAGE_KEY_LOC, cfi);
      const newPage = getPageFromCfi(bookRef.current!, cfi) || 1;
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }

      // Calculate progress percentage
      if (bookRef.current && bookRef.current.locations.length() > 0) {
        const progressPercentage = Math.round(Math.round(bookRef.current.locations.percentageFromCfi(cfi) * 100));
        setProgress(progressPercentage);
      }
    };

    rendition.on("relocated", handleRelocated);
    return () => {
      rendition.off("relocated", handleRelocated);
    };
  }, [STORAGE_KEY_LOC, currentPage]);

  // Effect for handling text selection
  useEffect(() => {
    const rendition = renditionRef.current;
    if (!rendition) return;

    const handleSelected = (cfiRange: string, contents: Contents) => {
      const selectedText = contents.window.getSelection()?.toString() || "";
      const range = contents.window.getSelection()?.getRangeAt(0);
      if (!range) return;

      const rect = range.getBoundingClientRect();

      if (selectedText) {
        setSelection({ cfi: cfiRange, text: selectedText, rect });
      } else {
        setSelection(null);
      }
    };

    rendition.on("selected", handleSelected);
    return () => {
      rendition.off("selected", handleSelected);
    };
  }, [addHighlight]);

  // Effect for loading saved highlights
  useEffect(() => {
    const savedHighlights = localStorage.getItem(STORAGE_KEY_HIGHLIGHTS);
    if (savedHighlights) {
      try {
        const parsed: Highlight[] = JSON.parse(savedHighlights);
        parsed.forEach(({ cfi, text, color }) => addHighlight({ cfi, text, color }));
        setHighlights(parsed);
      } catch (err) {
        console.error("Failed to parse saved highlights", err);
      }
    }
  }, [STORAGE_KEY_HIGHLIGHTS, addHighlight]);

  // Effect for loading saved bookmarks
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(STORAGE_KEY_BOOKMARK);
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch {
        console.warn("Failed to parse saved bookmarks");
      }
    }
  }, [STORAGE_KEY_BOOKMARK]);

  // Effect for loading saved notes
  useEffect(() => {
    const rendition = renditionRef.current;
    if (!rendition) return;

    const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes) as Note[];
      parsed.forEach((note) => {
        rendition.annotations.add("highlight", note.cfi, { text: note.text }, undefined, "epub-note", {
          fill: "lightblue",
          fillOpacity: "0.4",
          mixBlendMode: "multiply",
        });
      });
      setNotes(parsed);
    }
  }, [STORAGE_KEY_NOTES]);

  return {
    toc,
    location,
    viewerRef,
    highlights,
    bookmarks,
    searchResults,
    searchQuery,
    notes,
    removeHighlight,
    removeAllHighlights,
    setSearchQuery,
    addHighlight,
    addBookmark,
    goToBookmark,
    removeBookmark,
    removeAllBookmarks,
    goToHref,
    goToCfi,
    goNext,
    goPrev,
    addNote,
    currentPage,
    totalPages,
    error,
    isLoading,
    progress,
    bookTitle,
    bookCover,
    selection,
    setSelection,
  };
}
