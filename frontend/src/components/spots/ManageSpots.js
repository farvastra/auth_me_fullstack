import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserSpots, deleteSpot } from "../../features/SpotsSlice";
import { Link, useNavigate } from "react-router-dom";
import "../styles/manageSpots.css";

const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => state.spots.userSpots);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, spotId: null });

  useEffect(() => {
    dispatch(fetchUserSpots());
  }, [dispatch]);

  const handleDeleteConfirm = async () => {
    if (deleteModal.spotId) {
      await dispatch(deleteSpot(deleteModal.spotId));
      dispatch(fetchUserSpots()); 
      setDeleteModal({ isOpen: false, spotId: null });
    }
  };

  return (
    <div className="manage-spots">
      <h1>Manage Spots</h1>

      {spots.length === 0 ? (
        <div className="no-spots">
          <p>You haven't posted any spots yet.</p>
          <Link to="/spots/create" className="create-spot-link">
            Create a New Spot
          </Link>
        </div>
      ) : (
        <ul className="spot-list">
          {spots?.map((spot) => (
            <li key={spot.id} className="spot-tiles">
              <div className="spot-image" onClick={() => navigate(`/spots/${spot.id}`)}>
                <img src={spot.previewImage} alt={spot.name} />
              </div>

              <div className="spot-info">
                <h3 onClick={() => navigate(`/spots/${spot.id}`)}>{spot.name}</h3>
                <p>{spot.city}, {spot.state}</p>
                <p>⭐ {spot.avgRating || "No ratings yet"}</p>
                <p>${spot.price} / night</p>

                <div className="spot-buttons">
                  <button onClick={() => navigate(`/edit-spot/${spot.id}`)} className="update-btn">
                    Update
                  </button>
                  <button onClick={() => setDeleteModal({ isOpen: true, spotId: spot.id })} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {deleteModal.isOpen && (
        <div className="delete-modal">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            <div className="modal-buttons">
              <button className="delete-confirm-btn" onClick={handleDeleteConfirm}>Yes (Delete Spot)</button>
              <button className="cancel-btn" onClick={() => setDeleteModal({ isOpen: false, spotId: null })}>No (Keep Spot)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSpots;
