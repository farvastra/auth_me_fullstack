import React, {useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchSpots, deleteSpot } from '../../features/SpotsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import "../styles/spotsPage.css";


const SpotsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spots = useSelector(state => state.spots.spots);

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteSpot(id));
    };

    return (
        <div className="spots-container">
            <h1>My Spots</h1>

            {Array.isArray(spots) && spots.length === 0 ? (
                <p>You don't have any spots created yet, <Link to={`/spots/create`} className="add-spot-button">
                Add Spot
              </Link> </p>
            ) : (
                <ul className="spots-list">
                    {Array.isArray(spots) && spots.map(spot => (
                        <li key={spot.id} className="spot-card">
                            <div className="spot-info">
                                <p><strong>{spot.name.charAt(0).toUpperCase() + spot.name.slice(1)}</strong></p>
                                <p>{spot.address}, {spot.city}, {spot.state}, {spot.country}</p>
                            </div>
                            <div className="spot-buttons">
                                <button 
                                    className="edit-button" 
                                    onClick={() => navigate(`/edit-spot/${spot.id}`)}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button 
                                    className="delete-button" 
                                    onClick={() => handleDelete(spot.id)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <button 
                                    className="add-review-button"
                                    onClick={() => navigate(`/add-review/${spot.id}`)}
                                >
                                    Add Review
                                </button>
                                <button 
                                    className="see-reviews-button"
                                    onClick={() => navigate(`/spots/${spot.id}/reviews`)}
                                >
                                    See Reviews
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SpotsPage;
