import { BookImage, Bookmark, EnhancedNavItem, Highlight, Note, SearchResult } from "@/hooks/use-epub-reader";
import { useEffect, useRef, useState } from "react";
import { AddEditNoteDialog } from "./add-edit-note-dialog";
import { CopyConfirmationDialog } from "./copy-confirmation-dialog";
import { DesktopDrawer } from "./desktop-drawer";
import { MobileDrawer } from "./mobile-drawer";

// TODO (2025-07-22): Refactor to make it readable and maintainable, create internal reusable components for repeated sections.
// TODO: Refactor: Position button on bottom right, change popover content to a list layout (mobile-specific, similar to Apple Books mobile app).

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
  copyText: (text: string) => Promise<void>;
}

export function ReaderControlsDrawer(props: ReaderControlsDrawerProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isCopyConfirmationDialogOpen, setIsCopyConfirmationDialogOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const { setSelection, setClickedHighlight } = props;
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isNoteDialogOpen || isCopyConfirmationDialogOpen) {
        return;
      }

      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setSelection(null);
        setClickedHighlight(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelection, setClickedHighlight, isNoteDialogOpen, isCopyConfirmationDialogOpen]);

  const handleSaveNote = (note: string) => {
    if (props.selection) {
      props.addNote({
        cfi: props.selection.cfi,
        text: props.selection.text,
        note,
        createdAt: new Date().toISOString(),
      });
      setIsNoteDialogOpen(false);
      props.setSelection(null);
    }
  };

  const handleCloseNoteDialog = () => {
    setIsNoteDialogOpen(false);
    props.setSelection(null);
    props.setClickedHighlight(null);
  };

  return (
    <div ref={barRef}>
      <DesktopDrawer
        {...props}
        isPinned={isPinned}
        setIsPinned={setIsPinned}
        setIsNoteDialogOpen={setIsNoteDialogOpen}
        setIsCopyConfirmationDialogOpen={setIsCopyConfirmationDialogOpen}
      />
      <MobileDrawer
        {...props}
        isMobileDrawerOpen={isMobileDrawerOpen}
        setIsMobileDrawerOpen={setIsMobileDrawerOpen}
        setIsNoteDialogOpen={setIsNoteDialogOpen}
        setIsCopyConfirmationDialogOpen={setIsCopyConfirmationDialogOpen}
      />

      {isNoteDialogOpen && <AddEditNoteDialog open={isNoteDialogOpen} onSave={handleSaveNote} onClose={handleCloseNoteDialog} />}
      <CopyConfirmationDialog
        isOpen={isCopyConfirmationDialogOpen}
        onConfirm={async () => {
          if (props.selection) {
            await props.copyText(props.selection.text);
            setIsCopyConfirmationDialogOpen(false);
            props.setSelection(null);
          }
        }}
        onCancel={() => {
          setIsCopyConfirmationDialogOpen(false);
          props.setSelection(null);
        }}
        selectedText={props.selection?.text || ""}
      />
    </div>
  );
}