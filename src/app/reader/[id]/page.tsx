import EpubReader from "@/components/epub-reader";

type Params = { id: string };

export default async function ReaderPage() {
  const books: string[] = [
    "https://react-reader.metabits.no/files/alice.epub",
    "/books/moby-dick.epub",
    "/books/pg2701-images-3.epub",
  ];

  return (
    <div className="w-full h-screen flex flex-col">
      <EpubReader url={books[1]} />
    </div>
  );
}
