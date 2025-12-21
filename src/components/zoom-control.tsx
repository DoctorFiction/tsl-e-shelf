"use client";

import { readerPreferencesAtom } from "@/atoms/reader-preferences";
import { useAtom } from "jotai";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";

export function ZoomControl() {
  const [preferences, setPreferences] = useAtom(readerPreferencesAtom);
  const { zoom = 1 } = preferences;

  const handleZoomIn = () => {
    setPreferences({ ...preferences, zoom: Math.min(zoom + 0.1, 2) });
  };

  const handleZoomOut = () => {
    setPreferences({ ...preferences, zoom: Math.max(zoom - 0.1, 0.5) });
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleZoomOut}
        disabled={zoom <= 0.5}
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium tabular-nums">
        {Math.round(zoom * 100)}%
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleZoomIn}
        disabled={zoom >= 2}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}