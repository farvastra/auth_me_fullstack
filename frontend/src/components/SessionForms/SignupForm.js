import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, setUser, clearError } from "../../features/session/SessionSlice";
import { useNavigate } from "react-router-dom";
import "../styles/login-signup.css";

const SignupForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.session);
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",  
  });

  const [errorMessage, setErrorMessage] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    validateForm();
  }, [userData]);

  useEffect(() => {
    if (!isOpen) {
      resetForm(); 
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, username, email, password, confirmPassword } = userData;

    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      setIsButtonDisabled(true);
      return;
    }

    if (username.length < 4 || password.length < 6 ) {
      setErrorMessage("Please fill in all fields. Username must be 4+ characters, password 6+.");
      setIsButtonDisabled(true);
      return;
    }
   
    setIsButtonDisabled(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage([]); 

    if (userData.password !== userData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    dispatch(signupUser(userData)).then((res) => {
      if (res.payload?.user) {
        const userDetails = res.payload.user;
        dispatch(setUser(userDetails));
        localStorage.setItem("user", JSON.stringify(userDetails));
        navigate("/spots/manage-spots");
        resetForm();
        onClose();
      } else if (res.error) {
        console.log("res.error.message", res.error.message);
        
      }
    });
  };

 
  const resetForm = () => {
    setUserData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrorMessage([]);
    dispatch(setUser(null));
    setIsButtonDisabled(true);
  };

  const handleClose = () => {
    dispatch(clearError());
    resetForm();
    onClose(); 
  };
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={handleClose}>X</button>
        <h2>Sign Up</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input name="firstName" placeholder="First Name" onChange={handleChange} value={userData.firstName} />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} value={userData.lastName} />
          <input name="username" placeholder="Username" onChange={handleChange} value={userData.username} />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} value={userData.email} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} value={userData.password} />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} value={userData.confirmPassword} />

          <button type="submit" disabled={isButtonDisabled}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
