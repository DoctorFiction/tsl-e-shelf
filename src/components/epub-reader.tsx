"use client";
import { useEpubReader } from "@/hooks/use-epub-reader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useRef, useEffect } from "react";
import { Search, Highlighter, Trash2, Bookmark, BookMarked } from "lucide-react";
import formatRelativeDate from "@/lib/format-relative-date";

interface EpubReaderProps {
  url: string;
}

export default function EpubReader({ url }: EpubReaderProps) {
  const { viewerRef, goNext, goPrev, goToCfi, searchQuery, setSearchQuery, searchResults, highlights, removeHighlight, addBookmark, bookmarks, removeBookmark } = useEpubReader(url);

  // Popover ile state yönetimi sadeleşiyor
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

  return (
    <Card className="mt-2">
      <CardContent>
        <div className="flex p-2 items-center bg-gray-100 dark:bg-gray-800 relative justify-center">
          <div className="absolute left-4 flex gap-2">
            {/* Highlights Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="ml-2" aria-label="Show highlights" type="button">
                  <Highlighter className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-4" align="start" side="bottom">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Typography variant="body1" className="font-bold">
                      Highlights
                    </Typography>
                  </div>
                </div>
                <ul className="max-h-64 overflow-y-auto">
                  {highlights && highlights.length > 0 ? (
                    highlights.map((hl, i) => (
                      <Card key={i} className="flex flex-row items-center px-4 py-2 gap-2 cursor-pointer hover:bg-muted transition group">
                        <div
                          className="flex-1"
                          onClick={() => {
                            goToCfi(hl.cfi);
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
              </PopoverContent>
            </Popover>
            {/* Bookmarks Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="ml-2" aria-label="Show bookmarks" type="button">
                  <BookMarked className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-4" align="start" side="bottom">
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="body1" className="font-bold">
                    Bookmarks
                  </Typography>
                </div>
                <ul className="max-h-64 overflow-y-auto">
                  {bookmarks && bookmarks.length > 0 ? (
                    bookmarks.map((bm, i) => (
                      <Card key={i} className="flex flex-row items-center px-4 py-2 gap-2 cursor-pointer hover:bg-muted transition group">
                        <div
                          className="flex-1"
                          onClick={() => {
                            goToCfi(bm.cfi);
                          }}
                        >
                          <Typography variant="body2" className="line-clamp-2">
                            {bm.cfi}
                          </Typography>
                          <Typography variant="caption" className="text-xs text-gray-500 mt-1">
                            {formatRelativeDate(bm.createdAt)}
                          </Typography>
                        </div>
                        <button
                          className="text-gray-400 hover:text-red-500 transition ml-2"
                          aria-label="Delete bookmark"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBookmark?.(bm.cfi);
                          }}
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" className="text-gray-400">
                      No bookmarks found.
                    </Typography>
                  )}
                </ul>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-4 mx-auto">
            <Button onClick={goPrev}>◀ Prev</Button>
            <Button onClick={goNext}>Next ▶</Button>
          </div>
          <div className="absolute right-4 flex gap-2">
            {/* Search Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="ml-2" aria-label="Search in book" type="button" onClick={() => setTimeout(() => searchInputRef.current?.focus(), 100)}>
                  <Search className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end" side="bottom">
                <div className="flex items-center gap-2 mb-2">
                  <Input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search in book..." className="flex-1" />
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
              </PopoverContent>
            </Popover>
            <Button
              className="ml-2"
              onClick={() => {
                addBookmark();
              }}
              aria-label="Add bookmark"
              type="button"
            >
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div ref={viewerRef} className="w-full h-screen" />
      </CardContent>
    </Card>
  );
}

// Add this helper function at the top level of the file (outside the component):
