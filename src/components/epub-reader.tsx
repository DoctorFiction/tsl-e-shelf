"use client";
import { useEpubReader } from "@/hooks/use-epub-reader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { Search, Highlighter, Trash2 } from "lucide-react";

interface EpubReaderProps {
  url: string;
}

export default function EpubReader({ url }: EpubReaderProps) {
  const { viewerRef, goNext, goPrev, goToCfi, searchQuery, setSearchQuery, searchResults, highlights, removeHighlight } = useEpubReader(url);
  console.log("🚀 ~ EpubReader ~ highlights:", highlights);
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightsOpen, setHighlightsOpen] = useState(false); // highlight modal state
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext]);

  const handleClose = () => {
    setSearchOpen(false);
    // setSearchQuery(""); // Artık arama kutusu kapanınca arama ifadesi silinmeyecek
  };

  const handleHighlightsClose = () => setHighlightsOpen(false);

  return (
    <Card className="mt-2">
      <CardContent>
        <div className="flex p-2 items-center bg-gray-100 dark:bg-gray-800 relative justify-center">
          <div className="absolute left-4 flex gap-2">
            <Button className="ml-2" onClick={() => setHighlightsOpen((v) => !v)} aria-label="Show highlights" type="button">
              <Highlighter className="w-4 h-4 mr-1" />
            </Button>
          </div>
          <div className="flex gap-4 mx-auto">
            <Button onClick={goPrev}>◀ Prev</Button>
            <Button onClick={goNext}>Next ▶</Button>
          </div>
          <div className="absolute right-4">
            <Button
              className="ml-2"
              onClick={() => {
                setSearchOpen((v) => !v);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              aria-label="Search in book"
              type="button"
            >
              <Search className="w-4 h-4 mr-1" />
            </Button>
          </div>
          {/* Search Modal */}
          {searchOpen && (
            <div className="absolute top-12 right-0 z-20 w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in book..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Escape" && handleClose()}
                />
                <button onClick={handleClose} className="ml-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" aria-label="Close search">
                  ✕
                </button>
              </div>
              <div>
                {searchQuery && searchResults.length === 0 && (
                  <Typography variant="body2" className="text-gray-400">
                    No results found.
                  </Typography>
                )}
                {searchResults.length > 0 && (
                  <Typography variant="body1" className="font-bold mb-1">
                    {searchResults.length} results found:
                  </Typography>
                )}
                <ul className="max-h-48 overflow-y-auto">
                  {searchResults.map((result, i) => {
                    return (
                      <Card
                        key={i}
                        className="flex flex-col px-4 py-2 gap-0.5 cursor-pointer hover:bg-muted transition"
                        onClick={() => {
                          goToCfi(result.cfi);
                          handleClose();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <Typography variant="caption" className="font-bold">
                            {result.chapterTitle}
                          </Typography>
                        </div>
                        <Typography variant="body2" className="text-muted-foreground line-clamp-1">
                          <span dangerouslySetInnerHTML={{ __html: result.excerpt }} />
                        </Typography>
                      </Card>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
          {/* Highlights Modal */}
          {highlightsOpen && (
            <div className="absolute top-12 left-0 z-20 w-96 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="body1" className="font-bold">
                  Highlights
                </Typography>
                <button onClick={handleHighlightsClose} className="ml-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" aria-label="Close highlights">
                  ✕
                </button>
              </div>
              <ul className="max-h-64 overflow-y-auto">
                {highlights && highlights.length > 0 ? (
                  highlights.map((hl, i) => (
                    <Card key={i} className="flex flex-row items-center px-4 py-2 gap-2 cursor-pointer hover:bg-muted transition group">
                      <div
                        className="flex-1"
                        onClick={() => {
                          goToCfi(hl.cfi);
                          handleHighlightsClose();
                        }}
                      >
                        <Typography variant="body2" className="line-clamp-2">
                          {hl.text}
                        </Typography>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition ml-2"
                        aria-label="Delete highlight"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeHighlight?.(hl.cfi, "highlight");
                        }}
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body2" className="text-gray-400">
                    No highlights found.
                  </Typography>
                )}
              </ul>
            </div>
          )}
        </div>
        <div ref={viewerRef} className="w-full h-screen" />
      </CardContent>
    </Card>
  );
}
