import fs from "fs";
import path from "path";
import Link from "next/link";

export default function LibraryPage() {
  const booksDir = path.join(process.cwd(), "public", "books");
  const filenames = fs
    .readdirSync(booksDir)
    .filter((name) => name.endsWith(".epub"));

  const books = filenames.map((filename) => ({
    filename,
    title: decodeURIComponent(
      filename.replace(/\.epub$/, "").replace(/[_-]/g, " "),
    ),
    id: encodeURIComponent(filename), // Use this as the [id] param
  }));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📚 Library</h1>
      <ul className="space-y-2">
        {books.map((book) => (
          <li key={book.filename}>
            <Link
              href={`/reader/${book.id}`}
              className="text-blue-600 hover:underline"
            >
              {book.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
