
import { useState, useEffect } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Heart, BookOpen, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ReadingMoodSelector = () => {
  const { availableMoods, selectedMood, setSelectedMood, books } = useLibrary();
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  useEffect(() => {
    if (selectedMood) {
      setShowRecommendations(true);
    }
  }, [selectedMood]);
  
  const handleMoodSelect = (mood: typeof availableMoods[0]) => {
    setSelectedMood(mood);
    toast({
      title: `Mood: ${mood.name}`,
      description: `We'll adjust your experience for ${mood.name.toLowerCase()} reading.`,
    });
  };
  
  // Get book recommendations based on selected mood
  const getMoodBasedRecommendations = () => {
    if (!selectedMood) return [];
    
    // In a real app, this would use proper mood-based algorithms
    // This is a simple demonstration that assigns books to moods based on some criteria
    
    const moodGenreMap: Record<string, string[]> = {
      "mood1": ["Fiction", "Literary Fiction", "Romance"], // Relaxed
      "mood2": ["Adventure", "Fantasy", "Science Fiction"], // Adventurous
      "mood3": ["Poetry", "Drama", "Literary Fiction"], // Melancholic
      "mood4": ["Non-fiction", "Science", "History"], // Curious
      "mood5": ["Romance", "Drama"], // Romantic
      "mood6": ["Self-help", "Biography", "Philosophy"] // Inspired
    };
    
    const matchingGenres = moodGenreMap[selectedMood.id] || [];
    
    return books
      .filter(book => book.genre.some(g => matchingGenres.includes(g)))
      .slice(0, 4);
  };
  
  const recommendations = getMoodBasedRecommendations();

  return (
    <div className="card-library p-4 mb-6">
      <h3 className="font-serif text-xl font-bold mb-4 flex items-center">
        <Heart className="h-5 w-5 mr-2 text-library-wood" />
        Reading Mood
      </h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-3">
          How are you feeling today? Select your current mood and we'll adjust your reading recommendations.
        </p>
        
        <div className="grid grid-cols-3 gap-3">
          {availableMoods.map(mood => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood)}
              className={`p-3 rounded-md flex flex-col items-center transition-all ${
                selectedMood?.id === mood.id 
                  ? 'bg-white shadow-md scale-105 border-2 border-library-wood/20' 
                  : 'bg-library-wood/5 hover:bg-library-wood/10'
              }`}
              style={selectedMood?.id === mood.id ? { boxShadow: `0 4px 12px ${mood.color}33` } : {}}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="font-medium">{mood.name}</span>
              <span className="text-xs text-gray-600 mt-1">{mood.description}</span>
            </button>
          ))}
        </div>
      </div>
      
      {showRecommendations && selectedMood && (
        <div className="mt-6">
          <h4 className="font-medium text-lg mb-3 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-library-wood" />
            Perfect for your {selectedMood.name.toLowerCase()} mood
          </h4>
          
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recommendations.map(book => (
                <div key={book.id} className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-36 overflow-hidden">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="font-medium text-sm truncate">{book.title}</p>
                    <p className="text-xs text-gray-600 truncate">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-library-wood/5 rounded-lg">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-library-wood/40" />
              <p className="text-gray-600">No matching books found for this mood.</p>
              <p className="text-sm text-gray-500">Try selecting a different mood.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadingMoodSelector;
