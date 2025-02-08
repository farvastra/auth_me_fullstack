import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSpot } from '../../features/SpotsSlice';
import { useNavigate } from "react-router-dom";

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
        Object.keys(formData).forEach(key => {
            if (!formData[key]) newErrors[key] = 'This field is required';
        });
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
