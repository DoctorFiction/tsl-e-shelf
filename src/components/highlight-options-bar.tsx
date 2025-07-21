import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Highlight } from "@/hooks/use-epub-reader";
import { Trash2, X } from "lucide-react";

const HIGHLIGHT_COLORS = [
  { name: "Yellow", color: "#FFDE63" },
  { name: "Green", color: "#AFE99C" },
  { name: "Blue", color: "#9CCBFF" },
  { name: "Red", color: "#FF9C9C" },
  { name: "Purple", color: "#D3A5FF" },
];

interface HighlightOptionsBarProps {
  clickedHighlight: Highlight | null;
  setClickedHighlight: React.Dispatch<React.SetStateAction<Highlight | null>>;
  removeHighlight: (cfi: string, type: "highlight" | "underline") => void;
  updateHighlightColor: (cfi: string, newColor: string) => void;
  isPinned: boolean;
}

export function HighlightOptionsBar({
  clickedHighlight,
  setClickedHighlight,
  removeHighlight,
  updateHighlightColor,
  isPinned,
}: HighlightOptionsBarProps) {
  return (
    <div className="flex flex-col space-y-2">
      <Typography variant="body2" className="font-bold">
        Vurgu Eylemleri
      </Typography>
      <div className="flex flex-wrap gap-2">
        {HIGHLIGHT_COLORS.map((highlightColor) => (
          <Button
            key={highlightColor.name}
            variant="ghost"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              if (clickedHighlight) {
                updateHighlightColor(clickedHighlight.cfi, highlightColor.color);
              }
            }}
          >
            <div
              className={`w-6 h-6 rounded-full border ${clickedHighlight?.color === highlightColor.color ? "border-4 border-white" : ""}`}
              style={{
                backgroundColor: highlightColor.color,
              }}
            />
          </Button>
        ))}
      </div>
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
        {isPinned && <span>Vurguyu Kaldır</span>}
      </Button>
      <Button
        variant="ghost"
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => {
          setClickedHighlight(null);
        }}
      >
        <X className="w-6 h-6" />
        {isPinned && <span>Kapat</span>}
      </Button>
    </div>
  );
}
