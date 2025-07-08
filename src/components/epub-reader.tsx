"use client";
import { Highlight, useEpubReader } from "@/hooks/use-epub-reader";
import { useEffect, useState } from "react";
import { ReaderControlsDrawer } from "./reader-controls-drawer";
import { BookLoading } from "./book-loading";
import { Progress } from "./ui/progress";
import { NavigationControls } from "./navigation-controls";

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
  // TODO: make the reader responsive
  // TODO: add home, profile, logout etc drawer
  // TODO: fix next/prev page button width

  const [clickedHighlight, setClickedHighlight] = useState<Highlight | null>(null);

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
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

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;

      const distanceX = touchStart.x - touchEnd.x;
      const distanceY = touchStart.y - touchEnd.y;
      const isLeftSwipe = distanceX > 50;
      const isRightSwipe = distanceX < -50;
      const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

      // Only trigger page change if it's a horizontal swipe
      if (!isVerticalSwipe) {
        if (isLeftSwipe) {
          goNext();
        } else if (isRightSwipe) {
          goPrev();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Add touch event listeners for mobile swipe
    const viewerElement = viewerRef.current;
    if (viewerElement) {
      viewerElement.addEventListener("touchstart", handleTouchStart, { passive: true });
      viewerElement.addEventListener("touchmove", handleTouchMove, { passive: true });
      viewerElement.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (viewerElement) {
        viewerElement.removeEventListener("touchstart", handleTouchStart);
        viewerElement.removeEventListener("touchmove", handleTouchMove);
        viewerElement.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [goPrev, goNext, touchStart, touchEnd, viewerRef]);

  const isBookmarked = !!bookmarks.find((bm) => bm.cfi === location);
  const [controlsVisible, setControlsVisible] = useState(true);

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
      </div>

      {/* Navigation Controls - Bottom fixed position - Hidden on mobile */}
      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 transition-opacity duration-300 hidden md:block ${controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <NavigationControls goPrev={goPrev} goNext={goNext} />
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
