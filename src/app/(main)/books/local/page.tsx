"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  nobelBooksAtom,
  isLoadingNobelBooksAtom,
  errorNobelBooksAtom,
  fetchNobelBooksAtom,
} from "@/atoms/nobel-books-atom";



export default function LibraryPage() {
  const [nobelBooks] = useAtom(nobelBooksAtom);
  const [isLoading] = useAtom(isLoadingNobelBooksAtom);
  const [error] = useAtom(errorNobelBooksAtom);
  const [, fetchNobelBooks] = useAtom(fetchNobelBooksAtom);

  useEffect(() => {
    fetchNobelBooks();
  }, [fetchNobelBooks]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📚 Kütüphane</h1>

      <div className="mb-6">
        <button onClick={() => fetchNobelBooks()} disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? "Yükleniyor..." : "Nobel Kitaplarını Yenile"}
        </button>
        {error && <p className="text-red-500 mt-2">Hata: {error}</p>}
        {!error && !isLoading && nobelBooks.length === 0 && <p className="text-gray-500 mt-2">Gösterilecek kitap bulunamadı.</p>}
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
        <div className="text-gray-600">{isLoading ? "Kitaplar yükleniyor..." : "Listelenecek kitap bulunamadı."}</div>
      )}
    </div>
  );
}
