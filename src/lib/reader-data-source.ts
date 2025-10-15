import { Highlight, Bookmark, Note } from "@/hooks/use-epub-reader";
import { IReaderPreferenceConfig } from "@/atoms/reader-preferences";
import { NobelApiClient, NobelBookData } from "./nobel-api";

export interface EpubReaderDataSource {
  getHighlights: () => Promise<Highlight[]>;
  addHighlight: (highlight: Omit<Highlight, "createdAt" | "id">) => Promise<Highlight>;
  removeHighlight: (cfi: string) => Promise<void>;
  updateHighlightColor: (cfi: string, newColor: string) => Promise<void>;

  getBookmarks: () => Promise<Bookmark[]>;
  addBookmark: (bookmark: Omit<Bookmark, "createdAt">) => Promise<Bookmark>;
  removeBookmark: (cfi: string) => Promise<void>;

  getNotes: () => Promise<Note[]>;
  addNote: (note: Omit<Note, "createdAt">) => Promise<Note>;
  removeNote: (cfi: string) => Promise<void>;
  updateNote: (cfi: string, newNote: string) => Promise<void>;

  getLocation: () => Promise<string | null>;
  updateLocation: (location: string, progress: number) => Promise<void>;

  getTotalChars: () => Promise<number | null>;
  saveTotalChars: (totalChars: number) => Promise<void>;
  getCopiedChars: () => Promise<number>;
  updateCopiedChars: (chars: number) => Promise<void>;

  // This is for Nobel-specific data that doesn't fit the generic model
  getNobelBookData?: () => Promise<NobelBookData | null>;

  getReaderPreferences: () => Promise<IReaderPreferenceConfig | null>;
  updateReaderPreferences: (preferences: IReaderPreferenceConfig) => Promise<void>;
}

export class LocalStorageDataSource implements EpubReaderDataSource {
  private readonly url: string;
  public readonly STORAGE_KEY_HIGHLIGHTS: string;
  public readonly STORAGE_KEY_BOOKMARK: string;
  public readonly STORAGE_KEY_NOTES: string;
  public readonly STORAGE_KEY_LOC: string;
  public readonly STORAGE_KEY_TOTAL_CHARS: string;
  public readonly STORAGE_KEY_COPIED_CHARS: string;
  public readonly STORAGE_KEY_PREFERENCES: string;

  constructor(url: string) {
    this.url = url;
    this.STORAGE_KEY_HIGHLIGHTS = `epub-highlights-${url}`;
    this.STORAGE_KEY_BOOKMARK = `epub-bookmarks-${url}`;
    this.STORAGE_KEY_NOTES = `epub-notes-${url}`;
    this.STORAGE_KEY_LOC = `epub-location-${url}`;
    this.STORAGE_KEY_TOTAL_CHARS = `epub-total-chars-${url}`;
    this.STORAGE_KEY_COPIED_CHARS = `epub-copied-chars-${url}`;
    this.STORAGE_KEY_PREFERENCES = `epub-reader-preferences-${url}`;
  }

