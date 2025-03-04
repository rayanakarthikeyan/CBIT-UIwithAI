
import { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Search as SearchIcon, Filter } from 'lucide-react';
import BookCard from './BookCard';

const Search = () => {
  const { books, searchBooks } = useLibrary();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(books);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchResults = searchBooks(query);
    
    // Apply current filter to search results
    let filteredResults = searchResults;
    if (activeFilter !== 'all') {
      filteredResults = searchResults.filter(book => 
        book.genre.some(g => g.toLowerCase() === activeFilter.toLowerCase())
      );
    }
    
    setResults(filteredResults);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    
    // Apply filter to current results or all books if no search query
    if (query) {
      const searchResults = searchBooks(query);
      setResults(
        filter === 'all'
          ? searchResults
          : searchResults.filter(book => 
              book.genre.some(g => g.toLowerCase() === filter.toLowerCase())
            )
      );
    } else {
      setResults(
        filter === 'all'
          ? books
          : books.filter(book => 
              book.genre.some(g => g.toLowerCase() === filter.toLowerCase())
            )
      );
    }
  };

  // Extract unique genres from all books
  const allGenres = Array.from(
    new Set(books.flatMap(book => book.genre.map(g => g.toLowerCase())))
  );

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="chapter-heading mb-6">Search & Discovery</h2>
      
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books, authors, or genres..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-library-wood/20 focus:outline-none focus:ring-2 focus:ring-library-wood/30 bg-white/90"
            />
          </div>
          <button
            type="submit"
            className="btn-library flex items-center gap-2"
          >
            <SearchIcon className="h-4 w-4" />
            <span>Search</span>
          </button>
        </form>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex items-center">
        <Filter className="h-5 w-5 text-library-wood mr-2" />
        <div className="flex flex-wrap gap-2">
          <FilterButton 
            label="All" 
            isActive={activeFilter === 'all'} 
            onClick={() => handleFilterChange('all')} 
          />
          {allGenres.slice(0, 6).map(genre => (
            <FilterButton
              key={genre}
              label={genre.charAt(0).toUpperCase() + genre.slice(1)}
              isActive={activeFilter === genre}
              onClick={() => handleFilterChange(genre)}
            />
          ))}
        </div>
      </div>
      
      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {results.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-library-wood text-lg">No books found matching your search</p>
          </div>
        ) : (
          results.map(book => (
            <BookCard key={book.id} book={book} variant="grid" />
          ))
        )}
      </div>
    </section>
  );
};

const FilterButton = ({ 
  label, 
  isActive, 
  onClick 
}: { 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-library-wood text-white' 
        : 'bg-library-wood/10 text-library-wood hover:bg-library-wood/20'
    }`}
  >
    {label}
  </button>
);

export default Search;
