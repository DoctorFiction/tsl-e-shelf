"use client";
import { Highlight, useEpubReader } from "@/hooks/use-epub-reader";
import { useEffect, useState } from "react";
import { ReaderControlsDrawer } from "./reader-controls-drawer";
import { BookLoading } from "./book-loading";
import { Progress } from "./ui/progress";
// import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import Image from "next/image";

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
    bookAuthor,
    totalPages,
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
  // TODO: make the reader responsive
  // TODO: add home, profile, logout etc drawer
  // TODO: fix next/prev page button width

  const [clickedHighlight, setClickedHighlight] = useState<Highlight | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle key events when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Prevent default browser behavior for navigation keys
      if (["ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End"].includes(e.key)) {
        e.preventDefault();
      }

      // Navigation keys
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        console.log(`Keyboard ${e.key} - going to previous page`);
        goPrev();
      } else if (e.key === "ArrowRight" || e.key === "PageDown") {
        console.log(`Keyboard ${e.key} - going to next page`);
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goPrev, goNext]);

  const isBookmarked = !!bookmarks.find((bm) => bm.cfi === location);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [drawerPinned, setDrawerPinned] = useState(false);
  const [bookInfoOpen, setBookInfoOpen] = useState(false);

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);

    const showControls = () => {
      setControlsVisible(true);
      clearTimeout(timer);
    };

    // Show controls on mouse move, touch, or interaction
    const handleUserActivity = () => showControls();

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
    };
  }, [controlsVisible]);

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      {isLoading ? <BookLoading bookTitle={bookTitle} bookCover={bookCover} /> : <></>}
      <Progress value={progress} className="fixed top-0 left-0 right-0 z-20 h-1 rounded-none" />
      <div className="relative w-full flex-1">
        <div ref={viewerRef} className="w-full h-full" />

        <div className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-50 transition-opacity duration-300 hidden md:block ${controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <button
            onClick={goPrev}
            className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-full p-3 backdrop-blur-sm"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`fixed ${drawerPinned ? "right-72" : "right-28"} top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 hidden md:block ${
            controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={goNext}
            className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-full p-3 backdrop-blur-sm"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className={`fixed left-4 top-4 z-50 transition-opacity duration-300 ${controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <button onClick={() => setBookInfoOpen(true)} className=" transition-all duration-200 p-3 " aria-label="Book information">
            <Info className="w-5 h-5" />
          </button>
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
        onDrawerStateChange={setDrawerPinned}
      />

      {/* Book Information Modal */}
      <Dialog open={bookInfoOpen} onOpenChange={setBookInfoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {bookCover && (
              <div className="flex justify-center">
                <Image src={bookCover} alt={bookTitle || "Book cover"} width={128} height={192} className="max-w-32 max-h-48 object-contain rounded-lg shadow-md" />
              </div>
            )}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{bookTitle || "Unknown Title"}</h3>
              {bookAuthor && <p className="text-sm text-muted-foreground">Author: {bookAuthor}</p>}
              {totalPages > 0 && <p className="text-sm text-muted-foreground">Total Pages: {totalPages}</p>}
              {progress !== undefined && <p className="text-sm text-muted-foreground">Reading Progress: {Math.round(progress)}%</p>}
              <p className="text-sm text-muted-foreground">Total Bookmarks: {bookmarks.length}</p>
              <p className="text-sm text-muted-foreground">Total Highlights: {highlights.length}</p>
              <p className="text-sm text-muted-foreground">Total Notes: {notes.length}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
