"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BugPlay } from "lucide-react";
import { Switch } from "./ui/switch";

export function DevTools() {
  const pathname = usePathname();

  // Read the book ID from the path
  const bookId = pathname?.split("/").pop() || "";

  const STORAGE_DEVTOOL_LOG_ALL = "devtool-log-all";
  const STORAGE_DEVTOOL_DELETE_ALL = "devtool-delete-log";
  const STORAGE_DEVTOOL_AUTO_RELOAD = "devtool-auto-reload";

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

  const [mounted, setMounted] = useState(false);
  const [removeAllMode, setRemoveAllMode] = useState(false);
  const [logAllMode, setLogAllMode] = useState(false);
  const [autoReload, setAutoReload] = useState(false);

  useEffect(() => {
    setMounted(true);

    const localSettings = {
      removeAll:
        localStorage.getItem(STORAGE_DEVTOOL_DELETE_ALL) === "true"
          ? true
          : false,
      logAll:
        localStorage.getItem(STORAGE_DEVTOOL_LOG_ALL) === "true" ? true : false,
      autoReload:
        localStorage.getItem(STORAGE_DEVTOOL_AUTO_RELOAD) === "true"
          ? true
          : false,
    };
    setRemoveAllMode(localSettings.removeAll);
    setLogAllMode(localSettings.logAll);
    setAutoReload(localSettings.autoReload);
  }, []);

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
    if (autoReload) reload();
  };

  const clearAll = () => {
    if (removeAllMode) {
      Object.entries(localStorage).forEach(([key]) => {
        const isEpubKey = key.includes("epub");
        const isReaderKey = key.includes("reader");
        if (isEpubKey || isReaderKey) {
          clearKey(key);
          console.log(
            `✅ Cleared all reader-related localStorage for all books.`,
          );
        }
      });
    } else {
      Object.values(STORAGE_KEYS).forEach(clearKey);

      console.log("✅ Cleared all reader-related localStorage for this book.");
    }
    if (autoReload) reload();
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

  const reload = () => {
    window.location.reload();
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-full shadow-md">
            <BugPlay className="mr-2 h-4 w-4" />
            Dev Araçları
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 space-y-4 p-4" align="end">
          <h4 className="text-lg font-bold text-muted-foreground">
            Geliştirici Araçları
          </h4>

          <div className="space-y-2">
            <div className="flex gap-2">
              <p className="text-sm font-medium">📄 Kayıtlar</p>
              <p className="text-sm font-normal">Bu</p>
              <Switch
                checked={logAllMode}
                onCheckedChange={() => {
                  setLogAllMode(!logAllMode);
                  localStorage.setItem(
                    STORAGE_DEVTOOL_LOG_ALL,
                    logAllMode ? "false" : "true",
                  );
                }}
              />
              <p className="text-sm font-normal">Tümü</p>
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                console.log("📚 TOC:", getParsed(STORAGE_KEYS.toc));
              }}
            >
              📚 TOC Kaydet
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
              📍Konumu Kaydet
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
              🔖 Yer İşaretlerini Kaydet
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
              🖍️ Vurguları Kaydet
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                console.log("📝 Notes:", logEntry(STORAGE_KEYS.notes, "notes"));
              }}
            >
              📝 Notları Kaydet
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
              Tüm Okuyucu Durumunu Kaydet
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
              localStorage&apos;ı Dök
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <p className="text-sm font-medium">🗑️ Kaldır</p>
              <p className="text-sm font-normal">Bu</p>
              <Switch
                checked={removeAllMode}
                onCheckedChange={() => {
                  setRemoveAllMode(!removeAllMode);
                  localStorage.setItem(
                    STORAGE_DEVTOOL_DELETE_ALL,
                    removeAllMode ? "false" : "true",
                  );
                }}
              />
              <p className="text-sm font-normal">Tümü</p>
            </div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => clear(STORAGE_KEYS.location, "location")}
            >
              Konumu Temizle
            </Button>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => clear(STORAGE_KEYS.bookmarks, "bookmarks")}
            >
              Yer İşaretlerini Temizle
            </Button>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => clear(STORAGE_KEYS.highlights, "highlights")}
            >
              Vurguları Temizle
            </Button>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => clear(STORAGE_KEYS.notes, "notes")}
            >
              Notları Temizle
            </Button>

            <Button variant="destructive" className="w-full" onClick={clearAll}>
              Tüm Okuyucu Verilerini Temizle
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">⚙️ Eylemler</p>
            <div className="flex gap-2">
              <Switch
                checked={autoReload}
                onCheckedChange={() => {
                  setAutoReload(!autoReload);
                  localStorage.setItem(
                    STORAGE_DEVTOOL_AUTO_RELOAD,
                    autoReload ? "false" : "true",
                  );
                }}
              />
              <p className="text-sm font-normal">Eylem sonrası yeniden yükle</p>
            </div>
            <Button className="w-full" onClick={reload}>
              Okuyucuyu Yeniden Yükle
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
