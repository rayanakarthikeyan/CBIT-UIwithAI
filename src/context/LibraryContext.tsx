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

export interface ReadingMood {
  id: string;
  name: string;
  emoji: string;
  color: string; 
  description: string;
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
  getRecommendedBooks: () => Book[];
  addToReadingList: (bookId: string) => void;
  challenges: ReadingChallenge[];
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  categories: BookCategory[];
  addCategory: (name: string) => void;
  removeCategory: (id: string) => void;
  addBookToCategory: (bookId: string, categoryId: string) => void;
  removeBookFromCategory: (bookId: string, categoryId: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  audioProgress: Record<string, number>;
  updateAudioProgress: (bookId: string, progress: number) => void;
  audioBookmarks: Record<string, { position: number, note?: string }[]>;
  addAudioBookmark: (bookId: string, position: number, note?: string) => void;
  readingSpeed: number;
  setReadingSpeed: (speed: number) => void;
  favoriteQuotes: { text: string, author: string, source: string }[];
  addFavoriteQuote: (quote: { text: string, author: string, source: string }) => void;
  removeFavoriteQuote: (quoteText: string) => void;
  availableMoods: ReadingMood[];
  selectedMood: ReadingMood | null;
  setSelectedMood: (mood: ReadingMood | null) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

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

const initialMoods: ReadingMood[] = [
  {
    id: "mood1",
    name: "Relaxed",
    emoji: "😌",
    color: "#4CAF50",
    description: "In the mood for something light and easy-going"
  },
  {
    id: "mood2",
    name: "Adventurous",
    emoji: "🚀",
    color: "#FF9800",
    description: "Ready for an exciting journey or thrilling story"
  },
  {
    id: "mood3",
    name: "Melancholic",
    emoji: "😢",
    color: "#2196F3",
    description: "Something thoughtful and emotional"
  },
  {
    id: "mood4",
    name: "Curious",
    emoji: "🧠",
    color: "#9C27B0",
    description: "Looking to learn something new"
  },
  {
    id: "mood5",
    name: "Romantic",
    emoji: "❤️",
    color: "#E91E63",
    description: "In the mood for love and relationships"
  },
  {
    id: "mood6",
    name: "Inspired",
    emoji: "✨",
    color: "#00BCD4",
    description: "Looking for motivation and inspiration"
  }
];

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [challenges, setChallenges] = useState<ReadingChallenge[]>(initialChallenges);
  const [categories, setCategories] = useState<BookCategory[]>(initialCategories);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [audioProgress, setAudioProgress] = useState<Record<string, number>>({});
  const [audioBookmarks, setAudioBookmarks] = useState<Record<string, { position: number, note?: string }[]>>({});
  const [readingSpeed, setReadingSpeed] = useState(250);
  const [favoriteQuotes, setFavoriteQuotes] = useState<{ text: string, author: string, source: string }[]>([]);
  const [availableMoods] = useState<ReadingMood[]>(initialMoods);
  const [selectedMood, setSelectedMood] = useState<ReadingMood | null>(null);

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

  const getRecommendedBooks = (): Book[] => {
    if (readBooks.length === 0) {
      return books.slice(0, 5);
    }
    
    const favoriteGenres = readBooks
      .flatMap(book => book.genre)
      .reduce((acc: Record<string, number>, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {});
    
    const sortedGenres = Object.entries(favoriteGenres)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([genre]) => genre);
    
    const recommendations = unreadBooks.filter(book => 
      book.genre.some(genre => sortedGenres.includes(genre))
    );
    
    return recommendations.slice(0, 5);
  };

  const addToReadingList = (bookId: string) => {
    const categoryId = "cat2";
    addBookToCategory(bookId, categoryId);
  };

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

  const addCategory = (name: string) => {
    const newCategory: BookCategory = {
      id: `cat${Date.now()}`,
      name,
      books: []
    };
    
    setCategories(prevCategories => [...prevCategories, newCategory]);
  };

  const removeCategory = (id: string) => {
    setCategories(prevCategories => 
      prevCategories.filter(category => category.id !== id)
    );
  };

  const addBookToCategory = (bookId: string, categoryId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    setCategories(prevCategories =>
      prevCategories.map(category => {
        if (category.id === categoryId) {
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

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const updateAudioProgress = (bookId: string, progress: number) => {
    setAudioProgress(prev => ({
      ...prev,
      [bookId]: progress
    }));
  };

  const addAudioBookmark = (bookId: string, position: number, note?: string) => {
    setAudioBookmarks(prev => {
      const bookBookmarks = prev[bookId] || [];
      return {
        ...prev,
        [bookId]: [...bookBookmarks, { position, note }]
      };
    });
  };

  const addFavoriteQuote = (quote: { text: string, author: string, source: string }) => {
    setFavoriteQuotes(prev => [...prev, quote]);
  };

  const removeFavoriteQuote = (quoteText: string) => {
    setFavoriteQuotes(prev => prev.filter(quote => quote.text !== quoteText));
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
        isDarkMode,
        toggleDarkMode,
        audioProgress,
        updateAudioProgress,
        audioBookmarks,
        addAudioBookmark,
        readingSpeed,
        setReadingSpeed,
        favoriteQuotes,
        addFavoriteQuote,
        removeFavoriteQuote,
        availableMoods,
        selectedMood,
        setSelectedMood,
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
