import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FileText,
  MessageSquare,
  Upload,
  Droplet,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const SidebarLink = ({ icon: Icon, text, to, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
      active ? "bg-blue-700" : "hover:bg-blue-700"
    }`}
  >
    <Icon size={20} />
    <span>{text}</span>
  </Link>
);

SidebarLink.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
};

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-blue-100 hover:text-white transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-blue-800 text-blue-100 w-64 py-7 px-2 fixed 
          inset-y-0 left-0 z-40 transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative
          transition duration-200 ease-in-out
        `}
      >
        <div className="mb-8 px-4">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="flex flex-col space-y-2">
          <SidebarLink
            icon={FileText}
            text="Dashboard"
            to="/admin"
            active={location.pathname === "/admin"}
          />
          <SidebarLink
            icon={MessageSquare}
            text="Moderate Posts"
            to="/admin/posts"
            active={location.pathname === "/admin/posts"}
          />
          <SidebarLink
            icon={Upload}
            text="Upload Data"
            to="/admin/upload"
            active={location.pathname === "/admin/upload"}
          />
          <SidebarLink
            icon={Droplet}
            text="Manage Beaches"
            to="/admin/beaches"
            active={location.pathname === "/admin/beaches"}
          />
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
