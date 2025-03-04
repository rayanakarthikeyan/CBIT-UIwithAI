
import { useState } from 'react';
import { User, X, BookOpen, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useLibrary } from '@/context/LibraryContext';
import { books } from '@/data/books';

const LibrarianAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{
    sender: 'user' | 'librarian';
    message: string;
    timestamp: Date;
  }[]>([
    {
      sender: 'librarian',
      message: "Hello! I'm your library assistant. How can I help you discover your next great read?",
      timestamp: new Date(),
    },
  ]);
  
  const { readBooks } = useLibrary();
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to conversation
    const userMessage = {
      sender: 'user' as const,
      message: message.trim(),
      timestamp: new Date(),
    };
    
    setConversation([...conversation, userMessage]);
    setMessage('');
    
    // Simulate librarian response
    setTimeout(() => {
      const librarianResponse = {
        sender: 'librarian' as const,
        message: generateLibrarianResponse(userMessage.message, readBooks),
        timestamp: new Date(),
      };
      
      setConversation(prev => [...prev, librarianResponse]);
    }, 1000);
  };
  
  const toggleAssistant = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Librarian Assistant Button */}
      <button
        onClick={toggleAssistant}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-library-wood shadow-lg hover:bg-library-leather transition-colors duration-300"
        aria-label="Open librarian assistant"
      >
        <User className="h-6 w-6 text-white" />
      </button>
      
      {/* Assistant Dialog */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] bg-library-paper rounded-lg shadow-2xl border border-library-wood/10 animate-scale-in overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-library-wood text-white">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              <h3 className="font-serif font-bold">Librarian Assistant</h3>
            </div>
            <button
              onClick={toggleAssistant}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close assistant"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 bg-library-cream/50">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-library-wood text-white'
                      : 'bg-white border border-library-wood/10 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-3 border-t border-library-wood/10 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask for recommendations..."
                className="flex-1 py-2 px-3 rounded-md border border-library-wood/20 focus:outline-none focus:ring-2 focus:ring-library-wood/30 text-sm"
              />
              <button
                type="submit"
                className="btn-library py-2"
                disabled={!message.trim()}
              >
                Send
              </button>
            </div>
          </form>
          
          {/* Feedback buttons */}
          <div className="bg-library-cream/50 p-2 flex justify-center border-t border-library-wood/10">
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

// Helper function to generate librarian responses based on user input
function generateLibrarianResponse(userMessage: string, readBooks: typeof books): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for recommendation requests
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion') || lowerMessage.includes('what should')) {
    const genres = ['fiction', 'fantasy', 'sci-fi', 'science fiction', 'romance', 'mystery', 'thriller', 'historical', 'biography'];
    const mentionedGenre = genres.find(genre => lowerMessage.includes(genre));
    
    if (mentionedGenre) {
      const booksInGenre = books.filter(book => 
        book.genre.some(g => g.toLowerCase().includes(mentionedGenre))
      );
      
      if (booksInGenre.length > 0) {
        const randomIndex = Math.floor(Math.random() * booksInGenre.length);
        const recommendation = booksInGenre[randomIndex];
        return `Based on your interest in ${mentionedGenre}, I think you might enjoy "${recommendation.title}" by ${recommendation.author}. ${recommendation.synopsis.substring(0, 100)}...`;
      }
    }
    
    // If no specific genre or no books in that genre, give general recommendation
    if (readBooks.length > 0) {
      // Recommend based on what they've read
      const randomReadBook = readBooks[Math.floor(Math.random() * readBooks.length)];
      const similarGenre = randomReadBook.genre[0];
      const recommendations = books.filter(book => 
        !book.isRead && 
        book.genre.some(g => randomReadBook.genre.includes(g))
      );
      
      if (recommendations.length > 0) {
        const recommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
        return `Since you enjoyed "${randomReadBook.title}", I think you might like "${recommendation.title}" by ${recommendation.author}. It's also in the ${similarGenre} genre.`;
      }
    }
    
    // Fallback recommendation
    const randomBook = books[Math.floor(Math.random() * books.length)];
    return `I'd recommend "${randomBook.title}" by ${randomBook.author}. It's a popular ${randomBook.genre[0]} book that many readers enjoy.`;
  }
  
  // Check for search requests
  if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('looking for')) {
    return "You can use the search feature at the top of the page to find specific books, authors, or genres. Would you like me to help you find something specific?";
  }
  
  // Check for information about reading history
  if (lowerMessage.includes('reading history') || lowerMessage.includes('read so far') || lowerMessage.includes('finished')) {
    if (readBooks.length > 0) {
      return `You've read ${readBooks.length} books so far. Your most recent read was "${readBooks[0].title}" by ${readBooks[0].author}. Is there a particular type of book you'd like to explore next?`;
    } else {
      return "You haven't marked any books as read yet. When you find a book you've finished, you can mark it as read and it will appear in your reading journey timeline.";
    }
  }
  
  // Default response
  return "I'm here to help you find your next great read. You can ask me for recommendations based on genres you enjoy, help with finding specific books, or information about your reading history.";
}

export default LibrarianAssistant;
