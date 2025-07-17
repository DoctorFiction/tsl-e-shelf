import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Highlight, Note, SearchResult, BookImage, Bookmark, EnhancedNavItem } from "@/hooks/use-epub-reader";
import { ChevronUp, NotebookPen, Pin, PinOff, Settings, Underline, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BookmarkButton } from "./bookmark-button";
import { BookmarksListPopover } from "./bookmarks-list-popover";
import { HighlightsListPopover } from "./highlights-list-popover";
import { ModeToggle } from "./mode-toggle";
import { NotesListPopover } from "./notes-list-popover";
import { ImagesPopover } from "./images-popover";
import { ReaderSettings } from "./reader-settings";
import { SearchPopover } from "./search-popover";
import { TableOfContentsPopover } from "./table-of-contents-popover";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { ReaderBookInfo } from "./ui/reader-book-info";
import { Typography } from "./ui/typography";
import { HighlightOptionsBar } from "./highlight-options-bar";

// TODO: Refactor: Position button on bottom right, change popover content to a list layout (mobile-specific, similar to Apple Books mobile app).

const HIGHLIGHT_COLORS = [
  { name: "Yellow", color: "#FFDE63" },
  { name: "Green", color: "#AFE99C" },
  { name: "Blue", color: "#9CCBFF" },
  { name: "Red", color: "#FF9C9C" },
  { name: "Purple", color: "#D3A5FF" },
];

