"use client";

import { ChevronLeft, ChevronRight, Menu, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

interface MobileBottomBarProps {
  goPrev: () => void;
  goNext: () => void;
  onMenuClick: () => void;
  currentPage: number;
  totalPages?: number;
  currentChapterTitle: string | null;
  isBookmarked: boolean;
  addBookmark: () => void;
  removeBookmark: (cfi: string) => void;
  location: string | null;
}

export function MobileBottomBar({
  goPrev,
  goNext,
  onMenuClick,
  currentPage,
  totalPages,
  currentChapterTitle,
  isBookmarked,
  addBookmark,
  removeBookmark,
  location,
}: MobileBottomBarProps) {
  const handleBookmarkToggle = () => {
    if (isBookmarked && location) {
      removeBookmark(location);
    } else {
      addBookmark();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 z-50 md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-between px-2 py-2">
        {/* Left: Prev Button */}
        <Button
          onClick={goPrev}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Önceki sayfa"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="sr-only">Önceki</span>
        </Button>

        {/* Center: Page Info */}
        <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-2">
          <Typography variant="caption" className="text-muted-foreground truncate max-w-full">
            {currentChapterTitle || "—"}
          </Typography>
          <Typography variant="body2" className="font-medium">
            {currentPage} {totalPages ? `/ ${totalPages}` : ""}
          </Typography>
        </div>

        {/* Right: Bookmark, Menu, Next */}
        <div className="flex items-center gap-1">
          <Button
            onClick={handleBookmarkToggle}
            variant="ghost"
            size="sm"
            className={`p-2 rounded-full ${isBookmarked ? "text-yellow-500" : ""}`}
            aria-label={isBookmarked ? "Yer işaretini kaldır" : "Yer işareti ekle"}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </Button>
          <Button
            onClick={onMenuClick}
            variant="ghost"
            size="sm"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Menü"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <Button
            onClick={goNext}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Sonraki sayfa"
          >
            <span className="sr-only">Sonraki</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
