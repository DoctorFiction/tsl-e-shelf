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
import { Cog, Type } from "lucide-react";
import { useAtom } from "jotai";
import { Slider } from "@/components/ui/slider";
import {
  defaultOverrides,
  pendingReaderOverridesAtom,
  readerOverridesAtom,
  readerPreferencesAtom,
} from "@/atoms/reader-preferences";
import { useState, useEffect, CSSProperties, useMemo } from "react";
import useDebounce from "@/hooks/use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

// List of numeric override keys
export type SliderField =
  | "fontSize"
  | "lineHeight"
  | "characterSpacing"
  | "wordSpacing"
  | "margin";

export type SelectField = "fontFamily" | "textAlign" | "columnCount";
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

export const ReaderStyleSlider = ({
  label,
  field,
  min,
  max,
  step = 1,
  delay = 52,
  formatValue,
}: ReaderStyleSliderProps) => {
  const [pendingOverrides, setPendingOverrides] = useAtom(
    pendingReaderOverridesAtom,
  );
  const currentValue = Number(pendingOverrides[field]) || min;

  const [tempValue, setTempValue] = useState<number>(currentValue);
  const debouncedValue = useDebounce(tempValue, delay);

  useEffect(() => {
    if (debouncedValue !== currentValue) {
      setPendingOverrides((prev) => ({
        ...prev,
        [field]: debouncedValue,
      }));
    }
  }, [debouncedValue, field, setPendingOverrides, currentValue]);

  useEffect(() => {
    setTempValue(Number(currentValue));
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
  const [pendingOverrides, setPendingOverrides] = useAtom(
    pendingReaderOverridesAtom,
  );
  const currentValue = pendingOverrides[field] as string;

  const handleValueChange = (value: string) => {
    setPendingOverrides((prev) => ({
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
  const [pendingOverrides, setPendingOverrides] = useAtom(
    pendingReaderOverridesAtom,
  );
  const currentValue = (pendingOverrides[field] as boolean) ?? false;

  const handleCheckedChange = (checked: boolean) => {
    setPendingOverrides((prev) => ({
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

export const ReaderSettingsCustom = () => {
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

  type TextAlignOption = "left" | "right" | "center" | "justify";

  const textAlignOptions: { value: TextAlignOption; label: string }[] = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
    { value: "justify", label: "Justify" },
  ];

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [prefs] = useAtom(readerPreferencesAtom);
  const [overrides, setOverrides] = useAtom(readerOverridesAtom);
  const [pendingOverrides, setPendingOverrides] = useAtom(
    pendingReaderOverridesAtom,
  );

  const handleSave = () => {
    setOverrides(pendingOverrides);
    setDialogOpen(false);
  };

  const handleReset = () => {
    setPendingOverrides(defaultOverrides);
    setOverrides(defaultOverrides);
    setResetDialogOpen(false);
    setDialogOpen(false);
  };

  useEffect(() => {
    setPendingOverrides(overrides);
  }, [overrides, setPendingOverrides]);

  const previewStyle = useMemo<CSSProperties>(
    () => ({
      backgroundColor: isDark
        ? prefs.backgroundColor.dark
        : prefs.backgroundColor.light,
      color: isDark ? prefs.textColor.dark : prefs.textColor.light,
      fontSize: prefs.fontSize,
      fontFamily: prefs.fontFamily,
      lineHeight: prefs.lineHeight,
      columnCount: pendingOverrides.columnCount,
      wordSpacing: pendingOverrides.wordSpacing,
      textAlign: pendingOverrides.textAlign,
      paddingLeft: `${pendingOverrides.margin}px`,
      paddingRight: `${pendingOverrides.margin}px`,
    }),
    [prefs, pendingOverrides, isDark],
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1">
          <Cog />
          More customizations
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-row gap-2">
              <p>More customizations</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div
          style={previewStyle}
          className="rounded-md p-3 border bg-background"
        >
          <p>
            “After a while, finding that nothing more happened, she decided on
            going into the garden at once; but, alas for poor Alice! when she
            got to the door, she found she had forgotten the little golden key,
            and when she went back to the table for it, she found she could not
            possibly reach it: she could see it quite plainly through the glass,
            and she tried her best to climb up one of the legs of the table, but
            it was too slippery; and when she had tired herself out with trying,
            the poor little thing sat down and cried.”
          </p>
        </div>
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
            field="columnCount"
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
        <div className="flex justify-end gap-2 pt-4">
          <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="secondary">Reset</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to reset all styles?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>
                  Yes, Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
