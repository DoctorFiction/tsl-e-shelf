import { useCallback, useEffect, useRef, useState } from "react";
import ePub, { Location, Rendition } from "epubjs";

interface UseEpubReaderReturn {
  viewerRef: React.RefObject<HTMLDivElement | null>;
  location: string | null;
  goNext: () => void;
  goPrev: () => void;
}

export function useEpubReader(url: string): UseEpubReaderReturn {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    const book = ePub(url);
    const rendition = book.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
    });

    renditionRef.current = rendition;
    rendition.display();
    rendition.on("relocated", (location: Location) => {
      setLocation(location.start.cfi);
    });

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

  return { viewerRef, location, goNext, goPrev };
}
