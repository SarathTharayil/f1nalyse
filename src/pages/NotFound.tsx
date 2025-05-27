
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <div className="bg-f1-red text-white inline-block px-6 py-3 rounded-md font-bold text-4xl mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Page not found</h1>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't find the page you're looking for. The race might have finished already.
        </p>
        <Link to="/" className="text-white bg-f1-red hover:bg-f1-darkRed transition-colors px-6 py-3 rounded-md font-medium inline-block">
          Return to Pit Lane
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
