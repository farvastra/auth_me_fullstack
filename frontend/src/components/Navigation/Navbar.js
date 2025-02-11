import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut, setUser } from "../../features/session/SessionSlice";
import { useNavigate, Link } from "react-router-dom";
import DemoLoginButton from "../SessionForms/DemoLoginButton"; 
import "../styles/navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.session.user);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      dispatch(setUser(JSON.parse(storedUser))); 
    }
  }, [dispatch, user]);
  
  const handleLogout = async () => {
    try {
      dispatch(logOut());
      localStorage.removeItem("user"); // Clear user from localStorage
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
