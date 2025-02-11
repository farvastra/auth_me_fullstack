import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSpot } from '../../features/SpotsSlice';
import { useNavigate } from "react-router-dom";
import "../styles/createSpotForm.css";

const CreateSpotForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        state: '',
        country: '',
        lat: '',
        lng: '',
        name: '',
        description: '',
        price: ''
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        let newErrors = {};
      
        // Check for empty fields.
        Object.keys(formData).forEach((key) => {
          if (!formData[key]) {
            newErrors[key] = "This field is required!";
          }
        });
      
        // Validate Price: Must be a positive number.
         if (formData.price) {
          const priceValue = parseFloat(formData.price);
          if (isNaN(priceValue) || priceValue <= 0) {
            newErrors.price = "Price per day must be a positive number";
          }
        }
      
        // Validate Latitude: Must be a valid number between -90 and 90.
        if (formData.lat) {
          const latValue = parseFloat(formData.lat);
          if (isNaN(latValue)) {
            newErrors.lat = "Latitude must be a valid number";
          } else if (latValue < -90 || latValue > 90) {
            newErrors.lat = "Latitude must be within -90 and 90";
          }
        }
      
        // Validate Longitude: Must be a valid number between -180 and 180.
        if (formData.lng) {
          const lngValue = parseFloat(formData.lng);
          if (isNaN(lngValue)) {
            newErrors.lng = "Longitude must be a valid number";
          } else if (lngValue < -180 || lngValue > 180) {
            newErrors.lng = "Longitude must be within -180 and 180";
          }
        }
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
      };
      

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        dispatch(createSpot(formData));
        navigate("/spots");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create New Spot</h2>
            {Object.keys(formData).map(key => (
                <div key={key}>
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                        type="text"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                    />
                    {errors[key] && <span>{errors[key]}</span>}
                </div>
            ))}
            <button type="submit">Create Spot</button>
        </form>
    );
};

export default CreateSpotForm;
