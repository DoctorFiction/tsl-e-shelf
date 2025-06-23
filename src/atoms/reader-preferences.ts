import { atomWithStorage } from "jotai/utils";

export type ReaderThemeName =
  | "Original"
  | "Quiet"
  | "Paper"
  | "Bold"
  | "Calm"
  | "Focus";

export interface IReaderPreferenceConfig {
  fontSize: number; // px
  fontFamily: string;
  lineHeight: number;
  theme: "light" | "dark";
  textAlign?: string;
}

export const THEME_PRESETS: Record<ReaderThemeName, IReaderPreferenceConfig> = {
  Original: {
    fontSize: 17,
    fontFamily: "Georgia, 'Times New Roman', serif",
    lineHeight: 1.4,
    theme: "light",
    textAlign: "justify",
  },
  Quiet: {
    fontSize: 17,
    fontFamily: "Publico",
    lineHeight: 1.4,
    theme: "light",
    textAlign: "justify",
  },
  Paper: {
    fontSize: 17,
    fontFamily: "Palatino Linotype, Book Antiqua, Palatino, serif",
    lineHeight: 1.4,
    theme: "light",
    textAlign: "justify",
  },
  Bold: {
    fontSize: 17,
    fontFamily: "Arial Black, Gadget, sans-serif",
    lineHeight: 1.4,
    theme: "dark",
    textAlign: "left",
  },
  Calm: {
    fontSize: 17,
    fontFamily: "Helvetica Neue, sans-serif",
    lineHeight: 1.6,
    theme: "light",
    textAlign: "justify",
  },
  Focus: {
    fontSize: 17,
    fontFamily: "Courier New, Courier, monospace",
    lineHeight: 1.4,
    theme: "dark",
    textAlign: "left",
  },
};

export const defaultThemeName: ReaderThemeName = "Original";

export const readerThemeNameAtom = atomWithStorage<ReaderThemeName>(
  "reader-theme-name",
  defaultThemeName,
);

export const readerPreferencesAtom = atomWithStorage<IReaderPreferenceConfig>(
  "reader-preferences",
  THEME_PRESETS[defaultThemeName],
);
