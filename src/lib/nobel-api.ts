import { IReaderPreferenceConfig } from "@/atoms/reader-preferences";
export interface NobelNote {
  id?: string;
  cfi: string;
  text: string;
  note: string;
  createdAt?: string;
}

export interface NobelHighlight {
  id?: string;
  cfi: string;
  text: string;
  color?: string;
  createdAt?: string;
  type?: string;
}

export interface NobelBookmark {
  id?: string;
  cfi: string;
  label?: string;
  createdAt?: string;
}

export interface NobelLocation {
  cfi: string;
  progress?: number;
  updatedAt?: string;
}

export interface NobelCopyProtection {
  allowedPercentage: number;
  copiedPercentage: number;
  copiedCharacters?: number;
  isEnabled: boolean;
}

export interface NobelBookData {
  notes: NobelNote[];
  highlights: NobelHighlight[];
  bookmarks: NobelBookmark[];
  location: NobelLocation | null;
  copyProtection: NobelCopyProtection | null;
}

// Book ID mapping - maps ISBN or other identifiers to actual Nobel book IDs
const BOOK_ID_MAPPING: Record<string, string> = {
  // ISBN to Nobel ID mapping
  "9786057895554": "C9w1V0p1DHtqiWv", // Example from the network logs
  // Add more mappings as needed
  // You can also add the reverse mapping if needed
  C9w1V0p1DHtqiWv: "C9w1V0p1DHtqiWv",
  "94FoN1xy0lUZ5Cd": "94FoN1xy0lUZ5Cd", // Keep original Nobel IDs as-is
};

export class NobelApiClient {
  private bookId: string;
  private actualNobelId: string;

  constructor(bookId: string) {
    this.bookId = bookId;
    // Map the book ID to the actual Nobel ID if needed
    this.actualNobelId = BOOK_ID_MAPPING[bookId] || bookId;
    console.log(`Nobel API Client: Mapped ${bookId} -> ${this.actualNobelId}`);
  }

  // Fetch all data for the book
  async fetchAllBookData(): Promise<NobelBookData> {
    try {
      const [notes, highlights, bookmarks, location, copyProtection] = await Promise.all([
        this.fetchNotes(),
        this.fetchHighlights(),
        this.fetchBookmarks(),
        this.fetchLocation(),
        this.fetchCopyProtection(),
      ]);

      return {
        notes,
        highlights,
        bookmarks,
        location,
        copyProtection,
      };
    } catch (error) {
      console.error("Error fetching Nobel book data:", error);
      throw error;
    }
  }

  // Fetch notes
  async fetchNotes(): Promise<NobelNote[]> {
    try {
      const response = await fetch(`/api/books/nobel/${this.actualNobelId}/notes`);
      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching notes:", error);
      return [];
    }
  }

  // Fetch highlights
  async fetchHighlights(): Promise<NobelHighlight[]> {
    try {
      const response = await fetch(`/api/books/nobel/${this.actualNobelId}/highlights`);
      if (!response.ok) {
        throw new Error(`Failed to fetch highlights: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching highlights:", error);
      return [];
    }
  }

  // Fetch bookmarks
  async fetchBookmarks(): Promise<NobelBookmark[]> {
    try {
      const response = await fetch(`/api/books/nobel/${this.actualNobelId}/bookmarks`);
      if (!response.ok) {
        throw new Error(`Failed to fetch bookmarks: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      return [];
    }
  }

  // Fetch location
  async fetchLocation(): Promise<NobelLocation | null> {
    try {
      const response = await fetch(`/api/books/nobel/${this.actualNobelId}/location`);
      if (!response.ok) {
        throw new Error(`Failed to fetch location: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  }

  // Fetch copy protection info
  async fetchCopyProtection(): Promise<NobelCopyProtection | null> {
    try {
      const response = await fetch(`/api/books/nobel/${this.actualNobelId}/copy-protection`);
      if (!response.ok) {
        throw new Error(`Failed to fetch copy protection: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching copy protection:", error);
      return null;
    }
  }

  // Add a note
  async addNote(cfi: string, text: string, note: string): Promise<NobelNote> {
    try {
      const response = await fetch(`/api/books/nobel/${this.actualNobelId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cfi, text, note }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add note: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding note:", error);
      throw error;
    }
  }

  // Add a highlight
  async addHighlight(cfi: string, text: string, color?: string, type?: string): Promise<NobelHighlight> {
    try {
      const response = await fetch(`/api/books/nobel/${this.actualNobelId}/highlights/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cfi, text, color, type }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add highlight: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding highlight:", error);
      throw error;
    }
  }

  // Add a bookmark
  async addBookmark(cfi: string, label?: string): Promise<NobelBookmark> {
    try {
      const response = await fetch(`/api/books/nobel/${this.actualNobelId}/bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cfi, label }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add bookmark: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding bookmark:", error);
      throw error;
    }
  }

  // Update location
  async updateLocation(cfi: string, progress?: number): Promise<NobelLocation> {
    try {
      console.log("Nobel API: Sending location update:", { bookId: this.bookId, actualNobelId: this.actualNobelId, cfi, progress });

      const response = await fetch(`/api/books/nobel/${this.actualNobelId}/location`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cfi, progress }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Nobel API location update failed:", {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
        throw new Error(`Failed to update location: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  }

  // Delete a note
  async deleteNote(noteId: string): Promise<void> {
    try {
      const response = await fetch(`/api/books/nobel/${this.actualNobelId}/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete note: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  }

  // Delete a highlight
  async deleteHighlight(highlightId: string): Promise<void> {
    try {
      const response = await fetch(`/api/books/nobel/${this.actualNobelId}/highlights/${highlightId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete highlight: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting highlight:", error);
      throw error;
    }
  }

  // Delete a bookmark
  async deleteBookmark(bookmarkId: string): Promise<void> {
    try {
      const response = await fetch(`/api/books/nobel/${this.actualNobelId}/bookmarks/${bookmarkId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete bookmark: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      throw error;
    }
  }

  // Fetch reader preferences
  async fetchReaderPreferences(): Promise<IReaderPreferenceConfig | null> {
    try {
      const response = await fetch(`/api/user/preferences/reader-styles`);
      if (!response.ok) {
        throw new Error(`Failed to fetch reader preferences: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching reader preferences:", error);
      return null;
    }
  }

  // Update reader preferences
  async updateReaderPreferences(preferences: IReaderPreferenceConfig): Promise<void> {
    try {
      const response = await fetch(`/api/user/preferences/reader-styles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error(`Failed to update reader preferences: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating reader preferences:", error);
      throw error;
    }
  }
}

// Helper function to determine if a book ID is a Nobel book
export function isNobelBook(bookId: string): boolean {
  // Check if the bookId is in our mapping
  if (BOOK_ID_MAPPING[bookId]) {
    return true;
  }

  // Nobel book IDs can be:
  // 1. Alphanumeric strings like "94FoN1xy0lUZ5Cd" (10+ characters)
  // 2. ISBN format like "9786057895554" (13 digits)

  // Check for ISBN format (13 digits starting with 978 or 979)
  if (/^97[89]\d{10}$/.test(bookId)) {
    return true;
  }

  // Check for alphanumeric format (10+ characters)
  if (/^[a-zA-Z0-9]{10,}$/.test(bookId) && bookId.length >= 10) {
    return true;
  }

  return false;
}

// Helper function to create a Nobel API client for a book
export function createNobelApiClient(bookId: string): NobelApiClient | null {
  if (isNobelBook(bookId)) {
    return new NobelApiClient(bookId);
  }
  return null;
}
