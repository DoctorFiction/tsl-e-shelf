import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react";
import ePub, { Book, Contents, Location, NavItem, Rendition } from "epubjs";
import Section from "epubjs/types/section";
import Spine from "epubjs/types/spine";
import { useTheme } from "next-themes";
import { getReaderTheme } from "@/lib/get-reader-theme";
import { useAtom } from "jotai";
import { readerPreferencesAtom } from "@/atoms/reader-preferences";

type Highlight = {
  cfi: string;
  text: string;
  color?: string;
  type?: HighlightType;
};

type HighlightType = "highlight" | "underline";

type Bookmark = {
  cfi: string;
  label?: string;
  createdAt: string;
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

interface ExtendedSpine extends Spine {
  spineItems: Section[];
}

interface IUseEpubReaderReturn {
  location: string | null;
  goNext: () => void;
  goPrev: () => void;
  goToHref: (href: string) => void;
  goToCfi: (cfi: string) => void;
  toc: NavItem[];
  viewerRef: React.RefObject<HTMLDivElement | null>;
  addHighlight: (args: Highlight) => void;
  highlights: Highlight[];
  bookmarks: Bookmark[];
  addBookmark: () => void;
  goToBookmark: (cfi: string) => void;
  searchResults: SearchResult[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  removeHighlight: (cfi: string, type: HighlightType) => void;
  removeAllHighlights: () => void;
  addNote: (note: Note) => void;
  notes: Note[];
}

export function useEpubReader(url: string): IUseEpubReaderReturn {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const bookRef = useRef<Book | null>(null);
  const previousSearchHighlights = useRef<string[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  const [toc, setToc] = useState<NavItem[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [spine, setSpine] = useState<ExtendedSpine | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCfi, setSelectedCfi] = useState<string>("");
  const [previousSelectedCfi, setPreviousSelectedCfi] = useState<string | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [prefs] = useAtom(readerPreferencesAtom);
  console.log("prefs", prefs);

  const STORAGE_KEY_LOC = `epub-location-${url}`;
  const STORAGE_KEY_HIGHLIGHTS = `epub-highlights-${url}`;
  const STORAGE_KEY_BOOKMARK = `epub-bookmarks-${url}`;
  const STORAGE_KEY_NOTES = `epub-notes-${url}`;
  const STORAGE_KEY_TOC = `epub-toc`;

  const addHighlight = useCallback(
    ({ cfi, text, color = "yellow", type = "highlight" }: Highlight) => {
      const className = type === "underline" ? "epub-underline" : "epub-highlight";

      const style =
        type === "underline"
          ? {
              stroke: color,
              strokeWidth: "1",
            }
          : {
              fill: color,
              fillOpacity: "0.5",
              mixBlendMode: "multiply",
            };

      const newHighlight = { cfi, text };

      renditionRef.current?.annotations.add(type, cfi, { text }, undefined, className, style);

      setHighlights((prev) => {
        const updated = [...prev, newHighlight];
        localStorage.setItem(STORAGE_KEY_HIGHLIGHTS, JSON.stringify(updated));
        return updated;
      });
    },
    [STORAGE_KEY_HIGHLIGHTS]
  );

  const removeHighlight = (cfi: string, type: HighlightType) => {
    renditionRef.current?.annotations.remove(type, cfi);

    setHighlights((prev) => {
      const updated = prev.filter((h) => h.cfi !== cfi);
      localStorage.setItem(STORAGE_KEY_HIGHLIGHTS, JSON.stringify(updated));
      return updated;
    });
  };

  const removeAllHighlights = () => {
    highlights.forEach((highlight) => renditionRef.current?.annotations.remove(highlight.cfi, "highlight"));
    localStorage.removeItem(STORAGE_KEY_HIGHLIGHTS);
    setHighlights([]);
  };

  const addBookmark = useCallback(() => {
    if (!location) {
      console.warn("addBookmark: not a valid location to add a bookmark. location", location);
      return;
    }

    const newBookmark: Bookmark = {
      cfi: location,
      createdAt: new Date().toISOString(),
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
      renditionRef.current?.annotations.add("highlight", cfi, { text }, undefined, "epub-note", {
        fill: "lightblue",
        fillOpacity: "0.4",
        mixBlendMode: "multiply",
      });

      // update state + localStorage
      setNotes((prev) => {
        const updated = [...prev, newNote];
        localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updated));
        return updated;
      });
    },
    [STORAGE_KEY_NOTES]
  );

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

                const tocItem = book.navigation.toc.find((toc) => toc.href.includes(item.href));
                const chapterTitle = tocItem?.label || "";

                results.push({
                  cfi,
                  excerpt: `...${excerpt}...`,
                  href: item.href,
                  chapterTitle,
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
    [bookRef, spine]
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
      renditionRef.current.annotations.add("highlight", result.cfi, { text: result.excerpt }, undefined, "epub-search-highlight", {
        fill: "red",
        fillOpacity: "0.3",
        mixBlendMode: "multiply",
      });
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
      {
        fill: "yellow",
        fillOpacity: "100",
        mixBlendMode: "multiply",
      }
    );
    setPreviousSelectedCfi(selectedCfi);
  }, [previousSelectedCfi, selectedCfi]);

  // MAIN EFFECT
  useEffect(() => {
    if (!viewerRef.current) return;

    const themeObject = getReaderTheme(isDark, prefs);

    const book: Book = ePub(url);
    book.ready.then(() => {
      setToc(book.navigation?.toc || []);
      // for debugger
      localStorage.setItem(STORAGE_KEY_TOC, JSON.stringify(book.navigation?.toc || []));
      setSpine(book.spine as ExtendedSpine);
    });
    bookRef.current = book;

    const rendition = book.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
      allowScriptedContent: true,
    });

    rendition.hooks.content.register(() => {
      if (rendition?.themes) {
        rendition.themes.register("custom-theme", themeObject);
        rendition.themes.default({ override: true });
        rendition.themes.select("custom-theme");
      } else {
        console.warn("Rendition themes not initialized");
      }
    });

    renditionRef.current = rendition;

    // REAPPLY WHEN A NEW CHAPTER IS DISPLAYED TO AVOID FLASHING
    // flashing was solved by removing bg from EpubReader viewerRef - but keeping it here just in case if needed in the future
    // rendition.on("rendered", () => {
    //   rendition.themes.select("custom-theme");
    // });

    // Load last location
    const savedLocation = localStorage.getItem(STORAGE_KEY_LOC);
    rendition.display(savedLocation || undefined);

    // Set location on change
    rendition.on("relocated", (location: Location) => {
      const cfi = location.start.cfi;
      setLocation(cfi);
      localStorage.setItem(STORAGE_KEY_LOC, cfi);
    });

    // Handle new highlights on selection
    // note: currently highlights whenever a text is selected
    // highlight text later on via UI highligt picker, using addHighlight function
    rendition.on("selected", (cfiRange: string, contents: Contents) => {
      const selectedText = contents.window.getSelection()?.toString() || "";
      addHighlight({ cfi: cfiRange, text: selectedText });

      // FOR TESTING NOTES
      // const userNote = prompt("Add a note for:\n" + selectedText);
      // if (userNote) {
      //   addNote({ cfi: cfiRange, text: selectedText, note: userNote });
      // }
    });

    // Load saved highlights
    const savedHighlights = localStorage.getItem(STORAGE_KEY_HIGHLIGHTS);
    if (savedHighlights) {
      try {
        const parsed: Highlight[] = JSON.parse(savedHighlights);
        parsed.forEach(({ cfi, text }) => addHighlight({ cfi, text }));
        setHighlights(parsed);
      } catch (err) {
        console.error("Failed to parse saved highlights", err);
      }
    }

    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem(STORAGE_KEY_BOOKMARK);
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch {
        console.warn("Failed to parse saved bookmarks");
      }
    }

    // Load saved notes
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

    return () => {
      rendition.destroy?.();
      book.destroy?.();
    };
  }, [url, addHighlight, theme, STORAGE_KEY_LOC, STORAGE_KEY_HIGHLIGHTS, STORAGE_KEY_BOOKMARK, STORAGE_KEY_NOTES, STORAGE_KEY_TOC, isDark, prefs]);

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
    goToHref,
    goToCfi,
    goNext,
    goPrev,
    addNote,
  };
}