  private get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch (e) {
      console.error(`Failed to parse localStorage data for key "${key}"`, e);
      return null;
    }
  }

  public set<T>(key: string, data: T): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  async getHighlights(): Promise<Highlight[]> {
    return this.get<Highlight[]>(this.STORAGE_KEY_HIGHLIGHTS) || [];
  }

  async addHighlight(highlight: Omit<Highlight, "createdAt" | "id">): Promise<Highlight> {
    const newHighlight: Highlight = { ...highlight, createdAt: new Date().toISOString() };
    const highlights = await this.getHighlights();
    this.set(this.STORAGE_KEY_HIGHLIGHTS, [...highlights, newHighlight]);
    return newHighlight;
  }

  async removeHighlight(cfi: string): Promise<void> {
    const highlights = await this.getHighlights();
    this.set(
      this.STORAGE_KEY_HIGHLIGHTS,
      highlights.filter((h) => h.cfi !== cfi),
    );
  }

  async updateHighlightColor(cfi: string, newColor: string): Promise<void> {
    const highlights = await this.getHighlights();
    const updatedHighlights = highlights.map((h) => (h.cfi === cfi ? { ...h, color: newColor } : h));
    this.set(this.STORAGE_KEY_HIGHLIGHTS, updatedHighlights);
  }

  async getBookmarks(): Promise<Bookmark[]> {
    return this.get<Bookmark[]>(this.STORAGE_KEY_BOOKMARK) || [];
  }

  async addBookmark(bookmark: Omit<Bookmark, "createdAt">): Promise<Bookmark> {
    const newBookmark: Bookmark = { ...bookmark, createdAt: new Date().toISOString() };
    const bookmarks = await this.getBookmarks();
    this.set(this.STORAGE_KEY_BOOKMARK, [...bookmarks, newBookmark]);
    return newBookmark;
  }

  async removeBookmark(cfi: string): Promise<void> {
    const bookmarks = await this.getBookmarks();
    this.set(
      this.STORAGE_KEY_BOOKMARK,
      bookmarks.filter((b) => b.cfi !== cfi),
    );
  }

  async getNotes(): Promise<Note[]> {
    return this.get<Note[]>(this.STORAGE_KEY_NOTES) || [];
  }

  async addNote(note: Omit<Note, "createdAt">): Promise<Note> {
    const newNote: Note = { ...note, createdAt: new Date().toISOString() };
    const notes = await this.getNotes();
    this.set(this.STORAGE_KEY_NOTES, [...notes, newNote]);
    return newNote;
  }

  async removeNote(cfi: string): Promise<void> {
    const notes = await this.getNotes();
    this.set(
      this.STORAGE_KEY_NOTES,
      notes.filter((n) => n.cfi !== cfi),
    );
  }

  async updateNote(cfi: string, newNoteText: string): Promise<void> {
    const notes = await this.getNotes();
    const updatedNotes = notes.map((n) => (n.cfi === cfi ? { ...n, note: newNoteText } : n));
    this.set(this.STORAGE_KEY_NOTES, updatedNotes);
  }

  async getLocation(): Promise<string | null> {
    return this.get<string>(this.STORAGE_KEY_LOC);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateLocation(location: string, progress: number): Promise<void> {
    this.set(this.STORAGE_KEY_LOC, location);
  }

  async getTotalChars(): Promise<number | null> {
    return this.get<number>(this.STORAGE_KEY_TOTAL_CHARS);
  }

  async saveTotalChars(totalChars: number): Promise<void> {
    this.set(this.STORAGE_KEY_TOTAL_CHARS, totalChars);
  }

  async getCopiedChars(): Promise<number> {
    return this.get<number>(this.STORAGE_KEY_COPIED_CHARS) || 0;
  }

  async updateCopiedChars(chars: number): Promise<void> {
    this.set(this.STORAGE_KEY_COPIED_CHARS, chars);
  }

  async getReaderPreferences(): Promise<IReaderPreferenceConfig | null> {
    return this.get<IReaderPreferenceConfig>(this.STORAGE_KEY_PREFERENCES);
  }

  async updateReaderPreferences(preferences: IReaderPreferenceConfig): Promise<void> {
    this.set(this.STORAGE_KEY_PREFERENCES, preferences);
  }
}

export class NobelApiDataSource implements EpubReaderDataSource {
  private apiClient: NobelApiClient;
  private local: LocalStorageDataSource;

  constructor(bookId: string, url: string) {
    this.apiClient = new NobelApiClient(bookId);
    this.local = new LocalStorageDataSource(url);
  }

  async getNobelBookData(): Promise<NobelBookData | null> {
    try {
      return await this.apiClient.fetchAllBookData();
    } catch (error) {
      console.error("Failed to fetch Nobel book data:", error);
      return null;
    }
  }

  private async mergeData<T extends { cfi: string }>(localData: T[], apiData: T[]): Promise<T[]> {
    const combined = [...localData, ...apiData];
    const unique = Array.from(new Map(combined.map((item) => [item.cfi, item])).values());
    return unique;
  }

  async getHighlights(): Promise<Highlight[]> {
    const localHighlights = await this.local.getHighlights();
    try {
      const apiData = await this.getNobelBookData();
      const apiHighlights =
        apiData?.highlights?.map(
          (h) =>
            ({
              ...h,
              type: "highlight",
              createdAt: h.createdAt || new Date().toISOString(),
            }) as Highlight,
        ) || [];
      const merged = await this.mergeData(localHighlights, apiHighlights);
      this.local.set(this.local.STORAGE_KEY_HIGHLIGHTS, merged);
      return merged;
    } catch (e) {
      console.warn("Nobel API fetch for highlights failed, using local data.", e);
      return localHighlights;
    }
  }

