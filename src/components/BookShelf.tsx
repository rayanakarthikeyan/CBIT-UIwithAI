
import { useRef, useEffect } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import BookCard from './BookCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BookShelf = () => {
  const { books } = useLibrary();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="chapter-heading mb-6">Virtual Bookshelf</h2>
        
        <div className="relative">
          {/* Scroll buttons */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-library-paper/80 rounded-full p-2 shadow-md hover:bg-library-paper transition-colors"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-library-wood" />
          </button>
          
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-library-paper/80 rounded-full p-2 shadow-md hover:bg-library-paper transition-colors"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-library-wood" />
          </button>
          
          {/* Bookshelf */}
          <div className="overflow-hidden">
            <div className="bookshelf w-full h-6 rounded-t-md"></div>
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto py-6 px-6 bg-library-wood/20 scrollbar-none gap-1"
            >
              {books.map((book) => (
                <div key={book.id} className="flex-shrink-0 w-14 mr-1">
                  <BookCard book={book} variant="shelf" />
                </div>
              ))}
            </div>
            <div className="bookshelf w-full h-6 rounded-b-md shadow-md"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookShelf;
