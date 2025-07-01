"use client";
import { useEpubReader } from "@/hooks/use-epub-reader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useRef, useEffect } from "react";
import { Search, Highlighter, Trash2, Bookmark, BookMarked, ChevronLeft, ChevronRight } from "lucide-react";
import formatRelativeDate from "@/lib/format-relative-date";
import { ReaderSettings } from "./reader-settings";

interface EpubReaderProps {
  url: string;
}

export default function EpubReader({ url }: EpubReaderProps) {
  const { viewerRef, goNext, goPrev, goToCfi, searchQuery, setSearchQuery, searchResults, highlights, removeHighlight, addBookmark, bookmarks, removeBookmark, location } = useEpubReader(url);

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

  const isBookmarked = !!bookmarks.find((bm) => bm.cfi === location);

  return (
    <Card className="mt-2">
      <CardContent>
        <div className="flex p-2 items-center bg-gray-100 dark:bg-gray-800 relative justify-center">
          <div className="absolute left-4 flex gap-2">
            {/* Highlights Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
                  aria-label="Show highlights"
                  type="button"
                >
                  <Highlighter className="w-4 h-4 text-yellow-500" />
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
                <Button
                  className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
                  aria-label="Show bookmarks"
                  type="button"
                >
                  <BookMarked className="w-4 h-4 text-blue-500" />
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
                    bookmarks.map((bm, i) => {
                      return (
                        <Card
                          key={i}
                          className="relative px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group overflow-hidden border border-gray-200 dark:border-gray-700 mb-2"
                        >
                          <div
                            className="w-full"
                            onClick={() => {
                              goToCfi(bm.cfi);
                            }}
                          >
                            {bm.page && (
                              <div className="absolute top-3 right-3">
                                <span className=" text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md font-medium">{bm.page}</span>
                              </div>
                            )}

                            <div className="pr-12 mb-8">
                              <Typography variant="body2" className="line-clamp-3 text-gray-900 dark:text-gray-100 leading-relaxed">
                                {bm.chapter}
                              </Typography>
                            </div>

                            <div className="absolute bottom-3 left-4">
                              <Typography variant="caption" className="text-xs text-gray-500 dark:text-gray-400">
                                {formatRelativeDate(bm.createdAt)}
                              </Typography>
                            </div>
                          </div>

                          <button
                            className="absolute bottom-2 right-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 opacity-0 group-hover:opacity-100 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md hover:shadow-lg"
                            aria-label="Delete bookmark"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBookmark?.(bm.cfi);
                            }}
                            type="button"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </Card>
                      );
                    })
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
            <Button
              onClick={goPrev}
              className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-75 rounded-lg px-4 py-2 font-medium flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
            <Button
              onClick={goNext}
              className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-75 rounded-lg px-4 py-2 font-medium flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="absolute right-4 flex gap-2">
            {/* Search Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
                  aria-label="Search in book"
                  type="button"
                  onClick={() => setTimeout(() => searchInputRef.current?.focus(), 50)}
                >
                  <Search className="w-4 h-4 text-gray-500" />
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
                            <span
                              dangerouslySetInnerHTML={{
                                __html: result.excerpt,
                              }}
                            />
                          </Typography>
                        </Card>
                      );
                    })}
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
            {isBookmarked ? (
              <Button
                className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
                onClick={() => {
                  if (location) removeBookmark(location);
                }}
                aria-label="Remove bookmark"
                type="button"
              >
                <Bookmark fill="currentColor" className="w-4 h-4 text-red-500" />
              </Button>
            ) : (
              <Button
                className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
                onClick={() => {
                  addBookmark();
                }}
                aria-label="Add bookmark"
                type="button"
              >
                <Bookmark className="w-4 h-4 text-gray-500" />
              </Button>
            )}
            <ReaderSettings />
          </div>
        </div>
        <div ref={viewerRef} className="w-full h-screen" />
      </CardContent>
    </Card>
  );
}
