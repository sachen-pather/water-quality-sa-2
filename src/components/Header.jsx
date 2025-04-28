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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo and Title Section */}
          <div className="flex items-center space-x-2">
            {showBackButton ? (
              <Link
                to={backLink}
                className="group flex items-center text-white hover:text-cyan-100 font-medium transition-all duration-200"
              >
                <ChevronLeft
                  size={18}
                  className="transition-transform group-hover:-translate-x-1"
                />
                <span className="text-sm">Back</span>
              </Link>
            ) : (
              <Waves className="text-cyan-200 h-6 w-6 md:h-7 md:w-7" />
            )}

            <Link to="/" className="group">
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-cyan-100 transition-colors">
                {title}
              </h3>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/about"
              className="text-white hover:text-cyan-100 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/education"
              className="text-white hover:text-cyan-100 font-medium transition-colors"
            >
              Learn More
            </Link>
            <Link
              to="/community"
              className="text-white hover:text-cyan-100 font-medium transition-colors"
            >
              Discussion
            </Link>
            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 px-4 py-1.5 rounded-full hover:bg-cyan-50 transition-colors font-medium shadow-sm flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-white text-blue-700 px-4 py-1.5 rounded-full hover:bg-cyan-50 transition-colors font-medium shadow-sm"
              >
                Admin Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2 space-y-1">
            <Link
              to="/about"
              className="block text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm"
            >
              About
            </Link>
            <Link
              to="/education"
              className="block text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm"
            >
              Learn More
            </Link>
            <Link
              to="/community"
              className="block text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm"
            >
              Discussion
            </Link>
            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="w-full text-left text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm"
              >
                Admin Login
              </Link>
            )}
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
