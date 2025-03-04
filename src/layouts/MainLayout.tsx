
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import LibrarianAssistant from '@/components/LibrarianAssistant';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-library-wood text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h2 className="font-serif text-xl font-bold">The Local Library Adventure</h2>
              <p className="text-white/70 text-sm mt-1">Your digital reading companion</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-white/80 hover:text-white transition-colors">About</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Contact</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Help</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-white/60 text-sm">
            © {new Date().getFullYear()} The Local Library Adventure. All rights reserved.
          </div>
        </div>
      </footer>
      <LibrarianAssistant />
    </div>
  );
};

export default MainLayout;
