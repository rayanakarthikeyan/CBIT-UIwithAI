
import { useState } from 'react';
import { Book, BookOpen, Search, User, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-50 w-full bg-library-paper/90 backdrop-blur-md border-b border-library-wood/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-library-wood mr-2" />
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-library-wood">
              The Local Library Adventure
            </h1>
          </div>

          {isMobile ? (
            <button 
              onClick={toggleMenu}
              className="text-library-wood p-2 rounded-md hover:bg-library-wood/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <NavItem icon={<Book className="h-5 w-5" />} label="Bookshelf" />
              <NavItem icon={<Search className="h-5 w-5" />} label="Search" />
              <NavItem icon={<User className="h-5 w-5" />} label="Profile" />
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="animate-fade-in bg-library-paper border-b border-library-wood/10 shadow-md">
          <div className="px-4 py-3 space-y-1">
            <MobileNavItem icon={<Book className="h-5 w-5" />} label="Bookshelf" />
            <MobileNavItem icon={<Search className="h-5 w-5" />} label="Search" />
            <MobileNavItem icon={<User className="h-5 w-5" />} label="Profile" />
          </div>
        </div>
      )}
    </nav>
  );
};

const NavItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <a
    href="#"
    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-library-wood hover:bg-library-wood/10 transition-colors"
  >
    {icon}
    <span className="ml-2">{label}</span>
  </a>
);

const MobileNavItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <a
    href="#"
    className="flex items-center py-3 px-2 rounded-md text-library-wood hover:bg-library-wood/10 transition-colors"
  >
    {icon}
    <span className="ml-3 text-base font-medium">{label}</span>
  </a>
);

export default Navbar;
