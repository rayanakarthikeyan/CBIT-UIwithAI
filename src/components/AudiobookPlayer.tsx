
import { useState, useRef, useEffect } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Play, Pause, SkipBack, SkipForward, BookmarkPlus, Volume2, Volume1, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface AudioBookmark {
  position: number;
  timestamp: string;
  chapterName: string;
  note?: string;
}

const AudiobookPlayer = () => {
  const { selectedBook } = useLibrary();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [bookmarks, setBookmarks] = useState<AudioBookmark[]>([]);
  const [currentChapter, setCurrentChapter] = useState("Chapter 1");
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sample chapters for demonstration
  const chapters = [
    { name: "Chapter 1", start: 0, end: 180 },
    { name: "Chapter 2", start: 181, end: 360 },
    { name: "Chapter 3", start: 361, end: 540 },
    { name: "Chapter 4", start: 541, end: 720 }
  ];

  // Sample audio file - in production this would come from the book data
  const audioSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        
        // Update current chapter based on time
        const chapter = chapters.find(
          chapter => audio.currentTime >= chapter.start && audio.currentTime <= chapter.end
        );
        if (chapter) {
          setCurrentChapter(chapter.name);
        }
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        toast({
          title: "Audiobook ended",
          description: "You've reached the end of this audiobook chapter.",
        });
      };
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [chapters]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  };

  const changeChapter = (chapterName: string) => {
    const chapter = chapters.find(c => c.name === chapterName);
    if (chapter && audioRef.current) {
      audioRef.current.currentTime = chapter.start;
      setCurrentChapter(chapterName);
      toast({
        title: "Chapter Changed",
        description: `Now playing ${chapterName}`,
      });
    }
  };

  const addBookmark = () => {
    if (!audioRef.current) return;
    
    const newBookmark: AudioBookmark = {
      position: audioRef.current.currentTime,
      timestamp: new Date().toISOString(),
      chapterName: currentChapter
    };
    
    setBookmarks(prev => [...prev, newBookmark]);
    
    toast({
      title: "Bookmark Added",
      description: `Position marked at ${formatTime(newBookmark.position)} in ${currentChapter}`,
    });
  };

  const jumpToBookmark = (position: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = position;
      setCurrentTime(position);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <div className="card-library p-4 mb-6">
      <h3 className="font-serif text-xl font-bold mb-3 flex items-center">
        {selectedBook ? `Audiobook: ${selectedBook.title}` : 'Audiobook Player'}
      </h3>
      
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      <div className="bg-library-wood/5 rounded-lg p-3 mb-3">
        <div className="flex justify-between items-center text-sm text-library-wood mb-1">
          <span>{formatTime(currentTime)}</span>
          <span className="font-medium">{currentChapter}</span>
          <span>{formatTime(duration)}</span>
        </div>
        
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="mb-3"
        />
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="flex justify-start items-center space-x-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={toggleMute}
            >
              <VolumeIcon />
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={(val) => setVolume(val[0] / 100)}
              className="w-24"
            />
          </div>
          
          <div className="flex justify-end items-center">
            <span className="text-xs mr-2">Speed:</span>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="text-xs bg-white rounded border border-library-wood/20 px-1 py-0.5"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={skipBackward}
            className="rounded-full h-10 w-10 bg-white"
          >
            <SkipBack size={18} />
          </Button>
          
          <Button 
            onClick={togglePlayPause}
            className="rounded-full h-12 w-12 bg-library-wood text-white hover:bg-library-wood/90"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={skipForward}
            className="rounded-full h-10 w-10 bg-white"
          >
            <SkipForward size={18} />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between mb-3">
        <div className="flex-1 mr-2">
          <label className="text-sm font-medium mb-1 block">Chapters</label>
          <select
            value={currentChapter}
            onChange={(e) => changeChapter(e.target.value)}
            className="w-full text-sm bg-white rounded border border-library-wood/20 p-1.5"
          >
            {chapters.map((chapter) => (
              <option key={chapter.name} value={chapter.name}>
                {chapter.name} ({formatTime(chapter.start)} - {formatTime(chapter.end)})
              </option>
            ))}
          </select>
        </div>
        
        <Button 
          variant="outline" 
          onClick={addBookmark} 
          className="flex items-center bg-white"
        >
          <BookmarkPlus size={16} className="mr-1" />
          <span className="text-xs">Bookmark</span>
        </Button>
      </div>
      
      {bookmarks.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-1">Bookmarks</h4>
          <div className="max-h-32 overflow-y-auto">
            {bookmarks.map((bookmark, index) => (
              <div 
                key={index} 
                className="text-xs bg-library-wood/5 p-2 rounded-md mb-1 flex justify-between items-center"
              >
                <div>
                  <span className="font-medium">{bookmark.chapterName}</span>
                  <span className="mx-1">at</span>
                  <span>{formatTime(bookmark.position)}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => jumpToBookmark(bookmark.position)}
                  className="h-6 text-xs"
                >
                  Jump
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudiobookPlayer;
