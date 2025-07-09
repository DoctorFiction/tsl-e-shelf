import { Bookmark, Highlight, Note } from "@/hooks/use-epub-reader";
import { Info } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

interface ReaderBookInfoProps {
  highlights: Highlight[];
  bookmarks: Bookmark[];
  notes: Note[];
  bookTitle?: string | null;
  bookAuthor?: string | null;
  bookCover?: string | null;
  totalPages?: number;
  progress?: number;
}

export const ReaderBookInfo = ({ bookCover, bookTitle, bookAuthor, totalPages, progress, bookmarks, highlights, notes }: ReaderBookInfoProps) => {
  const [bookInfoOpen, setBookInfoOpen] = useState(false);
  return (
    <>
      <Button
        className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
        aria-label="Show Book Info"
        type="button"
        onClick={() => setBookInfoOpen(true)}
      >
        <Info className="w-4 h-4 text-blue-500" />
      </Button>
      {bookInfoOpen !== undefined && setBookInfoOpen && (
        <Dialog open={bookInfoOpen} onOpenChange={setBookInfoOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {bookCover && (
                <div className="flex justify-center">
                  <Image src={bookCover} alt={bookTitle || "Book cover"} width={128} height={192} className="max-w-32 max-h-48 object-contain rounded-lg shadow-md" />
                </div>
              )}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{bookTitle || "Unknown Title"}</h3>
                {bookAuthor && <p className="text-sm text-muted-foreground">Author: {bookAuthor}</p>}
                {totalPages && totalPages > 0 && <p className="text-sm text-muted-foreground">Total Pages: {totalPages}</p>}
                {progress !== undefined && <p className="text-sm text-muted-foreground">Reading Progress: {Math.round(progress)}%</p>}
                <p className="text-sm text-muted-foreground">Total Bookmarks: {bookmarks.length}</p>
                <p className="text-sm text-muted-foreground">Total Highlights: {highlights.length}</p>
                <p className="text-sm text-muted-foreground">Total Notes: {notes.length}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
