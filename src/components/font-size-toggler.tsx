"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { readerPreferencesAtom } from "@/atoms/reader-preferences";

const FONT_SIZE_MIN = 12;
const FONT_SIZE_MAX = 38;
const FONT_SIZE_STEP = 2;
const INDICATOR_COUNT = (FONT_SIZE_MAX - FONT_SIZE_MIN) / FONT_SIZE_STEP + 1;

export function FontSizeToggler({
  onChange,
}: {
  onChange?: (value: number) => void;
}) {
  const [readerPrefs, setReaderPrefs] = useAtom(readerPreferencesAtom);
  const [fontSize, setFontSize] = useState(readerPrefs.fontSize ?? 20);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setFontSize(readerPrefs.fontSize ?? 20);
  }, [readerPrefs.fontSize]);

  useEffect(() => {
    if (!touched) return;

    onChange?.(fontSize);
    setReaderPrefs((prev) => ({
      ...prev,
      fontSize,
    }));
  }, [fontSize, touched, onChange, setReaderPrefs]);

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
    <div className="flex flex-col gap-1">
      {/* Toggle Buttons */}
      <div className="flex w-full items-center border rounded-md overflow-hidden">
        <ToggleGroup type="single" className="flex w-full">
          <ToggleGroupItem
            value="decrease"
            className="flex-1 rounded-none"
            onClick={decrease}
          >
            <span className="text-sm font-serif">A</span>
          </ToggleGroupItem>
          <div className="w-px bg-border h-6" />
          <ToggleGroupItem
            value="increase"
            className="flex-1 rounded-none"
            onClick={increase}
          >
            <span className="text-xl font-serif">A</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Indicator Row (animated) */}
      <div className="h-4 mt-1">
        <div
          className={`flex items-center justify-center gap-1 transition-all duration-300 ease-in-out transform ${
            touched
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          {Array.from({ length: INDICATOR_COUNT }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx <= getActiveIndex() ? "bg-foreground" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
