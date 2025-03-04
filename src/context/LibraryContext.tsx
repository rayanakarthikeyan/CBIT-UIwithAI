
import { createContext, useContext, useState, ReactNode } from 'react';
import { Book, books as initialBooks } from '../data/books';

export interface ReadingChallenge {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentProgress: number;
  completed: boolean;
  badgeImage: string;
  badgeName: string;
}

export interface BookCategory {
  id: string;
  name: string;
  books: Book[];
}

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
  // New functions for recommendations
  getRecommendedBooks: () => Book[];
  addToReadingList: (bookId: string) => void;
  // Reading challenges
  challenges: ReadingChallenge[];
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  // Book categories
  categories: BookCategory[];
  addCategory: (name: string) => void;
  removeCategory: (id: string) => void;
  addBookToCategory: (bookId: string, categoryId: string) => void;
  removeBookFromCategory: (bookId: string, categoryId: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

// Initial reading challenges
const initialChallenges: ReadingChallenge[] = [
  {
    id: "c1",
    title: "Genre Explorer",
    description: "Read books from 5 different genres",
    targetCount: 5,
    currentProgress: 0,
    completed: false,
    badgeImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop",
    badgeName: "Genre Explorer"
  },
  {
    id: "c2",
    title: "Bookworm",
    description: "Read 10 books this month",
    targetCount: 10,
    currentProgress: 0,
    completed: false,
    badgeImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1974&auto=format&fit=crop",
    badgeName: "Bookworm"
  },
  {
    id: "c3",
    title: "Literary Adventurer",
    description: "Read a book published in each of the last 5 decades",
    targetCount: 5,
    currentProgress: 0,
    completed: false,
    badgeImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop",
    badgeName: "Literary Adventurer"
  },
];

// Initial categories
const initialCategories: BookCategory[] = [
  {
    id: "cat1",
    name: "Currently Reading",
    books: []
  },
  {
    id: "cat2",
    name: "Want to Read",
    books: []
  },
  {
    id: "cat3",
    name: "Favorites",
    books: []
  }
];

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [challenges, setChallenges] = useState<ReadingChallenge[]>(initialChallenges);
  const [categories, setCategories] = useState<BookCategory[]>(initialCategories);

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

  // Get recommendations based on user's reading history
  const getRecommendedBooks = (): Book[] => {
    if (readBooks.length === 0) {
      // If no reading history, recommend popular books
      return books.slice(0, 5);
    }
    
    // Get genres from read books
    const favoriteGenres = readBooks
      .flatMap(book => book.genre)
      .reduce((acc: Record<string, number>, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {});
    
    // Sort genres by frequency
    const sortedGenres = Object.entries(favoriteGenres)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([genre]) => genre);
    
    // Get books from favorite genres that user hasn't read yet
    const recommendations = unreadBooks.filter(book => 
      book.genre.some(genre => sortedGenres.includes(genre))
    );
    
    return recommendations.slice(0, 5);
  };

  // Add a book to reading list
  const addToReadingList = (bookId: string) => {
    const categoryId = "cat2"; // "Want to Read" category
    addBookToCategory(bookId, categoryId);
  };

  // Update challenge progress
  const updateChallengeProgress = (challengeId: string, progress: number) => {
    setChallenges(prevChallenges =>
      prevChallenges.map(challenge => {
        if (challenge.id === challengeId) {
          const updatedProgress = Math.min(challenge.targetCount, progress);
          const isCompleted = updatedProgress >= challenge.targetCount;
          
          return {
            ...challenge,
            currentProgress: updatedProgress,
            completed: isCompleted
          };
        }
        return challenge;
      })
    );
  };

  // Add a new category
  const addCategory = (name: string) => {
    const newCategory: BookCategory = {
      id: `cat${Date.now()}`,
      name,
      books: []
    };
    
    setCategories(prevCategories => [...prevCategories, newCategory]);
  };

  // Remove a category
  const removeCategory = (id: string) => {
    setCategories(prevCategories => 
      prevCategories.filter(category => category.id !== id)
    );
  };

  // Add a book to a category
  const addBookToCategory = (bookId: string, categoryId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    setCategories(prevCategories =>
      prevCategories.map(category => {
        if (category.id === categoryId) {
          // Check if book is already in the category
          if (category.books.some(b => b.id === bookId)) {
            return category;
          }
          
          return {
            ...category,
            books: [...category.books, book]
          };
        }
        return category;
      })
    );
  };

  // Remove a book from a category
  const removeBookFromCategory = (bookId: string, categoryId: string) => {
    setCategories(prevCategories =>
      prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            books: category.books.filter(book => book.id !== bookId)
          };
        }
        return category;
      })
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
        getRecommendedBooks,
        addToReadingList,
        challenges,
        updateChallengeProgress,
        categories,
        addCategory,
        removeCategory,
        addBookToCategory,
        removeBookFromCategory,
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
