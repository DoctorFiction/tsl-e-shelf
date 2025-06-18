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
};

type Bookmark = {
  cfi: string;
  label?: string;
  createdAt: string;
};

type SearchResult = {
  cfi: string;
  excerpt: string;
  href: string;
};

interface ExtendedSpine extends Spine {
  spineItems: Section[];
}

interface IUseEpubReaderReturn {
  location: string | null;
  goNext: () => void;
  goPrev: () => void;
  goToHref: (href: string) => void;
  toc: NavItem[];
  viewerRef: React.RefObject<HTMLDivElement | null>;
  addHighlight: (cfi: string, text: string) => void;
  highlights: Highlight[];
  bookmarks: Bookmark[];
  addBookmark: () => void;
  goToBookmark: (cfi: string) => void;
  searchResults: SearchResult[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export function useEpubReader(url: string): IUseEpubReaderReturn {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const bookRef = useRef<Book | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  const [toc, setToc] = useState<NavItem[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [spine, setSpine] = useState<ExtendedSpine | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const STORAGE_KEY_LOC = `epub-location-${url}`;
  const STORAGE_KEY_HIGHLIGHTS = `epub-highlights-${url}`;
  const BOOKMARK_STORAGE_KEY = `epub-bookmarks-${url}`;

  const addHighlight = useCallback(
    (cfi: string, text: string) => {
      const newHighlight = { cfi, text };

      renditionRef.current?.annotations.add(
        "highlight",
        cfi,
        { text },
        undefined,
        "epub-highlight",
        {
          fill: "yellow",
          fillOpacity: "0.5",
          mixBlendMode: "multiply",
        },
      );

      setHighlights((prev) => {
        const updated = [...prev, newHighlight];
        localStorage.setItem(STORAGE_KEY_HIGHLIGHTS, JSON.stringify(updated));
        return updated;
      });
    },
    [STORAGE_KEY_HIGHLIGHTS],
  );

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
        return [];
      }

      if (query === "") setSearchResults([]);

      const results: SearchResult[] = [];
      const spineItems = (spine as ExtendedSpine).spineItems;
      const contextLength = 30; // chars around match

      const promises = spineItems.map((item) =>
        (async () => {
          try {
            item.load(book.load.bind(book));
            const doc = item.document;

            if (!doc) return;

            const textNodes: Node[] = [];
            const walker = doc.createTreeWalker(
              doc,
              NodeFilter.SHOW_TEXT,
              null,
            );

            let currentNode;
            while ((currentNode = walker.nextNode())) {
              textNodes.push(currentNode);
            }

            const fullText = textNodes
              .map((n) => n.textContent || "")
              .join("")
              .toLowerCase();

            const searchQuery = query.toLowerCase();
            let pos = fullText.indexOf(searchQuery);

            while (pos !== -1) {
              let offset = pos;
              let nodeIndex = 0;

              // Figure out which node the match starts in
              while (nodeIndex < textNodes.length) {
                const nodeText = textNodes[nodeIndex].textContent || "";
                if (offset < nodeText.length) break;
                offset -= nodeText.length;
                nodeIndex++;
              }

              if (nodeIndex < textNodes.length) {
                const range = doc.createRange();
                try {
                  range.setStart(textNodes[nodeIndex], offset);
                  range.setEnd(
                    textNodes[nodeIndex],
                    offset + searchQuery.length,
                  );

                  const cfi = item.cfiFromRange(range);
                  const excerpt = fullText.substring(
                    Math.max(0, pos - contextLength),
                    pos + searchQuery.length + contextLength,
                  );

                  results.push({
                    cfi,
                    excerpt: `...${excerpt}...`,
                    href: item.href,
                  });
                } catch (e) {
                  console.warn("Invalid range during search", e);
                }
              }

              pos = fullText.indexOf(searchQuery, pos + 1);
            }

            item.unload?.();
          } catch (error) {
            console.error("Error searching spine item:", error);
          }
        })(),
      );

      await Promise.all(promises);
      setSearchResults(results);
    },
    [bookRef, spine],
  );

  useEffect(() => {
    if (deferredSearchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    if (deferredSearchQuery.length >= 3) {
      searchBook(deferredSearchQuery);
    }
  }, [deferredSearchQuery, searchBook]);

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
    rendition.on("selected", (cfiRange: string, contents: Contents) => {
      const selectedText = contents.window.getSelection()?.toString() || "";
      addHighlight(cfiRange, selectedText);
    });

    // Load saved highlights
    const saved = localStorage.getItem(STORAGE_KEY_HIGHLIGHTS);
    if (saved) {
      try {
        const parsed: Highlight[] = JSON.parse(saved);
        parsed.forEach(({ cfi, text }) => {
          rendition.annotations.add(
            "highlight",
            cfi,
            { text },
            undefined,
            "epub-highlight",
            {
              fill: "yellow",
              fillOpacity: "0.5",
              mixBlendMode: "multiply",
            },
          );
        });
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

  return {
    toc,
    location,
    viewerRef,
    highlights,
    bookmarks,
    searchResults,
    searchQuery,
    setSearchQuery,
    addHighlight,
    addBookmark,
    goToBookmark,
    goToHref,
    goNext,
    goPrev,
  };
}
