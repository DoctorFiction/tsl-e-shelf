// components/FontSizeToggler.tsx
"use client";

import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const FONT_SIZE_MIN = 12;
const FONT_SIZE_MAX = 36;
const FONT_SIZE_STEP = 2;

const INDICATOR_COUNT = (FONT_SIZE_MAX - FONT_SIZE_MIN) / FONT_SIZE_STEP + 1;

export function FontSizeToggler({
  onChange,
}: {
  onChange?: (value: number) => void;
}) {
  const [fontSize, setFontSize] = useState(20);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!touched) return;
    onChange?.(fontSize);
  }, [fontSize, touched, onChange]);

  const increase = () => {
    setTouched(true);
    setFontSize((prev) => Math.min(prev + FONT_SIZE_STEP, FONT_SIZE_MAX));
  };

  const decrease = () => {
    setTouched(true);
    setFontSize((prev) => Math.max(prev - FONT_SIZE_STEP, FONT_SIZE_MIN));
  };

  const getActiveIndex = () =>
    Math.floor((fontSize - FONT_SIZE_MIN) / FONT_SIZE_STEP);

  return (
    <div>
      <div className="flex w-full items-center border rounded-md overflow-hidden">
        <ToggleGroup type="single" className="flex w-full">
          <ToggleGroupItem
            value="decrease"
            className="flex-1 rounded-none"
            onClick={decrease}
          >
            A−
          </ToggleGroupItem>
          <div className="w-px bg-border h-6" />
          <ToggleGroupItem
            value="increase"
            className="flex-1 rounded-none"
            onClick={increase}
          >
            A+
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {touched && (
        <div className="flex items-center justify-center gap-1 mt-1">
          {Array.from({ length: INDICATOR_COUNT }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx <= getActiveIndex() ? "bg-foreground" : "bg-muted"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
