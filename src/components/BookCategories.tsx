
import { useState, useRef, useEffect } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Folder, Plus, X, Trash2, GripHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const BookCategories = () => {
  const { books, categories, addCategory, removeCategory, addBookToCategory, removeBookFromCategory } = useLibrary();
  const { toast } = useToast();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [draggedBook, setDraggedBook] = useState<string | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
  const dragSourceRef = useRef<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Add a cleanup effect for drag state
  useEffect(() => {
    const handleDragEnd = () => {
      setIsDragging(false);
      setDraggedBook(null);
      setDragOverCategory(null);
    };

    document.addEventListener('dragend', handleDragEnd);
    return () => document.removeEventListener('dragend', handleDragEnd);
  }, []);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      toast({
        title: "Category Created",
        description: `"${newCategoryName}" category has been created.`,
      });
    }
  };

  const handleRemoveCategory = (id: string, name: string) => {
    removeCategory(id);
    toast({
      title: "Category Removed",
      description: `"${name}" category has been removed.`,
    });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, bookId: string, sourceCategory?: string) => {
    // Set data in two formats for better cross-browser compatibility
    e.dataTransfer.setData('text/plain', bookId);
    e.dataTransfer.setData('application/json', JSON.stringify({ bookId, sourceCategory }));
    
    // Set drag image if possible
    const book = books.find(b => b.id === bookId);
    if (book && e.target instanceof HTMLElement) {
      const img = new Image();
      img.src = book.coverImage;
      // Wait a moment for the image to load
      setTimeout(() => {
        try {
          e.dataTransfer.setDragImage(img, 20, 20);
        } catch (err) {
          console.log('Unable to set custom drag image:', err);
        }
      }, 10);
    }
    
    setDraggedBook(bookId);
    dragSourceRef.current = sourceCategory || null;
    setIsDragging(true);
    
    // Set better cursor style
    if (e.dataTransfer.setDragImage) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, categoryId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCategory(categoryId);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only reset if not dragging over a child element
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverCategory(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, categoryId: string) => {
    e.preventDefault();
    
    // Try to get data in JSON format first, fallback to text
    let bookId: string;
    let sourceCategory: string | null = null;
    
    try {
      const jsonData = e.dataTransfer.getData('application/json');
      if (jsonData) {
        const parsed = JSON.parse(jsonData);
        bookId = parsed.bookId;
        sourceCategory = parsed.sourceCategory;
      } else {
        bookId = e.dataTransfer.getData('text/plain');
      }
    } catch (error) {
      // Fallback to plain text if JSON parsing fails
      bookId = e.dataTransfer.getData('text/plain');
    }
    
    if (!bookId) {
      console.error('No book ID found in drag data');
      return;
    }
    
    // Don't do anything if dropping into the same category
    if (sourceCategory === categoryId) {
      setDraggedBook(null);
      setDragOverCategory(null);
      setIsDragging(false);
      return;
    }
    
    // Use the sourceCategory from the data if available, otherwise use the ref
    const actualSourceCategory = sourceCategory || dragSourceRef.current;
    
    if (actualSourceCategory) {
      // If coming from another category, remove from there first
      removeBookFromCategory(bookId, actualSourceCategory);
    }
    
    addBookToCategory(bookId, categoryId);
    
    // Reset drag state
    setDraggedBook(null);
    setDragOverCategory(null);
    dragSourceRef.current = null;
    setIsDragging(false);
    
    const book = books.find(b => b.id === bookId);
    const category = categories.find(c => c.id === categoryId);
    
    toast({
      title: "Book Moved",
      description: book && category 
        ? `"${book.title}" has been moved to "${category.name}".`
        : "Book has been moved to the new category.",
      duration: 3000,
    });
  };

  const handleRemoveBookFromCategory = (bookId: string, categoryId: string) => {
    const book = books.find(b => b.id === bookId);
    const category = categories.find(c => c.id === categoryId);
    
    removeBookFromCategory(bookId, categoryId);
    
    toast({
      title: "Book Removed",
      description: book && category 
        ? `"${book.title}" has been removed from "${category.name}".`
        : "Book has been removed from the category.",
      duration: 3000,
    });
  };

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="chapter-heading mb-8">My Book Collections</h2>
        
        {/* Create new category */}
        <div className="mb-8 p-6 bg-library-paper shadow-md rounded-lg">
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Create a new collection..."
              className="flex-grow px-4 py-2 border border-library-wood/20 rounded-md focus:outline-none focus:ring-2 focus:ring-library-wood/30"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-library-wood text-white rounded-md hover:bg-library-wood/90 transition-colors"
              disabled={!newCategoryName.trim()}
            >
              <Plus className="h-4 w-4" />
              <span>Create</span>
            </button>
          </form>
        </div>
        
        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id}
              className={cn(
                "card-library transition-all duration-200", 
                dragOverCategory === category.id 
                  ? "border-library-wood border-2 shadow-lg scale-105 bg-library-wood/5" 
                  : "",
                isDragging ? "drop-target-active" : ""
              )}
              onDragOver={(e) => handleDragOver(e, category.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, category.id)}
            >
              <div className="p-5">
                {/* Category header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Folder className="h-5 w-5 text-library-wood mr-2" />
                    <h3 className="font-serif font-bold text-lg text-library-wood">
                      {category.name}
                    </h3>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveCategory(category.id, category.name)}
                    className="p-1.5 text-library-wood/60 hover:text-library-wood/90 hover:bg-library-wood/10 rounded-full"
                    aria-label={`Remove ${category.name} category`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Books in category */}
                <div className="space-y-2 min-h-[8rem]">
                  {category.books.length === 0 ? (
                    <div className={cn(
                      "flex flex-col items-center justify-center h-32 border border-dashed rounded-md p-4 text-center",
                      dragOverCategory === category.id 
                        ? "border-library-wood border-2 bg-library-wood/10 text-library-wood" 
                        : "border-library-wood/30 text-library-wood/50"
                    )}>
                      <p>Drag books here to add to this collection</p>
                    </div>
                  ) : (
                    category.books.map((book) => (
                      <div 
                        key={book.id}
                        className={cn(
                          "flex items-center p-2 bg-white rounded-md shadow-sm border transition-all",
                          draggedBook === book.id 
                            ? "opacity-50 border-dashed" 
                            : "border-library-wood/10 hover:shadow-md"
                        )}
                        draggable
                        onDragStart={(e) => handleDragStart(e, book.id, category.id)}
                        aria-label={`Drag ${book.title} by ${book.author}`}
                      >
                        <GripHorizontal className="h-4 w-4 text-library-wood/40 cursor-move mr-2" />
                        
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="h-10 w-8 bg-library-wood/10 rounded overflow-hidden mr-2 flex-shrink-0">
                            <img 
                              src={book.coverImage}
                              alt={book.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="truncate">
                            <p className="font-medium text-sm truncate">{book.title}</p>
                            <p className="text-xs text-gray-500 truncate">{book.author}</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveBookFromCategory(book.id, category.id)}
                          className="ml-2 p-1 text-library-wood/60 hover:text-library-wood/90 rounded-full"
                          aria-label={`Remove ${book.title} from ${category.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Available books section */}
        <div className="mt-10">
          <h3 className="font-serif font-bold text-xl text-library-wood mb-4">
            Your Library
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Drag these books to add them to your collections
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {books.map((book) => (
              <div
                key={book.id}
                className={cn(
                  "card-library transition-all duration-200", 
                  draggedBook === book.id 
                    ? "opacity-50 scale-95 cursor-grabbing" 
                    : "cursor-grab hover:shadow-md hover:-translate-y-1"
                )}
                draggable
                onDragStart={(e) => handleDragStart(e, book.id)}
                aria-label={`Drag ${book.title} by ${book.author}`}
              >
                <div className="aspect-[2/3] overflow-hidden">
                  <img 
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <h4 className="font-medium text-sm line-clamp-1">{book.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Drag instruction tooltip that appears during drag */}
      {isDragging && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-library-wood text-white px-4 py-2 rounded-full shadow-lg animate-fade-in z-50">
          Drag to a collection to add
        </div>
      )}
    </section>
  );
};

export default BookCategories;