  async addHighlight(highlight: Omit<Highlight, "createdAt" | "id">): Promise<Highlight> {
    const newHighlight = await this.local.addHighlight(highlight);
    try {
      await this.apiClient.addHighlight(newHighlight.cfi, newHighlight.text, newHighlight.color, newHighlight.type);
    } catch (e) {
      console.error("Failed to add highlight to Nobel API, saved locally.", e);
    }
    return newHighlight;
  }

  async removeHighlight(cfi: string): Promise<void> {
    await this.local.removeHighlight(cfi);
    try {
      // Note: Nobel API might need an ID to delete. This assumes CFI is enough or we need to find the ID.
      // Assuming we need to find the highlight to get its ID.
      const highlights = await this.getHighlights();
      const highlightToDelete = highlights.find((h) => h.cfi === cfi);
      if (highlightToDelete?.id) {
        await this.apiClient.deleteHighlight(highlightToDelete.id);
      }
    } catch (e) {
      console.error("Failed to remove highlight from Nobel API, removed locally.", e);
    }
  }

  async updateHighlightColor(cfi: string, newColor: string): Promise<void> {
    await this.local.updateHighlightColor(cfi, newColor);
    try {
      const highlights = await this.getHighlights();
      const highlightToUpdate = highlights.find((h) => h.cfi === cfi);
      if (highlightToUpdate?.id) {
        // await this.apiClient.updateHighlight(highlightToUpdate.id, { color: newColor });
      }
    } catch (e) {
      console.error("Failed to update highlight color in Nobel API, updated locally.", e);
    }
  }

  async getBookmarks(): Promise<Bookmark[]> {
    const localBookmarks = await this.local.getBookmarks();
    try {
      const apiData = await this.getNobelBookData();
      const apiBookmarks =
        apiData?.bookmarks?.map(
          (b) =>
            ({
              ...b,
              createdAt: b.createdAt || new Date().toISOString(),
              chapter: null,
              page: null,
            }) as Bookmark,
        ) || [];
      const merged = await this.mergeData(localBookmarks, apiBookmarks);
      this.local.set(this.local.STORAGE_KEY_BOOKMARK, merged);
      return merged;
    } catch (e) {
      console.warn("Nobel API fetch for bookmarks failed, using local data.", e);
      return localBookmarks;
    }
  }

  async addBookmark(bookmark: Omit<Bookmark, "createdAt">): Promise<Bookmark> {
    const newBookmark = await this.local.addBookmark(bookmark);
    try {
      await this.apiClient.addBookmark(newBookmark.cfi, newBookmark.chapter || undefined);
    } catch (e) {
      console.error("Failed to add bookmark to Nobel API, saved locally.", e);
    }
    return newBookmark;
  }

  async removeBookmark(cfi: string): Promise<void> {
    await this.local.removeBookmark(cfi);
    try {
      const bookmarks = await this.getBookmarks();
      const bookmarkToDelete = bookmarks.find((b) => b.cfi === cfi);
      if (bookmarkToDelete?.id) {
        await this.apiClient.deleteBookmark(bookmarkToDelete.id);
      }
    } catch (e) {
      console.error("Failed to remove bookmark from Nobel API, removed locally.", e);
    }
  }

  async getNotes(): Promise<Note[]> {
    const localNotes = await this.local.getNotes();
    try {
      const apiData = await this.getNobelBookData();
      const apiNotes =
        apiData?.notes?.map(
          (n) =>
            ({
              ...n,
              createdAt: n.createdAt || new Date().toISOString(),
            }) as Note,
        ) || [];
      const merged = await this.mergeData(localNotes, apiNotes);
      this.local.set(this.local.STORAGE_KEY_NOTES, merged);
      return merged;
    } catch (e) {
      console.warn("Nobel API fetch for notes failed, using local data.", e);
      return localNotes;
    }
  }

