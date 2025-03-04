
import { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Pie, PieChart, Cell } from 'recharts';
import { BookOpen, Award, TrendingUp } from 'lucide-react';

const UserProfile = () => {
  const { books, readBooks } = useLibrary();
  const [readingGoal, setReadingGoal] = useState(12);

  // Generate reading progress data
  const getMonthName = (monthIndex: number) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[monthIndex];
  };

  const currentYear = new Date().getFullYear();
  
  // Create monthly reading data
  const monthlyReadingData = Array.from({ length: 12 }, (_, i) => {
    // Count books read in this month
    const booksReadThisMonth = readBooks.filter(book => {
      if (!book.dateRead) return false;
      const date = new Date(book.dateRead);
      return date.getFullYear() === currentYear && date.getMonth() === i;
    }).length;
    
    return {
      name: getMonthName(i),
      count: booksReadThisMonth,
    };
  });

  // Genre distribution data
  const genreData = readBooks.reduce((acc: { name: string; value: number }[], book) => {
    book.genre.forEach(genre => {
      const existingGenre = acc.find(item => item.name === genre);
      if (existingGenre) {
        existingGenre.value += 1;
      } else {
        acc.push({ name: genre, value: 1 });
      }
    });
    return acc;
  }, []);

  // Sort genres by frequency
  genreData.sort((a, b) => b.value - a.value);

  // Reading goal progress
  const readingGoalProgress = Math.min(Math.round((readBooks.length / readingGoal) * 100), 100);

  // Colors for the pie chart
  const COLORS = ['#8C3130', '#345E8F', '#2D5542', '#8E5D41', '#5D4777', '#2A6B75', '#6B4226'];

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="chapter-heading mb-6">Your Reading Profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="md:col-span-1 space-y-6">
            <div className="card-library p-6">
              <h3 className="font-serif text-xl font-bold mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-library-wood" />
                Reading Stats
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Books Read</span>
                    <span className="text-sm font-bold">{readBooks.length}</span>
                  </div>
                  <div className="w-full bg-library-wood/10 rounded-full h-2">
                    <div 
                      className="bg-library-wood h-2 rounded-full"
                      style={{ width: `${(readBooks.length / books.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Reading Goal</span>
                    <span className="text-sm font-bold">{readBooks.length}/{readingGoal} books</span>
                  </div>
                  <div className="w-full bg-library-wood/10 rounded-full h-2">
                    <div 
                      className="bg-library-accent h-2 rounded-full"
                      style={{ width: `${readingGoalProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <label htmlFor="readingGoal" className="block text-sm font-medium mb-1">
                    Set Annual Reading Goal
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="readingGoal"
                      min="1"
                      max="100"
                      value={readingGoal}
                      onChange={(e) => setReadingGoal(Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-library-wood/20 rounded-md text-center"
                    />
                    <span className="ml-2 text-sm text-gray-600">books per year</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-library p-6">
              <h3 className="font-serif text-xl font-bold mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-library-wood" />
                Reading Achievements
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-library-wood/5 rounded-lg">
                  <div className="h-10 w-10 flex-shrink-0 bg-library-wood text-white rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Bookworm</h4>
                    <p className="text-xs text-gray-600">Read 5 books</p>
                  </div>
                  <div className="ml-auto">
                    {readBooks.length >= 5 ? (
                      <div className="h-6 w-6 bg-library-green rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-500">{readBooks.length}/5</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-library-wood/5 rounded-lg">
                  <div className="h-10 w-10 flex-shrink-0 bg-library-wood/80 text-white rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Steady Reader</h4>
                    <p className="text-xs text-gray-600">Read books 3 months in a row</p>
                  </div>
                  <div className="ml-auto">
                    <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-500">1/3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reading Chart */}
          <div className="card-library p-6 md:col-span-2">
            <h3 className="font-serif text-xl font-bold mb-6">Your Reading Activity</h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyReadingData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="name" stroke="#8E5D41" />
                  <YAxis stroke="#8E5D41" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFF8E7', 
                      border: '1px solid rgba(142, 93, 65, 0.2)',
                      borderRadius: '4px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Books Read" 
                    stroke="#8C3130" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8">
              <h3 className="font-serif text-xl font-bold mb-6">Genre Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name }) => name}
                      >
                        {genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  {genreData.slice(0, 5).map((genre, index) => (
                    <div key={genre.name} className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm">{genre.name}</span>
                      <span className="text-xs text-gray-500 ml-auto">{genre.value} books</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
