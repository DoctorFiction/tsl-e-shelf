"use client";
import { useEpubReader } from "@/hooks/use-epub-reader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useRef, useState } from "react";
import { Search, Highlighter, Trash2, Bookmark, BookMarked, ChevronLeft, ChevronRight, Trash, List } from "lucide-react";
import formatRelativeDate from "@/lib/format-relative-date";
import { ReaderSettings } from "./reader-settings";
import { NavItem } from "epubjs";

type EnhancedNavItem = NavItem & {
  page?: number;
  subitems?: EnhancedNavItem[];
};

interface EpubReaderProps {
  url: string;
}

export default function EpubReader({ url }: EpubReaderProps) {
  const {
    viewerRef,
    goNext,
    goPrev,
    goToCfi,
    goToHref,
    searchQuery,
    setSearchQuery,
    searchResults,
    highlights,
    removeHighlight,
    removeAllHighlights,
    addBookmark,
    bookmarks,
    removeBookmark,
    removeAllBookmarks,
    location,
    toc,
  } = useEpubReader(url);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [highlightDeleteDialogOpen, setHighlightDeleteDialogOpen] = useState(false);
  const [bookmarkDeleteDialogOpen, setBookmarkDeleteDialogOpen] = useState(false);

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
                  {highlights && highlights.length > 0 && (
                    <AlertDialog open={highlightDeleteDialogOpen} onOpenChange={setHighlightDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" aria-label="Delete all highlights">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tüm Highlight&apos;ları Sil</AlertDialogTitle>
                          <AlertDialogDescription>Bu işlem tüm highlight&apos;ları kalıcı olarak silecek. Bu işlem geri alınamaz.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              removeAllHighlights();
                              setHighlightDeleteDialogOpen(false);
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Evet, Tümünü Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
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
                  {bookmarks && bookmarks.length > 0 && (
                    <AlertDialog open={bookmarkDeleteDialogOpen} onOpenChange={setBookmarkDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" aria-label="Delete all bookmarks">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tüm İşaretleri Sil</AlertDialogTitle>
                          <AlertDialogDescription>Bu işlem tüm işaretleri kalıcı olarak silecek. Bu işlem geri alınamaz.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              removeAllBookmarks();
                              setBookmarkDeleteDialogOpen(false);
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Evet, Tümünü Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
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
                  <Search className="w-4 h-4 text-black dark:text-white" />
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
                <Bookmark className="w-4 h-4 text-black dark:text-white" />
              </Button>
            )}
            {/* Table of Contents Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
                  aria-label="Table of Contents"
                  type="button"
                >
                  <List className="w-4 h-4 text-black dark:text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end" side="bottom">
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="body1" className="font-bold">
                    Table of Contents
                  </Typography>
                </div>
                <ul className="max-h-64 overflow-y-auto pr-2">
                  {toc && toc.length > 0 ? (
                    (toc as EnhancedNavItem[]).map((chapter, i) => (
                      <Card
                        key={i}
                        className="flex flex-col px-4 py-2 gap-0.5 cursor-pointer hover:bg-muted transition mb-1"
                        onClick={() => {
                          goToHref(chapter.href);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <Typography variant="body2" className="font-medium flex-1">
                            {chapter.label}
                          </Typography>
                          {chapter.page && (
                            <Typography variant="caption" className="text-muted-foreground ml-2">
                              {chapter.page}
                            </Typography>
                          )}
                        </div>
                        {/* {chapter.subitems && chapter.subitems.length > 0 && (
                          <div className="ml-4 mt-1">
                            {(chapter.subitems as EnhancedNavItem[]).map((subchapter, j) => (
                              <div
                                key={j}
                                className="py-1 cursor-pointer hover:bg-muted/50 transition rounded px-2 flex items-center justify-between"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  goToHref(subchapter.href);
                                }}
                              >
                                <Typography variant="caption" className="text-muted-foreground flex-1">
                                  {subchapter.label}
                                </Typography>
                                {subchapter.page && (
                                  <Typography variant="caption" className="text-muted-foreground/70 ml-2 text-xs">
                                    {subchapter.page}
                                  </Typography>
                                )}
                              </div>
                            ))}
                          </div>
                        )} */}
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" className="text-gray-400">
                      No table of contents available.
                    </Typography>
                  )}
                </ul>
              </PopoverContent>
            </Popover>
            <ReaderSettings />
          </div>
        </div>
        <div ref={viewerRef} className="w-full h-screen" />
      </CardContent>
    </Card>
  );
}
