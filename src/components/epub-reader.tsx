// components/EpubReader.tsx
"use client";

import { useEffect, useRef } from "react";
import ePub from "epubjs";

interface EpubReaderProps {
  url: string;
}

export default function EpubReader({ url }: EpubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    const book = ePub(url);
    const rendition = book.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
    });

    rendition.display();

    return () => {
      rendition?.destroy?.();
      book?.destroy?.();
    };
  }, [url]);

  return <div ref={viewerRef} className="w-full h-screen bg-white" />;
}
