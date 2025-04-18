import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { LogOut } from "lucide-react";

const Header = ({
  user,
  onLogout,
  title = "SeaClear",
  showBackButton = false,
  backLink = "/",
}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          {showBackButton && (
            <Link
              to={backLink}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              ← Back
            </Link>
          )}
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        </div>

        {user ? (
          <div className="flex items-center">
            <span className="mr-4">
              Welcome, {typeof user === "string" ? user : user.name || "User"}
            </span>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 flex items-center"
            >
              <LogOut size={18} className="mr-2" /> Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/education" className="text-gray-600 hover:text-gray-900">
              Learn
            </Link>
            <Link to="/community" className="text-gray-600 hover:text-gray-900">
              Community
            </Link>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onLogout: PropTypes.func,
  title: PropTypes.string,
  showBackButton: PropTypes.bool,
  backLink: PropTypes.string,
};

export default Header;
