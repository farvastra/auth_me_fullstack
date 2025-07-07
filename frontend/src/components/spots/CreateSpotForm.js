import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSpot } from '../../features/SpotsSlice';
import { useNavigate } from "react-router-dom";
import "../styles/createSpotForm.css";

const CreateSpotForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        country: '',
        address: '',
        city: '',
        state: '',
        description: '',
        name: '',
        price: '',
        previewImage: '',
        image1: '',
        image2: '',
        image3: '',
        image4: ''
    });

    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');

    const validate = () => {
        let newErrors = {};
        setGlobalError('');

        // Required fields validation
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.address) newErrors.address = "Street address is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.name) newErrors.name = "Spot name is required";
        if (!formData.previewImage) newErrors.previewImage = "Preview image URL is required";

        // Description length validation
        if (!formData.description) {
            newErrors.description = "Description is required";
        } else if (formData.description.length < 30) {
            newErrors.description = "Description needs 30 or more characters";
        }

        // Price validation
        if (!formData.price) {
            newErrors.price = "Price per night is required";
        } else {
            const priceValue = parseFloat(formData.price);
            if (isNaN(priceValue) || priceValue <= 0) {
                newErrors.price = "Price must be a positive number";
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setGlobalError("Please correct the errors below before submitting...");
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("formdata", formData);
      if (!validate()) return;
  
      try {
          const newSpot = await dispatch(createSpot(formData)).unwrap();
          console.log("newspot", newSpot);
          navigate(`/spots/${newSpot.id}`); 
      } catch (error) {
          setGlobalError("An error occurred while creating the spot, Please try again.");
      }
  };
  

    return (
        <form onSubmit={handleSubmit} className="create-spot-form">
            <h2>Create A New Spot</h2>

            {globalError && <p className="error-message">{globalError}</p>}

            <section>
                <h3>Where's your place located?</h3>
                <p>Guests will only get your exact address once they booked a reservation.</p>

                <label>Country</label>
                <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
                {errors.country && <span className="error-message">{errors.country}</span>}

                <label>Street Address</label>
                <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} />
                {errors.address && <span className="error-message">{errors.address}</span>}

                <label>City</label>
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                {errors.city && <span className="error-message">{errors.city}</span>}

                <label>State</label>
                <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
                {errors.state && <span className="error-message">{errors.state}</span>}
            </section>

            {/* Section 2: Description */}
            <section>
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                <textarea name="description" placeholder="Please write at least 30 characters" value={formData.description} onChange={handleChange} />
                {errors.description && <span className="error-message">{errors.description}</span>}
            </section>

            {/* Section 3: Title */}
            <section>
                <h3>Create a title for your spot</h3>
                <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                <input type="text" name="name" placeholder="Name of your spot" value={formData.name} onChange={handleChange} />
                {errors.name && <span className="error-message">{errors.name}</span>}
            </section>

            {/* Section 4: Price */}
            <section>
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <input type="number" name="price" placeholder="Price per night (USD)" value={formData.price} onChange={handleChange} />
                {errors.price && <span className="error-message">{errors.price}</span>}
            </section>

            {/* Section 5: Photos */}
            <section>
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>

                <label>Preview Image</label>
                <input type="text" name="previewImage" placeholder="Preview Image URL" value={formData.previewImage} onChange={handleChange} />
                {errors.previewImage && <span className="error-message">{errors.previewImage}</span>}

                <label>Image URL</label>
                <input type="text" name="image1" placeholder="Image URL" value={formData.image1} onChange={handleChange} />
                
                <input type="text" name="image2" placeholder="Image URL" value={formData.image2} onChange={handleChange} />
                
                <input type="text" name="image3" placeholder="Image URL" value={formData.image3} onChange={handleChange} />
                
                <input type="text" name="image4" placeholder="Image URL" value={formData.image4} onChange={handleChange} />
            </section>

            <button type="submit">Create Spot</button>
        </form>
    );
};

export default CreateSpotForm;
