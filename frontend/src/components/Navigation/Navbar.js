import React from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../../features/session/SessionSlice"; // Import logOut
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); 
   console.log("User:", user);

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
            <span>Welcome, {user}!</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
