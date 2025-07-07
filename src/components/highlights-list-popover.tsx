import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Typography } from "@/components/ui/typography";
import { Highlight } from "@/hooks/use-epub-reader";
import formatRelativeDate from "@/lib/format-relative-date";
import { Highlighter, Trash, Trash2 } from "lucide-react";
import { useState } from "react";

interface HighlightsListPopoverProps {
  highlights: Highlight[];
  goToCfi: (cfi: string) => void;
  removeHighlight: (cfi: string, type: "highlight" | "underline") => void;
  removeAllHighlights: () => void;
}

export function HighlightsListPopover({
  highlights,
  goToCfi,
  removeHighlight,
  removeAllHighlights,
}: HighlightsListPopoverProps) {
  const [highlightDeleteDialogOpen, setHighlightDeleteDialogOpen] = useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
          aria-label="Show highlights"
          type="button"
        >
          <Highlighter className="w-4 h-4 text-yellow-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="start" side="bottom">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Typography variant="body1" className="font-bold">
              Highlights
            </Typography>
          </div>
          {highlights && highlights.length > 0 && (
            <AlertDialog open={highlightDeleteDialogOpen} onOpenChange={setHighlightDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" aria-label="Delete all highlights">
                  <Trash className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tüm Highlightları Sil</AlertDialogTitle>
                  <AlertDialogDescription>Bu işlem tüm highlightları kalıcı olarak silecek. Bu işlem geri alınamaz.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      removeAllHighlights();
                      setHighlightDeleteDialogOpen(false);
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
          {highlights && highlights.length > 0 ? (
            highlights.map((hl, i) => (
              <Card key={i} className="flex flex-row items-center px-4 py-2 gap-2 cursor-pointer hover:bg-muted transition group">
                <div
                  className="flex-1"
                  onClick={() => {
                    goToCfi(hl.cfi);
                  }}
                >
                  <Typography variant="body2" className={`line-clamp-2 ${hl.type === "underline" ? "underline" : ""}`}>
                    {hl.type !== "underline" && hl.color && <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: hl.color }} />}
                    {hl.text}
                  </Typography>
                  <Typography variant="caption" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatRelativeDate(hl.createdAt)}
                  </Typography>
                </div>
                <button
                  className="text-gray-400 hover:text-red-500 transition ml-2"
                  aria-label="Delete highlight"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeHighlight?.(hl.cfi, hl.type || "highlight");
                  }}
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            ))
          ) : (
            <Typography variant="body2" className="text-gray-400">
              No highlights found.
            </Typography>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
