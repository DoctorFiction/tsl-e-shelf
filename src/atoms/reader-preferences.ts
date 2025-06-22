import { atomWithStorage } from "jotai/utils";

export interface IReaderPreferences {
  fontSize: number; // px
  fontFamily: string;
  lineHeight: number;
  theme: "light" | "dark"; // optional override
  textAlign?: string;
}

const defaultPreferences: IReaderPreferences = {
  fontSize: 17,
  fontFamily: "Georgia, 'Times New Roman', serif",
  lineHeight: 1.6,
  theme: "light",
  textAlign: "justify",
};

export const readerPreferencesAtom = atomWithStorage<IReaderPreferences>(
  "reader-prefs",
  defaultPreferences,
);
