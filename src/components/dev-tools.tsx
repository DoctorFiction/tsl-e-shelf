"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
// import { useEpubReader } from "@/hooks/use-epub-reader"; // adjust if needed
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BugPlay } from "lucide-react";
import { Switch } from "./ui/switch";

export function DevTools() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [removeAllMode, setRemoveAllMode] = useState(false);
  const [logAllMode, setLogAllMode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Read the book ID from the path
  const bookId = pathname?.split("/").pop() || "";

  // epub-location-/books/pg50290-images-3.epub
  const STORAGE_PREFIX = `epub`;
  const STORAGE_BOOK = `/books/${bookId}`;
  const STORAGE_KEYS = {
    toc: "epub-toc",
    tocHistory: "epub-toc-history",
    location: `${STORAGE_PREFIX}-location-${STORAGE_BOOK}`,
    highlights: `${STORAGE_PREFIX}-highlights-${STORAGE_BOOK}`,
    bookmarks: `${STORAGE_PREFIX}-bookmarks-${STORAGE_BOOK}`,
    notes: `${STORAGE_PREFIX}-notes-${STORAGE_BOOK}`,
  };

  // Try to get epub state from localStorage
  const getParsed = (key: string) => {
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return value;
    }
  };

  const clearKey = (key: string) => localStorage.removeItem(key);

  const clear = (key: string, type: string = "") => {
    if (removeAllMode) {
      Object.entries(localStorage).forEach(([key]) => {
        const isEpubKey = key.includes("epub");
        const ePubKey = `${STORAGE_PREFIX}-${type}`;
        const meetsType = key.startsWith(ePubKey);

        if (isEpubKey && meetsType) {
          clearKey(key);
        }
      });
      console.log(`${type} cleared (ALL)`);
    } else {
      clearKey(key);
      console.log(`${type} cleared`);
    }
  };

  const logEntry = (key: string, type: string = "") => {
    if (logAllMode) {
      const allLogs: { key: string; value: string | null }[] = [];
      Object.entries(localStorage).forEach(([key]) => {
        const isEpubKey = key.includes("epub");
        const ePubKey = `${STORAGE_PREFIX}-${type}`;
        const meetsType = key.startsWith(ePubKey);

        if (isEpubKey && meetsType) {
          allLogs.push({ key, value: localStorage.getItem(key) });
        }
      });
      return allLogs;
    } else {
      return getParsed(key);
    }
  };

  const clearAll = () => {
    Object.values(STORAGE_KEYS).forEach(clearKey);
    console.log("✅ Cleared all reader-related localStorage for this book.");
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-full shadow-md">
            <BugPlay className="mr-2 h-4 w-4" />
            Dev Tools
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 space-y-4 p-4" align="end">
          <h4 className="text-lg font-bold text-muted-foreground">
            Developer Tools
          </h4>

          <div className="space-y-2">
            <div className="flex gap-2">
              <p className="text-sm font-medium">📄 Logs</p>
              <p className="text-sm font-normal">This</p>
              <Switch checked={logAllMode} onCheckedChange={setLogAllMode} />
              <p className="text-sm font-normal">All</p>
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                console.log("📚 TOC:", getParsed(STORAGE_KEYS.toc));
              }}
            >
              📚 Log TOC
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                console.log(
                  "📍Location:",
                  logEntry(STORAGE_KEYS.location, "location"),
                );
              }}
            >
              📍Log Location
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                console.log(
                  "🔖 Bookmarks:",
                  logEntry(STORAGE_KEYS.bookmarks, "bookmarks"),
                );
              }}
            >
              🔖 Log Bookmarks
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                console.log(
                  "🖍️ Highlights:",
                  logEntry(STORAGE_KEYS.highlights, "highlights"),
                );
              }}
            >
              🖍️ Log Highlights
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                console.log("📝 Notes:", logEntry(STORAGE_KEYS.notes, "notes"));
              }}
            >
              📝 Log Notes
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                console.log("📚 TOC:", logEntry(STORAGE_KEYS.toc, "toc"));
                console.log(
                  "📍Location:",
                  logEntry(STORAGE_KEYS.location, "location"),
                );
                console.log(
                  "🔖 Bookmarks:",
                  logEntry(STORAGE_KEYS.bookmarks, "bookmarks"),
                );
                console.log(
                  "🖍️ Highlights:",
                  logEntry(STORAGE_KEYS.highlights, "highlights"),
                );
                console.log("📝 Notes:", logEntry(STORAGE_KEYS.notes, "notes"));
              }}
            >
              Log All Reader State
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                Object.entries(localStorage).forEach(([key, value]) => {
                  console.log(`🗝️ ${key}:`, value);
                });
              }}
            >
              Dump localStorage
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <p className="text-sm font-medium">🗑️ Remove</p>
              <p className="text-sm font-normal">This</p>
              <Switch
                checked={removeAllMode}
                onCheckedChange={setRemoveAllMode}
              />
              <p className="text-sm font-normal">All</p>
            </div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => clear(STORAGE_KEYS.location, "location")}
            >
              Clear Location
            </Button>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => clear(STORAGE_KEYS.bookmarks, "bookmarks")}
            >
              Clear Bookmarks
            </Button>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => clear(STORAGE_KEYS.highlights, "highlights")}
            >
              Clear Highlights
            </Button>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => clear(STORAGE_KEYS.notes, "notes")}
            >
              Clear Notes
            </Button>

            <Button variant="destructive" className="w-full" onClick={clearAll}>
              Clear All Reader Data
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">⚙️ Actions</p>
            <Button
              className="w-full"
              onClick={() => {
                window.location.reload();
              }}
            >
              Reload Reader
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
