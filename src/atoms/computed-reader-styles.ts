import { atom } from "jotai";
import { readerThemeNameAtom, readerOverridesAtom, THEME_PRESETS } from "./reader-preferences";

export const computedReaderStylesAtom = atom((get) => {
  const themeName = get(readerThemeNameAtom);
  const theme = THEME_PRESETS[themeName];
  const overrides = get(readerOverridesAtom);

  return {
    ...theme,
    ...overrides,
    fontSize: overrides.fontSize ?? theme.fontSize,
    fontFamily: overrides.fontFamily ?? theme.fontFamily,
    lineHeight: overrides.lineHeight ?? theme.lineHeight,
    wordSpacing: overrides.wordSpacing ?? "normal",
    
    columnCount: overrides.columnCount ?? 1,
    textAlign: overrides.textAlign ?? theme.textAlign ?? "left",
    isBold: overrides.isBold ?? false,
    characterSpacing: overrides.characterSpacing ?? 0,
  };
});
