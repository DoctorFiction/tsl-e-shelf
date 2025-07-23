import { Typography } from "@/components/ui/typography";
import { BookImage, Bookmark, EnhancedNavItem, Highlight, Note, SearchResult } from "@/hooks/use-epub-reader";
import { BookmarkButton } from "./bookmark-button";
import { BookmarksListPopover } from "./bookmarks-list-popover";
import { HighlightsListPopover } from "./highlights-list-popover";
import { ImagesPopover } from "./images-popover";
import { NotesListPopover } from "./notes-list-popover";
import { ReaderBookInfo } from "./ui/reader-book-info";
import { ReaderSettings } from "./reader-settings";
import { SearchPopover } from "./search-popover";
import { TableOfContentsPopover } from "./table-of-contents-popover";

interface MainControlGroupProps {
  variant: "desktop" | "mobile";
  isPinned?: boolean;
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
  removeHighlight: (cfi: string, type: "highlight" | "underline") => void;
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
}

export function MainControlGroup({
  variant,
  isPinned,
  toc,
  goToHref,
  isBookmarked,
  addBookmark,
  removeBookmark,
  location,
  bookmarks,
  goToCfi,
  removeAllBookmarks,
  highlights,
  removeHighlight,
  removeAllHighlights,
  notes,
  removeNote,
  removeAllNotes,
  editNote,
  searchQuery,
  setSearchQuery,
  searchResults,
  currentSearchResultIndex,
  goToSearchResult,
  searchBook,
  isSearching,
  bookImages,
  getPreviewText,
  bookCover,
  bookTitle,
  totalPages,
  progress,
}: MainControlGroupProps) {
  if (variant === "mobile") {
    return (
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-2">
          <TableOfContentsPopover toc={toc} goToHref={goToHref} />
          <Typography className="text-xs">İçindekiler</Typography>
        </div>
        <div className="flex flex-col items-center gap-2">
          <BookmarkButton isBookmarked={isBookmarked} addBookmark={addBookmark} removeBookmark={removeBookmark} location={location} />
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
          <ReaderBookInfo bookCover={bookCover} bookTitle={bookTitle} totalPages={totalPages} progress={progress} highlights={highlights} bookmarks={bookmarks} notes={notes} />
          <Typography className="text-xs">Kitap Bilgisi</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col space-y-2 ${isPinned ? "items-start" : "items-center"}`}>
      <Typography variant="body2" className="font-bold">
        Kontroller
      </Typography>
      <div className="flex flex-row gap-2 items-center">
        <TableOfContentsPopover toc={toc} goToHref={goToHref} />
        {isPinned && <Typography>İçindekiler</Typography>}
      </div>
      <div className="flex flex-row gap-2 items-center">
        <BookmarkButton isBookmarked={isBookmarked} addBookmark={addBookmark} removeBookmark={removeBookmark} location={location} />
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
  );
}
