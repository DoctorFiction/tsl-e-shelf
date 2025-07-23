import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Highlight } from "@/hooks/use-epub-reader";
import { Copy, NotebookPen, Underline } from "lucide-react";

const HIGHLIGHT_COLORS = [
  { name: "Yellow", color: "#FFDE63" },
  { name: "Green", color: "#AFE99C" },
  { name: "Blue", color: "#9CCBFF" },
  { name: "Red", color: "#FF9C9C" },
  { name: "Purple", color: "#D3A5FF" },
];

interface SelectionActionsBarProps {
  variant: "desktop" | "mobile";
  isPinned?: boolean;
  selection: { cfi: string; text: string; rect: DOMRect } | null;
  addHighlight: (args: Highlight) => void;
  setIsNoteDialogOpen: (isOpen: boolean) => void;
  setIsCopyConfirmationDialogOpen: (isOpen: boolean) => void;
  setIsMobileDrawerOpen?: (isOpen: boolean) => void;
}

export function SelectionActionsBar({ variant, isPinned, selection, addHighlight, setIsNoteDialogOpen, setIsCopyConfirmationDialogOpen, setIsMobileDrawerOpen }: SelectionActionsBarProps) {
  if (variant === "mobile") {
    return (
      <div className="mb-6">
        <Typography variant="body2" className="font-bold mb-3">
          Highlight & Note
        </Typography>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {HIGHLIGHT_COLORS.map((highlight) => (
            <Button
              key={highlight.name}
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-3"
              onClick={() => {
                if (selection) {
                  addHighlight({
                    cfi: selection.cfi,
                    text: selection.text,
                    color: highlight.color,
                    createdAt: new Date().toISOString(),
                  });
                  setIsMobileDrawerOpen?.(false);
                }
              }}
            >
              <div
                className="w-8 h-8 rounded-full border"
                style={{
                  backgroundColor: highlight.color,
                }}
              />
              <span className="text-xs">{highlight.name}</span>
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={() => {
              if (selection) {
                addHighlight({
                  cfi: selection.cfi,
                  text: selection.text,
                  type: "underline",
                  createdAt: new Date().toISOString(),
                });
                setIsMobileDrawerOpen?.(false);
              }
            }}
          >
            <Underline className="w-4 h-4" />
            <span>Altını Çiz</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={() => {
              setIsNoteDialogOpen(true);
              setIsMobileDrawerOpen?.(false);
            }}
          >
            <NotebookPen className="w-4 h-4" />
            <span>Not</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={() => {
              setIsCopyConfirmationDialogOpen(true);
              setIsMobileDrawerOpen?.(false);
            }}
          >
            <Copy className="w-4 h-4" />
            <span>Kopyala</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col space-y-2 ${isPinned ? "items-start" : "items-center"}`}>
      <Typography variant="body2" className="font-bold">
        Vurgu & Not
      </Typography>
      <div className="flex flex-wrap gap-2">
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
                  createdAt: new Date().toISOString(),
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
            {isPinned && <span>{highlight.name}</span>}
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
                createdAt: new Date().toISOString(),
              });
            }
          }}
        >
          <Underline className="w-6 h-6" />
          {isPinned && <span>Altını Çiz</span>}
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setIsNoteDialogOpen(true);
          }}
        >
          <NotebookPen className="w-6 h-6" />
          {isPinned && <span>Not</span>}
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setIsCopyConfirmationDialogOpen(true);
          }}
        >
          <Copy className="w-6 h-6" />
          {isPinned && <span>Kopyala</span>}
        </Button>
      </div>
    </div>
  );
}
