import { Book } from "epubjs";

export const getChapterFromCfi = async (
  book: Book,
  cfi: string,
): Promise<string | null> => {
  if (!book.navigation) {
    await book.ready;
  }
  const spine = await book.spine.get(cfi);
  if (spine) {
    const tocItem = book.navigation.toc.find((item) =>
      item.href.includes(spine.href),
    );
    return tocItem ? tocItem.label.trim() : null;
  }
  return null;
};

export const getPageFromCfi = (book: Book, cfi: string): number | null => {
  if (book.locations.length() > 0) {
    const page = book.locations.locationFromCfi(cfi);
    // locationFromCfi returns the page number, but the type definitions might be incorrect
    // Casting to unknown and then to number to bypass the type error
    return page as unknown as number;
  }
  return null;
};