  async addNote(note: Omit<Note, "createdAt">): Promise<Note> {
    const newNote = await this.local.addNote(note);
    try {
      await this.apiClient.addNote(newNote.cfi, newNote.text, newNote.note);
    } catch (e) {
      console.error("Failed to add note to Nobel API, saved locally.", e);
    }
    return newNote;
  }

  async removeNote(cfi: string): Promise<void> {
    await this.local.removeNote(cfi);
    try {
      const notes = await this.getNotes();
      const noteToDelete = notes.find((n) => n.cfi === cfi);
      if (noteToDelete?.id) {
        await this.apiClient.deleteNote(noteToDelete.id);
      }
    } catch (e) {
      console.error("Failed to remove note from Nobel API, removed locally.", e);
    }
  }

  async updateNote(cfi: string, newNoteText: string): Promise<void> {
    await this.local.updateNote(cfi, newNoteText);
    try {
      const notes = await this.getNotes();
      const noteToUpdate = notes.find((n) => n.cfi === cfi);
      if (noteToUpdate?.id) {
        // await this.apiClient.updateNote(noteToUpdate.id, { note: newNoteText });
      }
    } catch (e) {
      console.error("Failed to update note in Nobel API, updated locally.", e);
    }
  }

  async getLocation(): Promise<string | null> {
    const localLocation = await this.local.getLocation();
    try {
      const apiData = await this.getNobelBookData();
      const apiLocation = apiData?.location?.cfi;

      // Validate that the location from the API is a valid-looking CFI string
      const isValidCfi = typeof apiLocation === "string" && apiLocation.startsWith("epubcfi");

      if (apiLocation && isValidCfi) {
        // If the API gives a good location, use it and update the local cache
        await this.local.updateLocation(apiLocation, 0);
        return apiLocation;
      } else if (!isValidCfi && apiLocation) {
        // If the API gives a bad location, log it but don't use it
        console.warn(`[DataSource] Ignoring invalid location from API: ${apiLocation}`);
      }
    } catch (e) {
      console.warn("Nobel API fetch for location failed, using local data.", e);
    }

    // Fallback to the locally stored location
    return localLocation;
  }

  async updateLocation(location: string, progress: number): Promise<void> {
    await this.local.updateLocation(location, progress);
    try {
      await this.apiClient.updateLocation(location, progress);
    } catch (e) {
      console.error("Failed to update location to Nobel API, saved locally.", e);
    }
  }

  async getTotalChars(): Promise<number | null> {
    return this.local.getTotalChars();
  }

  async saveTotalChars(totalChars: number): Promise<void> {
    return this.local.saveTotalChars(totalChars);
  }

  async getCopiedChars(): Promise<number> {
    // Copy protection info should probably come from a single source of truth, the API.
    try {
      const copyProtectionInfo = await this.apiClient.fetchCopyProtection();
      if (copyProtectionInfo?.copiedCharacters) {
        const chars = Number(copyProtectionInfo.copiedCharacters);
        await this.local.updateCopiedChars(chars);
        return chars;
      }
    } catch (e) {
      console.warn("Could not get copied chars from API, using local value", e);
    }
    return this.local.getCopiedChars();
  }

  async updateCopiedChars(chars: number): Promise<void> {
    await this.local.updateCopiedChars(chars);
    try {
      // await this.apiClient.updateCopyProtectionInfo({ copiedCharacters: chars });
    } catch (e) {
      console.error("Failed to update copied chars to Nobel API, saved locally.", e);
    }
  }

  async getReaderPreferences(): Promise<IReaderPreferenceConfig | null> {
    const localPreferences = await this.local.getReaderPreferences();
    try {
      const apiPreferences = await this.apiClient.fetchReaderPreferences();
      if (apiPreferences) {
        await this.local.updateReaderPreferences(apiPreferences);
        return apiPreferences;
      }
    } catch (e) {
      console.warn("Nobel API fetch for reader preferences failed, using local data.", e);
    }
    return localPreferences;
  }

  async updateReaderPreferences(preferences: IReaderPreferenceConfig): Promise<void> {
    await this.local.updateReaderPreferences(preferences);
    try {
      await this.apiClient.updateReaderPreferences(preferences);
    } catch (e) {
      console.error("Failed to update reader preferences to Nobel API, saved locally.", e);
    }
  }
}
