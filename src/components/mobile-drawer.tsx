import { Button } from "@/components/ui/button";
import { BookImage, Bookmark, EnhancedNavItem, Highlight, Note, SearchResult } from "@/hooks/use-epub-reader";
import { ChevronUp, Settings } from "lucide-react";
import { HighlightOptionsBar } from "./highlight-options-bar";
import { MainControlGroup } from "./main-control-group";
import { SelectionActionsBar } from "./selection-actions-bar";

interface MobileDrawerProps {
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (isOpen: boolean) => void;
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

export function MobileDrawer(props: MobileDrawerProps) {
  const {
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
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
    <>
      <Button
        onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
        className="fixed top-4 right-4 z-50 md:hidden bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white border-0 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200"
        size="sm"
      >
        {isMobileDrawerOpen ? <ChevronUp className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
      </Button>

      <div
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-t-2xl shadow-xl transition-transform duration-300 z-50 md:hidden ${
          isMobileDrawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {clickedHighlight ? (
            <HighlightOptionsBar
              clickedHighlight={clickedHighlight}
              setClickedHighlight={setClickedHighlight}
              removeHighlight={removeHighlight}
              updateHighlightColor={updateHighlightColor}
              isPinned={false} // isPinned is not applicable for mobile
            />
          ) : selection ? (
            <SelectionActionsBar
              variant="mobile"
              selection={selection}
              addHighlight={addHighlight}
              setIsNoteDialogOpen={setIsNoteDialogOpen}
              setIsCopyConfirmationDialogOpen={setIsCopyConfirmationDialogOpen}
              setIsMobileDrawerOpen={setIsMobileDrawerOpen}
            />
          ) : (
            <MainControlGroup variant="mobile" {...props} saveReaderPreferences={saveReaderPreferences} />
          )}

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

      {isMobileDrawerOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileDrawerOpen(false)} />}
    </>
  );
}