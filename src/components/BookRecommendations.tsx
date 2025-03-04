
import { useState, useRef } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookRecommendations = () => {
  const { getRecommendedBooks, addToReadingList } = useLibrary();
  const { toast } = useToast();
  const recommendedBooks = getRecommendedBooks();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const nextRecommendation = () => {
    if (currentIndex < recommendedBooks.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlippedCard(null);
    }
  };

  const prevRecommendation = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlippedCard(null);
    }
  };

  const handleFlip = (bookId: string) => {
    setFlippedCard(flippedCard === bookId ? null : bookId);
  };

  const handleAddToReadingList = (bookId: string) => {
    addToReadingList(bookId);
    toast({
      title: "Added to Reading List",
      description: "The book has been added to your 'Want to Read' list",
    });
  };

  if (recommendedBooks.length === 0) {
    return null;
  }

  return (
    <section className="py-10 bg-library-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="chapter-heading mb-8">Recommended For You</h2>
        
        <div className="relative">
          {/* Navigation buttons */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-library-paper/90 rounded-full p-2 shadow-md hover:bg-library-paper transition-colors"
            onClick={prevRecommendation}
            disabled={currentIndex === 0}
            aria-label="Previous recommendation"
          >
            <ChevronLeft className={`h-6 w-6 ${currentIndex === 0 ? 'text-gray-400' : 'text-library-wood'}`} />
          </button>
          
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-library-paper/90 rounded-full p-2 shadow-md hover:bg-library-paper transition-colors"
            onClick={nextRecommendation}
            disabled={currentIndex === recommendedBooks.length - 1}
            aria-label="Next recommendation"
          >
            <ChevronRight className={`h-6 w-6 ${currentIndex === recommendedBooks.length - 1 ? 'text-gray-400' : 'text-library-wood'}`} />
          </button>
          
          {/* Recommendation carousel */}
          <div 
            ref={carouselRef}
            className="flex justify-center items-center py-8"
          >
            {recommendedBooks.map((book, index) => (
              <div 
                key={book.id}
                className={`flip-card ${index === currentIndex ? 'block' : 'hidden'}`}
                style={{ perspective: '1000px' }}
              >
                <div 
                  className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flippedCard === book.id ? 'rotate-y-180' : ''}`}
                  style={{ 
                    transformStyle: 'preserve-3d', 
                    transform: flippedCard === book.id ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* Front of card */}
                  <div 
                    className="absolute w-full h-full backface-hidden cursor-pointer"
                    style={{ backfaceVisibility: 'hidden' }}
                    onClick={() => handleFlip(book.id)}
                  >
                    <div className="bg-white shadow-book rounded-lg overflow-hidden max-w-sm mx-auto animate-float">
                      <div className="aspect-[2/3] overflow-hidden">
                        <img 
                          src={book.coverImage} 
                          alt={book.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-serif font-bold text-xl text-library-wood">{book.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">by {book.author}</p>
                        <p className="text-xs text-gray-500 mt-2">(Click to see details)</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Back of card */}
                  <div 
                    className="absolute w-full h-full backface-hidden rotate-y-180 cursor-pointer"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                    onClick={() => handleFlip(book.id)}
                  >
                    <div className="bg-library-cream shadow-book rounded-lg overflow-hidden p-6 max-w-sm mx-auto h-full flex flex-col">
                      <h3 className="font-serif font-bold text-xl text-library-wood mb-2">{book.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">by {book.author} • {book.published}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {book.genre.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-1 bg-library-wood/10 text-library-wood rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <p className="text-sm flex-grow line-clamp-4 mb-4">{book.synopsis}</p>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToReadingList(book.id);
                        }}
                        className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-library-wood text-white rounded-md hover:bg-library-wood/90 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add to Reading List</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {recommendedBooks.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-library-wood' : 'bg-library-wood/30'
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  setFlippedCard(null);
                }}
                aria-label={`Go to recommendation ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookRecommendations;
