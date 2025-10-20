import { Button } from "@/components/ui/button";
import { BookImage, Bookmark, EnhancedNavItem, Highlight, Note, SearchResult } from "@/hooks/use-epub-reader";
import { AlignJustify, AlignLeft, ChevronLeft } from "lucide-react";
import { HighlightOptionsBar } from "./highlight-options-bar";
import { MainControlGroup } from "./main-control-group";
import { ModeToggle } from "./mode-toggle";
import { SelectionActionsBar } from "./selection-actions-bar";

interface DesktopDrawerProps {
  isPinned: boolean;
  setIsPinned: (isPinned: boolean) => void;
  onDrawerStateChange?: (isPinned: boolean) => void;
  selection: { cfi: string; text: string; rect: DOMRect } | null;
  setSelection: React.Dispatch<React.SetStateAction<{ cfi: string; text: string; rect: DOMRect } | null>>;
  clickedHighlight: Highlight | null;
  setClickedHighlight: React.Dispatch<React.SetStateAction<Highlight | null>>;
  removeHighlight: (cfi: string, type: "highlight" | "underline") => void;
  updateHighlightColor: (cfi: string, newColor: string) => void;
  addHighlight: (args: Highlight) => void;
  setIsNoteDialogOpen: (isOpen: boolean) => void;
  setIsCopyConfirmationDialogOpen: (isOpen: boolean) => void;
  toc: EnhancedNavItem[];
  goToHref: (href: string) => void;
  isBookmarked: boolean;
  addBookmark: () => void;
  removeBookmark: (cfiToRemove: string) => void;
  location: string | null;
  bookmarks: Bookmark[];
  goToCfi: (cfi: string) => void;
  removeAllBookmarks: () => void;
  highlights: Highlight[];
  removeAllHighlights: () => void;
  notes: Note[];
  removeNote: (cfiToRemove: string) => void;
  removeAllNotes: () => void;
  editNote: (cfi: string, newNote: string) => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchResults: SearchResult[];
  currentSearchResultIndex: number;
  goToSearchResult: (index: number) => void;
  searchBook: (query: string) => Promise<void>;
  isSearching: boolean;
  bookImages: BookImage[];
  getPreviewText: (charCount?: number) => Promise<string | null>;
  bookCover?: string | null;
  bookTitle?: string | null;
  totalPages?: number;
  progress?: number;
  saveReaderPreferences: (preferences: IReaderPreferenceConfig) => Promise<void>;
}

export function DesktopDrawer(props: DesktopDrawerProps) {
  const {
    isPinned,
    setIsPinned,
    onDrawerStateChange,
    selection,
    setSelection,
    clickedHighlight,
    setClickedHighlight,
    removeHighlight,
    updateHighlightColor,
    addHighlight,
    setIsNoteDialogOpen,
    setIsCopyConfirmationDialogOpen,
    saveReaderPreferences,
  } = props;

  return (
    <div
      className={`hidden md:flex fixed right-0 top-0 h-full bg-gray-100 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-md p-4 mt-1 flex-col space-y-4 transition-all duration-300 z-50
        ${isPinned ? "w-64" : "w-20 items-center"}`}
    >
      <div className="flex items-center justify-start w-full">
        <Button
          variant="ghost"
          onClick={() => {
            setIsPinned(!isPinned);
            onDrawerStateChange?.(!isPinned);
          }}
          aria-label={isPinned ? "Collapse Drawer" : "Expand Drawer"}
          className="p-2"
        >
          {isPinned ? <AlignLeft className="w-6 h-6" /> : <AlignJustify className="w-6 h-6" />}
        </Button>
      </div>

      {clickedHighlight ? (
        <HighlightOptionsBar
          clickedHighlight={clickedHighlight}
          setClickedHighlight={setClickedHighlight}
          removeHighlight={removeHighlight}
          updateHighlightColor={updateHighlightColor}
          isPinned={isPinned}
        />
      ) : selection ? (
        <SelectionActionsBar
          variant="desktop"
          isPinned={isPinned}
          selection={selection}
          addHighlight={addHighlight}
          setIsNoteDialogOpen={setIsNoteDialogOpen}
          setIsCopyConfirmationDialogOpen={setIsCopyConfirmationDialogOpen}
        />
      ) : (
        <MainControlGroup variant="desktop" {...props} saveReaderPreferences={saveReaderPreferences} />
      )}

      <div className="mt-auto flex flex-col items-center gap-3 mb-4">
        {selection && (
          <Button
            variant="ghost"
            className={`flex items-center ${
              isPinned ? "gap-2" : "justify-center"
            } text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700`}
            onClick={() => {
              setSelection(null);
              setClickedHighlight(null);
            }}
            title={!isPinned ? "Geri Dön" : undefined}
          >
            <ChevronLeft className={`${isPinned ? "w-4 h-4" : "w-6 h-6"}`} />
            {isPinned && <span className="text-sm">Geri Dön</span>}
          </Button>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}