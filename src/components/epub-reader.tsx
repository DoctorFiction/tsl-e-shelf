"use client";
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
  const [controlsVisible, setControlsVisible] = useState(true);

  return (
    <div className="w-full h-screen overflow-hidden" onMouseEnter={() => setControlsVisible(true)} onMouseLeave={() => setControlsVisible(false)}>
      {isLoading ? (
        <BookLoading bookTitle={bookTitle} bookCover={bookCover} />
      ) : (
        <>
          <div className={`absolute top-0 left-0 right-0 z-10 transition-transform duration-300 ${controlsVisible ? "translate-y-0" : "-translate-y-full"}`}>
            <div className="flex items-center justify-between px-2 py-1 bg-gray-100 dark:bg-gray-800 relative">
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
          </div>
        </>
      )}
      <Progress value={progress} className="fixed top-0 left-0 right-0 z-20 h-1 rounded-none" />
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
    </div>
  );
}
