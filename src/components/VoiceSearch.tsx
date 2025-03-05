
import { useState, useEffect } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Mic, MicOff, Search, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const VoiceSearch = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { searchBooks } = useLibrary();
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchBooks>>([]);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setPermissionDenied(false);
        toast({
          title: "Voice Search Active",
          description: "I'm listening for your book search...",
          duration: 3000,
        });
      };
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        if (transcript) {
          performSearch(transcript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          setPermissionDenied(true);
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access in your browser settings to use voice search.",
            variant: "destructive",
            duration: 5000,
          });
        } else {
          toast({
            title: "Voice Recognition Error",
            description: "There was a problem with voice recognition. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        }
      };
      
      setRecognition(recognition);
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (transcript) {
      performSearch(transcript);
    }
  }, [transcript]);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Voice Search Unavailable",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      setTranscript('');
      setSearchResults([]);
      recognition.start();
    }
  };

  const performSearch = (query: string) => {
    const results = searchBooks(query);
    setSearchResults(results);
    
    if (results.length > 0) {
      toast({
        title: "Search Results",
        description: `Found ${results.length} books matching "${query}"`,
        duration: 3000,
      });
    } else {
      toast({
        title: "No Results",
        description: `No books found matching "${query}"`,
        duration: 3000,
      });
    }
  };

  return (
    <div className="glass-panel p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg font-semibold">Voice Search</h3>
        {permissionDenied ? (
          <div className="flex items-center text-amber-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span className="text-sm">Microphone access denied</span>
          </div>
        ) : (
          <button
            onClick={toggleListening}
            className={`rounded-full w-12 h-12 flex items-center justify-center transition-colors ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-library-wood hover:bg-library-wood/90 text-white'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start voice search'}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        )}
      </div>
      
      {transcript && (
        <div className="mb-4">
          <div className="flex items-center gap-2 bg-white/80 p-2 rounded-md">
            <Search className="h-4 w-4 text-library-wood" />
            <p className="text-sm font-medium">{transcript}</p>
          </div>
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Search Results:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {searchResults.slice(0, 6).map(book => (
              <div key={book.id} className="bg-white/80 p-2 rounded-md text-xs">
                <div className="h-24 overflow-hidden mb-1">
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="w-full h-full object-cover rounded-sm"
                  />
                </div>
                <p className="font-medium truncate">{book.title}</p>
                <p className="text-gray-600 truncate">{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {isListening && (
        <div className="flex justify-center mt-4">
          <div className="flex gap-1">
            <span className="h-2 w-2 bg-library-wood rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
            <span className="h-2 w-2 bg-library-wood rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
            <span className="h-2 w-2 bg-library-wood rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      )}
      
      {permissionDenied && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            Please enable microphone access in your browser settings to use voice search. 
            After enabling, refresh the page and try again.
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;
