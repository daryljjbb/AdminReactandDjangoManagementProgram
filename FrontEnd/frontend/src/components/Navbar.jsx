import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      // After logging out of Django, redirect to login
      // and reload to clear the auth state in React
      navigate("/login");
      window.location.reload(); 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!isAuthenticated) return null; // Don't show navbar if not logged in

  return (
    <nav className="navbar navbar-dark bg-dark mb-4 p-2">
      <div className="container">
        <span className="navbar-brand">
          Invoice App {isAdmin && <span className="badge bg-danger ms-2">Admin</span>}
        </span>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;