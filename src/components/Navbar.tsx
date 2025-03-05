
import { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Search, Bell, BookOpen, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-mobile';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
  const { books, searchBooks } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchBooks>>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const results = searchBooks(searchQuery);
    setSearchResults(results);
    setIsSearchOpen(true);
  };

  return (
    <nav className="bg-library-wood/95 backdrop-blur-md text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 mr-2" />
            <span className="font-serif text-xl font-bold">Library Adventure</span>
          </div>

          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="mr-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 text-white placeholder-white/70 rounded-md px-3 py-1 pl-8 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
              </div>
            </form>

            <div className="flex items-center space-x-4">
              <button className="relative hover:text-white/80">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
              
              <DarkModeToggle />
              
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                My Books
              </Button>
            </div>
          </div>

          {isMobile && (
            <div className="flex items-center md:hidden">
              <DarkModeToggle />
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Menu className="h-6 w-6 text-white" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-library-paper">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center">
                        <BookOpen className="h-6 w-6 mr-2 text-library-wood" />
                        <span className="font-serif text-xl font-bold text-library-wood">
                          Library
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleSearch} className="mb-6">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search books..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-white border border-library-wood/20 rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-library-wood/50"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-library-wood/50" />
                      </div>
                    </form>

                    <div className="space-y-1">
                      <NavItem href="#" icon={<BookOpen className="h-4 w-4 mr-2" />}>
                        My Books
                      </NavItem>
                      <NavItem href="#" icon={<Bell className="h-4 w-4 mr-2" />}>
                        Notifications
                      </NavItem>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavItem = ({ href, icon, children }: NavItemProps) => {
  return (
    <a
      href={href}
      className="flex items-center px-3 py-2 text-library-wood hover:bg-library-wood/10 rounded-md transition-colors"
    >
      {icon}
      <span>{children}</span>
    </a>
  );
};

export default Navbar;
