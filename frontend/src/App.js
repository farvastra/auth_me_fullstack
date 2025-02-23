import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Navbar from "./components/Navigation/Navbar";
import LoginForm from "./components/SessionForms/LoginForm";
import SignupForm from "./components/SessionForms/SignupForm";
import HomePage from "./components/HomePage";
import CreateSpot from "./components/spots/CreateSpotForm"; 
import EditSpotPage from './components/spots/EditSpotPage';
import ManageSpots from "./components/spots/ManageSpots";
import SpotDetailPage from "./components/spots/SpotDetailPage";
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
        <Route path="/spots/:id" element={<SpotDetailPage />} /> 
        <Route path="/edit-spot/:id" element={<EditSpotPage />} />
        <Route path="/spots/manage-spots" element={<ManageSpots />} />
      </Routes>
    </Router>
  </Provider>
);

export default App;
