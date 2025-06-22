"use client";
import { useEpubReader } from "@/hooks/use-epub-reader";

interface EpubReaderProps {
  url: string;
}

export default function EpubReader({ url }: EpubReaderProps) {
  const {
    viewerRef,
    goNext,
    goPrev,
    goToCfi,
    searchQuery,
    setSearchQuery,
    searchResults,
  } = useEpubReader(url);

  return (
    <div>
      <div className="flex gap-4 p-2 justify-center bg-gray-100 dark:bg-gray-800">
        <button onClick={goPrev} className="px-4 py-2 bg-blue-500  rounded">
          ◀ Prev
        </button>
        <button onClick={goNext} className="px-4 py-2 bg-blue-500  rounded">
          Next ▶
        </button>
      </div>

      <div className="p-2 text-center text-sm text-gray-500">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search in book..."
        />
      </div>
      <ul>
        {searchResults.length > 0 && (
          <p className="font-bold">{searchResults.length} results found:</p>
        )}
        {searchResults.map((result, i) => (
          <li key={i} onClick={() => goToCfi(result.cfi)}>
            <div className="flex gap-0.5">
              <p>{i + 1} - </p>
              <p dangerouslySetInnerHTML={{ __html: result.excerpt }} />{" "}
              <p className="font-bold">({result.chapterTitle})</p>
            </div>
          </li>
        ))}
      </ul>
      <div ref={viewerRef} className="w-full h-screen" />
    </div>
  );
}
