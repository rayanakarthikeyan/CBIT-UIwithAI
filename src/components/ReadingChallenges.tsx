
import { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Trophy, Share2, Award, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const ReadingChallenges = () => {
  const { challenges, updateChallengeProgress } = useLibrary();
  const { toast } = useToast();
  const [showAddChallenge, setShowAddChallenge] = useState(false);

  const handleShare = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    // In a real app, this would open a share dialog
    toast({
      title: "Share Challenge",
      description: `Shared your "${challenge.title}" challenge!`,
    });
  };

  const handleIncrementProgress = (challengeId: string, currentProgress: number) => {
    updateChallengeProgress(challengeId, currentProgress + 1);
  };

  return (
    <section className="py-10 bg-library-cream/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="chapter-heading">Reading Challenges</h2>
          <button
            onClick={() => setShowAddChallenge(!showAddChallenge)}
            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-library-green text-white hover:bg-library-green/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Challenge</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id} 
              className={`card-library overflow-hidden ${challenge.completed ? 'border-library-gold bg-library-gold/5' : ''}`}
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-xl text-library-wood">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    {challenge.completed ? (
                      <div className="relative">
                        <Award className="h-12 w-12 text-library-gold animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-library-cream" />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-library-wood/10 p-2 rounded-full">
                        <Trophy className="h-8 w-8 text-library-wood/70" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4 flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progress: {challenge.currentProgress}/{challenge.targetCount}
                    </span>
                    <span className="text-sm text-library-wood font-medium">
                      {Math.round((challenge.currentProgress / challenge.targetCount) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(challenge.currentProgress / challenge.targetCount) * 100} 
                    className={challenge.completed ? "bg-library-gold/20" : "bg-library-wood/20"}
                  />
                </div>
                
                {challenge.completed ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-medium bg-library-gold/20 text-library-gold px-2 py-1 rounded-full">
                        Badge Earned: {challenge.badgeName}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleShare(challenge.id)}
                      className="flex items-center space-x-1 text-sm text-library-wood hover:text-library-wood/70"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleIncrementProgress(challenge.id, challenge.currentProgress)}
                      className="flex-grow text-center px-4 py-2 rounded-md bg-library-wood text-white hover:bg-library-wood/90 transition-colors"
                    >
                      Update Progress
                    </button>
                    
                    <button
                      onClick={() => handleShare(challenge.id)}
                      className="p-2 rounded-md border border-library-wood/30 text-library-wood hover:bg-library-wood/5"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Add new challenge form (simplified) */}
        {showAddChallenge && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h3 className="font-serif font-bold text-xl text-library-wood mb-4">Create a New Challenge</h3>
            <p className="text-sm text-gray-600 mb-2">
              Custom challenges will be available in a future update!
            </p>
            <button
              onClick={() => setShowAddChallenge(false)}
              className="px-4 py-2 bg-library-wood text-white rounded-md hover:bg-library-wood/90 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReadingChallenges;
