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
    // locationFromCfi returns a 0-indexed number, but its type definition is 'Location'.
    // We assert it to number and add 1 to make it 1-indexed for display.
    return (page as unknown as number) + 1;
  }
  return null;
};

