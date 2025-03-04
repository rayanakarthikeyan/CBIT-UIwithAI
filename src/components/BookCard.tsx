
import { useState } from 'react';
import { Book } from '@/data/books';
import { Heart, BookOpen, Clock, Award, X } from 'lucide-react';
import { useLibrary } from '@/context/LibraryContext';

interface BookCardProps {
  book: Book;
  variant?: 'shelf' | 'grid';
}

const BookCard = ({ book, variant = 'shelf' }: BookCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { markAsRead, addNote } = useLibrary();
  const [note, setNote] = useState(book.notes || '');

  const handleSaveNote = () => {
    addNote(book.id, note);
  };

  if (variant === 'shelf') {
    return (
      <>
        <div 
          className="book-spine cursor-pointer group relative"
          onClick={() => setIsDetailsOpen(true)}
          style={{
            backgroundColor: getRandomColor(book.id),
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center px-2 transform -rotate-90 origin-center">
            <h3 className="font-serif font-bold text-white text-shadow-sm truncate w-full text-center">
              {book.title}
            </h3>
          </div>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
            <div className="h-[2px] w-1/3 bg-white/30"></div>
          </div>
          
          {/* Hover preview */}
          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -top-40 left-1/2 -translate-x-1/2 w-48 p-2 bg-library-paper rounded-md shadow-book z-20">
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="w-full h-40 object-cover rounded-sm mb-2"
            />
            <h4 className="font-serif font-bold text-sm">{book.title}</h4>
            <p className="text-xs text-gray-600">{book.author}</p>
          </div>
        </div>

        {/* Book details overlay */}
        {isDetailsOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsDetailsOpen(false)}>
            <div 
              className="bg-library-paper max-w-2xl w-full rounded-lg shadow-2xl overflow-hidden animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                className="absolute top-4 right-4 p-1.5 rounded-full bg-library-paper text-library-wood hover:bg-library-wood/10 transition-colors"
                onClick={() => setIsDetailsOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-library-wood mb-2">{book.title}</h2>
                    <p className="text-sm text-gray-600 mb-4">by {book.author} • {book.published}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {book.genre.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-library-wood/10 text-library-wood rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-sm mb-4">{book.synopsis}</p>
                    
                    <div className="flex space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{book.pages} pages</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        <span>{book.rating} rating</span>
                      </div>
                      {book.isRead && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Read on {new Date(book.dateRead || '').toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    {!book.isRead && (
                      <button 
                        className="w-full btn-library"
                        onClick={() => {
                          markAsRead(book.id);
                          setIsDetailsOpen(false);
                        }}
                      >
                        Mark as Read
                      </button>
                    )}
                    <button 
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md border border-library-wood text-library-wood hover:bg-library-wood/5 transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                      <span>Add to Favorites</span>
                    </button>
                  </div>
                </div>
                
                <div className="bg-library-wood/5 p-6">
                  <div className="mb-4">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-full h-60 object-cover rounded-md shadow-md mx-auto"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-serif font-bold mb-2">My Notes</h3>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add your notes about this book..."
                      className="w-full p-3 rounded-md border border-library-wood/20 bg-white/80 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-library-wood/30"
                    />
                    <button
                      onClick={handleSaveNote}
                      className="mt-2 px-4 py-2 bg-library-wood/90 text-white rounded-md text-sm hover:bg-library-wood transition-colors"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Grid variant
  return (
    <div 
      className="card-library overflow-hidden cursor-pointer" 
      onClick={() => setIsDetailsOpen(true)}
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img 
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-3">
        <h3 className="font-serif font-bold text-library-wood line-clamp-1">{book.title}</h3>
        <p className="text-xs text-gray-600">{book.author}</p>
      </div>
    </div>
  );
};

// Helper function to generate deterministic colors based on book ID
function getRandomColor(id: string): string {
  const colors = [
    '#8C3130', // Deep red
    '#345E8F', // Deep blue
    '#2D5542', // Deep green
    '#8E5D41', // Brown
    '#5D4777', // Purple
    '#2A6B75', // Teal
    '#6B4226', // Dark brown
    '#603813', // Mahogany
    '#264E36', // Forest green
    '#5B3256', // Plum
  ];
  
  // Use the book id to deterministically select a color
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

export default BookCard;
