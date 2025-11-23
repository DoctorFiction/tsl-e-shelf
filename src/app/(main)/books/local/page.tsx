"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nobelBooksAtom, isLoadingNobelBooksAtom, errorNobelBooksAtom, fetchNobelBooksAtom } from "@/atoms/nobel-books-atom";

export default function LibraryPage() {
  const router = useRouter();
  const [nobelBooks] = useAtom(nobelBooksAtom);
  const [isLoading] = useAtom(isLoadingNobelBooksAtom);
  const [error] = useAtom(errorNobelBooksAtom);
  const [, fetchNobelBooks] = useAtom(fetchNobelBooksAtom);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    fetchNobelBooks();
  }, [fetchNobelBooks]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.name.endsWith(".epub")) {
      alert("Lütfen geçerli bir EPUB dosyası seçin.");
      return;
    }

    setIsImporting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/books/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Kitap yüklenirken bir hata oluştu.");
      }

      const data = await response.json();
      const bookId = data.id;

      // Redirect to the reader with the uploaded book
      router.push(`/reader/${bookId}`);
    } catch (error) {
      console.error("Error importing book:", error);
      alert("Kitap içe aktarılırken bir hata oluştu.");
      setIsImporting(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📚 Kütüphane</h1>

      <div className="mb-6 flex gap-4 flex-wrap items-center">
        <Button onClick={handleImportClick} disabled={isImporting} className="gap-2">
          <Upload className="w-4 h-4" />
          {isImporting ? "Kitap İçe Aktarılıyor..." : "Kitap İçe Aktar"}
        </Button>
        <input ref={fileInputRef} type="file" accept=".epub" onChange={handleFileChange} className="hidden" />

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
