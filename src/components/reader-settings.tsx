"use client";

import {
  readerThemeNameAtom,
  readerPreferencesAtom,
  THEME_PRESETS,
  IReaderPreferenceConfig,
} from "@/atoms/reader-preferences";
import { useAtom } from "jotai";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CaseSensitive } from "lucide-react";
import { FontSizeToggler } from "./font-size-toggler";
import { useCallback } from "react";
import { ModeToggle } from "./mode-toggle";
import clsx from "clsx";

export const ReaderSettings = () => {
  const [themeName, setThemeName] = useAtom(readerThemeNameAtom);
  const [, setReaderPrefs] = useAtom(readerPreferencesAtom);

  const handleFontSizeChange = useCallback(
    (val: number) => {
      setReaderPrefs((prev) => ({
        ...prev,
        fontSize: val,
      }));
    },
    [setReaderPrefs],
  );

  const handleThemeSelect = (newThemeName: keyof typeof THEME_PRESETS) => {
    const newTheme: IReaderPreferenceConfig = THEME_PRESETS[newThemeName];
    setThemeName(newThemeName);
    setReaderPrefs((prev) => ({
      ...newTheme,
      fontSize: prev.fontSize, // preserve user's current font size
    }));
  };

  return (
    <div className="fixed bottom-18 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-full shadow-md">
            <CaseSensitive className="mr-2 h-4 w-4" />
            Theme Settings
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px]">
          <div className="flex flex-col ">
            {/* Font Size & Mode */}
            <div className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-8">
                <FontSizeToggler onChange={handleFontSizeChange} />
              </div>
              <div className="col-span-4">
                <ModeToggle />
              </div>
            </div>

            {/* Theme Presets */}
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(THEME_PRESETS).map(([name, config]) => (
                <div
                  key={name}
                  className={clsx(
                    "text-center border-2 rounded-md cursor-pointer p-1",
                    themeName === name
                      ? "border-primary"
                      : "border-transparent hover:border-muted",
                  )}
                  onClick={() =>
                    handleThemeSelect(name as keyof typeof THEME_PRESETS)
                  }
                >
                  <p className="text-sm">{name}</p>
                  <p
                    className="text-lg"
                    style={{ fontFamily: config.fontFamily }}
                  >
                    Aa
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center text-muted-foreground text-sm">
              Customize (coming soon)
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
