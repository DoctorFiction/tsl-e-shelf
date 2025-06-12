import { getBooks } from "@/lib/books";
import Image from "next/image";

export default async function MyLibrary() {
  const data = await getBooks();

  return (
    <div className="p-6">
      <h1 className="text-3xl capitalize font-bold mb-4">Kitaplar</h1>
      <h1 className="text-3xl font-bold text-white mb-6">My Library</h1>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {data.results.map((book: any) => (
          <div
            key={book.id}
            className="bg-gray-800 text-white rounded-xl overflow-hidden shadow-lg flex flex-col"
          >
            <div className="relative h-56">
              <Image
                src={book.formats["image/jpeg"]}
                alt={book.title}
                fill
                className="object-cover rounded"
                sizes="(max-width: 768px) 100vw, 200px"
              />
              <span className="absolute bottom-1 right-1 bg-black/60 text-xs px-2 py-0.5 rounded">
                {book.authors[0]?.name}
              </span>
            </div>

            <div className="p-3 flex-1 flex flex-col justify-between">
              <h2 className="text-sm font-semibold line-clamp-2">
                {book.title}
              </h2>

              <a
                href={`/reader/${book.id}`}
                className="mt-2 text-center text-sm text-white bg-blue-600 hover:bg-blue-700 rounded px-3 py-1"
              >
                Read
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
