"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LocalBook {
  filename: string;
  title: string;
  id: string;
}

interface NobelBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  bookFileUrl: string;
  filename: string;
  totalPages: number;
  urunId: number;
}

export default function LibraryPage() {
  const [localBooks, setLocalBooks] = useState<LocalBook[]>([]);
  const [nobelBooks, setNobelBooks] = useState<NobelBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLocalBooks() {
      try {
        const response = await fetch("/api/books/local");
        if (!response.ok) {
          throw new Error("Failed to fetch local books");
        }
        const books = await response.json();
        setLocalBooks(books);
      } catch (err) {
        console.error("Failed to load local books:", err);
      }
    }
    loadLocalBooks();
  }, []);

  const fetchNobelBooks = async () => {
    setIsLoading(true);
    setError(null);

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
      setNobelBooks(books);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kitaplar yüklenirken hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📚 Kütüphane</h1>

      <div className="mb-6">
        <button onClick={fetchNobelBooks} disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? "Yükleniyor..." : "Nobel Kitapları Çek"}
        </button>
        {error && <p className="text-red-500 mt-2">Hata: {error}</p>}
      </div>

      {/* Nobel Books Section */}
      {nobelBooks.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Nobel Yayın Kitapları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nobelBooks.map((book) => (
              <div key={book.id} className="border rounded-lg p-4 hover:shadow-md">
                <Image src={book.coverUrl} alt={book.title} width={200} height={300} className="w-50 h-75 object-fit mb-2 rounded" />
                <h3 className="font-semibold text-sm mb-1">{book.title}</h3>
                <p className="text-gray-600 text-xs mb-2">{book.author}</p>
                <p className="text-gray-500 text-xs mb-2">{book.totalPages} sayfa</p>
                <Link href={`/reader/${encodeURIComponent(book.bookFileUrl)}`} target="_blank" className="text-blue-600 hover:underline text-sm">
                  Kitabı Aç
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Yerel Kitaplar</h2>
          <ul className="space-y-2">
            {localBooks.length === 0 ? (
              <p>Yerel kitap bulunamadı</p>
            ) : (
              localBooks.map((book, index) => (
                <li key={book.filename}>
                  <Link href={`/reader/${book.id}`} className="text-blue-600 hover:underline">
                    {`${index + 1}. `} {book.title}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
