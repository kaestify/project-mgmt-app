import React from "react";
import { Link } from "react-router-dom";
import { isAuth, handleLogout } from "../utils/helpers";

export default function Navbar({ children }) {
  const nav = () => (
    <ul className="nav nav-tabs" style={{ backgroundColor: "#e3f2fd" }}>
      <Link to="/" className="navbar-brand text-dark">
        Tuesday.com
      </Link>
      <li className="nav-item">
        <Link to="/" className="text-dark nav-link">
          Home
        </Link>
      </li>
      {!isAuth() && (
        <li className="nav-item">
          <Link to="/login" className="text-dark nav-link">
            Login
          </Link>
        </li>
      )}
      {isAuth() && (
        <li className="nav-item">
          <Link to="/newproject" className="text-dark nav-link">
            Add New Project
          </Link>
        </li>
      )}
      {isAuth() && (
        <li className="nav-item">
          <Link to="/profile" className="text-dark nav-link">
            Profile
          </Link>
        </li>
      )}

      {isAuth() && (
        <li className="nav-item">
          <span
            className="text-dark nav-link"
            style={{ cursor: "pointer", color: "black" }}
            onClick={handleLogout}
          >
            Signout
          </span>
        </li>
      )}
    </ul>
  );

  return (
    <React.Fragment>
      {nav()}
      <div className="container">{children}</div>
    </React.Fragment>
  );
}
