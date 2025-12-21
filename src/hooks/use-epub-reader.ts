import {
  IReaderPreferenceConfig,
  readerPreferencesAtom,
} from "@/atoms/reader-preferences";
import { copiedCharsAtom, totalBookCharsAtom, copyAllowancePercentageAtom } from "@/atoms/copy-protection";
import { computedReaderStylesAtom } from "@/atoms/computed-reader-styles";
import { getChapterFromCfi, getPageFromCfi } from "@/lib/epub-utils";
import { getReaderTheme } from "@/lib/get-reader-theme";
import ePub, { Book, Contents, Location, NavItem, Rendition } from "epubjs";
import Section from "epubjs/types/section";
import Spine from "epubjs/types/spine";
import { useAtom } from "jotai";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { EpubReaderDataSource } from "@/lib/reader-data-source";
import { bookmarksAtom, highlightsAtom, notesAtom, currentLocationAtom } from "@/atoms/reader-data";

// TODO: Fit the cover page with no padding
// TODO: Add swipe next/prev page navigation when on mobile

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
  createdAt: string;
};

export type HighlightType = "highlight" | "underline";

type EpubjsSearchResult = {
  cfi: string;
  excerpt: string;
};

export type Bookmark = {
  id?: string;
  cfi: string;
  label?: string;
  createdAt: string;
  chapter: string | null;
  page: number | null;
};

export type Note = {
  id?: string;
  cfi: string;
  text: string;
  note: string;
  createdAt: string;
};

export type SearchResult = {
  cfi: string;
  excerpt: string;
  href: string;
  chapterTitle: string;
  chapterIndex: number;
};

export type BookImage = {
  src: string;
  cfi: string;
  description: string;
  chapter: string | null;
  page: number | null;
};

export type EnhancedNavItem = NavItem & {
  page?: number;
  subitems?: EnhancedNavItem[];
};

interface ExtendedSpine extends Spine {
  spineItems: Section[];
}

interface IUseEpubReader {
  url: string;
  dataSource: EpubReaderDataSource;
  isCopyProtected?: boolean;
  copyAllowancePercentage?: number;
}

interface IUseEpubReaderReturn {
  resize: () => void;
  location: string | null;
  imagePreview: { src: string; description: string } | null;
  setImagePreview: React.Dispatch<React.SetStateAction<{ src: string; description: string } | null>>;
  bookImages: BookImage[];
  goNext: () => void;
  goPrev: () => void;
  goToHref: (href: string) => void;
  goToCfi: (cfi: string) => void;
  toc: EnhancedNavItem[];
  viewerRef: React.RefObject<HTMLDivElement | null>;
  addHighlight: (args: Omit<Highlight, "createdAt" | "id">) => void;
  highlights: Highlight[];
  bookmarks: Bookmark[];
  addBookmark: () => void;
  goToBookmark: (cfi: string) => void;
  removeBookmark: (cfiToRemove: string) => void;
  removeAllBookmarks: () => void;
  searchResults: SearchResult[];
  currentSearchResultIndex: number;
  goToSearchResult: (index: number) => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchBook: (query: string) => Promise<void>;
  removeHighlight: (cfi: string, type: HighlightType) => void;
  removeAllHighlights: () => void;
  addNote: (note: Omit<Note, "createdAt" | "id">) => void;
  notes: Note[];
  removeNote: (cfi: string) => void;
  removeAllNotes: () => void;
  editNote: (cfi: string, newNote: string) => void;
  editingNote: Note | null;
  setEditingNote: React.Dispatch<React.SetStateAction<Note | null>>;
  clickedHighlight: Highlight | null;
  setClickedHighlight: React.Dispatch<React.SetStateAction<Highlight | null>>;
  updateHighlightColor: (cfi: string, newColor: string) => void;
  currentPage: number;
  totalPages: number;
  error: Error | null;
  isLoading: boolean;
  progress: number;
  bookTitle: string | null;
  bookAuthor: string | null;
  bookCover: string | null;
  selection: { cfi: string; text: string; rect: DOMRect } | null;
  setSelection: React.Dispatch<React.SetStateAction<{ cfi: string; text: string; rect: DOMRect } | null>>;
  currentChapterTitle: string | null;
  isSearching: boolean;
  getPreviewText: (charCount?: number) => Promise<string | null>;
  copyText: (text: string) => Promise<void>;
  totalBookChars: number;
  copiedChars: number;
  saveReaderPreferences: (preferences: IReaderPreferenceConfig) => Promise<void>;
}

