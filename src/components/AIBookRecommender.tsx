
import { useState, useRef, useEffect } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { BookOpen, Send, X, ThumbsUp, ThumbsDown, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isRecommendation?: boolean;
  recommendedBook?: string;
}

const AIBookRecommender = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm your AI reading assistant. Tell me what kind of books you enjoy, and I'll recommend something perfect for you.",
      timestamp: new Date()
    }
  ]);
  const { books, addToReadingList } = useLibrary();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    
    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateRecommendation(userMessage.text, books);
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const generateRecommendation = (userInput: string, books: any[]): Message => {
    const input = userInput.toLowerCase();
    let recommendedBook = null;
    
    // Check for genre preferences
    const genres = [
      'fiction', 'fantasy', 'sci-fi', 'science fiction', 
      'romance', 'mystery', 'thriller', 'horror', 
      'biography', 'history', 'philosophy', 'poetry',
      'young adult', 'children'
    ];
    
    const mentionedGenres = genres.filter(genre => input.includes(genre));
    
    // Check for mood or themes
    const moods = [
      'happy', 'uplifting', 'funny', 'humorous', 'sad', 
      'emotional', 'dark', 'inspiring', 'thoughtful',
      'exciting', 'action', 'adventure', 'light', 'deep'
    ];
    
    const mentionedMoods = moods.filter(mood => input.includes(mood));
    
    // Try to find a book based on user input
    if (mentionedGenres.length > 0 || mentionedMoods.length > 0) {
      // Filter based on genres
      let filteredBooks = books;
      
      if (mentionedGenres.length > 0) {
        filteredBooks = books.filter(book => 
          book.genre.some((g: string) => 
            mentionedGenres.some(mg => g.toLowerCase().includes(mg))
          )
        );
      }
      
      // If we have mood information, prioritize books that might match
      if (mentionedMoods.length > 0 && filteredBooks.length > 1) {
        // This is a simple simulation of mood matching using synopsis text
        filteredBooks = filteredBooks.filter(book => 
          mentionedMoods.some(mood => 
            book.synopsis.toLowerCase().includes(mood)
          )
        );
        
        // If filtering by mood removed all books, revert to genre-filtered list
        if (filteredBooks.length === 0) {
          filteredBooks = books.filter(book => 
            book.genre.some((g: string) => 
              mentionedGenres.some(mg => g.toLowerCase().includes(mg))
            )
          );
        }
      }
      
      // If we have matches, pick one randomly
      if (filteredBooks.length > 0) {
        recommendedBook = filteredBooks[Math.floor(Math.random() * filteredBooks.length)];
      }
    }
    
    // If no specific recommendation found, pick a book randomly
    if (!recommendedBook && books.length > 0) {
      recommendedBook = books[Math.floor(Math.random() * books.length)];
    }
    
    // Construct response
    let responseText = '';
    
    if (mentionedGenres.length > 0) {
      responseText += `Based on your interest in ${mentionedGenres.join(', ')}, `;
    } else if (mentionedMoods.length > 0) {
      responseText += `For a ${mentionedMoods.join(', ')} reading experience, `;
    } else {
      responseText += `Based on your message, `;
    }
    
    if (recommendedBook) {
      responseText += `I recommend "${recommendedBook.title}" by ${recommendedBook.author}. `;
      responseText += `${recommendedBook.synopsis.substring(0, 120)}... `;
      responseText += `Would you like to add this to your reading list?`;
    } else {
      responseText = "I'm sorry, I couldn't find a specific recommendation based on your input. Could you tell me more about what kinds of books you enjoy?";
    }
    
    return {
      id: Date.now().toString(),
      sender: 'ai',
      text: responseText,
      timestamp: new Date(),
      isRecommendation: !!recommendedBook,
      recommendedBook: recommendedBook?.id,
    };
  };

  const handleAddToReadingList = (bookId: string) => {
    if (!bookId) return;
    
    addToReadingList(bookId);
    
    toast({
      title: "Added to Reading List",
      description: "This book has been added to your 'Want to Read' list.",
      duration: 3000,
    });
    
    // Add confirmation message
    setMessages(prev => [
      ...prev, 
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: "Great choice! I've added this book to your reading list. Is there anything else you'd like to explore?",
        timestamp: new Date(),
      }
    ]);
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChatbot}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-library-wood shadow-lg hover:bg-library-accent transition-colors duration-300"
        aria-label="Open AI book recommender"
      >
        <BookOpen className="h-6 w-6 text-white" />
      </button>
      
      {/* Chatbot Dialog */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] bg-white rounded-lg shadow-2xl border border-library-wood/10 animate-scale-in overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-library-wood to-library-accent text-white">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              <h3 className="font-serif font-bold">AI Book Recommender</h3>
            </div>
            <button
              onClick={toggleChatbot}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close recommender"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 bg-library-cream/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-library-wood text-white'
                      : 'bg-white shadow-sm text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  
                  {message.isRecommendation && message.recommendedBook && (
                    <button
                      onClick={() => handleAddToReadingList(message.recommendedBook!)}
                      className="mt-2 text-xs flex items-center gap-1 bg-library-accent/10 hover:bg-library-accent/20 text-library-accent px-2 py-1 rounded-full transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add to Reading List</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tell me what books you like..."
                className="flex-1 py-2 px-3 rounded-md border border-library-wood/20 focus:outline-none focus:ring-2 focus:ring-library-wood/30 text-sm"
              />
              <button
                type="submit"
                className="btn-library py-2"
                disabled={!inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
          
          <div className="bg-library-cream/30 p-2 flex justify-center border-t border-gray-200">
            <div className="flex items-center space-x-6">
              <button className="flex items-center text-sm text-gray-600 hover:text-library-wood">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span>Helpful</span>
              </button>
              <button className="flex items-center text-sm text-gray-600 hover:text-library-wood">
                <ThumbsDown className="h-4 w-4 mr-1" />
                <span>Not helpful</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBookRecommender;
