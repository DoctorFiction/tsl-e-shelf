"use client";
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
  | "margin"
  | "columns";

interface ReaderStyleSliderProps {
  label: string;
  field: SliderField;
  min: number;
  max: number;
  step?: number;
  formatValue?: (val: number) => string;
}

export const ReaderStyleSlider = ({
  label,
  field,
  min,
  max,
  step = 1,
  formatValue,
}: ReaderStyleSliderProps) => {
  const [overrides, setOverrides] = useAtom(readerOverridesAtom);
  const currentValue = overrides[field] ?? min;

  // UI WILL BE CHANGED OPTIMIC
  const [tempValue, setTempValue] = useState<number>(currentValue);
  const debouncedValue = useDebounce(tempValue, 52);

  useEffect(() => {
    if (debouncedValue !== currentValue) {
      setOverrides((prev) => ({
        ...prev,
        [field]: debouncedValue,
      }));
    }
  }, [debouncedValue, field, setOverrides, currentValue]);

  // DEFAULT VALUE
  useEffect(() => {
    setTempValue(currentValue);
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
