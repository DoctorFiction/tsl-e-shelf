import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  addBookmark: () => void;
  removeBookmark: (cfi: string) => void;
  location: string | null;
}

export function BookmarkButton({
  isBookmarked,
  addBookmark,
  removeBookmark,
  location,
}: BookmarkButtonProps) {
  return isBookmarked ? (
    <Button
      className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
      onClick={() => {
        if (location) removeBookmark(location);
      }}
      aria-label="Yer işaretini kaldır"
      type="button"
    >
      <Bookmark fill="currentColor" className="w-4 h-4 text-red-500" />
    </Button>
  ) : (
    <Button
      className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
      onClick={() => {
        addBookmark();
      }}
      aria-label="Yer işareti ekle"
      type="button"
    >
      <Bookmark className="w-4 h-4 text-black dark:text-white" />
    </Button>
  );
}
