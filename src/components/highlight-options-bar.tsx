import { Button } from "@/components/ui/button";
import { Highlight } from "@/hooks/use-epub-reader";
import { Underline, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";

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
  setClickedHighlight: (highlight: null) => void;
  setSelection: React.Dispatch<React.SetStateAction<{ cfi: string; text: string; rect: DOMRect } | null>>;
}

export function HighlightOptionsBar({ selection, addHighlight, clickedHighlight, removeHighlight, setClickedHighlight, setSelection }: HighlightOptionsBarProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setSelection(null);
        setClickedHighlight(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelection, setClickedHighlight]);

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
    </div>
  );
}
