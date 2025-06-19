import {
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import ePub, { Book, Contents, Location, NavItem, Rendition } from "epubjs";
import Section from "epubjs/types/section";
import Spine from "epubjs/types/spine";

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
  const [spine, setSpine] = useState<ExtendedSpine | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCfi, setSelectedCfi] = useState<string>("");
  const [previousSelectedCfi, setPreviousSelectedCfi] = useState<string | null>(
    null,
  );
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const STORAGE_KEY_LOC = `epub-location-${url}`;
  const STORAGE_KEY_HIGHLIGHTS = `epub-highlights-${url}`;
  const BOOKMARK_STORAGE_KEY = `epub-bookmarks-${url}`;

  const addHighlight = useCallback(
    ({ cfi, text, color = "yellow", type = "highlight" }: Highlight) => {
      const className =
        type === "underline" ? "epub-underline" : "epub-highlight";

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

      renditionRef.current?.annotations.add(
        type,
        cfi,
        { text },
        undefined,
        className,
        style,
      );

      setHighlights((prev) => {
        const updated = [...prev, newHighlight];
        localStorage.setItem(STORAGE_KEY_HIGHLIGHTS, JSON.stringify(updated));
        return updated;
      });
    },
    [STORAGE_KEY_HIGHLIGHTS],
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
    highlights.forEach((highlight) =>
      renditionRef.current?.annotations.remove(highlight.cfi, "highlight"),
    );
    localStorage.removeItem(STORAGE_KEY_HIGHLIGHTS);
    setHighlights([]);
  };

  const addBookmark = useCallback(() => {
    if (!location) {
      console.warn(
        "addBookmark: not a valid location to add a bookmark. location",
        location,
      );
      return;
    }

    const newBookmark: Bookmark = {
      cfi: location,
      createdAt: new Date().toISOString(),
    };

    setBookmarks((prev) => {
      const updated = [...prev, newBookmark];
      localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [location, BOOKMARK_STORAGE_KEY]);

  const goToBookmark = useCallback((cfi: string) => {
    if (!cfi) {
      console.warn("goToBookmark: not a valid CFI to go. CFI", cfi);
      return;
    }

    renditionRef.current?.display(cfi);
  }, []);

  const searchBook = useCallback(
    async (query: string) => {
      const book = bookRef.current;
      if (!query || !book || !spine) {
        console.warn(`Invalid searchBook call`);
        setSearchResults([]);
        return;
      }

      if (query.trim() === "") {
        setSearchResults([]);
        return;
      }

      const results: SearchResult[] = [];
      const spineItems = (spine as ExtendedSpine).spineItems;
      const contextLength = 30;

      const promises = spineItems.map(async (item, chapterIndex) => {
        try {
          item.load(book.load.bind(book));
          const doc = item.document;
          if (!doc) return;

          const textNodes: Node[] = [];
          const walker = doc.createTreeWalker(doc, NodeFilter.SHOW_TEXT);

          let currentNode: Node | null;
          while ((currentNode = walker.nextNode())) {
            textNodes.push(currentNode);
          }

          const searchQuery = query.toLowerCase();

          const tocItem = book.navigation.toc.find((toc) =>
            toc.href.includes(item.href),
          );
          const chapterTitle = tocItem?.label || "Unknown Chapter";

          for (const node of textNodes) {
            const nodeText = node.textContent?.toLowerCase() || "";
            let index = nodeText.indexOf(searchQuery);

            while (index !== -1) {
              try {
                const range = doc.createRange();
                range.setStart(node, index);
                range.setEnd(node, index + searchQuery.length);

                const cfi = item.cfiFromRange(range);
                const fullNodeText = node.textContent || "";
                const excerpt = fullNodeText.substring(
                  Math.max(0, index - contextLength),
                  index + searchQuery.length + contextLength,
                );

                results.push({
                  cfi,
                  excerpt: `...${excerpt}...`,
                  href: item.href,
                  chapterTitle,
                  chapterIndex,
                });
              } catch (e) {
                console.warn("Invalid range during node-based search", e);
              }

              index = nodeText.indexOf(searchQuery, index + 1);
            }
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
      renditionRef.current.annotations.add(
        "highlight",
        result.cfi,
        { text: result.excerpt },
        undefined,
        "epub-search-highlight",
        {
          fill: "red",
          fillOpacity: "0.3",
          mixBlendMode: "multiply",
        },
      );
      previousSearchHighlights.current.push(result.cfi);
    }
  }, [searchResults]);

  // HIGHLIGHT SELECTED SEARCH EFFECT
  useEffect(() => {
    if (!selectedCfi || !renditionRef.current) return;

    // Remove the previous highlight
    if (previousSelectedCfi)
      renditionRef.current.annotations.remove(previousSelectedCfi, "highlight");

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
      },
    );
    setPreviousSelectedCfi(selectedCfi);
  }, [previousSelectedCfi, selectedCfi]);

  // MAIN EFFECT
  useEffect(() => {
    if (!viewerRef.current) return;

    const book: Book = ePub(url);
    book.ready.then(() => {
      setToc(book.navigation?.toc || []);
      setSpine(book.spine as ExtendedSpine);
    });
    bookRef.current = book;

    const rendition = book.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
      allowScriptedContent: true,
    });

    renditionRef.current = rendition;

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
    });

    // Load saved highlights
    const saved = localStorage.getItem(STORAGE_KEY_HIGHLIGHTS);
    if (saved) {
      try {
        const parsed: Highlight[] = JSON.parse(saved);
        parsed.forEach(({ cfi, text }) => addHighlight({ cfi, text }));
        setHighlights(parsed);
      } catch (err) {
        console.error("Failed to parse saved highlights", err);
      }
    }

    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch {
        console.warn("Failed to parse saved bookmarks");
      }
    }

    return () => {
      rendition.destroy?.();
      book.destroy?.();
    };
  }, [
    url,
    addHighlight,
    STORAGE_KEY_LOC,
    STORAGE_KEY_HIGHLIGHTS,
    BOOKMARK_STORAGE_KEY,
  ]);

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

  return {
    toc,
    location,
    viewerRef,
    highlights,
    bookmarks,
    searchResults,
    searchQuery,
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
  };
}
