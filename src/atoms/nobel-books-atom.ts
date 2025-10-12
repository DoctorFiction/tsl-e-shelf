"use client";

import { atom } from "jotai";

export interface NobelBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  bookFileUrl: string;
  filename: string;
  totalPages: number;
  urunId: number;
}

export const nobelBooksAtom = atom<NobelBook[]>([]);
export const isLoadingNobelBooksAtom = atom<boolean>(false);
export const errorNobelBooksAtom = atom<string | null>(null);

export const fetchNobelBooksAtom = atom(
  (get) => get(nobelBooksAtom),
  async (_get, set) => {
    set(isLoadingNobelBooksAtom, true);
    set(errorNobelBooksAtom, null);

    try {
      const response = await fetch("/api/books/nobel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const books: NobelBook[] = await response.json();
      set(nobelBooksAtom, books);
    } catch (err) {
      set(errorNobelBooksAtom, err instanceof Error ? err.message : "Kitaplar yüklenirken hata oluştu");
    } finally {
      set(isLoadingNobelBooksAtom, false);
    }
  }
);