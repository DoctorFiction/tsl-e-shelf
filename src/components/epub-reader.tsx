"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Highlight, useEpubReader } from "@/hooks/use-epub-reader";
import { useEffect, useState } from "react";
import { BookmarkButton } from "./bookmark-button";
import { BookmarksListPopover } from "./bookmarks-list-popover";
import { HighlightOptionsBar } from "./highlight-options-bar";
import { HighlightsListPopover } from "./highlights-list-popover";
import { BookLoading } from "./book-loading";
import { NavigationControls } from "./navigation-controls";
import { ReaderSettings } from "./reader-settings";
import { SearchPopover } from "./search-popover";
import { TableOfContentsPopover } from "./table-of-contents-popover";
import { Progress } from "./ui/progress";

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
    isLoading,
    bookCover,
    bookTitle,
    progress,
    selection,
    setSelection,
    addHighlight,
    addNote,
  } = useEpubReader(url);

  // TODO: add book title
  // TODO: add book page number

  const [clickedHighlight, setClickedHighlight] = useState<Highlight | null>(null);

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
    <Card className="!py-0">
      <CardContent className="p-0">
        {isLoading ? (
          <BookLoading bookTitle={bookTitle} bookCover={bookCover} />
        ) : (
          <>
            <div className="flex flex-col p-2 items-center bg-gray-100 dark:bg-gray-800 relative justify-center">
              <div className="absolute left-4 flex gap-2">
                <HighlightsListPopover highlights={highlights} goToCfi={goToCfi} removeHighlight={removeHighlight} removeAllHighlights={removeAllHighlights} />
                <BookmarksListPopover bookmarks={bookmarks} goToCfi={goToCfi} removeBookmark={removeBookmark} removeAllBookmarks={removeAllBookmarks} />
              </div>
              <div className="flex gap-4 mx-auto">
                <NavigationControls goPrev={goPrev} goNext={goNext} />
              </div>
              <div className="absolute right-4 flex gap-2">
                <SearchPopover searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchResults={searchResults} goToCfi={goToCfi} />
                <BookmarkButton isBookmarked={isBookmarked} addBookmark={addBookmark} removeBookmark={removeBookmark} location={location} />
                <TableOfContentsPopover toc={toc} goToHref={goToHref} />
                <ReaderSettings />
              </div>
            </div>
            <Progress value={progress} className="h-1 rounded-none" />
          </>
        )}
        <div ref={viewerRef} className="w-full h-screen" />
        <HighlightOptionsBar
          selection={selection}
          addHighlight={addHighlight}
          clickedHighlight={clickedHighlight}
          removeHighlight={removeHighlight}
          setClickedHighlight={setClickedHighlight}
          setSelection={setSelection}
          addNote={addNote}
        />
      </CardContent>
    </Card>
  );
}
