
import MainLayout from '@/layouts/MainLayout';
import BookShelf from '@/components/BookShelf';
import ReadingJourney from '@/components/ReadingJourney';
import Search from '@/components/Search';
import UserProfile from '@/components/UserProfile';
import BookRecommendations from '@/components/BookRecommendations';
import ReadingChallenges from '@/components/ReadingChallenges';
import BookCategories from '@/components/BookCategories';
import { LibraryProvider } from '@/context/LibraryContext';

const Index = () => {
  return (
    <LibraryProvider>
      <MainLayout>
        <header className="relative">
          <div className="absolute inset-0 bg-library-wood opacity-10 z-0"></div>
          <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-library-wood mb-4 animate-fade-in">
              Welcome to Your Library Adventure
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Explore, discover, and immerse yourself in the world of books
            </p>
          </div>
        </header>
        
        <BookShelf />
        
        <div className="h-px w-full max-w-5xl mx-auto bg-library-wood/10 my-4"></div>
        
        {/* New component: Book Recommendations */}
        <BookRecommendations />
        
        <div className="h-px w-full max-w-5xl mx-auto bg-library-wood/10 my-4"></div>
        
        <ReadingJourney />
        
        <div className="h-px w-full max-w-5xl mx-auto bg-library-wood/10 my-4"></div>
        
        {/* New component: Reading Challenges */}
        <ReadingChallenges />
        
        <div className="h-px w-full max-w-5xl mx-auto bg-library-wood/10 my-4"></div>
        
        {/* New component: Book Categories */}
        <BookCategories />
        
        <div className="h-px w-full max-w-5xl mx-auto bg-library-wood/10 my-4"></div>
        
        <Search />
        
        <div className="h-px w-full max-w-5xl mx-auto bg-library-wood/10 my-4"></div>
        
        <UserProfile />
      </MainLayout>
    </LibraryProvider>
  );
};

export default Index;
