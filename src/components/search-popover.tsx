import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Typography } from "@/components/ui/typography";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRef } from "react";

// FIX: fix the next/prev section layout, when has more search results than 100
// FIX: lags a bit when too many results. add enter on search, debouncelags a bit when too many results.

interface SearchPopoverProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: { cfi: string; excerpt: string; chapterTitle: string }[];
  goToCfi: (cfi: string) => void;
  currentSearchResultIndex: number;
  goToSearchResult: (index: number) => void;
}

export function SearchPopover({ searchQuery, setSearchQuery, searchResults, goToCfi, currentSearchResultIndex, goToSearchResult }: SearchPopoverProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        goToSearchResult(currentSearchResultIndex - 1);
      } else {
        goToSearchResult(currentSearchResultIndex + 1);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
          aria-label="Search in book"
          type="button"
          onClick={() => setTimeout(() => searchInputRef.current?.focus(), 50)}
        >
          <Search className="w-4 h-4 text-black dark:text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end" side="bottom">
        <div className="flex items-center gap-2 mb-2">
          <Input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="Search in book..." className="flex-1" />
        </div>
        <div>
          {searchQuery && searchResults.length === 0 && (
            <Typography variant="body2" className="text-gray-400">
              No results found.
            </Typography>
          )}
          {searchResults.length > 0 && (
            <div className="flex items-center justify-between mb-1">
              <Typography variant="body1" className="font-bold">
                {searchResults.length} results found:
              </Typography>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => goToSearchResult(currentSearchResultIndex - 1)} disabled={currentSearchResultIndex <= 0}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Typography variant="body2">{currentSearchResultIndex !== -1 ? `${currentSearchResultIndex + 1} / ${searchResults.length}` : ""}</Typography>
                <Button variant="ghost" size="sm" onClick={() => goToSearchResult(currentSearchResultIndex + 1)} disabled={currentSearchResultIndex >= searchResults.length - 1}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          <ul className="max-h-48 overflow-y-auto">
            {searchResults.map((result, i) => {
              return (
                <Card
                  key={i}
                  className="flex flex-col px-4 py-3 cursor-pointer hover:bg-muted transition mb-2"
                  onClick={() => {
                    goToCfi(result.cfi);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <Typography variant="caption" className="font-bold">
                      {result.chapterTitle}
                    </Typography>
                  </div>
                  <Typography variant="body2" className="text-muted-foreground line-clamp-1">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: result.excerpt,
                      }}
                    />
                  </Typography>
                </Card>
              );
            })}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
