import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut, setUser } from "../../features/session/SessionSlice";
import { useNavigate, Link } from "react-router-dom";
import LoginForm from "../SessionForms/LoginForm"; 
import SignUpForm from "../SessionForms/SignupForm"; 
import "../styles/navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (!user) {
          dispatch(setUser(parsedUser));
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logOut());
    localStorage.removeItem("user");
    setIsMenuOpen(false); 
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <div className="auth-links">
          {user ? (
            <>
              <button className="create-spot-btn" onClick={() => navigate("/spots/create")}>
                Create a New Spot
              </button>

              <div className="user-menu-container" ref={menuRef}>
                <button className="user-menu-btn" onClick={() => setIsMenuOpen((prev) => !prev)}>
                  User Menu ▼
                </button>

                {isMenuOpen && (
                  <div className="user-dropdown">
                    <p>Hello, {user.firstName}</p>
                    <p>{user.email}</p>
                    
                    <button className="dropdown-btn" onClick={() => navigate("/spots/manage-spots")}>
                      Manage Spots
                    </button>

                    <button className="logout-btn" onClick={handleLogout}>Log out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button onClick={() => setIsSignUpOpen(true)}>Sign Up</button>
              <button onClick={() => setIsLoginOpen(true)}>Login</button>
            </>
          )}
        </div>
      </nav>

      {isLoginOpen && <LoginForm isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />}
      {isSignUpOpen && <SignUpForm isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />}
    </>
  );
};

export default Navbar;
