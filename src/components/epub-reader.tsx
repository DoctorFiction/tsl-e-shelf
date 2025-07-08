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

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

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

    const handleTouchStart = (e: TouchEvent) => {
      setTouchEnd(null);
      setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart || !touchEnd) return;

      const distanceX = touchStart.x - touchEnd.x;
      const distanceY = touchStart.y - touchEnd.y;
      const isLeftSwipe = distanceX > 30; // Reduced threshold for easier swiping
      const isRightSwipe = distanceX < -30; // Reduced threshold for easier swiping
      const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

      console.log(`Touch end: distanceX=${distanceX}, distanceY=${distanceY}, isVerticalSwipe=${isVerticalSwipe}`);

      // Only trigger page change if it's a horizontal swipe
      if (!isVerticalSwipe) {
        if (isLeftSwipe) {
          console.log("Swipe left - going to next page");
          e.preventDefault();
          goNext();
        } else if (isRightSwipe) {
          console.log("Swipe right - going to previous page");
          e.preventDefault();
          goPrev();
        }
      }

      // Reset touch states
      setTouchStart(null);
      setTouchEnd(null);
    };

    // Mobile click handling for page navigation
    const handleClick = (e: MouseEvent) => {
      // Only handle clicks on mobile devices
      if (window.innerWidth >= 768) return; // md breakpoint

      const target = e.target as HTMLElement;
      const viewerElement = viewerRef.current;

      // Make sure click is on the viewer
      if (!viewerElement || !viewerElement.contains(target)) return;

      // Check if click is on any interactive element
      if (target.closest('button, a, input, textarea, [role="button"]')) return;

      const rect = viewerElement.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const viewerWidth = rect.width;

      // Left third for previous, right third for next, middle third does nothing
      if (clickX < viewerWidth * 0.33) {
        console.log("Click left - going to previous page");
        goPrev();
      } else if (clickX > viewerWidth * 0.67) {
        console.log("Click right - going to next page");
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Add touch event listeners for mobile swipe
    const viewerElement = viewerRef.current;
    if (viewerElement) {
      viewerElement.addEventListener("touchstart", handleTouchStart, { passive: false });
      viewerElement.addEventListener("touchmove", handleTouchMove, { passive: false });
      viewerElement.addEventListener("touchend", handleTouchEnd, { passive: false });
      viewerElement.addEventListener("click", handleClick, { passive: true });
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (viewerElement) {
        viewerElement.removeEventListener("touchstart", handleTouchStart);
        viewerElement.removeEventListener("touchmove", handleTouchMove);
        viewerElement.removeEventListener("touchend", handleTouchEnd);
        viewerElement.removeEventListener("click", handleClick);
      }
    };
  }, [goPrev, goNext, touchStart, touchEnd, viewerRef]);

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

        {/* Navigation Controls - Side positioning - Hidden on mobile */}
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

        {/* Book Info Icon - Top left corner */}
        <div className={`fixed left-4 top-4 z-50 transition-opacity duration-300 ${controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <button
            onClick={() => setBookInfoOpen(true)}
            className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-full p-3 backdrop-blur-sm"
            aria-label="Book information"
          >
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
