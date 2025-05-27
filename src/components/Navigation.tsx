import { Link, useLocation } from "react-router-dom";
import { BarChart3, Home, Trophy, TrendingUp } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/statistics":
        return "Statistics";
      case "/results":
        return "Results";
      case "/analysis":
        return "Analysis";
      default:
        return "F1nalyse";
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <div className="bg-f1-red text-white px-3 py-1 rounded-md font-bold text-xl">
              F1NALYSE
            </div>
          </Link>
          
          <div className="flex items-center bg-gray-100 rounded-md p-1 space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                location.pathname === "/"
                  ? "bg-f1-red text-white shadow-sm"
                  : "text-gray-600 hover:text-f1-red hover:bg-white"
              }`}
            >
              <Home size={16} />
              <span className="hidden sm:block">Home</span>
            </Link>
            
            <Link
              to="/statistics"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                location.pathname === "/statistics"
                  ? "bg-f1-red text-white shadow-sm"
                  : "text-gray-600 hover:text-f1-red hover:bg-white"
              }`}
            >
              <BarChart3 size={16} />
              <span className="hidden sm:block">Stats</span>
            </Link>

            <Link
              to="/results"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                location.pathname === "/results"
                  ? "bg-f1-red text-white shadow-sm"
                  : "text-gray-600 hover:text-f1-red hover:bg-white"
              }`}
            >
              <Trophy size={16} />
              <span className="hidden sm:block">Results</span>
            </Link>

            <Link
              to="/analysis"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                location.pathname === "/analysis"
                  ? "bg-f1-red text-white shadow-sm"
                  : "text-gray-600 hover:text-f1-red hover:bg-white"
              }`}
            >
              <TrendingUp size={16} />
              <span className="hidden sm:block">Analysis</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
