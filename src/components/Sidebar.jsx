import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FileText,
  MessageSquare,
  Upload,
  Droplet,
  AlertTriangle,
} from "lucide-react";

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

  return (
    <div className="bg-blue-800 text-blue-100 w-64 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
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
        <SidebarLink
          icon={AlertTriangle}
          text="View Reports"
          to="/admin/reports"
          active={location.pathname === "/admin/reports"}
        />
      </nav>
    </div>
  );
};

export default Sidebar;
