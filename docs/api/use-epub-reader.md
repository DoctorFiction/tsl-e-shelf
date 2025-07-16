# `useEpubReader` API Documentation

The `useEpubReader` hook is the core headless API for all e-reader functionality within the TSL-E-Shelf application. It provides a comprehensive set of features for rendering EPUB books, managing reader state, handling user interactions, and integrating with various reader-specific functionalities like highlights, bookmarks, notes, and search.

## Usage

```typescript
import { useEpubReader } from "@/hooks/use-epub-reader";

function MyReaderComponent({ bookUrl }: { bookUrl: string }) {
  const {
    location,
    goNext,
    goPrev,
    toc,
    addHighlight,
    highlights,
    bookmarks,
    addBookmark,
    // ... and many more
  } = useEpubReader(bookUrl);

  // Your component logic here
  return (
    <div>
      {/* Render your reader UI */}
    </div>
  );
}
```

## Parameters

`useEpubReader` accepts a single parameter:

*   `url`: `string` - The URL or path to the EPUB file to be loaded.

## Return Value (`IUseEpubReaderReturn` Interface)

The hook returns an object conforming to the `IUseEpubReaderReturn` interface, providing access to the reader's state and control functions.

```typescript
interface IUseEpubReaderReturn {
  /**
   * The current CFI (Canonical Fragment Identifier) location in the book.
   * @type {string | null}
   */
  location: string | null;

  /**
   * State for image preview, containing the source and description of the image.
   * @type {{ src: string; description: string } | null}
   */
  imagePreview: { src: string; description: string } | null;

  /**
   * Setter for the imagePreview state.
   * @type {React.Dispatch<React.SetStateAction<{ src: string; description: string } | null>>}
   */
  setImagePreview: React.Dispatch<React.SetStateAction<{ src: string; description: string } | null>>;

  /**
   * An array of all images found in the book, with their CFI, source, description, chapter, and page.
   * @type {BookImage[]}
   */
  bookImages: BookImage[];

  /**
   * Navigates to the next page/section in the book.
   * @returns {void}
   */
  goNext: () => void;

  /**
   * Navigates to the previous page/section in the book.
   * @returns {void}
   */
  goPrev: () => void;

  /**
   * Navigates to a specific location in the book using an href.
   * @param {string} href - The href to navigate to.
   * @returns {void}
   */
  goToHref: (href: string) => void;

  /**
   * Navigates to a specific CFI location in the book.
   * @param {string} cfi - The CFI to navigate to.
   * @returns {void}
   */
  goToCfi: (cfi: string) => void;

  /**
   * The Table of Contents (TOC) of the book, enhanced with page numbers.
   * @type {EnhancedNavItem[]}
   */
  toc: EnhancedNavItem[];

  /**
   * React ref for the viewer DOM element where the book is rendered.
   * @type {React.RefObject<HTMLDivElement | null>}
   */
  viewerRef: React.RefObject<HTMLDivElement | null>;

  /**
   * Adds a highlight to the book.
   * @param {Highlight} args - The highlight object containing cfi, text, type, and color.
   * @returns {void}
   */
  addHighlight: (args: Highlight) => void;

  /**
   * An array of all highlights in the book.
   * @type {Highlight[]}
   */
  highlights: Highlight[];

  /**
   * An array of all bookmarks in the book.
   * @type {Bookmark[]}
   */
  bookmarks: Bookmark[];

  /**
   * Adds a bookmark at the current location.
   * @returns {void}
   */
  addBookmark: () => void;

  /**
   * Navigates to a specific bookmark by its CFI.
   * @param {string} cfi - The CFI of the bookmark to navigate to.
   * @returns {void}
   */
  goToBookmark: (cfi: string) => void;

  /**
   * Removes a bookmark by its CFI.
   * @param {string} cfiToRemove - The CFI of the bookmark to remove.
   * @returns {void}
   */
  removeBookmark: (cfiToRemove: string) => void;

  /**
   * Removes all bookmarks.
   * @returns {void}
   */
  removeAllBookmarks: () => void;

  /**
   * An array of search results.
   * @type {SearchResult[]}
   */
  searchResults: SearchResult[];

  /**
   * The index of the currently selected search result.
   * @type {number}
   */
  currentSearchResultIndex: number;

  /**
   * Navigates to a specific search result by its index.
   * @param {number} index - The index of the search result to navigate to.
   * @returns {void}
   */
  goToSearchResult: (index: number) => void;

  /**
   * The current search query string.
   * @type {string}
   */
  searchQuery: string;

  /**
   * Setter for the searchQuery state.
   * @type {React.Dispatch<React.SetStateAction<string>>}
   */
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

  /**
   * Removes a highlight by its CFI and type.
   * @param {string} cfi - The CFI of the highlight to remove.
   * @param {HighlightType} type - The type of highlight (e.g., "highlight", "underline").
   * @returns {void}
   */
  removeHighlight: (cfi: string, type: HighlightType) => void;

  /**
   * Removes all highlights.
   * @returns {void}
   */
  removeAllHighlights: () => void;

  /**
   * Adds a note to the book.
   * @param {Note} note - The note object containing cfi, text, and the note content.
   * @returns {void}
   */
  addNote: (note: Note) => void;

  /**
   * An array of all notes in the book.
   * @type {Note[]}
   */
  notes: Note[];

  /**
   * Removes a note by its CFI.
   * @param {string} cfi - The CFI of the note to remove.
   * @returns {void}
   */
  removeNote: (cfi: string) => void;

  /**
   * Removes all notes.
   * @returns {void}
   */
  removeAllNotes: () => void;

  /**
   * Edits an existing note.
   * @param {string} cfi - The CFI of the note to edit.
   * @param {string} newNote - The new content for the note.
   * @returns {void}
   */
  editNote: (cfi: string, newNote: string) => void;

  /**
   * The note currently being edited, or null if no note is being edited.
   * @type {Note | null}
   */
  editingNote: Note | null;

  /**
   * Setter for the editingNote state.
   * @type {React.Dispatch<React.SetStateAction<Note | null>>}
   */
  setEditingNote: React.Dispatch<React.SetStateAction<Note | null>>;

  /**
   * The highlight that was most recently clicked, or null if no highlight is clicked.
   * @type {Highlight | null}
   */
  clickedHighlight: Highlight | null;

  /**
   * Setter for the clickedHighlight state.
   * @type {React.Dispatch<React.SetStateAction<Highlight | null>>}
   */
  setClickedHighlight: React.SetStateAction<Highlight | null>;

  /**
   * Updates the color of an existing highlight.
   * @param {string} cfi - The CFI of the highlight to update.
   * @param {string} newColor - The new color for the highlight.
   * @returns {void}
   */
  updateHighlightColor: (cfi: string, newColor: string) => void;

  /**
   * The current page number being displayed.
   * @type {number}
   */
  currentPage: number;

  /**
   * The total number of pages in the book.
   * @type {number}
   */
  totalPages: number;

  /**
   * Any error encountered during book loading or rendering.
   * @type {Error | null}
   */
  error: Error | null;

  /**
   * Indicates if the book is currently loading.
   * @type {boolean}
   */
  isLoading: boolean;

  /**
   * The reading progress as a percentage (0-100).
   * @type {number}
   */
  progress: number;

  /**
   * The title of the loaded book.
   * @type {string | null}
   */
  bookTitle: string | null;

  /**
   * The author of the loaded book.
   * @type {string | null}
   */
  bookAuthor: string | null;

  /**
   * The URL of the book cover image.
   * @type {string | null}
   */
  bookCover: string | null;

  /**
   * The current text selection in the reader, including CFI, text, and bounding rectangle.
   * @type {{ cfi: string; text: string; rect: DOMRect } | null}
   */
  selection: { cfi: string; text: string; rect: DOMRect } | null;

  /**
   * Setter for the selection state.
   * @type {React.Dispatch<React.SetStateAction<{ cfi: string; text: string; rect: DOMRect } | null>>}
   */
  setSelection: React.Dispatch<React.SetStateAction<{ cfi: string; text: string; rect: DOMRect } | null>>;

  /**
   * The title of the current chapter.
   * @type {string | null}
   */
  currentChapterTitle: string | null;
}
```

