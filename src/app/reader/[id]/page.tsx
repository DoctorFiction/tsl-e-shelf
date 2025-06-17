import EpubReader from "@/components/epub-reader";

type Params = { id: string };

export default async function ReaderPage({ params }: { params: Params }) {
  const res = await fetch(`https://gutendex.com/books/${params.id}`);
  const book = await res.json();
  // const htmlUrl = book.formats["text/html"];
  const books: string[] = [
    "https://react-reader.metabits.no/files/alice.epub",
    "/books/moby-dick.epub",
    "/books/pg2701-images-3.epub",
  ];

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 bg-gray-100 border-b">
        <h1 className="text-xl font-bold">{book.title}</h1>
        <p className="text-sm text-gray-600">
          {book.authors.map((a: { name: string }) => a.name).join(", ")}
        </p>
      </div>
      <EpubReader url={books[1]} />
    </div>
  );
}
