import { Button } from "@/components/ui/button";
import { Bookmark, EnhancedNavItem, Highlight, Note, SearchResult } from "@/hooks/use-epub-reader";
import { Underline, Trash2, X, NotebookPen, Pin, PinOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { HighlightsListPopover } from "./highlights-list-popover";
import { BookmarksListPopover } from "./bookmarks-list-popover";
import { NotesListPopover } from "./notes-list-popover";
import { SearchPopover } from "./search-popover";
import { BookmarkButton } from "./bookmark-button";
import { TableOfContentsPopover } from "./table-of-contents-popover";
import { ReaderSettings } from "./reader-settings";
import { Typography } from "./ui/typography";

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
  removeHighlight: (cfi: string, type: "highlight" | "underline") => void;
  setClickedHighlight: React.Dispatch<React.SetStateAction<Highlight | null>>;
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
}

export function ReaderControlsDrawer({
  selection,
  addHighlight,
  clickedHighlight,
  removeHighlight,
  setClickedHighlight,
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
}: ReaderControlsDrawerProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
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
    <div
      ref={barRef}
      className={`fixed right-0 top-0 h-full bg-gray-100 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-md p-4 mt-1 flex flex-col space-y-4 transition-all duration-300 z-50
        ${isPinned ? "w-64" : "w-20 items-center"}`}
    >
      <Button variant="ghost" className="" onClick={() => setIsPinned(!isPinned)} aria-label={isPinned ? "Unpin drawer" : "Pin drawer"}>
        {isPinned ? <PinOff className="w-6 h-6" /> : <Pin className="w-6 h-6" />}
      </Button>

      {/* Highlight Options */}
      {selection && (
        <div className={`flex flex-col space-y-2 ${isPinned ? "items-start" : "items-center"}`}>
          <Typography variant="body2" className="font-bold">
            Highlight & Note
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
              {isPinned && <span>Underline</span>}
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setIsNoteDialogOpen(true);
              }}
            >
              <NotebookPen className="w-6 h-6" />
              {isPinned && <span>Note</span>}
            </Button>
          </div>
        </div>
      )}

      {/* Clicked Highlight Options */}
      {clickedHighlight && (
        <Button
          variant="ghost"
          className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-700"
          onClick={() => {
            if (clickedHighlight) {
              removeHighlight(clickedHighlight.cfi, clickedHighlight.type || "highlight");
              setClickedHighlight(null);
            }
          }}
        >
          <Trash2 className="w-6 h-6" />
          {isPinned && <span>Remove Highlight</span>}
        </Button>
      )}

      {/* Main Controls */}
      <div className={`flex flex-col space-y-2 ${isPinned ? "items-start" : "items-center"}`}>
        <Typography variant="body2" className="font-bold">
          Controls
        </Typography>
        <div className="flex flex-row gap-2 items-center">
          <TableOfContentsPopover toc={toc} goToHref={goToHref} />
          {isPinned && <Typography>Table of Contents</Typography>}
        </div>
        <div className="flex flex-row gap-2 items-center">
          <BookmarkButton isBookmarked={isBookmarked} addBookmark={addBookmarkProp} removeBookmark={removeBookmark} location={location} />
          {isPinned && <Typography>Bookmark</Typography>}
        </div>
        <div className="flex flex-row gap-2 items-center">
          <BookmarksListPopover bookmarks={bookmarks} goToCfi={goToCfi} removeBookmark={removeBookmark} removeAllBookmarks={removeAllBookmarks} />
          {isPinned && <Typography>Bookmarks</Typography>}
        </div>
        <div className="flex flex-row gap-2 items-center">
          <HighlightsListPopover highlights={highlights} goToCfi={goToCfi} removeHighlight={removeHighlight} removeAllHighlights={removeAllHighlights} />
          {isPinned && <Typography>Highlights</Typography>}
        </div>
        <div className="flex flex-row gap-2 items-center">
          <NotesListPopover notes={notes} goToCfi={goToCfi} removeNote={removeNote} removeAllNotes={removeAllNotes} editNote={editNote} />
          {isPinned && <Typography>Notes</Typography>}
        </div>
        <div className="flex flex-row gap-2 items-center">
          <SearchPopover
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            goToCfi={goToCfi}
            currentSearchResultIndex={currentSearchResultIndex}
            goToSearchResult={goToSearchResult}
          />
          {isPinned && <Typography>Search</Typography>}
        </div>
        <div className="flex flex-row gap-2 items-center">
          <ReaderSettings />
          {isPinned && <Typography>Settings</Typography>}
        </div>
      </div>

      <Button
        variant="ghost"
        className="absolute bottom-4 right-4"
        onClick={() => {
          setSelection(null);
          setClickedHighlight(null);
        }}
      >
        <X className="w-6 h-6" />
      </Button>

      <Dialog open={isNoteDialogOpen} onOpenChange={handleCloseNoteDialog}>
        <DialogContent
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selection && <blockquote className="mt-6 border-l-2 pl-6 italic">{selection.text}</blockquote>}
            <Label htmlFor="note-content" className="sr-only">
              Note
            </Label>
            <Textarea id="note-content" placeholder="Type your note here." value={noteContent} onChange={(e) => setNoteContent(e.target.value)} className="min-h-[100px]" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseNoteDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
