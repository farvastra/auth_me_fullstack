import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../features/session/SessionSlice";
import { useNavigate, Link } from "react-router-dom";
import DemoLoginButton from "../SessionForms/DemoLoginButton"; 
import "../styles/navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.session.user);
  
  const handleLogout = async () => {
    try {
      dispatch(logOut());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      <div className="auth-links">
        {user ? (
          <>
            <Link to="/spots/create">Create Spot</Link>
            <Link to="/spots">Spots</Link>
            <span>Welcome, {user.username}!</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
            <DemoLoginButton />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
