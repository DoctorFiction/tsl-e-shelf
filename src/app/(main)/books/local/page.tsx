import Link from "next/link";
import { getLocalBooks, LocalBook } from "@/lib/local-books";

export default async function LibraryPage() {
  const books: LocalBook[] = await getLocalBooks();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📚 Kütüphane</h1>
      <ul className="space-y-2">
        {books.length === 0 ? (
          <p>Yerel kitap bulunamadı</p>
        ) : (
          books.map((book, index) => (
            <li key={book.filename}>
              <Link href={`/reader/${book.id}`} className="text-blue-600 hover:underline">
                {`${index + 1}. `} {book.title}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
