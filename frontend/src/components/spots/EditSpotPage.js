import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateSpot } from '../../features/SpotsSlice';
import "../styles/editSpotPage.css";

const EditSpotPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const spot = useSelector(state =>
        state.spots.userSpots.find(spot => spot.id === parseInt(id))
    );
    

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        country: '',
        description: '',
        price: '',
        imageUrl: '' 
    });


    useEffect(() => {
        if (spot) {
            setFormData({
                name: spot.name,
                city: spot.city,
                state: spot.state,
                address: spot.address || '',
                country: spot.country || '',
                description: spot.description || '',
                price: spot.price || '',
                imageUrl: spot.previewImage || '' 
            });
        }
    }, [spot]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        
        console.log("Updating Spot with Data:", formData); 
    
        if (spot) {
            dispatch(updateSpot({ id: spot.id, updatedData: formData }))
                .unwrap()  
                .then(() => {
                    navigate(`/spots/${spot.id}`);
                })
                .catch((error) => console.error("Update failed:", error));
        }
    };
    
    if (!spot) return <p>Spot not found!</p>;

    return (
        <div className="edit-container">
            <h2>Update your Spot</h2>
            <form onSubmit={handleUpdate}>
                <label>
                    Name:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </label>
                <label>
                    City:
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                </label>
                <label>
                    State:
                    <input type="text" name="state" value={formData.state} onChange={handleChange} required />
                </label>
                <label>
                    Address:
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                </label>
                <label>
                    Country:
                    <input type="text" name="country" value={formData.country} onChange={handleChange} required />
                </label>
                <label>
                    Description:
                    <textarea name="description" value={formData.description} onChange={handleChange} required />
                </label>
                <label>
                    Price:
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                </label>
                <label>
                    Image URL (Optional):
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                </label>
                <div className="button-group">
                    <button type="submit" className="save-button">Update your Spot</button>
                    <button type="button" className="cancel-button" onClick={() => navigate(`/spots/${spot.id}`)}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditSpotPage;
