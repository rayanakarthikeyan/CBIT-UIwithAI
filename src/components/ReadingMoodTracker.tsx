
import { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Heart, Smile, Frown, Meh, Star, Bookmark } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

type Mood = 'happy' | 'sad' | 'inspired' | 'confused' | 'nostalgic' | 'other';

interface MoodEntry {
  bookId: string;
  date: string;
  mood: Mood;
  note?: string;
}

const moodEmojis: Record<Mood, string> = {
  happy: '😊',
  sad: '😢',
  inspired: '✨',
  confused: '🤔',
  nostalgic: '🕰️',
  other: '📝'
};

const moodColors: Record<Mood, string> = {
  happy: '#FFD700',
  sad: '#6495ED',
  inspired: '#FF4500',
  confused: '#9370DB',
  nostalgic: '#20B2AA',
  other: '#A9A9A9'
};

const ReadingMoodTracker = () => {
  const { books, readBooks } = useLibrary();
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<Mood | ''>('');
  const [moodNote, setMoodNote] = useState('');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  const handleMoodSelection = (mood: Mood) => {
    setSelectedMood(mood);
  };

  const handleBookSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBook(event.target.value);
  };

  const saveMoodEntry = () => {
    if (!selectedBook || !selectedMood) {
      toast({
        title: "Missing Information",
        description: "Please select a book and mood.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: MoodEntry = {
      bookId: selectedBook,
      date: new Date().toISOString(),
      mood: selectedMood,
      note: moodNote || undefined
    };

    setMoodEntries(prev => [newEntry, ...prev]);
    
    // Reset form
    setSelectedBook('');
    setSelectedMood('');
    setMoodNote('');
    
    toast({
      title: "Mood Saved",
      description: "Your reading mood has been recorded.",
    });
  };
  
  // Generate mood statistics for visualization
  const moodStats = moodEntries.reduce((acc: Record<Mood, number>, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<Mood, number>);
  
  const chartData = Object.entries(moodStats).map(([mood, count]) => ({
    name: mood,
    value: count
  }));

  return (
    <div className="card-library p-6 mb-6">
      <h3 className="font-serif text-xl font-bold mb-4 flex items-center">
        <Heart className="h-5 w-5 mr-2 text-library-wood" />
        Reading Mood Tracker
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="book-select" className="block text-sm font-medium mb-1">
              Select a book you've read
            </label>
            <select
              id="book-select"
              value={selectedBook}
              onChange={handleBookSelection}
              className="w-full p-2 border border-library-wood/20 rounded-md bg-white"
            >
              <option value="">Choose a book...</option>
              {readBooks.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} by {book.author}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              How did this book make you feel?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(moodEmojis).map(([mood, emoji]) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => handleMoodSelection(mood as Mood)}
                  className={`p-3 rounded-md flex flex-col items-center justify-center transition-all ${
                    selectedMood === mood 
                      ? 'bg-library-wood text-white scale-105' 
                      : 'bg-library-wood/10 hover:bg-library-wood/20'
                  }`}
                >
                  <span className="text-xl mb-1">{emoji}</span>
                  <span className="text-xs capitalize">{mood}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="mood-note" className="block text-sm font-medium mb-1">
              Add a note (optional)
            </label>
            <textarea
              id="mood-note"
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="What specific thoughts or feelings did you have?"
              className="w-full p-2 border border-library-wood/20 rounded-md bg-white h-24"
            />
          </div>
          
          <button
            onClick={saveMoodEntry}
            disabled={!selectedBook || !selectedMood}
            className="btn-library w-full"
          >
            Save Reading Mood
          </button>
        </div>
        
        <div>
          <h4 className="font-medium text-lg mb-3">Your Reading Moods</h4>
          
          {chartData.length > 0 ? (
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name }) => `${name}: ${moodEmojis[name as Mood]}`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={moodColors[entry.name as Mood]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} entries`, 
                      `${name} ${moodEmojis[name as Mood]}`
                    ]} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-library-wood/5 rounded-lg">
              <Bookmark className="h-8 w-8 text-library-wood/30 mb-2" />
              <p className="text-sm text-gray-500">No mood entries yet</p>
              <p className="text-xs text-gray-400">Track how books make you feel</p>
            </div>
          )}
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {moodEntries.map((entry, index) => {
              const book = books.find(b => b.id === entry.bookId);
              return (
                <div 
                  key={index} 
                  className="bg-library-wood/5 p-3 rounded-md text-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{book?.title}</span>
                    <span>{moodEmojis[entry.mood]}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                  {entry.note && <p className="text-xs mt-1 italic">{entry.note}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingMoodTracker;
