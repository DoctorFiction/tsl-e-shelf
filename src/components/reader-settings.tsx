"use client";

import {
  defaultPreferences,
  readerPreferencesAtom,
} from "@/atoms/reader-preferences";
import { useAtom } from "jotai";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CaseSensitive } from "lucide-react";
import { FontSizeToggler } from "./font-size-toggler";
import { useCallback } from "react";

export const ReaderSettings = () => {
  const [currentPref, setCurrentPref] = useAtom(readerPreferencesAtom);
  const defPrefs = defaultPreferences;

  const handleFontSizeChange = useCallback(
    (val: number) => {
      setCurrentPref((prev) => ({
        ...prev,
        fontSize: val,
      }));
    },
    [setCurrentPref],
  );

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
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-12 gap-2 h-full">
              <div className="col-span-8">
                <FontSizeToggler onChange={handleFontSizeChange} />
              </div>
              <div className="col-span-4">MODE</div>
            </div>
            <div className="grid grid-cols-2 gap-1 border-r-amber-400">
              {defPrefs.map((pref) => (
                <div
                  key={pref.title}
                  className="text-center border-2 border-solid rounded-md cursor-pointer"
                  onClick={() => setCurrentPref(pref.config)}
                >
                  <p>{pref.title}</p>
                  <p style={{ fontFamily: pref.config.fontFamily }}>Aa</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <p>Customize</p>
            </div>
          </div>
          {/* THIS WILL MOVE TO CUSTOMIZE PREFERENCE LATER */}
          {/* <div className="flex flex-col gap-1"> */}
          {/*   <label className="block"> */}
          {/*     Font Size:{" "} */}
          {/*     <input */}
          {/*       type="number" */}
          {/*       value={currentPref.fontSize} */}
          {/*       onChange={(e) => */}
          {/*         setCurrentPref({ */}
          {/*           ...currentPref, */}
          {/*           fontSize: parseInt(e.target.value), */}
          {/*         }) */}
          {/*       } */}
          {/*     /> */}
          {/*   </label> */}
          {/**/}
          {/*   <label className="block"> */}
          {/*     Font Family:{" "} */}
          {/*     <select */}
          {/*       value={currentPref.fontFamily} */}
          {/*       onChange={(e) => */}
          {/*         setCurrentPref({ */}
          {/*           ...currentPref, */}
          {/*           fontFamily: e.target.value, */}
          {/*         }) */}
          {/*       } */}
          {/*     > */}
          {/*       <option value="Georgia, 'Times New Roman', serif"> */}
          {/*         Georgia */}
          {/*       </option> */}
          {/*       <option value="'Helvetica Neue', sans-serif">Helvetica</option> */}
          {/*       <option value="'Courier New', monospace">Courier</option> */}
          {/*     </select> */}
          {/*   </label> */}
          {/* </div> */}
        </PopoverContent>
      </Popover>
    </div>
  );
};