## Types and Interfaces

### `Highlight`

Represents a text highlight in the book.

```typescript
export type Highlight = {
  id?: string;
  cfi: string;
  text: string;
  type?: HighlightType;
  color?: string;
  rect?: DOMRect;
  createdAt: string;
};
```

### `HighlightType`

Defines the type of highlight.

```typescript
type HighlightType = "highlight" | "underline";
```

### `Bookmark`

Represents a bookmark in the book.

```typescript
export type Bookmark = {
  cfi: string;
  label?: string;
  createdAt: string;
  chapter: string | null;
  page: number | null;
};
```

### `Note`

Represents a user-added note associated with a text selection.

```typescript
export type Note = {
  cfi: string;
  text: string;
  note: string;
  createdAt: string;
};
```

### `SearchResult`

Represents a single search result.

```typescript
export type SearchResult = {
  cfi: string;
  excerpt: string;
  href: string;
  chapterTitle: string;
  chapterIndex: number;
};
```

### `BookImage`

Represents an image found within the book content.

```typescript
export type BookImage = {
  src: string;
  cfi: string;
  description: string;
  chapter: string | null;
  page: number | null;
};
```

### `EnhancedNavItem`

Extends the `epubjs` `NavItem` with an estimated page number.

```typescript
export type EnhancedNavItem = NavItem & {
  page?: number;
  subitems?: EnhancedNavItem[];
};
```
