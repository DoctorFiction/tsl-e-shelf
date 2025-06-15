import BookSearchAutocomplete from "@/components/book-search-autocomplete";
import RecentlyVisitedBooks from "@/components/recently-visited-books";

export default function Home() {
  return (
    <div className="text-center pt-12">
      <h1 className="text-3xl capitalize font-bold mb-4">E-shelf</h1>
      <p className="text-[16px] mb-8">
        {/* TODO: Update the home page */}
        This is the root home page... Add recent books, search, etc...
      </p>
      <div className="max-w-7xl mx-auto mb-10">
        {/* Book Search Autocomplete Component */}
        <BookSearchAutocomplete />
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Recently Visited Books Component */}
        <RecentlyVisitedBooks />
      </div>
    </div>
  );
}