interface ReaderControlsDrawerProps {
  selection: { cfi: string; text: string; rect: DOMRect } | null;
  addHighlight: (args: Highlight) => void;
  clickedHighlight: Highlight | null;
  setClickedHighlight: React.Dispatch<React.SetStateAction<Highlight | null>>;
  updateHighlightColor: (cfi: string, newColor: string) => void;
  removeHighlight: (cfi: string, type: "highlight" | "underline") => void;
  setSelection: React.Dispatch<React.SetStateAction<{ cfi: string; text: string; rect: DOMRect } | null>>;
  addNote: (args: Note) => void;
  highlights: Highlight[];
  bookmarks: Bookmark[];
  notes: Note[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchResults: SearchResult[];
  goToCfi: (cfi: string) => void;
  removeBookmark: (cfiToRemove: string) => void;
  removeAllBookmarks: () => void;
  removeNote: (cfiToRemove: string) => void;
  removeAllNotes: () => void;
  editNote: (cfi: string, newNote: string) => void;
  removeAllHighlights: () => void;
  isBookmarked: boolean;
  addBookmark: () => void;
  location: string | null;
  toc: EnhancedNavItem[];
  goToHref: (href: string) => void;
  currentSearchResultIndex: number;
  goToSearchResult: (index: number) => void;
  searchBook: (query: string) => Promise<void>;
  onDrawerStateChange?: (isPinned: boolean) => void;
  bookTitle?: string | null;
  bookAuthor?: string | null;
  bookCover?: string | null;
  totalPages?: number;
  progress?: number;
  bookImages: BookImage[];
  isSearching: boolean;
  getPreviewText: (charCount?: number) => Promise<string | null>;
}

export function ReaderControlsDrawer({
  selection,
  addHighlight,
  clickedHighlight,
  setClickedHighlight,
  updateHighlightColor,
  removeHighlight,
  setSelection,
  addNote,
  highlights,
  bookmarks,
  notes,
  searchQuery,
  setSearchQuery,
  searchResults,
  goToCfi,
  removeBookmark,
  removeAllBookmarks,
  removeNote,
  removeAllNotes,
  editNote,
  removeAllHighlights,
  isBookmarked,
  addBookmark: addBookmarkProp,
  location,
  toc,
  goToHref,
  currentSearchResultIndex,
  goToSearchResult,
  onDrawerStateChange,
  bookTitle,
  bookCover,
  totalPages,
  progress,
  bookImages,
  searchBook,
  isSearching,
  getPreviewText,
}: ReaderControlsDrawerProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    // TODO: Close all popovers within this component when the reader is clicked.
    const handleClickOutside = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        if (!isNoteDialogOpen) {
          setSelection(null);
          setClickedHighlight(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelection, setClickedHighlight, isNoteDialogOpen]);

  const handleSaveNote = () => {
    if (selection && noteContent.trim() !== "") {
      addNote({
        cfi: selection.cfi,
        text: selection.text,
        note: noteContent,
        createdAt: new Date().toISOString(),
      });
      setNoteContent("");
      setIsNoteDialogOpen(false);
      setSelection(null);
    }
  };

  const handleCloseNoteDialog = () => {
    setNoteContent("");
    setIsNoteDialogOpen(false);
    setSelection(null);
    setClickedHighlight(null);
  };

  return (
    <>
      {/* Desktop Drawer */}
      <div
        ref={barRef}
        className={`hidden md:flex fixed right-0 top-0 h-full bg-gray-100 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-md p-4 mt-1 flex-col space-y-4 transition-all duration-300 z-50
          ${isPinned ? "w-64" : "w-20 items-center"}`}
      >
        <Button
          variant="ghost"
          className=""
          onClick={() => {
            setIsPinned(!isPinned);
            onDrawerStateChange?.(!isPinned);
          }}
          aria-label={isPinned ? "Çekmeceyi Sabitle" : "Çekmeceyi Çöz"}
        >
          {isPinned ? <PinOff className="w-6 h-6" /> : <Pin className="w-6 h-6" />}
        </Button>

        {/* Highlight Options */}
        {clickedHighlight ? (
          <HighlightOptionsBar
            clickedHighlight={clickedHighlight}
            setClickedHighlight={setClickedHighlight}
            removeHighlight={removeHighlight}
            updateHighlightColor={updateHighlightColor}
            isPinned={isPinned}
          />
        ) : selection ? (
          <div className={`flex flex-col space-y-2 ${isPinned ? "items-start" : "items-center"}`}>
            <Typography variant="body2" className="font-bold">
              Vurgu & Not
            </Typography>
            <div className="flex flex-wrap gap-2">
              {HIGHLIGHT_COLORS.map((highlight) => (
                <Button
                  key={highlight.name}
                  variant="ghost"
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    if (selection) {
                      addHighlight({
                        cfi: selection.cfi,
                        text: selection.text,
                        color: highlight.color,
                        createdAt: new Date().toISOString(),
                      });
                    }
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{
                      backgroundColor: highlight.color,
                    }}
                  />
                  {isPinned && <span>{highlight.name}</span>}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  if (selection) {
                    addHighlight({
                      cfi: selection.cfi,
                      text: selection.text,
                      type: "underline",
                      createdAt: new Date().toISOString(),
                    });
                  }
                }}
              >
                <Underline className="w-6 h-6" />
                {isPinned && <span>Altını Çiz</span>}
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setIsNoteDialogOpen(true);
                }}
              >
                <NotebookPen className="w-6 h-6" />
                {isPinned && <span>Not</span>}
              </Button>
            </div>
          </div>
        ) : (
          <div className={`flex flex-col space-y-2 ${isPinned ? "items-start" : "items-center"}`}>
            <Typography variant="body2" className="font-bold">
              Kontroller
            </Typography>
            <div className="flex flex-row gap-2 items-center">
              <TableOfContentsPopover toc={toc} goToHref={goToHref} />
              {isPinned && <Typography>İçindekiler</Typography>}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <BookmarkButton isBookmarked={isBookmarked} addBookmark={addBookmarkProp} removeBookmark={removeBookmark} location={location} />
              {isPinned && <Typography>Yer İşareti</Typography>}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <BookmarksListPopover bookmarks={bookmarks} goToCfi={goToCfi} removeBookmark={removeBookmark} removeAllBookmarks={removeAllBookmarks} />
              {isPinned && <Typography>Yer İşaretleri</Typography>}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <HighlightsListPopover highlights={highlights} goToCfi={goToCfi} removeHighlight={removeHighlight} removeAllHighlights={removeAllHighlights} />
              {isPinned && <Typography>Vurgular</Typography>}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <NotesListPopover notes={notes} goToCfi={goToCfi} removeNote={removeNote} removeAllNotes={removeAllNotes} editNote={editNote} />
              {isPinned && <Typography>Notlar</Typography>}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <SearchPopover
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                goToCfi={goToCfi}
                currentSearchResultIndex={currentSearchResultIndex}
                goToSearchResult={goToSearchResult}
                searchBook={searchBook}
                isSearching={isSearching}
              />
              {isPinned && <Typography>Ara</Typography>}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <ImagesPopover images={bookImages} goToCfiAction={goToCfi} />
              {isPinned && <Typography>Resimler</Typography>}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <ReaderSettings getPreviewText={getPreviewText} />
              {isPinned && <Typography>Ayarlar</Typography>}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <ReaderBookInfo bookCover={bookCover} bookTitle={bookTitle} totalPages={totalPages} progress={progress} highlights={highlights} bookmarks={bookmarks} notes={notes} />
              {isPinned && <Typography>Kitap Bilgisi</Typography>}
            </div>
          </div>
        )}

