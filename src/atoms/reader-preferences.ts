import { atomWithStorage } from "jotai/utils";

export interface IReaderPreferences {
  title: string;
  config: IReaderPreferenceConfig;
}

export interface IReaderPreferenceConfig {
  fontSize: number; // px
  fontFamily: string;
  lineHeight: number;
  theme: "light" | "dark"; // optional override
  textAlign?: string;
}

const defaultPreferences: IReaderPreferences = {
  title: "Original",
  config: {
    fontSize: 17,
    fontFamily: "Georgia, 'Times New Roman', serif",
    lineHeight: 1.6,
    theme: "light",
    textAlign: "justify",
  },
};

export const readerPreferencesAtom = atomWithStorage<IReaderPreferences>(
  "reader-prefs",
  defaultPreferences,
);
