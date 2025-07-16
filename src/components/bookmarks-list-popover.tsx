import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Typography } from "@/components/ui/typography";
import { Bookmark } from "@/hooks/use-epub-reader";
import formatRelativeDate from "@/lib/format-relative-date";
import { BookMarked, Trash, Trash2 } from "lucide-react";
import { useState } from "react";

interface BookmarksListPopoverProps {
  bookmarks: Bookmark[];
  goToCfi: (cfi: string) => void;
  removeBookmark: (cfiToRemove: string) => void;
  removeAllBookmarks: () => void;
}

export function BookmarksListPopover({
  bookmarks,
  goToCfi,
  removeBookmark,
  removeAllBookmarks,
}: BookmarksListPopoverProps) {
  const [bookmarkDeleteDialogOpen, setBookmarkDeleteDialogOpen] = useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
          aria-label="Yer İşaretlerini Göster"
          type="button"
        >
          <BookMarked className="w-4 h-4 text-blue-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="start" side="bottom">
        <div className="flex items-center justify-between mb-2">
          <Typography variant="body1" className="font-bold">
            Yer İşaretleri
          </Typography>
          {bookmarks && bookmarks.length > 0 && (
            <AlertDialog open={bookmarkDeleteDialogOpen} onOpenChange={setBookmarkDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" aria-label="Tüm yer işaretlerini sil">
                  <Trash className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tüm Yer İşaretlerini Sil</AlertDialogTitle>
                  <AlertDialogDescription>Bu işlem tüm yer işaretlerini kalıcı olarak silecek. Bu işlem geri alınamaz.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      removeAllBookmarks();
                      setBookmarkDeleteDialogOpen(false);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Evet, Tümünü Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <ul className="max-h-64 overflow-y-auto">
          {bookmarks && bookmarks.length > 0 ? (
            bookmarks.map((bm, i) => {
              return (
                <Card
                  key={i}
                  className="relative px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group overflow-hidden border border-gray-200 dark:border-gray-700 mb-2"
                >
                  <div
                    className="w-full"
                    onClick={() => {
                      goToCfi(bm.cfi);
                    }}
                  >
                    {bm.page && (
                      <div className="absolute top-3 right-3">
                        <span className=" text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md font-medium">{bm.page}</span>
                      </div>
                    )}

                    <div className="pr-12 mb-8">
                      <Typography variant="body2" className="line-clamp-3 text-gray-900 dark:text-gray-100 leading-relaxed">
                        {bm.chapter}
                      </Typography>
                    </div>

                    <div className="absolute bottom-3 left-4">
                      <Typography variant="caption" className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeDate(bm.createdAt)}
                      </Typography>
                    </div>
                  </div>

                  <button
                    className="absolute bottom-2 right-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 opacity-0 group-hover:opacity-100 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md hover:shadow-lg"
                    aria-label="Yer işaretini sil"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBookmark?.(bm.cfi);
                    }}
                    type="button"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </Card>
              );
            })
          ) : (
            <Typography variant="body2" className="text-gray-400">
              Yer işareti bulunamadı.
            </Typography>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
