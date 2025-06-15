"use client";
import { useEffect, useState, useRef } from "react";
import { getBooks } from "@/lib/books";
import { useRouter } from "next/navigation";

interface IBook {
  id: number | string;
  title: string;
  authors: { name: string }[];
}

export default function BookSearchAutocomplete() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filtered, setFiltered] = useState<IBook[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  function handleSelect(book: IBook) {
    setShowDropdown(false);
    setQuery("");
    if (book.id) router.push(`/reader/${book.id}`);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (query.length === 0) {
      setFiltered([]);
      setShowDropdown(false);
      return;
    }
    const lower = query.toLowerCase();
    const results = books.filter((book) => book.title.toLowerCase().includes(lower) || book.authors.some((a) => a.name.toLowerCase().includes(lower)));
    setFiltered(results.slice(0, 8));
    setShowDropdown(results.length > 0);
  }, [query, books]);

  useEffect(() => {
    setLoading(true);
    getBooks().then((data) => {
      setBooks(data.results);
      setLoading(false);
    });
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Yazar veya kitap ara..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:text-gray-400"
          onFocus={() => query && setShowDropdown(filtered.length > 0)}
          autoComplete="off"
          disabled={loading}
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </span>
        )}
      </div>
      {showDropdown && !loading && (
        <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-72 overflow-auto">
          {filtered.length === 0 ? (
            <li className="px-4 py-2 text-center text-gray-500">No books found.</li>
          ) : (
            filtered.map((book) => (
              <li key={book.id} className="px-4 py-2 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => handleSelect(book)}>
                <span className="font-medium">{book.title}</span>
                <span className="text-gray-500 ml-2 text-sm">{book.authors[0]?.name}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
