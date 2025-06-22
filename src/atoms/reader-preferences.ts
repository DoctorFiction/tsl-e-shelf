import { atomWithStorage } from "jotai/utils";

export interface IReaderPreference {
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

const DEFAULT_CONFIG_VALUES = {
  fontSize: 17,
  lineHeight: 1.4,
};

const original: IReaderPreference = {
  title: "Original",
  config: {
    fontSize: DEFAULT_CONFIG_VALUES.fontSize,
    fontFamily: "Georgia, 'Times New Roman', serif",
    lineHeight: DEFAULT_CONFIG_VALUES.lineHeight,
    theme: "light",
    textAlign: "justify",
  },
};

const quiet: IReaderPreference = {
  title: "Quiet",
  config: {
    fontSize: DEFAULT_CONFIG_VALUES.fontSize,
    fontFamily: "Publico",
    lineHeight: DEFAULT_CONFIG_VALUES.lineHeight,
    theme: "light",
    textAlign: "justify",
  },
};

export const defaultPreferences: IReaderPreference[] = [original, quiet];

const defaultPreferenceConfig: IReaderPreferenceConfig =
  defaultPreferences[0].config;

export const readerPreferencesAtom = atomWithStorage<IReaderPreferenceConfig>(
  "reader-prefs",
  defaultPreferenceConfig,
);
