import { Button } from "@/components/ui/button";
import { Highlight } from "@/hooks/use-epub-reader";
import { Underline, Trash2, X, NotebookPen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

const HIGHLIGHT_COLORS = [
  { name: "Yellow", color: "#FFDE63" },
  { name: "Green", color: "#AFE99C" },
  { name: "Blue", color: "#9CCBFF" },
  { name: "Red", color: "#FF9C9C" },
  { name: "Purple", color: "#D3A5FF" },
];

interface HighlightOptionsBarProps {
  selection: { cfi: string; text: string; rect: DOMRect } | null;
  addHighlight: (args: { cfi: string; text: string; type?: "highlight" | "underline"; color?: string }) => void;
  clickedHighlight: Highlight | null;
  removeHighlight: (cfi: string, type: "highlight" | "underline") => void;
  setClickedHighlight: React.Dispatch<React.SetStateAction<Highlight | null>>;
  setSelection: React.Dispatch<React.SetStateAction<{ cfi: string; text: string; rect: DOMRect } | null>>;
  addNote: (args: { cfi: string; text: string; note: string }) => void;
}

export function HighlightOptionsBar({ selection, addHighlight, clickedHighlight, removeHighlight, setClickedHighlight, setSelection, addNote }: HighlightOptionsBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        if (!isNoteDialogOpen) {
          setSelection(null);
          setClickedHighlight(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelection, setClickedHighlight, isNoteDialogOpen]);

  const handleSaveNote = () => {
    if (selection && noteContent.trim() !== "") {
      addNote({
        cfi: selection.cfi,
        text: selection.text,
        note: noteContent,
      });
      setNoteContent("");
      setIsNoteDialogOpen(false);
      setSelection(null);
    }
  };

  const handleCloseNoteDialog = () => {
    setNoteContent("");
    setIsNoteDialogOpen(false);
    setSelection(null);
    setClickedHighlight(null);
  };

  if (!selection && !clickedHighlight) return null;

  return (
    <div ref={barRef} className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md p-4 flex items-center justify-center space-x-4">
      {selection && (
        <>
          {HIGHLIGHT_COLORS.map((highlight) => (
            <Button
              key={highlight.name}
              variant="ghost"
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                if (selection) {
                  addHighlight({
                    cfi: selection.cfi,
                    text: selection.text,
                    color: highlight.color,
                  });
                }
              }}
            >
              <div
                className="w-6 h-6 rounded-full border"
                style={{
                  backgroundColor: highlight.color,
                }}
              />
              <span>{highlight.name}</span>
            </Button>
          ))}
          <Button
            variant="ghost"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              if (selection) {
                addHighlight({
                  cfi: selection.cfi,
                  text: selection.text,
                  type: "underline",
                });
              }
            }}
          >
            <Underline className="w-6 h-6" />
            <span>Underline</span>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setIsNoteDialogOpen(true);
            }}
          >
            <NotebookPen className="w-6 h-6" />
            <span>Note</span>
          </Button>
        </>
      )}

      {clickedHighlight && (
        <Button
          variant="ghost"
          className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-700"
          onClick={() => {
            if (clickedHighlight) {
              removeHighlight(clickedHighlight.cfi, clickedHighlight.type || "highlight");
              setClickedHighlight(null);
            }
          }}
        >
          <Trash2 className="w-6 h-6" />
          <span>Remove Highlight</span>
        </Button>
      )}
      <Button
        variant="ghost"
        className="absolute right-4 top-1/2 -translate-y-1/2"
        onClick={() => {
          setSelection(null);
          setClickedHighlight(null);
        }}
      >
        <X className="w-6 h-6" />
      </Button>

      <Dialog open={isNoteDialogOpen} onOpenChange={handleCloseNoteDialog}>
        <DialogContent
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="note-content" className="sr-only">
              Note
            </Label>
            <Textarea id="note-content" placeholder="Type your note here." value={noteContent} onChange={(e) => setNoteContent(e.target.value)} className="min-h-[100px]" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseNoteDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
