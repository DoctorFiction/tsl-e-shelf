"use client";
import { useEpubReader } from "@/hooks/use-epub-reader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";

interface EpubReaderProps {
  url: string;
}

export default function EpubReader({ url }: EpubReaderProps) {
  const { viewerRef, goNext, goPrev, goToCfi, searchQuery, setSearchQuery, searchResults } = useEpubReader(url);

  return (
    <Card className="mt-2">
      <CardContent>
        <div className="flex gap-4 p-2 justify-center bg-gray-100 dark:bg-gray-800">
          <Button onClick={goPrev}>◀ Prev</Button>
          <Button onClick={goNext}>Next ▶</Button>
        </div>

        <div className="p-2 text-center text-sm text-gray-500">
          <Input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search in book..." />
        </div>
        <ul>
          {searchResults.length > 0 && (
            <Typography variant="body1" className="font-bold">
              {searchResults.length} results found:
            </Typography>
          )}
          {searchResults.map((result, i) => (
            <li key={i} onClick={() => goToCfi(result.cfi)}>
              <div className="flex gap-0.5">
                <Typography variant="body2">{i + 1} - </Typography>
                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: result.excerpt }} />{" "}
                <Typography variant="body2" className="font-bold">
                  ({result.chapterTitle})
                </Typography>
              </div>
            </li>
          ))}
        </ul>
        <div ref={viewerRef} className="w-full h-screen" />
      </CardContent>
    </Card>
  );
}
