"use client";
import { Highlight, useEpubReader } from "@/hooks/use-epub-reader";
import { useEffect, useState } from "react";
import { ReaderControlsDrawer } from "./reader-controls-drawer";
import { BookLoading } from "./book-loading";
import { Progress } from "./ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    notes,
    removeNote,
    removeAllNotes,
    editNote,
    currentSearchResultIndex,
    goToSearchResult,
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
  const [, setControlsVisible] = useState(true);

  return (
    <div className="w-full h-screen overflow-hidden" onMouseEnter={() => setControlsVisible(true)} onMouseLeave={() => setControlsVisible(false)}>
      {isLoading ? <BookLoading bookTitle={bookTitle} bookCover={bookCover} /> : <></>}
      <Progress value={progress} className="fixed top-0 left-0 right-0 z-20 h-1 rounded-none" />
      <div className="relative w-full h-screen">
        <div ref={viewerRef} className="w-full h-full" />
        {/* Previous Page Button */}
        <div className="absolute left-0 top-0 h-full w-1/5 flex items-center justify-start opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={goPrev}>
          <ChevronLeft className="w-12 h-12 text-gray-600 dark:text-gray-300" />
        </div>
        {/* Next Page Button */}
        <div className="absolute right-0 top-0 h-full w-1/5 flex items-center justify-end opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={goNext}>
          <ChevronRight className="w-12 h-12 text-gray-600 dark:text-gray-300" />
        </div>
      </div>
      <ReaderControlsDrawer
        selection={selection}
        addHighlight={addHighlight}
        clickedHighlight={clickedHighlight}
        removeHighlight={removeHighlight}
        setClickedHighlight={setClickedHighlight}
        setSelection={setSelection}
        addNote={addNote}
        highlights={highlights}
        bookmarks={bookmarks}
        notes={notes}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        goToCfi={goToCfi}
        removeBookmark={removeBookmark}
        removeAllBookmarks={removeAllBookmarks}
        removeNote={removeNote}
        removeAllNotes={removeAllNotes}
        editNote={editNote}
        removeAllHighlights={removeAllHighlights}
        isBookmarked={isBookmarked}
        addBookmark={addBookmark}
        location={location}
        toc={toc}
        goToHref={goToHref}
        currentSearchResultIndex={currentSearchResultIndex}
        goToSearchResult={goToSearchResult}
      />
    </div>
  );
}
