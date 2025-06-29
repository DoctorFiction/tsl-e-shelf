"use client";
import EpubReader from "./epub-reader";

interface IClientReader {
  bookUrl: string;
}

export default function ClientReader({ bookUrl }: IClientReader) {
  return (
    <div>
      <div className="prose max-w-none p-4 h-screen overflow-y-scroll bg-white">
        <EpubReader url={bookUrl} />
      </div>
    </div>
  );
}
