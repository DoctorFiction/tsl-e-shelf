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
import clsx from "clsx";
import { useTheme } from "next-themes";
import { ReaderSettingsCustom } from "./reader-settings-custom";

export const ReaderSettings = () => {
  const [themeName, setThemeName] = useAtom(readerThemeNameAtom);
  const [, setReaderPrefs] = useAtom(readerPreferencesAtom);
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
      fontSize: prev.fontSize,
    }));
  };

  return (
    <div className="fixed bottom-18 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-full shadow-md">
            <CaseSensitive className="mr-2 h-4 w-4" />
            Reader Style
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-4">
          <div className="flex flex-col gap-1">
            {/* Font Size + Mode */}
            <div className="flex-1">
              <FontSizeToggler onChange={handleFontSizeChange} />
            </div>

            <div className="h-px bg-muted mb-4" />

            {/* Theme Picker */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Theme Presets
              </p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(THEME_PRESETS).map(([name, config]) => (
                  <button
                    key={name}
                    onClick={() =>
                      handleThemeSelect(name as keyof typeof THEME_PRESETS)
                    }
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2 rounded-md border transition-all",
                      themeName === name
                        ? "border-primary bg-accent/20"
                        : "border-border hover:border-muted",
                    )}
                  >
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{
                        backgroundColor: isDark
                          ? config.backgroundColor?.dark
                          : config.backgroundColor.light,
                      }}
                    />
                    <div className="flex flex-col items-start">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          fontFamily: config.fontFamily,
                          color: isDark
                            ? config.textColor.dark
                            : config.textColor.light,
                        }}
                      >
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </p>
                      <p
                        className="text-sm text-muted-foreground"
                        style={{
                          fontFamily: config.fontFamily,
                          color: isDark
                            ? config.textColor.dark
                            : config.textColor.light,
                        }}
                      >
                        Aa
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="h-px bg-muted my-4" />
          <div className="flex flex-col gap-1">
            <ReaderSettingsCustom />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
