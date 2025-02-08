import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateSpot } from '../../features/SpotsSlice';

const EditSpotPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const spot = useSelector(state => 
        state.spots.spots.find(spot => spot.id === parseInt(id))
    );

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        country: '',
        lat: '',
        lng: '',
        description: '',
        price: ''
    });

    useEffect(() => {
        if (spot) {
            setFormData({
                name: spot.name,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: spot.lat || '',
                lng: spot.lng || '',
                description: spot.description || '',
                price: spot.price || ''
            });
        }
    }, [spot]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (spot) {
            dispatch(updateSpot({ id: spot.id, updatedData: formData }))
                .then(() => {
                    navigate('/spots'); 
                })
                .catch((error) => console.error('Update failed:', error));
        }
    };

    if (!spot) return <p>Spot not found!</p>;

    return (
        <div className="edit-container">
            <h2>Edit Spot</h2>
            <form onSubmit={handleUpdate}>
                <label>
                    Name:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </label>
                <label>
                    Address:
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </label>
                <label>
                    City:
                    <input type="text" name="city" value={formData.city} onChange={handleChange} />
                </label>
                <label>
                    State:
                    <input type="text" name="state" value={formData.state} onChange={handleChange} />
                </label>
                <label>
                    Country:
                    <input type="text" name="country" value={formData.country} onChange={handleChange} />
                </label>
                <label>
                    Latitude:
                    <input type="number" name="lat" value={formData.lat} onChange={handleChange} />
                </label>
                <label>
                    Longitude:
                    <input type="number" name="lng" value={formData.lng} onChange={handleChange} />
                </label>
                <label>
                    Description:
                    <textarea name="description" value={formData.description} onChange={handleChange} />
                </label>
                <label>
                    Price:
                    <input type="number" name="price" value={formData.price} onChange={handleChange} />
                </label>
                <div className="button-group">
                    <button type="submit" className="save-button">Save</button>
                    <button type="button" className="cancel-button" onClick={() => navigate('/')}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditSpotPage;