        {/* Bottom section with Theme and Close button */}
        <div className="mt-auto flex flex-col items-center gap-3 mb-4">
          <ModeToggle />
          <Button
            variant="ghost"
            onClick={() => {
              setSelection(null);
              setClickedHighlight(null);
            }}
            className="p-2 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Controls Button */}
      <Button
        onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
        className="fixed top-4 right-4 z-50 md:hidden bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white border-0 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200"
        size="sm"
      >
        {isMobileDrawerOpen ? <ChevronUp className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
      </Button>

      {/* Mobile Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-t-2xl shadow-xl transition-transform duration-300 z-50 md:hidden ${
          isMobileDrawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {/* Mobile Highlight Options */}
          {clickedHighlight ? (
            <HighlightOptionsBar
              clickedHighlight={clickedHighlight}
              setClickedHighlight={setClickedHighlight}
              removeHighlight={removeHighlight}
              updateHighlightColor={updateHighlightColor}
              isPinned={isPinned}
            />
          ) : selection ? (
            <div className="mb-6">
              <Typography variant="body2" className="font-bold mb-3">
                Highlight & Note
              </Typography>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {HIGHLIGHT_COLORS.map((highlight) => (
                  <Button
                    key={highlight.name}
                    variant="ghost"
                    className="flex flex-col items-center gap-1 h-auto py-3"
                    onClick={() => {
                      if (selection) {
                        addHighlight({
                          cfi: selection.cfi,
                          text: selection.text,
                          color: highlight.color,
                          createdAt: new Date().toISOString(),
                        });
                        setIsMobileDrawerOpen(false);
                      }
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full border"
                      style={{
                        backgroundColor: highlight.color,
                      }}
                    />
                    <span className="text-xs">{highlight.name}</span>
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={() => {
                    if (selection) {
                      addHighlight({
                        cfi: selection.cfi,
                        text: selection.text,
                        type: "underline",
                        createdAt: new Date().toISOString(),
                      });
                      setIsMobileDrawerOpen(false);
                    }
                  }}
                >
                  <Underline className="w-4 h-4" />
                  <span>Altını Çiz</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={() => {
                    setIsNoteDialogOpen(true);
                    setIsMobileDrawerOpen(false);
                  }}
                >
                  <NotebookPen className="w-4 h-4" />
                  <span>Not</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-2">
                <TableOfContentsPopover toc={toc} goToHref={goToHref} />
                <Typography className="text-xs">İçindekiler</Typography>
              </div>
              <div className="flex flex-col items-center gap-2">
                <BookmarkButton isBookmarked={isBookmarked} addBookmark={addBookmarkProp} removeBookmark={removeBookmark} location={location} />
                <Typography className="text-xs">Yer İşareti</Typography>
              </div>
              <div className="flex flex-col items-center gap-2">
                <BookmarksListPopover bookmarks={bookmarks} goToCfi={goToCfi} removeBookmark={removeBookmark} removeAllBookmarks={removeAllBookmarks} />
                <Typography className="text-xs">Yer İşaretleri</Typography>
              </div>
              <div className="flex flex-col items-center gap-2">
                <HighlightsListPopover highlights={highlights} goToCfi={goToCfi} removeHighlight={removeHighlight} removeAllHighlights={removeAllHighlights} />
                <Typography className="text-xs">Vurgular</Typography>
              </div>
              <div className="flex flex-col items-center gap-2">
                <NotesListPopover notes={notes} goToCfi={goToCfi} removeNote={removeNote} removeAllNotes={removeAllNotes} editNote={editNote} />
                <Typography className="text-xs">Notlar</Typography>
              </div>
              <div className="flex flex-col items-center gap-2">
                <SearchPopover
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchResults={searchResults}
                  goToCfi={goToCfi}
                  currentSearchResultIndex={currentSearchResultIndex}
                  goToSearchResult={goToSearchResult}
                  searchBook={searchBook}
                  isSearching={isSearching}
                />
                <Typography className="text-xs">Ara</Typography>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ImagesPopover images={bookImages} goToCfiAction={goToCfi} />
                <Typography className="text-xs">Resimler</Typography>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ReaderSettings getPreviewText={getPreviewText} />
                <Typography className="text-xs">Ayarlar</Typography>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ModeToggle />
                <Typography className="text-xs">Tema</Typography>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ReaderBookInfo bookCover={bookCover} bookTitle={bookTitle} totalPages={totalPages} progress={progress} highlights={highlights} bookmarks={bookmarks} notes={notes} />
                <Typography className="text-xs">Kitap Bilgisi</Typography>
              </div>
            </div>
          )}

          {/* Theme and Close Section for mobile - always show at bottom when there's selection or clicked highlight */}
          {(selection || clickedHighlight) && (
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="flex flex-col items-center gap-2">
                <ModeToggle />
                <Typography className="text-xs">Tema</Typography>
              </div>
            </div>
          )}

          {/* Close Button */}
          <Button
            variant="outline"
            className="w-full mt-6"
            onClick={() => {
              setIsMobileDrawerOpen(false);
              setSelection(null);
              setClickedHighlight(null);
            }}
          >
            Kapat
          </Button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isMobileDrawerOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileDrawerOpen(false)} />}

      <Dialog open={isNoteDialogOpen} onOpenChange={handleCloseNoteDialog}>
        <DialogContent
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Not Ekle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selection && <blockquote className="mt-6 border-l-2 pl-6 italic">{selection.text}</blockquote>}
            <Label htmlFor="note-content" className="sr-only">
              Not
            </Label>
            <Textarea id="note-content" placeholder="Notunuzu buraya yazın." value={noteContent} onChange={(e) => setNoteContent(e.target.value)} className="min-h-[100px]" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseNoteDialog}>
              İptal
            </Button>
            <Button onClick={handleSaveNote}>Notu Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}