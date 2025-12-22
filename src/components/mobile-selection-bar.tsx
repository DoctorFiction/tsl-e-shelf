"use client";

import { Copy, Highlighter, NotebookPen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlight } from "@/hooks/use-epub-reader";
import { useEffect, useState } from "react";

const HIGHLIGHT_COLORS = [
  { name: "Sarı", color: "#FFDE63" },
  { name: "Yeşil", color: "#AFE99C" },
  { name: "Mavi", color: "#9CCBFF" },
  { name: "Kırmızı", color: "#FF9C9C" },
  { name: "Mor", color: "#D3A5FF" },
];

interface MobileSelectionBarProps {
  selection: { cfi: string; text: string; rect: DOMRect } | null;
  addHighlight: (args: Highlight) => void;
  setIsNoteDialogOpen: (isOpen: boolean) => void;
  setIsCopyConfirmationDialogOpen: (isOpen: boolean) => void;
  onClose: () => void;
}

export function MobileSelectionBar({
  selection,
  addHighlight,
  setIsNoteDialogOpen,
  setIsCopyConfirmationDialogOpen,
  onClose,
}: MobileSelectionBarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Reset color picker when selection changes
  useEffect(() => {
    setShowColorPicker(false);
  }, [selection?.cfi]);

  if (!selection) return null;

  const handleHighlight = (color: string) => {
    addHighlight({
      cfi: selection.cfi,
      text: selection.text,
      color: color,
      createdAt: new Date().toISOString(),
    });
    setShowColorPicker(false);
    onClose();
  };

  const handleUnderline = () => {
    addHighlight({
      cfi: selection.cfi,
      text: selection.text,
      type: "underline",
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  const handleNote = () => {
    setIsNoteDialogOpen(true);
    // Don't close - keep selection for note dialog
  };

  const handleCopy = () => {
    setIsCopyConfirmationDialogOpen(true);
    // Don't close - keep selection for copy confirmation
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[60] md:hidden" 
        onClick={onClose}
      />
      
      {/* Floating Bar */}
      <div className="fixed bottom-16 left-2 right-2 z-[70] md:hidden animate-in slide-in-from-bottom-4 duration-200">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Selected Text Preview */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs text-muted-foreground line-clamp-2">
              &ldquo;{selection.text.slice(0, 100)}{selection.text.length > 100 ? "..." : ""}&rdquo;
            </p>
          </div>

          {/* Color Picker */}
          {showColorPicker && (
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center justify-center gap-3">
                {HIGHLIGHT_COLORS.map((h) => (
                  <button
                    key={h.name}
                    onClick={() => handleHighlight(h.color)}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform active:scale-95"
                    style={{ backgroundColor: h.color }}
                    aria-label={h.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-around px-2 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Highlighter className="w-5 h-5" />
              <span className="text-[10px]">Vurgula</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleUnderline}
            >
              <span className="w-5 h-5 border-b-2 border-current flex items-end justify-center text-xs font-medium">U</span>
              <span className="text-[10px]">Altı Çiz</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleNote}
            >
              <NotebookPen className="w-5 h-5" />
              <span className="text-[10px]">Not</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleCopy}
            >
              <Copy className="w-5 h-5" />
              <span className="text-[10px]">Kopyala</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
              <span className="text-[10px]">Kapat</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
