
import { useState, useEffect } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Quote, RefreshCw, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// Sample quotes for demonstration
const SAMPLE_QUOTES = [
  {
    text: "So many books, so little time.",
    author: "Frank Zappa",
    source: "Interview, 1983"
  },
  {
    text: "A room without books is like a body without a soul.",
    author: "Cicero",
    source: "De Amicitia"
  },
  {
    text: "The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.",
    author: "Jane Austen",
    source: "Northanger Abbey"
  },
  {
    text: "Good friends, good books, and a sleepy conscience: this is the ideal life.",
    author: "Mark Twain",
    source: "A Connecticut Yankee in King Arthur's Court"
  },
  {
    text: "I cannot live without books.",
    author: "Thomas Jefferson",
    source: "Letter to John Adams, 1815"
  },
  {
    text: "Books are a uniquely portable magic.",
    author: "Stephen King",
    source: "On Writing: A Memoir of the Craft"
  },
  {
    text: "A book must be the axe for the frozen sea within us.",
    author: "Franz Kafka",
    source: "Letter to Oskar Pollak, 1904"
  },
  {
    text: "That's the thing about books. They let you travel without moving your feet.",
    author: "Jhumpa Lahiri",
    source: "The Namesake"
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    source: "I Can Read With My Eyes Shut!"
  },
  {
    text: "Reading is an exercise in empathy; an exercise in walking in someone else's shoes for a while.",
    author: "Malorie Blackman",
    source: "Interview, 2013"
  }
];

interface Quote {
  text: string;
  author: string;
  source: string;
}

const RandomQuoteGenerator = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  
  useEffect(() => {
    // Load saved favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteQuotes');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
    
    // Get initial random quote
    getRandomQuote();
  }, []);
  
  const getRandomQuote = () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * SAMPLE_QUOTES.length);
      setCurrentQuote(SAMPLE_QUOTES[randomIndex]);
      setIsLoading(false);
    }, 500);
  };
  
  const toggleFavorite = (quote: Quote) => {
    const isFavorited = favorites.some(fav => fav.text === quote.text);
    
    if (isFavorited) {
      const updatedFavorites = favorites.filter(fav => fav.text !== quote.text);
      setFavorites(updatedFavorites);
      localStorage.setItem('favoriteQuotes', JSON.stringify(updatedFavorites));
      
      toast({
        title: "Removed from favorites",
        description: "Quote has been removed from your favorites.",
      });
    } else {
      const updatedFavorites = [...favorites, quote];
      setFavorites(updatedFavorites);
      localStorage.setItem('favoriteQuotes', JSON.stringify(updatedFavorites));
      
      toast({
        title: "Added to favorites",
        description: "Quote has been saved to your favorites.",
      });
    }
  };
  
  const shareQuote = (quote: Quote) => {
    if (navigator.share) {
      navigator.share({
        title: 'Book Quote',
        text: `"${quote.text}" — ${quote.author}, ${quote.source}`,
        url: window.location.href,
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}, ${quote.source}`);
      
      toast({
        title: "Copied to clipboard",
        description: "Quote has been copied to your clipboard.",
      });
    }
  };
  
  const isQuoteFavorited = (quote: Quote): boolean => {
    return favorites.some(fav => fav.text === quote.text);
  };

  return (
    <div className="card-library p-4 mb-6">
      <h3 className="font-serif text-xl font-bold mb-4 flex items-center">
        <Quote className="h-5 w-5 mr-2 text-library-wood" />
        Literary Quotes
      </h3>
      
      <div className="flex gap-3 mb-4">
        <Button 
          variant={showFavorites ? "outline" : "default"}
          onClick={() => setShowFavorites(false)}
          className={showFavorites ? "bg-white" : "bg-library-wood text-white"}
        >
          Random Quotes
        </Button>
        <Button 
          variant={showFavorites ? "default" : "outline"}
          onClick={() => setShowFavorites(true)}
          className={showFavorites ? "bg-library-wood text-white" : "bg-white"}
        >
          My Favorites ({favorites.length})
        </Button>
      </div>
      
      {showFavorites ? (
        <div className="space-y-4">
          {favorites.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Heart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>You haven't saved any favorite quotes yet.</p>
              <p className="text-sm mt-1">Find a quote you love and click the heart icon!</p>
            </div>
          ) : (
            favorites.map((quote, index) => (
              <div key={index} className="bg-library-wood/5 p-4 rounded-lg relative">
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => toggleFavorite(quote)}
                    className="p-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <Heart className="h-4 w-4 fill-library-wood text-library-wood" />
                  </button>
                  <button
                    onClick={() => shareQuote(quote)}
                    className="p-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
                    aria-label="Share quote"
                  >
                    <Share2 className="h-4 w-4 text-library-wood" />
                  </button>
                </div>
                <p className="font-serif text-lg mb-3">"{quote.text}"</p>
                <p className="text-sm text-right">
                  — <span className="font-medium">{quote.author}</span>, <span className="italic">{quote.source}</span>
                </p>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="bg-library-wood/5 p-6 rounded-lg flex flex-col items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-library-wood mb-4"></div>
              <p className="text-gray-500">Finding a literary gem...</p>
            </div>
          ) : currentQuote && (
            <div className="bg-library-wood/5 p-6 rounded-lg relative">
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => toggleFavorite(currentQuote)}
                  className="p-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
                  aria-label={isQuoteFavorited(currentQuote) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    className={`h-4 w-4 ${isQuoteFavorited(currentQuote) ? 'fill-library-wood text-library-wood' : 'text-library-wood'}`} 
                  />
                </button>
                <button
                  onClick={() => shareQuote(currentQuote)}
                  className="p-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
                  aria-label="Share quote"
                >
                  <Share2 className="h-4 w-4 text-library-wood" />
                </button>
              </div>
              <p className="font-serif text-xl mb-4">"{currentQuote.text}"</p>
              <p className="text-right">
                — <span className="font-medium">{currentQuote.author}</span>, <span className="italic">{currentQuote.source}</span>
              </p>
              <div className="mt-6 text-center">
                <Button 
                  onClick={getRandomQuote}
                  variant="outline"
                  className="inline-flex items-center bg-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Quote
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RandomQuoteGenerator;
