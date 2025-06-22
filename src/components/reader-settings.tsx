"use client";

import { readerPreferencesAtom } from "@/atoms/reader-preferences";
import { useAtom } from "jotai";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CaseSensitive } from "lucide-react";

export const ReaderSettings = () => {
  const [prefs, setPrefs] = useAtom(readerPreferencesAtom);

  return (
    <div className="fixed bottom-18 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-full shadow-md">
            <CaseSensitive className="mr-2 h-4 w-4" />
            Theme Settings
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-1">
            <label className="block">
              Font Size:{" "}
              <input
                type="number"
                value={prefs.fontSize}
                onChange={(e) =>
                  setPrefs({ ...prefs, fontSize: parseInt(e.target.value) })
                }
              />
            </label>

            <label className="block">
              Font Family:{" "}
              <select
                value={prefs.fontFamily}
                onChange={(e) =>
                  setPrefs({ ...prefs, fontFamily: e.target.value })
                }
              >
                <option value="Georgia, 'Times New Roman', serif">
                  Georgia
                </option>
                <option value="'Helvetica Neue', sans-serif">Helvetica</option>
                <option value="'Courier New', monospace">Courier</option>
              </select>
            </label>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
