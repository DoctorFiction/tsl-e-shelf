import { Bookmark, Highlight, Note } from "@/hooks/use-epub-reader";
import { copiedCharsAtom, totalBookCharsAtom, copyAllowancePercentageAtom } from "@/atoms/copy-protection";
import { useAtom } from "jotai";
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
  const [totalBookChars] = useAtom(totalBookCharsAtom);
  const [copiedChars] = useAtom(copiedCharsAtom);
  const [copyAllowance] = useAtom(copyAllowancePercentageAtom);

  const currentCopiedPercentage = totalBookChars > 0 ? (copiedChars / totalBookChars) * 100 : 0;
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
                {bookAuthor && (
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Author</p>
                    <p className="text-sm">{bookAuthor}</p>
                  </div>
                )}
                {totalPages && totalPages > 0 && (
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Total Pages</p>
                    <p className="text-sm">{totalPages}</p>
                  </div>
                )}
                {progress !== undefined && (
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Reading Progress</p>
                    <p className="text-sm">{Math.round(progress)}%</p>
                  </div>
                )}
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Total Bookmarks</p>
                  <p className="text-sm">{bookmarks.length}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Total Highlights</p>
                  <p className="text-sm">{highlights.length}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Total Notes</p>
                  <p className="text-sm">{notes.length}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Copied</p>
                  <p className="text-sm">{currentCopiedPercentage.toFixed(2)}% / {copyAllowance.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
