
import { useState, useEffect } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Clock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

// Average adult reading speeds in words per minute
const READING_SPEEDS = {
  SLOW: 150,
  AVERAGE: 250,
  FAST: 400
};

const ReadingTimeEstimator = () => {
  const { books, selectedBook } = useLibrary();
  const [readingSpeed, setReadingSpeed] = useState(READING_SPEEDS.AVERAGE);
  const [customSpeed, setCustomSpeed] = useState(false);
  
  // Function to estimate reading time based on word count and reading speed
  const estimateReadingTime = (wordCount: number, speed: number): string => {
    const minutes = Math.ceil(wordCount / speed);
    
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    }
    
    return `${hours} hour${hours === 1 ? '' : 's'} ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}`;
  };

  // For demo purposes - we're assigning random word counts to books
  // In a real app, this would come from actual book data
  const getBookWordCount = (bookId: string): number => {
    // Using the book's id to generate a somewhat consistent random number
    const hash = bookId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Generate a word count between 20,000 and 120,000
    return 20000 + (hash % 100000);
  };

  const handleCustomSpeedChange = (value: number[]) => {
    setReadingSpeed(value[0]);
  };

  return (
    <div className="card-library p-4 mb-6">
      <h3 className="font-serif text-xl font-bold mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-library-wood" />
        Reading Time Estimator
      </h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Your Reading Speed</span>
          <span className="text-sm font-mono bg-library-wood/10 px-2 py-1 rounded">
            {readingSpeed} words/minute
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            onClick={() => {
              setReadingSpeed(READING_SPEEDS.SLOW);
              setCustomSpeed(false);
            }}
            className={`py-1 px-2 text-xs rounded-md transition-colors ${
              readingSpeed === READING_SPEEDS.SLOW && !customSpeed
                ? 'bg-library-wood text-white'
                : 'bg-library-wood/10 hover:bg-library-wood/20'
            }`}
          >
            Relaxed (150 wpm)
          </button>
          
          <button
            onClick={() => {
              setReadingSpeed(READING_SPEEDS.AVERAGE);
              setCustomSpeed(false);
            }}
            className={`py-1 px-2 text-xs rounded-md transition-colors ${
              readingSpeed === READING_SPEEDS.AVERAGE && !customSpeed
                ? 'bg-library-wood text-white'
                : 'bg-library-wood/10 hover:bg-library-wood/20'
            }`}
          >
            Average (250 wpm)
          </button>
          
          <button
            onClick={() => {
              setReadingSpeed(READING_SPEEDS.FAST);
              setCustomSpeed(false);
            }}
            className={`py-1 px-2 text-xs rounded-md transition-colors ${
              readingSpeed === READING_SPEEDS.FAST && !customSpeed
                ? 'bg-library-wood text-white'
                : 'bg-library-wood/10 hover:bg-library-wood/20'
            }`}
          >
            Quick (400 wpm)
          </button>
        </div>
        
        <div className="mb-2">
          <label className="text-sm mb-1 block">
            <input
              type="checkbox"
              checked={customSpeed}
              onChange={() => setCustomSpeed(!customSpeed)}
              className="mr-2"
            />
            Custom reading speed
          </label>
          
          {customSpeed && (
            <div className="mt-2">
              <Slider
                value={[readingSpeed]}
                min={100}
                max={800}
                step={10}
                onValueChange={handleCustomSpeedChange}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Slow (100 wpm)</span>
                <span>Fast (800 wpm)</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {selectedBook ? (
        <div className="bg-library-wood/5 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{selectedBook.title}</span>
            <span className="text-sm text-library-wood font-mono">
              ~{(getBookWordCount(selectedBook.id) / 1000).toFixed(0)}k words
            </span>
          </div>
          <div className="text-center font-serif text-lg">
            Estimated reading time: <strong>{estimateReadingTime(getBookWordCount(selectedBook.id), readingSpeed)}</strong>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {books.slice(0, 6).map(book => (
            <div key={book.id} className="bg-library-wood/5 p-2 rounded-md flex items-center">
              <div className="h-12 w-10 mr-2 overflow-hidden">
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  className="h-full w-full object-cover rounded-sm"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{book.title}</p>
                <p className="text-xs text-gray-600">
                  {estimateReadingTime(getBookWordCount(book.id), readingSpeed)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadingTimeEstimator;
