import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

/**
 * Navigation Bar Component
 * Displays navigation links and user info
 */
const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🍬 Sweet Shop
        </Link>

        <ul className="navbar-menu">
          {user ? (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>
              {isAdmin() && (
                <li>
                  <Link to="/admin">Admin Panel</Link>
                </li>
              )}
              <li className="user-info">
                <span>👤 {user.username}</span>
                {isAdmin() && <span className="admin-badge">Admin</span>}
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
