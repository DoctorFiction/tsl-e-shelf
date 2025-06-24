"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Type } from "lucide-react";
import { ReaderStyleSlider } from "./reader-settings-slider";

interface MoreReaderSettingsProps {
  show: boolean;
}

export const ReaderSettingsCustomization = ({
  show,
}: MoreReaderSettingsProps) => {
  return (
    <div
      className={`
        transition-all duration-300 ease-in-out overflow-hidden px-1
        ${show ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0"}
      `}
      aria-hidden={!show}
    >
      <div className="flex flex-col gap-4">
        {/* Font Selector */}
        <Select>
          <SelectTrigger className="w-full">
            <Type className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectGroup>
              <SelectLabel>Fonts</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Sliders */}
        <ReaderStyleSlider
          label="Line Spacing"
          field="lineHeight"
          min={1.25}
          max={2.5}
          step={0.05}
          formatValue={(val) => val.toFixed(2)}
        />
        <ReaderStyleSlider
          label="Word Spacing"
          field="wordSpacing"
          min={0}
          max={2}
          step={0.1}
        />
        {/* Add more sliders here as needed */}
      </div>
    </div>
  );
};
