import { atom } from "jotai";
import type { Highlight, Bookmark, Note } from "@/hooks/use-epub-reader";

export const highlightsAtom = atom<Highlight[]>([]);
export const bookmarksAtom = atom<Bookmark[]>([]);
export const notesAtom = atom<Note[]>([]);
export const currentLocationAtom = atom<string | null>(null);
