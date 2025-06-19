import { getBooks } from "@/lib/books";
import Image from "next/image";

interface IBook {
  id: number | string;
  title: string;
  authors: { name: string }[];
  formats: { [key: string]: string };
}

export default async function MyLibrary() {
  const data = await getBooks();

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200">
      <h1 className="text-4xl capitalize font-extrabold mb-8 text-center text-gray-900 tracking-tight drop-shadow-lg">Kitaplar</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {data.results.map((book: IBook) => (
          <div
            key={book.id}
            className="group bg-gray-800/80 border border-gray-700 text-white rounded-2xl overflow-hidden shadow-xl flex flex-col transition-all duration-150 transform hover:scale-105 hover:shadow-2xl hover:border-blue-500"
          >
            <div className="relative h-60 w-full overflow-hidden flex items-center justify-center bg-white">
              <Image
                src={book.formats["image/jpeg"]}
                alt={book.title}
                fill
                className="object-contain w-full h-full transition-all duration-150 rounded-t-2xl"
                sizes="(max-width: 768px) 100vw, 200px"
              />
              <span className="absolute bottom-2 left-2 bg-black/70 text-xs px-3 py-1 rounded-full font-medium shadow-md backdrop-blur-sm">{book.authors[0]?.name}</span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <h2 className="text-base font-semibold line-clamp-2 mb-3 text-white/90 group-hover:text-blue-400 transition-colors duration-200">{book.title}</h2>

              <a
                href={`/reader/${book.id}`}
                className="mt-auto text-center text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg px-4 py-2 shadow transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Oku
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
