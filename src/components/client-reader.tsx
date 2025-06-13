"use client";

import { useEffect, useState } from "react";

interface IClientReader {
  bookUrl: string;
  availableFormats: AvailableFormat[];
}

type AvailableFormat = {
  format: string;
  url: string;
};

export default function ClientReader({
  bookUrl,
  availableFormats,
}: IClientReader) {
  console.log("ClientReader rendered");
  const [content, setContent] = useState<string | null>(null);
  const [currentFormat, setCurrentFormat] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [url, setUrl] = useState<string>(bookUrl);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/book?url=${encodeURIComponent(url)}`);
        const text = await res.text();
        setContent(text);
      } catch (err) {
        console.error("Failed to fetch book content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [url]);

  return (
    <div>
      <div className="flex gap-1 pt-1">
        {availableFormats.map(({ format, url: formatUrl }) => (
          <button
            key={formatUrl}
            className={`px-4 py-2 rounded font-bold ${
              url === formatUrl
                ? "bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-700 text-white"
            }`}
            onClick={() => {
              setUrl(formatUrl);
              setCurrentFormat(format);
            }}
          >
            {format}
          </button>
        ))}
      </div>
      {!loading ? (
        <div className="prose max-w-none p-4 h-screen overflow-y-scroll bg-white">
          {currentFormat?.startsWith("text/plain") && content ? (
            content.split("\n").map((line, i) => <p key={i}>{line}</p>)
          ) : currentFormat?.startsWith("text/html") && content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : currentFormat?.includes("epub") ? (
            <p>This format (.epub) is not supported yet in the demo.</p> // TODO epub support
          ) : (
            <p>Format not supported for reading.</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
