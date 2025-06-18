"use client";
import { useEpubReader } from "@/hooks/use-epub-reader";

interface EpubReaderProps {
  url: string;
}

export default function EpubReader({ url }: EpubReaderProps) {
  const {
    viewerRef,
    location,
    goNext,
    goPrev,
    goToHref,
    searchQuery,
    setSearchQuery,
    searchResults,
  } = useEpubReader(url);

  return (
    <div>
      <div className="p-2 text-center text-sm text-gray-500">
        Current location: {location}
      </div>
      <div className="flex gap-4 p-2 justify-center bg-gray-100">
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
        {searchResults.map((result, i) => (
          <li key={i} onClick={() => goToHref(result.href)}>
            <p dangerouslySetInnerHTML={{ __html: result.excerpt }} />
          </li>
        ))}
      </ul>
      <div ref={viewerRef} className="w-full h-screen bg-white" />
    </div>
  );
}
