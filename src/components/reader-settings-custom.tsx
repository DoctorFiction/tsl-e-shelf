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
import { Switch } from "@/components/ui/switch";
import { Type } from "lucide-react";
import { useAtom } from "jotai";
import { Slider } from "@/components/ui/slider";
import { readerOverridesAtom } from "@/atoms/reader-preferences";
import { useState, useEffect } from "react";
import useDebounce from "@/hooks/use-debounce";

// List of numeric override keys
export type SliderField =
  | "fontSize"
  | "lineHeight"
  | "characterSpacing"
  | "wordSpacing"
  | "margin";

export type SelectField = "fontFamily" | "textAlign" | "columns";
export type SwitchField = "isBold";

interface ReaderStyleSliderProps {
  label: string;
  field: SliderField;
  min: number;
  max: number;
  step?: number;
  delay?: number;
  formatValue?: (val: number) => string;
}

interface ReaderStyleSelectProps {
  label: string;
  field: SelectField;
  options: { value: string; label: string }[];
  placeholder?: string;
  icon?: React.ReactNode;
}

interface ReaderStyleSwitchProps {
  label: string;
  field: SwitchField;
  description?: string;
}

interface MoreReaderSettingsProps {
  show: boolean;
}

export const ReaderStyleSlider = ({
  label,
  field,
  min,
  max,
  step = 1,
  delay = 52,
  formatValue,
}: ReaderStyleSliderProps) => {
  const [overrides, setOverrides] = useAtom(readerOverridesAtom);
  const currentValue = Number(overrides[field]) || min; // Ensure it's a number

  // UI WILL BE CHANGED OPTIMIC
  const [tempValue, setTempValue] = useState<number>(currentValue);
  const debouncedValue = useDebounce(tempValue, delay);

  useEffect(() => {
    if (debouncedValue !== currentValue) {
      setOverrides((prev) => ({
        ...prev,
        [field]: Number(debouncedValue), // Ensure we store as number
      }));
    }
  }, [debouncedValue, field, setOverrides, currentValue]);

  // DEFAULT VALUE
  useEffect(() => {
    setTempValue(Number(currentValue)); // Ensure temp value is number
  }, [currentValue]);

  const handleChange = (newVal: number[]) => {
    setTempValue(newVal[0]);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm font-medium text-muted-foreground">
        <span>{label}</span>
        <span>{formatValue ? formatValue(tempValue) : tempValue}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[tempValue]}
        onValueChange={handleChange}
      />
    </div>
  );
};

export const ReaderStyleSelect = ({
  label,
  field,
  options,
  placeholder = "Select option",
  icon,
}: ReaderStyleSelectProps) => {
  const [overrides, setOverrides] = useAtom(readerOverridesAtom);
  const currentValue = overrides[field] as string;

  const handleValueChange = (value: string) => {
    setOverrides((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          {icon && <span className="mr-2">{icon}</span>}
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const ReaderStyleSwitch = ({
  label,
  field,
  description,
}: ReaderStyleSwitchProps) => {
  const [overrides, setOverrides] = useAtom(readerOverridesAtom);
  const currentValue = (overrides[field] as boolean) ?? false;

  const handleCheckedChange = (checked: boolean) => {
    setOverrides((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="space-y-0.5">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        {description && (
          <p className="text-xs text-muted-foreground/70">{description}</p>
        )}
      </div>
      <Switch checked={currentValue} onCheckedChange={handleCheckedChange} />
    </div>
  );
};

export const ReaderSettingsCustom = ({ show }: MoreReaderSettingsProps) => {
  const fontOptions = [
    { value: "system", label: "System Default" },
    { value: "serif", label: "Serif" },
    { value: "sans-serif", label: "Sans Serif" },
    { value: "monospace", label: "Monospace" },
    { value: "georgia", label: "Georgia" },
    { value: "times", label: "Times New Roman" },
  ];

  const columnOptions = [
    { value: "1", label: "Single Column" },
    { value: "2", label: "Two Columns" },
  ];

  const textAlignOptions = [
    { value: "left", label: "Left Align" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right Align" },
    { value: "justify", label: "Justify" },
  ];

  return (
    <div
      className={`
        transition-all duration-300 ease-in-out overflow-hidden px-1
        ${show ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0"}
      `}
      aria-hidden={!show}
    >
      <div className="flex flex-col gap-4">
        <ReaderStyleSelect
          label="Font Family"
          field="fontFamily"
          options={fontOptions}
          placeholder="Select font"
          icon={<Type className="h-4 w-4" />}
        />

        <ReaderStyleSlider
          label="Line Spacing"
          field="lineHeight"
          min={0.75}
          max={2.5}
          step={0.05}
          formatValue={(val) => val.toFixed(2)}
        />

        <ReaderStyleSlider
          label="Character Spacing"
          field="characterSpacing"
          min={-3}
          max={5}
          step={0.5}
          formatValue={(val) => `${val.toFixed(1)}px`}
        />

        <ReaderStyleSlider
          label="Word Spacing"
          field="wordSpacing"
          min={-5}
          max={10}
          step={0.5}
          formatValue={(val) => `${val.toFixed(1)}px`}
        />

        <ReaderStyleSlider
          label="Margin"
          field="margin"
          min={0}
          max={250}
          step={1}
          delay={250}
          formatValue={(val) => `${val.toFixed(1)}px`}
        />

        <ReaderStyleSelect
          label="Columns"
          field="columns"
          options={columnOptions}
          placeholder="Select columns"
          icon={<Type className="h-4 w-4" />}
        />

        <ReaderStyleSelect
          label="Text Alignment"
          field="textAlign"
          options={textAlignOptions}
          placeholder="Select alignment"
          icon={<Type className="h-4 w-4" />}
        />

        <ReaderStyleSwitch
          label="Bold Text"
          field="isBold"
          description="Make text bold for better readability"
        />
      </div>
    </div>
  );
};
