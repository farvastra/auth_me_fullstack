import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Navbar from "./components/Navigation/Navbar";
import LoginForm from "./components/SessionForms/LoginForm";
import SignupForm from "./components/SessionForms/SignupForm";
import HomePage from "./components/HomePage";
import CreateSpot from "./components/spots/CreateSpotForm"; 
import AllSpots from "./components/spots/Spots"; 
import EditSpotPage from './components/spots/EditSpotPage';
import AddReview from "./components/reviews/AddReview";
import Reviews from "./components/reviews/Reviews";
import "./App.css";

const App = () => (
  <Provider store={store}>
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/spots/create" element={<CreateSpot />} />
        <Route path="/spots" element={<AllSpots />} /> 
        <Route path="/edit-spot/:id" element={<EditSpotPage />} />
        <Route path="/add-review/:spotId" element={<AddReview />} />
        <Route path="/spots/:spotId/reviews" element={<Reviews />} />

      </Routes>
    </Router>
  </Provider>
);

export default App;