export function useEpubReader({ url, dataSource, isCopyProtected = false, copyAllowancePercentage = 10 }: IUseEpubReader): IUseEpubReaderReturn {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const bookRef = useRef<Book | null>(null);
  const previousSearchHighlights = useRef<string[]>([]);
  const locationUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [highlights, setHighlights] = useAtom(highlightsAtom);
  const [location, setLocation] = useAtom(currentLocationAtom);
  const [toc, setToc] = useState<EnhancedNavItem[]>([]);
  const [bookmarks, setBookmarks] = useAtom(bookmarksAtom);
  const [notes, setNotes] = useAtom(notesAtom);

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [clickedHighlight, setClickedHighlight] = useState<Highlight | null>(null);

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearchResultIndex, setCurrentSearchResultIndex] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [bookTitle, setBookTitle] = useState<string | null>(null);
  const [bookAuthor, setBookAuthor] = useState<string | null>(null);
  const [bookCover, setBookCover] = useState<string | null>(null);
  const [selectedCfi, setSelectedCfi] = useState<string>("");
  const [previousSelectedCfi, setPreviousSelectedCfi] = useState<string | null>(null);
  const [selection, setSelection] = useState<{ cfi: string; text: string; rect: DOMRect } | null>(null);
  const [currentChapterTitle, setCurrentChapterTitle] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<{ src: string; description: string } | null>(null);
  const [bookImages, setBookImages] = useState<BookImage[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const resize = useCallback(() => {
    const viewer = viewerRef.current;
    const rendition = renditionRef.current as (Rendition & { manager?: unknown }) | null;
    if (!viewer || !rendition || !rendition.manager) return;

    const width = viewer.clientWidth;
    const height = viewer.clientHeight;
    try {
      rendition.resize(width, height);
    } catch (e) {
      console.warn("Rendition resize skipped:", e);
    }
  }, [viewerRef]);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [readerPreferences, setReaderPreferences] = useAtom(
    readerPreferencesAtom,
  );
  const { zoom } = readerPreferences;

  const [computedStyles] = useAtom(computedReaderStylesAtom);

  const [totalBookChars, setTotalBookChars] = useAtom(totalBookCharsAtom);
  const [copiedChars, setCopiedChars] = useAtom(copiedCharsAtom);
  const [copyAllowance, setCopyAllowance] = useAtom(copyAllowancePercentageAtom);

  useEffect(() => {
    if (copyAllowancePercentage !== undefined) {
      if (copyAllowancePercentage < 0 || copyAllowancePercentage > 100) {
        console.error("Invalid copyAllowancePercentage. It must be between 0 and 100.");
        throw new Error("Invalid copyAllowancePercentage");
      }
      setCopyAllowance(copyAllowancePercentage);
    }
  }, [copyAllowancePercentage, setCopyAllowance]);

  const copyText = useCallback(
    async (text: string) => {
      if (!isCopyProtected) {
        try {
          await navigator.clipboard.writeText(text);
        } catch (err) {
          console.error("Failed to copy text (unprotected):", err);
        }
        return;
      }

      const allowedChars = (totalBookChars * copyAllowance) / 100;

      if (copiedChars + text.length > allowedChars) {
        throw new Error("Copy limit exceeded");
      }

      try {
        await navigator.clipboard.writeText(text);
        const newCopiedChars = copiedChars + text.length;
        await dataSource.updateCopiedChars(newCopiedChars);
        setCopiedChars(newCopiedChars);
      } catch (err) {
        console.error("Failed to copy text (protected):", err);
        throw err;
      }
    },
    [isCopyProtected, totalBookChars, copiedChars, setCopiedChars, dataSource, copyAllowance]
  );

  const addHighlight = useCallback(
    async (highlight: Omit<Highlight, "createdAt" | "id">) => {
      const config = {
        ...defaultConfig[highlight.type || "highlight"],
        style: { ...defaultConfig[highlight.type || "highlight"].style, fill: highlight.color, stroke: highlight.color },
      };
      renditionRef.current?.annotations.add(highlight.type || "highlight", highlight.cfi, { text: highlight.text }, undefined, config.className, config.style);

      try {
        const newHighlight = await dataSource.addHighlight(highlight);
        setHighlights((prev) => [...prev, newHighlight]);
      } catch (error) {
        console.error("Failed to save highlight:", error);
      }

      setSelection(null);
    },
    [dataSource, setHighlights]
  );

  const restoreHighlight = useCallback(({ cfi, text, type = "highlight", color = "yellow" }: Highlight) => {
    const config = {
      ...defaultConfig[type],
      style: { ...defaultConfig[type].style, fill: color, stroke: color },
    };

    renditionRef.current?.annotations.add(type, cfi, { text }, undefined, config.className, config.style);
  }, []);

  const removeHighlight = useCallback(
    async (cfi: string, type: HighlightType) => {
      try {
        renditionRef.current?.annotations.remove(cfi, type);
      } catch (error) {
        console.warn("Error removing highlight annotation:", error);
      }

      await dataSource.removeHighlight(cfi);
      setHighlights((prev) => prev.filter((h) => h.cfi !== cfi));
    },
    [dataSource, setHighlights]
  );

  const removeAllHighlights = useCallback(async () => {
    for (const highlight of highlights) {
      try {
        renditionRef.current?.annotations.remove(highlight.cfi, "highlight");
        await dataSource.removeHighlight(highlight.cfi);
      } catch (error) {
        console.warn("Error removing highlight annotation:", error);
      }
    }
    setHighlights([]);
  }, [dataSource, highlights, setHighlights]);

  const addBookmark = useCallback(async () => {
    const book = bookRef.current;
    if (!location || !book) {
      console.warn("addBookmark: not a valid location to add a bookmark. location", location);
      return;
    }

    const chapter = await getChapterFromCfi(book, location);
    const page = getPageFromCfi(book, location);

    const newBookmarkData = {
      cfi: location,
      chapter,
      page,
    };

    try {
      const newBookmark = await dataSource.addBookmark(newBookmarkData);
      setBookmarks((prev) => [...prev, newBookmark]);
    } catch (error) {
      console.error("Failed to save bookmark:", error);
    }
  }, [location, dataSource, setBookmarks]);

  const goToBookmark = useCallback((cfi: string) => {
    if (!cfi) {
      console.warn("goToBookmark: not a valid CFI to go. CFI", cfi);
      return;
    }
    renditionRef.current?.display(cfi);
  }, []);

  const removeBookmark = useCallback(
    async (cfiToRemove: string) => {
      await dataSource.removeBookmark(cfiToRemove);
      setBookmarks((prev) => prev.filter((b) => b.cfi !== cfiToRemove));
    },
    [dataSource, setBookmarks]
  );

  const removeAllBookmarks = useCallback(async () => {
    for (const bookmark of bookmarks) {
      await dataSource.removeBookmark(bookmark.cfi);
    }
    setBookmarks([]);
  }, [dataSource, bookmarks, setBookmarks]);

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
    async (note: Omit<Note, "createdAt" | "id">) => {
      renditionRef.current?.annotations.add("highlight", note.cfi, { text: note.text }, undefined, defaultConfig.note.className, defaultConfig.note.style);

      try {
        const newNote = await dataSource.addNote(note);
        setNotes((prev) => [...prev, newNote]);
      } catch (error) {
        console.error("Failed to save note:", error);
      }
      setSelection(null);
    },
    [dataSource, setNotes]
  );

  const removeNote = useCallback(
    async (cfi: string) => {
      renditionRef.current?.annotations.remove(cfi, "highlight");
      await dataSource.removeNote(cfi);
      setNotes((prev) => prev.filter((n) => n.cfi !== cfi));
    },
    [dataSource, setNotes]
  );

  const removeAllNotes = useCallback(async () => {
    for (const note of notes) {
      renditionRef.current?.annotations.remove(note.cfi, "highlight");
      await dataSource.removeNote(note.cfi);
    }
    setNotes([]);
  }, [dataSource, notes, setNotes]);

  const editNote = useCallback(
    async (cfi: string, newNote: string) => {
      await dataSource.updateNote(cfi, newNote);
      setNotes((prev) => prev.map((n) => (n.cfi === cfi ? { ...n, note: newNote } : n)));
    },
    [dataSource, setNotes]
  );

  const updateHighlightColor = useCallback(
    async (cfi: string, newColor: string) => {
      await dataSource.updateHighlightColor(cfi, newColor);
      setHighlights((prev) => {
        return prev.map((h) => {
          if (h.cfi === cfi) {
            renditionRef.current?.annotations.remove(cfi, h.type || "highlight");
            renditionRef.current?.annotations.add(h.type || "highlight", cfi, { text: h.text }, undefined, defaultConfig[h.type || "highlight"].className, {
              ...defaultConfig[h.type || "highlight"].style,
              fill: newColor,
              stroke: newColor,
            });
            return { ...h, color: newColor };
          }
          return h;
        });
      });
    },
    [dataSource, setHighlights]
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
      setIsSearching(true);
      const book = bookRef.current;
      if (!query || !book || !book.spine) {
        setSearchResults([]);
        setCurrentSearchResultIndex(-1);
        setIsSearching(false);
        return;
      }

      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setSearchResults([]);
        setCurrentSearchResultIndex(-1);
        setIsSearching(false);
        return;
      }

      try {
        const spineItems = (book.spine as ExtendedSpine).spineItems;
        const searchPromises = spineItems.map(async (section) => {
          await section.load(book.load.bind(book));
          const results = await section.find(trimmedQuery);
          section.unload();
          return results;
        });
        const allResults = await Promise.all(searchPromises);
        const flattenedResults = allResults.flat() as unknown as EpubjsSearchResult[];

        const finalResults: SearchResult[] = await Promise.all(
          flattenedResults.map(async (result) => {
            const section = book.spine.get(result.cfi);
            const chapterTitle = await getChapterFromCfi(book, result.cfi);

            return {
              cfi: result.cfi,
              excerpt: result.excerpt,
              href: section.href,
              chapterTitle: chapterTitle || "",
              chapterIndex: section.index,
            };
          })
        );

        setSearchResults(finalResults);
        setCurrentSearchResultIndex(finalResults.length > 0 ? 0 : -1);
      } catch (error) {
        console.error("Error during book search:", error);
        setSearchResults([]);
        setCurrentSearchResultIndex(-1);
      } finally {
        setIsSearching(false);
      }
    },
    [bookRef]
  );

  const goToSearchResult = useCallback(
    (index: number) => {
      if (index >= 0 && index < searchResults.length) {
        const result = searchResults[index];
        renditionRef.current?.display(result.cfi);
        setSelectedCfi(result.cfi);
        setCurrentSearchResultIndex(index);
      }
    },
    [searchResults]
  );

  const getPreviewText = useCallback(async (charCount = 250) => {
    const book = bookRef.current;
    if (!book || !book.locations) return null;

    const cfi = book.locations.cfiFromPercentage(0.5);
    const section = await book.spine.get(cfi);
    if (!section) return null;

    await section.load(book.load.bind(book));
    const text = section.document.body.textContent?.trim().slice(0, charCount) || null;
    section.unload();

    return text;
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery.trim().length === 0) {
      setSearchResults([]);
      setCurrentSearchResultIndex(-1);
      return;
    }

    if (debouncedSearchQuery.length >= 3) {
      searchBook(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, searchBook]);

  const saveReaderPreferences = useCallback(
    async (preferences: IReaderPreferenceConfig) => {
      await dataSource.updateReaderPreferences(preferences);
      setReaderPreferences(preferences);
    },
    [dataSource, setReaderPreferences],
  );

  useEffect(() => {
    const rendition = renditionRef.current;
    if (!rendition) return;

    if (zoom) {
      rendition.themes.override("zoom", zoom);
    }

    setTimeout(() => {
      resize();
    }, 10);
  }, [zoom, resize]);

  useEffect(() => {
    if (!renditionRef.current) return;

    for (const cfi of previousSearchHighlights.current) {
      renditionRef.current?.annotations.remove(cfi, "highlight");
    }
    previousSearchHighlights.current = [];

    for (const result of searchResults) {
      renditionRef.current.annotations.add("highlight", result.cfi, { text: result.excerpt }, undefined, defaultConfig.searchResult.className, defaultConfig.searchResult.style);
      previousSearchHighlights.current.push(result.cfi);
    }
  }, [searchResults]);

  useEffect(() => {
    if (!selectedCfi || !renditionRef.current) return;

    if (previousSelectedCfi) renditionRef.current.annotations.remove(previousSelectedCfi, "highlight");

    renditionRef.current.annotations.add("highlight", selectedCfi, {}, undefined, undefined, defaultConfig.selectedSearchResult.style);
    setPreviousSelectedCfi(selectedCfi);
  }, [previousSelectedCfi, selectedCfi]);

  useEffect(() => {
    if (!viewerRef.current) return;

    setError(null);
    setIsLoading(true);

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
        setBookAuthor(metadata.creator || null);

        const coverUrl = await book.coverUrl();
        setBookCover(coverUrl);
        const originalToc = book.navigation?.toc || [];

        await book.locations.generate(5000);

        if (isCopyProtected) {
          const savedTotalChars = await dataSource.getTotalChars();
          if (savedTotalChars) {
            setTotalBookChars(savedTotalChars);
          } else {
            const allText = await Promise.all(
              (book.spine as ExtendedSpine).spineItems.map(async (item) => {
                await item.load(book.load.bind(book));
                const text = item.document.body.textContent || "";
                item.unload();
                return text;
              })
            );
            const totalChars = allText.join("").length;
            setTotalBookChars(totalChars);
            await dataSource.saveTotalChars(totalChars);
          }

          const savedCopiedChars = await dataSource.getCopiedChars();
          setCopiedChars(savedCopiedChars);
        }

        setTotalPages(book.locations.length());

        try {
          const enhancedToc = await enhanceTocWithPages(originalToc, book);
          setToc(enhancedToc);
        } catch (error) {
          console.warn("Error enhancing TOC with pages:", error);
          setToc(originalToc as EnhancedNavItem[]);
        }

        const savedLocation = await dataSource.getLocation();
        setLocation(savedLocation);

        if (savedLocation) {
          try {
            // Validate the CFI by calling the method that would otherwise throw an error
            book.locations.locationFromCfi(savedLocation);

            rendition.display(savedLocation);
            setCurrentPage(getPageFromCfi(book, savedLocation) || 1);
          } catch (e) {
            console.warn(`Invalid saved location CFI found: "${savedLocation}". Starting from the beginning.`, e);
            rendition.display(); // Display from start if CFI is bad
          }
        } else {
          rendition.display(); // Display from start if no location saved
        }

        setIsLoading(false);

        const images: BookImage[] = [];
        const spine = book.spine as ExtendedSpine;
        for (const item of spine.spineItems) {
          try {
            await item.load(book.load.bind(book));
            const doc = item.document;
            if (!doc) continue;

            const imgElements = doc.querySelectorAll("img");
            for (const img of Array.from(imgElements)) {
              const cfi = item.cfiFromElement(img);
              const description = img.title || img.alt || "";
              const chapter = await getChapterFromCfi(book, cfi);
              const page = getPageFromCfi(book, cfi);
              images.push({ src: img.src, cfi, description, chapter, page });
            }
            item.unload?.();
          } catch (error) {
            console.warn("Error extracting images from spine item:", error);
          }
        }
        setBookImages(images);
      });

      return () => {
        book.destroy();
        rendition.destroy();
        // Reset atoms on unmount
        setHighlights([]);
        setBookmarks([]);
        setNotes([]);
        setLocation(null);
      };
    } catch (err) {
      console.error("Error initializing EPUB reader:", err);
      setError(err as Error);
      setIsLoading(false);
    }
  }, [url, dataSource, enhanceTocWithPages, isCopyProtected, setTotalBookChars, setCopiedChars, setHighlights, setBookmarks, setNotes, setLocation]);

  useEffect(() => {
    const rendition = renditionRef.current;
    if (!rendition) return;

    const themeObject = getReaderTheme(isDark, computedStyles);

    if (rendition?.themes) {
      rendition.themes.register("custom-theme", themeObject);
      rendition.themes.default({ override: true });
      rendition.themes.select("custom-theme");
    }
  }, [isDark, computedStyles, renditionRef]);

  useEffect(() => {
    const rendition = renditionRef.current;
    if (!rendition) return;

    const handleRelocated = async (locationData: Location) => {
      const cfi = locationData.start.cfi;
      setLocation(cfi);

      const book = bookRef.current;
      if (!book) return;

      const newPage = getPageFromCfi(book, cfi) || 1;
      setCurrentPage(newPage);

      const chapter = await getChapterFromCfi(book, cfi);
      setCurrentChapterTitle(chapter);

      if (book.locations.length() > 0) {
        const rawProgress = book.locations.percentageFromCfi(cfi);
        const progressForUI = Math.round(rawProgress * 100);
        setProgress(progressForUI);

        if (locationUpdateTimeoutRef.current) {
          clearTimeout(locationUpdateTimeoutRef.current);
        }

        locationUpdateTimeoutRef.current = setTimeout(async () => {
          try {
            await dataSource.updateLocation(cfi, rawProgress);
          } catch (error) {
            console.error("Failed to update location:", error);
          }
        }, 2000);
      }
    };

    rendition.on("relocated", handleRelocated);
    return () => {
      rendition.off("relocated", handleRelocated);
      if (locationUpdateTimeoutRef.current) {
        clearTimeout(locationUpdateTimeoutRef.current);
      }
    };
  }, [dataSource, setLocation, setCurrentPage, setCurrentChapterTitle, setProgress]);

  useEffect(() => {
    const rendition = renditionRef.current;
    if (!rendition) return;

    const handleSelected = (cfiRange: string, contents: Contents) => {
      const selectedText = contents.window.getSelection()?.toString();
      if (!selectedText) {
        return;
      }

      const range = contents.window.getSelection()?.getRangeAt(0);
      if (!range) return;

      const rect = range.getBoundingClientRect();
      setSelection({ cfi: cfiRange, text: selectedText, rect });
    };

    const handleClick = async (event: MouseEvent) => {
      if (!(event.view as Window)?.getSelection()?.toString()) {
        setSelection(null);
      }

      setClickedHighlight(null);

      const target = event.target as HTMLElement;
      const x = event.clientX;
      const y = event.clientY;

      for (const note of notes) {
        try {
          const range = renditionRef.current?.getRange(note.cfi);
          if (range) {
            const rects = range.getClientRects();
            for (let i = 0; i < rects.length; i++) {
              if (x >= rects[i].left && x <= rects[i].right && y >= rects[i].top && y <= rects[i].bottom) {
                setEditingNote(note);
                return;
              }
            }
          }
        } catch (error) {
          console.warn("Error getting range for note CFI:", note.cfi, error);
        }
      }

      for (const highlight of highlights) {
        try {
          const range = renditionRef.current?.getRange(highlight.cfi);
          if (range) {
            const rects = range.getClientRects();
            for (let i = 0; i < rects.length; i++) {
              if (x >= rects[i].left && x <= rects[i].right && y >= rects[i].top && y <= rects[i].bottom) {
                setClickedHighlight(highlight);
                return;
              }
            }
          }
        } catch (error) {
          console.warn("Error getting range for highlight CFI:", highlight.cfi, error);
        }
      }

      if (target.tagName === "IMG") {
        event.preventDefault();
        event.stopPropagation();
        const img = target as HTMLImageElement;
        const description = img.title || img.alt || "";
        setImagePreview({ src: img.src, description });
      }
    };

    rendition.on("selected", handleSelected);
    rendition.on("click", handleClick);

    return () => {
      rendition.off("selected", handleSelected);
      rendition.off("click", handleClick);
    };
  }, [notes, highlights]);

  useEffect(() => {
    dataSource.getHighlights().then((savedHighlights) => {
      if (savedHighlights) {
        savedHighlights.forEach(restoreHighlight);
        setHighlights(savedHighlights);
      }
    });
  }, [dataSource, restoreHighlight, setHighlights]);

  useEffect(() => {
    dataSource.getBookmarks().then(setBookmarks);
  }, [dataSource, setBookmarks]);

  useEffect(() => {
    const rendition = renditionRef.current;
    if (!rendition) return;
    dataSource.getNotes().then((savedNotes) => {
      if (savedNotes) {
        savedNotes.forEach((note) => {
          rendition.annotations.add("highlight", note.cfi, { text: note.text }, undefined, defaultConfig.note.className, defaultConfig.note.style);
        });
        setNotes(savedNotes);
      }
    });
  }, [dataSource, renditionRef, setNotes]);

  useEffect(() => {
    
  }, [dataSource]);

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
    removeNote,
    removeAllNotes,
    editNote,
    editingNote,
    setEditingNote,
    clickedHighlight,
    setClickedHighlight,
    updateHighlightColor,
    currentPage,
    totalPages,
    error,
    isLoading,
    progress,
    bookTitle,
    bookAuthor,
    bookCover,
    selection,
    setSelection,
    currentSearchResultIndex,
    goToSearchResult,
    currentChapterTitle,
    imagePreview,
    setImagePreview,
    bookImages,
    searchBook,
    isSearching,
    getPreviewText,
    copyText,
    totalBookChars,
    copiedChars,
    resize,
    saveReaderPreferences,
  };
}