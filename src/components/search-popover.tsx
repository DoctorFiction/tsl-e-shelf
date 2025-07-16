import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Typography } from "@/components/ui/typography";
import { Search, X } from "lucide-react";
import { useRef } from "react";

interface SearchPopoverProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: { cfi: string; excerpt: string; chapterTitle: string }[];
  goToCfi: (cfi: string) => void;
  currentSearchResultIndex: number;
  goToSearchResult: (index: number) => void;
  searchBook: (query: string) => Promise<void>;
  isSearching: boolean;
}

export function SearchPopover({ searchQuery, setSearchQuery, searchResults, goToCfi, currentSearchResultIndex, goToSearchResult, searchBook, isSearching }: SearchPopoverProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (searchResults.length > 0) {
        // If there are search results, navigate them.
        if (e.shiftKey) {
          goToSearchResult(currentSearchResultIndex - 1);
        } else {
          goToSearchResult(currentSearchResultIndex + 1);
        }
      } else if (searchQuery.trim() !== "") {
        // If no results yet, but there's a query, initiate a new search immediately.
        // This will also trigger if isSearching is true, effectively restarting/confirming the search.
        searchBook(searchQuery);
      }
      // If searchQuery is empty and searchResults.length is 0, do nothing on Enter.
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
          aria-label="Kitapta Ara"
          type="button"
          onClick={() => setTimeout(() => searchInputRef.current?.focus(), 50)}
        >
          <Search className="w-4 h-4 text-black dark:text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end" side="bottom">
        <div className="flex items-center gap-2 mb-2">
          <Input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value === "") {
                searchBook("");
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Kitapta ara..."
            className="flex-1"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                searchBook("");
              }}
              className="h-auto p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div>
          {isSearching && searchQuery.length > 0 && (
            <div className="flex flex-row gap-2 items-center">
              <Typography variant="body2" className="text-gray-400">
                Aranıyor...
              </Typography>
              <div className="h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!isSearching && searchQuery && searchResults.length === 0 && (
            <Typography variant="body2" className="text-gray-400">
              Sonuç bulunamadı.
            </Typography>
          )}
          {!searchQuery && (
            <Typography variant="body2" className="text-gray-400">
              Kitapta aramak için yazın.
            </Typography>
          )}
          {searchResults.length > 0 && (
            <div className="flex items-center justify-between mb-1">
              <Typography variant="body1" className="font-bold">
                {searchResults.length} sonuç bulundu:
              </Typography>
              <div className="flex items-center gap-2">
                <Typography variant="body2">{currentSearchResultIndex !== -1 ? `${currentSearchResultIndex + 1} / ${searchResults.length}` : ""}</Typography>
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
