"use client";

import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ChevronLeft, Waves, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

const Header = ({
  title = "SeaClear",
  showBackButton = false,
  backLink = "/",
}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin status when component mounts
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-cyan-600 to-blue-700 shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            {showBackButton ? (
              <Link
                to={backLink}
                className="group flex items-center text-white hover:text-cyan-100 font-medium mr-4 transition-all duration-200"
              >
                <ChevronLeft
                  size={20}
                  className="mr-1 transition-transform group-hover:-translate-x-1"
                />
                <span>Back</span>
              </Link>
            ) : (
              <Waves className="text-cyan-200 h-7 w-7 mr-2" />
            )}

            <Link to="/" className="group">
              <div className="flex flex-col">
                <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-cyan-100 transition-colors">
                  {title}
                </h3>
                <p className="text-cyan-100 text-sm font-medium">
                  Keeping beaches safe
                </p>
              </div>
            </Link>
          </div>

          {!showBackButton && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/about"
                className="text-white hover:text-cyan-100 font-medium transition-colors relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-200 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/education"
                className="text-white hover:text-cyan-100 font-medium transition-colors relative group"
              >
                Learn More
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-200 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/community"
                className="text-white hover:text-cyan-100 font-medium transition-colors relative group"
              >
                Community
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-200 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {isAdmin ? (
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-700 px-5 py-2 rounded-full hover:bg-cyan-50 transition-colors font-medium shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-blue-700 px-5 py-2 rounded-full hover:bg-cyan-50 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  Admin Login
                </Link>
              )}
            </nav>
          )}

          {/* Mobile menu button - only shown on smaller screens */}
          <div className="md:hidden flex items-center">
            {!showBackButton && (
              <div className="md:hidden flex justify-center pb-3 space-x-6">
                <Link
                  to="/about"
                  className="text-white hover:text-cyan-100 font-medium text-sm"
                >
                  About
                </Link>
                <Link
                  to="/education"
                  className="text-white hover:text-cyan-100 font-medium text-sm"
                >
                  Learn More
                </Link>
                <Link
                  to="/community"
                  className="text-white hover:text-cyan-100 font-medium text-sm"
                >
                  Community
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile navigation - only shown on smaller screens */}
        {!showBackButton && (
          <div className="md:hidden flex justify-center pb-3 space-x-6">
            <Link
              to="/education"
              className="text-white hover:text-cyan-100 font-medium text-sm"
            >
              Learn More
            </Link>
            <Link
              to="/community"
              className="text-white hover:text-cyan-100 font-medium text-sm"
            >
              Community
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  showBackButton: PropTypes.bool,
  backLink: PropTypes.string,
};

export default Header;
