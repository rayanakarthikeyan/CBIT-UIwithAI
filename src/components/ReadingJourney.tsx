
import { useLibrary } from '@/context/LibraryContext';
import { Book } from 'lucide-react';

const ReadingJourney = () => {
  const { readBooks } = useLibrary();
  
  // Sort read books by date
  const sortedBooks = [...readBooks].sort((a, b) => {
    if (!a.dateRead || !b.dateRead) return 0;
    return new Date(b.dateRead).getTime() - new Date(a.dateRead).getTime();
  });

  return (
    <section className="py-10 bg-library-cream/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="chapter-heading mb-8">Your Reading Journey</h2>
        
        {sortedBooks.length === 0 ? (
          <div className="text-center py-12 bg-library-paper/50 rounded-lg border border-library-wood/10 shadow-inner">
            <Book className="h-12 w-12 text-library-wood/30 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-medium text-library-wood">Your reading journey is about to begin</h3>
            <p className="text-gray-600 mt-2">Mark some books as read to see them appear here</p>
          </div>
        ) : (
          <div className="relative pl-6 md:pl-8 ml-4">
            {/* Timeline line */}
            <div className="timeline-line" />
            
            <div className="space-y-8">
              {sortedBooks.map((book) => (
                <div key={book.id} className="relative animate-fade-in">
                  {/* Timeline dot */}
                  <div className="timeline-dot" />
                  
                  <div className="card-library ml-6 md:ml-8 p-4 hover:translate-y-[-2px] transition-transform duration-300">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-24 flex-shrink-0">
                        <img 
                          src={book.coverImage} 
                          alt={book.title}
                          className="w-full h-32 md:h-36 object-cover rounded-md shadow-md"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                          <div>
                            <h3 className="font-serif font-bold text-library-wood">{book.title}</h3>
                            <p className="text-sm text-gray-600">{book.author}</p>
                          </div>
                          
                          <div className="text-sm text-library-wood/70">
                            {book.dateRead && (
                              <time dateTime={book.dateRead}>
                                {new Date(book.dateRead).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </time>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {book.genre.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs px-2 py-0.5 bg-library-wood/10 text-library-wood rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <p className="text-sm line-clamp-2 text-gray-700">
                            {book.notes || book.synopsis.substring(0, 120) + '...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReadingJourney;
