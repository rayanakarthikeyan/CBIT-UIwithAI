
import { useState, useRef } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Folder, Plus, X, Trash2, GripHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DragItem {
  type: 'BOOK';
  id: string;
}

const BookCategories = () => {
  const { books, categories, addCategory, removeCategory, addBookToCategory, removeBookFromCategory } = useLibrary();
  const { toast } = useToast();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [draggedBook, setDraggedBook] = useState<string | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
  const dragSourceRef = useRef<string | null>(null);

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
    e.dataTransfer.setData('text/plain', bookId);
    setDraggedBook(bookId);
    dragSourceRef.current = sourceCategory || null;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, categoryId: string) => {
    e.preventDefault();
    setDragOverCategory(categoryId);
  };

  const handleDragLeave = () => {
    setDragOverCategory(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, categoryId: string) => {
    e.preventDefault();
    const bookId = e.dataTransfer.getData('text/plain');
    
    if (dragSourceRef.current) {
      // If coming from another category, remove from there first
      removeBookFromCategory(bookId, dragSourceRef.current);
    }
    
    addBookToCategory(bookId, categoryId);
    setDraggedBook(null);
    setDragOverCategory(null);
    dragSourceRef.current = null;
    
    toast({
      title: "Book Moved",
      description: "Book has been moved to the new category.",
    });
  };

  const handleRemoveBookFromCategory = (bookId: string, categoryId: string) => {
    removeBookFromCategory(bookId, categoryId);
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
              className={`card-library ${dragOverCategory === category.id ? 'border-library-wood/50 bg-library-wood/5' : ''}`}
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
                <div className="space-y-2 min-h-32">
                  {category.books.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 border border-dashed border-library-wood/30 rounded-md p-4 text-center text-library-wood/50">
                      <p>Drag books here to add to this collection</p>
                    </div>
                  ) : (
                    category.books.map((book) => (
                      <div 
                        key={book.id}
                        className="flex items-center p-2 bg-white rounded-md shadow-sm border border-library-wood/10"
                        draggable
                        onDragStart={(e) => handleDragStart(e, book.id, category.id)}
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
                className={`card-library cursor-grab ${draggedBook === book.id ? 'opacity-50' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, book.id)}
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
    </section>
  );
};

export default BookCategories;
