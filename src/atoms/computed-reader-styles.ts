import { atom } from "jotai";
import { readerPreferencesAtom } from "./reader-preferences";

export const computedReaderStylesAtom = atom((get) => {
  return get(readerPreferencesAtom);
});