import { useCallback, useEffect, useRef, useState } from "react";
import ePub, { Book, Contents, Location, NavItem, Rendition } from "epubjs";

interface Highlight {
  cfi: string;
  text: string;
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
}

export function useEpubReader(url: string): IUseEpubReaderReturn {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  const [toc, setToc] = useState<NavItem[]>([]);

  const STORAGE_KEY_LOC = `epub-location-${url}`;
  const STORAGE_KEY_HIGHLIGHTS = `epub-highlights-${url}`;

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

  useEffect(() => {
    if (!viewerRef.current) return;

    const book: Book = ePub(url);
    book.ready.then(() => {
      setToc(book.navigation?.toc || []);
    });

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

    return () => {
      rendition.destroy?.();
      book.destroy?.();
    };
  }, [url, addHighlight, STORAGE_KEY_LOC, STORAGE_KEY_HIGHLIGHTS]);

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
    addHighlight,
    goToHref,
    goNext,
    goPrev,
  };
}
