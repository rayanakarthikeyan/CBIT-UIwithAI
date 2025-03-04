
import { createContext, useContext, useState, ReactNode } from 'react';
import { Book, books as initialBooks } from '../data/books';

interface LibraryContextType {
  books: Book[];
  readBooks: Book[];
  unreadBooks: Book[];
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  addBook: (book: Book) => void;
  markAsRead: (id: string, date?: string) => void;
  searchBooks: (query: string) => Book[];
  addNote: (id: string, note: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const readBooks = books.filter(book => book.isRead);
  const unreadBooks = books.filter(book => !book.isRead);

  const addBook = (book: Book) => {
    setBooks(prevBooks => [...prevBooks, book]);
  };

  const markAsRead = (id: string, date?: string) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === id ? { ...book, isRead: true, dateRead: date || new Date().toISOString().slice(0, 10) } : book
      )
    );
  };

  const searchBooks = (query: string): Book[] => {
    if (!query) return books;
    
    const lowerQuery = query.toLowerCase();
    return books.filter(
      book =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.genre.some(g => g.toLowerCase().includes(lowerQuery))
    );
  };

  const addNote = (id: string, note: string) => {
    setBooks(prevBooks =>
      prevBooks.map(book => (book.id === id ? { ...book, notes: note } : book))
    );
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        readBooks,
        unreadBooks,
        selectedBook,
        setSelectedBook,
        addBook,
        markAsRead,
        searchBooks,
        addNote,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
