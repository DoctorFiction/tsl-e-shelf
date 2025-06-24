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
  theme: "light" | "dark" | "auto";
  textAlign?: string;
  backgroundColor: { light: string; dark: string };
  textColor: { light: string; dark: string };
}

export interface IReaderOverrides {
  fontSize?: number;
  fontFamily?: string;
  lineHeight?: number;
  isBold?: boolean;
  characterSpacing?: number;
  wordSpacing?: number;
  margin?: number;
  columns?: string; // Change this from number to string
  textAlign?: string;
}

export const THEME_PRESETS: Record<ReaderThemeName, IReaderPreferenceConfig> = {
  Original: {
    fontSize: 17,
    fontFamily: "Georgia, 'Times New Roman', serif",
    lineHeight: 1.2,
    theme: "auto",
    textAlign: "justify",
    backgroundColor: {
      light: "#ffffff",
      dark: "#000000",
    },
    textColor: {
      light: "#000000",
      dark: "#ffffff",
    },
  },
  Quiet: {
    fontSize: 17,
    fontFamily: "Publico",
    lineHeight: 1.4,
    theme: "auto",
    textAlign: "justify",
    backgroundColor: {
      light: "#414144",
      dark: "#000000",
    },
    textColor: {
      light: "#A5A5Ad",
      dark: "#828288",
    },
  },
  Paper: {
    fontSize: 17,
    fontFamily: "Palatino Linotype, Book Antiqua, Palatino, serif",
    lineHeight: 1.55,
    theme: "auto",
    textAlign: "justify",
    backgroundColor: {
      light: "#EBEAEA",
      dark: "#1A1A1C",
    },
    textColor: {
      light: "#1D1A1A",
      dark: "#F0F0EE",
    },
  },
  Bold: {
    fontSize: 17,
    fontFamily: "Arial Black, Gadget, sans-serif",
    lineHeight: 1.5,
    theme: "auto",
    textAlign: "left",
    backgroundColor: {
      light: "#FFFFFF",
      dark: "#000000",
    },
    textColor: {
      light: "#1A1A1C",
      dark: "#EDECf0",
    },
  },
  Calm: {
    fontSize: 17,
    fontFamily: "'Helvetica Neue', sans-serif",
    lineHeight: 1.55,
    theme: "auto",
    textAlign: "justify",
    backgroundColor: {
      light: "#EEDEC3",
      dark: "#433E36",
    },
    textColor: {
      light: "#342C24",
      dark: "#F7E9D7",
    },
  },
  Focus: {
    fontSize: 17,
    fontFamily: "Proxima Nova, sans-serif",
    lineHeight: 1.4,
    theme: "auto",
    textAlign: "left",
    backgroundColor: {
      light: "#FFFCF3",
      dark: "#17160F",
    },
    textColor: {
      light: "#141303",
      dark: "#FFF8E9",
    },
  },
};

const defaultOverrides: IReaderOverrides = {
  characterSpacing: 1,
  wordSpacing: 1,
  isBold: false,
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

export const readerOverridesAtom = atomWithStorage<IReaderOverrides>(
  "reader-overrides",
  defaultOverrides,
);
