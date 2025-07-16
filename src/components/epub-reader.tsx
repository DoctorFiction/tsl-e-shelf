"use client";
import { useEpubReader } from "@/hooks/use-epub-reader";
import { useEffect, useState } from "react";
import { ReaderControlsDrawer } from "./reader-controls-drawer";
import { BookLoading } from "./book-loading";
import { Progress } from "./ui/progress";
import { BookProgressDisplay } from "./book-progress-display";
import { ImagePreview } from "./image-preview";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { EditNoteDialog } from "./edit-note-dialog";

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
    addHighlight,
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
    addNote,
    notes,
    removeNote,
    removeAllNotes,
    editNote,
    editingNote,
    setEditingNote,
    clickedHighlight,
    setClickedHighlight,
    updateHighlightColor,
    currentSearchResultIndex,
    goToSearchResult,
    currentPage,
    currentChapterTitle,
    imagePreview,
    setImagePreview,
    bookImages,
    searchBook,
  } = useEpubReader(url);

  // TODO: Handle book title, page number, and chapter display on mobile devices
  // TODO: Implement mobile-specific onclick event on the reader: Show the drawer popout button when the user taps the reader; otherwise, hide it.
  // TODO: Implement mobile-specific display for book title, current page, and chapter name when the user taps the reader.
  // TODO: Add a main application drawer for navigation (e.g., home, profile)

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
        <div ref={viewerRef} className="w-full h-full">
          {!isLoading && <BookProgressDisplay bookTitle={bookTitle} currentPage={currentPage} currentChapterTitle={currentChapterTitle} />}
        </div>

        <div
          className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-50 text-center transition-opacity duration-300 hidden md:block ${controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
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
        bookTitle={bookTitle}
        bookAuthor={bookAuthor}
        bookCover={bookCover}
        totalPages={totalPages}
        progress={progress}
        bookImages={bookImages}
        updateHighlightColor={updateHighlightColor}
        searchBook={searchBook}
      />
      <ImagePreview imagePreview={imagePreview} setImagePreviewAction={setImagePreview} />
      {editingNote && (
        <EditNoteDialog
          note={editingNote}
          onSave={(newNote) => {
            editNote(editingNote.cfi, newNote);
            setEditingNote(null);
          }}
          onDelete={(cfi) => {
            removeNote(cfi);
            setEditingNote(null);
          }}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
}
