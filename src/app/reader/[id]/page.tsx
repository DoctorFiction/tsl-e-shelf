import EpubReader from "@/components/epub-reader";

export default async function ReaderPage() {
  const books: string[] = [
    "https://react-reader.metabits.no/files/alice.epub",
    "/books/Aftermath Star Wars by Wendig Chuck (z-lib.org).epub",
    "/books/alice.epub",
    "/books/Dune by Frank Herbert (z-lib.org).epub",
    "/books/Herbert_Frank_-_01_Dune.epub",
    "/books/Puzo, Mario - The Godfather by Puzo Mario (z-lib.org).epub",
  ];

  return (
    <div className="w-full h-screen flex flex-col">
      <EpubReader url={books[0]} />
    </div>
  );
}
