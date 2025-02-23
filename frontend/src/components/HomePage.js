import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSpots } from "../features/SpotsSlice";
import { Tooltip } from "react-tooltip"; 
// import { FaStar } from "react-icons/fa";
import "./styles/homepage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spots, status, error } = useSelector((state) => state.spots);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  if (status === "loading") return <p>Loading spots...</p>;
  if (status === "failed") return <p className="error">{error}</p>;

  return (
    <div className="home-container">
    <h1>Explore Available Spots</h1>
    <div className="spots-grid">
      {spots.map((spot) => (
        <div
          key={spot.id}
          className="spot-tile"
          onClick={() => navigate(`/spots/${spot.id}`)}
          data-tooltip-id={`tooltip-${spot.id}`}
          data-tooltip-content={spot.name}
        >
          <div className="spot-image-container">
          
            <img
              src={spot.previewImage}
              alt={spot.name}
              className="spot-thumbnail"
            />
          </div>
  
          <div className="spot-details">
            <div className="spot-header">
              <div className ="name-rating">
              <h2>{spot.name}</h2>
              <span className="spot-rating">
                ⭐ {spot.avgStarRating > 0 ? spot.avgStarRating.toFixed(1) : "New"}
              </span>
              </div>
              <h3>{spot.city}, {spot.state}</h3>
            </div>
            <p className="spot-price">${spot.price} / night</p>
          </div>
  
          <Tooltip id={`tooltip-${spot.id}`} place="top" />
        </div>
      ))}
    </div>
  </div>
    )}
  
  
   export default HomePage;
