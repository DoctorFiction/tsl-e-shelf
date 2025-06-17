import { useCallback, useEffect, useRef, useState } from "react";
import ePub, { Book, Location, Rendition, NavItem } from "epubjs";

interface IUseEpubReaderReturn {
  location: string | null;
  goNext: () => void;
  goPrev: () => void;
  goToHref: (href: string) => void;
  toc: NavItem[];
  viewerRef: React.RefObject<HTMLDivElement | null>;
}

export function useEpubReader(url: string): IUseEpubReaderReturn {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [toc, setToc] = useState<NavItem[]>([]);

  useEffect(() => {
    if (!viewerRef.current) return;

    // BOOK
    const book: Book = ePub(url);
    book.ready.then(() => {
      setToc(book.navigation?.toc || []);
    });

    // RENDITION
    const rendition = book.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
      allowScriptedContent: true,
    });
    renditionRef.current = rendition;
    rendition.display();
    rendition.on("relocated", (location: Location) => {
      setLocation(location.start.cfi);
    });

    // CLEANUP
    return () => {
      rendition.destroy?.();
      book.destroy?.();
    };
  }, [url]);

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
    location,
    goNext,
    goPrev,
    goToHref,
    toc,
    viewerRef,
  };
}
