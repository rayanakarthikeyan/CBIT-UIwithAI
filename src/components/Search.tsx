
import { useState, useEffect } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Search as SearchIcon, Filter, BookOpen, SlidersHorizontal, X } from 'lucide-react';
import BookCard from './BookCard';

const Search = () => {
  const { books, searchBooks } = useLibrary();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(books);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [authorFilter, setAuthorFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  // Extract unique genres from all books
  const allGenres = Array.from(
    new Set(books.flatMap(book => book.genre.map(g => g.toLowerCase())))
  );

  // Extract unique authors from all books
  const allAuthors = Array.from(
    new Set(books.map(book => book.author))
  ).sort();

  useEffect(() => {
    // Apply filters whenever they change
    applyFilters();
  }, [query, activeFilter, authorFilter, yearFilter, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    // First get search results
    let filteredResults = query ? searchBooks(query) : books;
    
    // Apply genre filter
    if (activeFilter !== 'all') {
      filteredResults = filteredResults.filter(book => 
        book.genre.some(g => g.toLowerCase() === activeFilter.toLowerCase())
      );
    }
    
    // Apply author filter
    if (authorFilter) {
      filteredResults = filteredResults.filter(book => 
        book.author.toLowerCase().includes(authorFilter.toLowerCase())
      );
    }
    
    // Apply year filter
    if (yearFilter) {
      filteredResults = filteredResults.filter(book => 
        book.publishedDate && book.publishedDate.includes(yearFilter)
      );
    }
    
    // Apply sorting
    filteredResults = sortResults(filteredResults, sortBy);
    
    setResults(filteredResults);
  };

  const sortResults = (books: any[], sortType: string) => {
    switch (sortType) {
      case 'title-asc':
        return [...books].sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return [...books].sort((a, b) => b.title.localeCompare(a.title));
      case 'author':
        return [...books].sort((a, b) => a.author.localeCompare(b.author));
      case 'newest':
        return [...books].sort((a, b) => {
          if (!a.publishedDate) return 1;
          if (!b.publishedDate) return -1;
          return b.publishedDate.localeCompare(a.publishedDate);
        });
      case 'oldest':
        return [...books].sort((a, b) => {
          if (!a.publishedDate) return 1;
          if (!b.publishedDate) return -1;
          return a.publishedDate.localeCompare(b.publishedDate);
        });
      default:
        return books; // relevance (original order)
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const clearFilters = () => {
    setActiveFilter('all');
    setAuthorFilter('');
    setYearFilter('');
    setSortBy('relevance');
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

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
          <button
            type="button"
            onClick={toggleAdvancedFilters}
            className="bg-library-wood/10 hover:bg-library-wood/20 text-library-wood py-3 px-4 rounded-lg transition-colors"
            aria-label="Advanced filters"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </form>
      </div>
      
      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mb-6 p-4 bg-white/90 rounded-lg shadow-sm border border-library-wood/10 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Advanced Filters</h3>
            <button 
              onClick={clearFilters}
              className="text-sm text-library-wood hover:text-library-accent flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="author-filter" className="block text-sm font-medium mb-1">
                Author
              </label>
              <select
                id="author-filter"
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                className="w-full p-2 border border-library-wood/20 rounded-md bg-white"
              >
                <option value="">Any author</option>
                {allAuthors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="year-filter" className="block text-sm font-medium mb-1">
                Publication Year
              </label>
              <input
                id="year-filter"
                type="text"
                placeholder="e.g. 2010"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full p-2 border border-library-wood/20 rounded-md bg-white"
              />
            </div>
            
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium mb-1">
                Sort by
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-library-wood/20 rounded-md bg-white"
              >
                <option value="relevance">Relevance</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="author">Author</option>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
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
      
      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {results.length === 0 
            ? 'No results found' 
            : `Showing ${results.length} ${results.length === 1 ? 'book' : 'books'}`}
        </p>
        {(activeFilter !== 'all' || authorFilter || yearFilter) && (
          <button 
            onClick={clearFilters}
            className="text-sm text-library-wood hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
      
      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {results.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <BookOpen className="h-16 w-16 text-library-wood/20 mx-auto mb-4" />
            <p className="text-library-wood text-lg">No books found matching your search</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
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
