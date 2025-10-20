"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Asterisk, Cog, Type } from "lucide-react";
import { useAtom } from "jotai";
import { Slider } from "@/components/ui/slider";
import { IReaderPreferenceConfig, readerPreferencesAtom, THEME_PRESETS, defaultThemeName } from "@/atoms/reader-preferences";
import { useState, useEffect, CSSProperties, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface ReaderPreviewProps {
  getPreviewText: (charCount?: number) => Promise<string | null>;
  previewStyle: CSSProperties;
}

const ReaderPreview = ({ getPreviewText, previewStyle }: ReaderPreviewProps) => {
  const [previewText, setPreviewText] = useState<string | null>(null);

  useEffect(() => {
    getPreviewText(250).then(setPreviewText);
  }, [getPreviewText]);

  return (
    <div className="relative rounded-md p-4 border bg-background h-40 overflow-hidden">
      {previewText ? (
        <p style={previewStyle} className="text-sm leading-relaxed">
          {previewText}...
        </p>
      ) : (
        <p>Yükleniyor...</p>
      )}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

// List of numeric override keys
export type SliderField = "fontSize" | "lineHeight" | "characterSpacing" | "wordSpacing";

export type SelectField = "fontFamily" | "textAlign" | "columnCount" | "margin";
export type SwitchField = "isBold";

interface ReaderStyleSliderProps {
  label: string;
  field: SliderField;
  min: number;
  max: number;
  step?: number;
  formatValue?: (val: number) => string;
}

interface ReaderStyleSelectProps {
  label: string;
  field: SelectField;
  options: { value: string; label: string }[];
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface ReaderStyleSwitchProps {
  label: string;
  field: SwitchField;
  description?: string;
}

interface ReaderSettingsCustomProps {
  getPreviewText: (charCount?: number) => Promise<string | null>;
  saveReaderPreferences: (preferences: IReaderPreferenceConfig) => Promise<void>;
}

const ReaderStyleSlider = ({
  label,
  field,
  min,
  max,
  step = 1,
  formatValue,
  value,
  onChange,
}: ReaderStyleSliderProps & {
  value: number;
  onChange: (field: SliderField, value: number) => void;
}) => {
  const [tempValue, setTempValue] = useState<number>(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleValueChange = (value: number[]) => {
    setTempValue(value[0]);
  };

  const handleValueCommit = (value: number[]) => {
    onChange(field, value[0]);
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
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
      />
    </div>
  );
};

const ReaderStyleSelect = ({
  label,
  field,
  options,
  placeholder = "Seçenek seçin",
  icon,
  disabled,
  value,
  onChange,
}: ReaderStyleSelectProps & {
  value: string;
  onChange: (field: SelectField, value: string) => void;
}) => {
  const handleValueChange = (value: string) => {
    onChange(field, value);
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
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

const ReaderStyleSwitch = ({
  label,
  field,
  description,
  value,
  onChange,
}: ReaderStyleSwitchProps & {
  value: boolean;
  onChange: (field: SwitchField, value: boolean) => void;
}) => {
  const handleCheckedChange = (checked: boolean) => {
    onChange(field, checked);
  };

  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="space-y-0.5">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {description && <p className="text-xs text-muted-foreground/70">{description}</p>}
      </div>
      <Switch checked={value} onCheckedChange={handleCheckedChange} />
    </div>
  );
};

export const ReaderSettingsCustom = ({ getPreviewText, saveReaderPreferences }: ReaderSettingsCustomProps) => {
  const fontOptions = [
    { value: "system", label: "Sistem Varsayılanı" },
    { value: "Georgia, 'Times New Roman', serif", label: "Georgia" },
    { value: "Publico", label: "Publico" },
    {
      value: "Palatino Linotype, Book Antiqua, Palatino, serif",
      label: "Palatino",
    },
    { value: "Arial Black, Gadget, sans-serif", label: "Arial Black" },
    { value: "'Helvetica Neue', sans-serif", label: "Helvetica Neue" },
    { value: "Proxima Nova, sans-serif", label: "Proxima Nova" },
    { value: "monospace", label: "Monospace" },
  ];

  const columnOptions = [
    { value: "1", label: "Tek Sütun" },
    { value: "2", label: "İki Sütun" },
  ];

  const marginOptions = [
    { value: "small", label: "Küçük (13.5cm)" },
    { value: "full", label: "Tam (100%)" },
  ];

  type TextAlignOption = "left" | "right" | "center" | "justify";

  const textAlignOptions: { value: TextAlignOption; label: string }[] = [
    { value: "left", label: "Sol" },
    { value: "center", label: "Orta" },
    { value: "right", label: "Sağ" },
    { value: "justify", label: "Yasla" },
  ];

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [open, setOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const [readerPreferences, setReaderPreferences] = useAtom(readerPreferencesAtom);
  const [localPreferences, setLocalPreferences] = useState(readerPreferences);

  useEffect(() => {
    console.log("readerPreferences changed", readerPreferences);
    setLocalPreferences({
      ...readerPreferences,
      fontSize: Number(readerPreferences.fontSize),
      lineHeight: Number(readerPreferences.lineHeight),
      characterSpacing: Number(readerPreferences.characterSpacing),
      wordSpacing: Number(readerPreferences.wordSpacing),
    });
  }, [readerPreferences]);

  const handleLocalChange = (field: keyof IReaderPreferenceConfig, value: string | number | boolean) => {
    const processedValue = (field === "fontSize" || field === "lineHeight" || field === "characterSpacing" || field === "wordSpacing")
      ? Number(value)
      : value;
    setLocalPreferences((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
  };

  const isSmallMargin = localPreferences.margin === "small";

  useEffect(() => {
    if (isSmallMargin) {
      setLocalPreferences((prev) => ({
        ...prev,
        columnCount: "1",
      }));
    }
  }, [isSmallMargin]);

  const handleReset = () => {
    const defaultPrefs = THEME_PRESETS[defaultThemeName];
    setReaderPreferences(defaultPrefs);
    setLocalPreferences(defaultPrefs);
    saveReaderPreferences(defaultPrefs);
    setResetDialogOpen(false);
    setOpen(false);
  };

  const handleSave = () => {
    setReaderPreferences(localPreferences);
    saveReaderPreferences(localPreferences);
    setOpen(false);
  };

  const previewStyle = useMemo<CSSProperties>(() => {
    const defaultColors = { light: "#ffffff", dark: "#000000" }; // Fallback colors
    const bgColor = localPreferences.backgroundColor || defaultColors;
    const txtColor = localPreferences.textColor || defaultColors;

    return {
      backgroundColor: isDark ? bgColor.dark : bgColor.light,
      color: isDark ? txtColor.dark : txtColor.light,
      fontSize: localPreferences.fontSize,
      fontFamily: localPreferences.fontFamily,
      lineHeight: localPreferences.lineHeight,
      fontWeight: localPreferences.isBold ? "bold" : "normal",
      letterSpacing: `${localPreferences.characterSpacing}px`,
      wordSpacing: `${localPreferences.wordSpacing}px`,
      textAlign: localPreferences.textAlign,
      columnCount: Number(localPreferences.columnCount) || 1,
    };
  }, [localPreferences, isDark]);

  const isCustomized = useMemo(() => {
    const defaultPrefs = THEME_PRESETS[defaultThemeName];
    return Object.entries(defaultPrefs).some(([key, val]) => {
      if (key in localPreferences) {
        return localPreferences[key as keyof IReaderPreferenceConfig] !== val;
      }
      return false;
    });
  }, [localPreferences]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <div className="flex flex-row gap-1 items-center">
          <Button variant="outline" className="gap-1 grow" onClick={() => setOpen(true)}>
            <Cog />
            Daha fazla özelleştirme
          </Button>
          {isCustomized ? <Asterisk className="flex-none" /> : ""}
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            <div className="flex flex-row gap-2">
              <p>Daha fazla özelleştirme</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="flex flex-col gap-4">
            <ReaderPreview getPreviewText={getPreviewText} previewStyle={previewStyle} />
            <div className="flex flex-col gap-4">
              <ReaderStyleSelect
                label="Yazı Tipi Ailesi"
                field="fontFamily"
                options={fontOptions}
                placeholder="Seçenek seçin"
                icon={<Type className="h-4 w-4" />}
                value={localPreferences.fontFamily ?? "system"}
                onChange={handleLocalChange}
              />
              <ReaderStyleSlider
                label="Satır Aralığı"
                field="lineHeight"
                min={0.75}
                max={2.5}
                step={0.05}
                formatValue={(val) => val.toFixed(2)}
                value={localPreferences.lineHeight ?? 1.2}
                onChange={handleLocalChange}
              />
              <ReaderStyleSlider
                label="Karakter Aralığı"
                field="characterSpacing"
                min={-3}
                max={5}
                step={0.5}
                formatValue={(val) => `${val.toFixed(1)}px`}
                value={localPreferences.characterSpacing ?? 1}
                onChange={handleLocalChange}
              />
              <ReaderStyleSlider
                label="Kelime Aralığı"
                field="wordSpacing"
                min={-5}
                max={10}
                step={0.5}
                formatValue={(val) => `${val.toFixed(1)}px`}
                value={localPreferences.wordSpacing ?? 1}
                onChange={handleLocalChange}
              />

              <ReaderStyleSelect
                label="Sütunlar"
                field="columnCount"
                options={columnOptions}
                placeholder="Sütun seçin"
                icon={<Type className="h-4 w-4" />}
                disabled={isSmallMargin}
                value={(localPreferences.columnCount ?? "1").toString()}
                onChange={handleLocalChange}
              />
              <ReaderStyleSelect
                label="Kenar Boşluğu"
                field="margin"
                options={marginOptions}
                placeholder="Kenar boşluğu seçin"
                icon={<Type className="h-4 w-4" />}
                value={localPreferences.margin ?? "full"}
                onChange={handleLocalChange}
              />
              <ReaderStyleSelect
                label="Metin Hizalama"
                field="textAlign"
                options={textAlignOptions}
                placeholder="Hizalama seçin"
                icon={<Type className="h-4 w-4" />}
                value={localPreferences.textAlign ?? "justify"}
                onChange={handleLocalChange}
              />
              <ReaderStyleSwitch
                label="Kalın Metin"
                field="isBold"
                description="Daha iyi okunabilirlik için metni kalınlaştırın"
                value={localPreferences.isBold ?? false}
                onChange={handleLocalChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t flex-shrink-0">
          {/* Reset Button on the left if customized */}
          <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={!isCustomized}>
                Sıfırla
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Özelleştirmeleri sıfırla?</AlertDialogTitle>
                <AlertDialogDescription>Bu işlem tüm özel stillerinizi kaldıracak ve varsayılan temaya geri dönecektir.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>Evet, Sıfırla</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Cancel + Save Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSave}>Kaydet</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
