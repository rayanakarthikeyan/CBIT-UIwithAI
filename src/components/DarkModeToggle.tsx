
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for user preference in localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    
    if (isDarkMode) {
      // Switch to light mode
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      toast({
        title: "Light Mode Activated",
        description: "Your eyes might thank you during the day!",
      });
    } else {
      // Switch to dark mode
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      toast({
        title: "Dark Mode Activated",
        description: "Easier on the eyes in low light conditions!",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun size={18} className={`transition-opacity ${isDarkMode ? 'opacity-50' : 'opacity-100'}`} />
      <Switch 
        checked={isDarkMode}
        onCheckedChange={toggleDarkMode}
        aria-label="Toggle dark mode"
      />
      <Moon size={18} className={`transition-opacity ${isDarkMode ? 'opacity-100' : 'opacity-50'}`} />
    </div>
  );
};

export default DarkModeToggle;
