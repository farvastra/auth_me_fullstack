import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance, {restoreCSRF} from '../utils/axiosInstance'; 
const API_BASE_URL = 'https://auth-me-backend.onrender.com/api/spots';

// Fetch all spots
// export const fetchSpots = createAsyncThunk('spots/fetchSpots', async () => {
//     const response = await axiosInstance.get(`${API_BASE_URL}/current`, );
//     console.log("resp",response.data.Spots);
//     return response.data.Spots;  
// });

// Fetch all spots by current user
export const fetchSpots = createAsyncThunk('spots/fetchSpots', async () => {

    restoreCSRF().then(() => {
        console.log("✅ CSRF Token restored, safe to make requests.");
      });
    const response = await axiosInstance.get(`${API_BASE_URL}/current`);
    console.log("resp", response.data.Spots);
    return response.data.Spots;
});

// Create a new spot
export const createSpot = createAsyncThunk('spots/createSpot', async (spotData) => {
    try {
        const response = await axiosInstance.post(API_BASE_URL, spotData, {
            withCredentials: true, 
          }); 
        return response.data; 
    } catch (error) {
        throw new Error('Failed to create spot');
    }
});

// Update a spot
export const updateSpot = createAsyncThunk('spots/updateSpot', async ({ id, updatedData }) => {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, updatedData); 
        return response.data; 
    } catch (error) {
        throw new Error('Failed to update spot');
    }
});

// Delete a spot
export const deleteSpot = createAsyncThunk('spots/deleteSpot', async (id) => {
    try {
        await axiosInstance.delete(`${API_BASE_URL}/${id}`); 
        return id; 
    } catch (error) {
        throw new Error('Failed to delete spot');
    }
});

const spotSlice = createSlice({
    name: 'spots',
    initialState: { spots: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSpots.fulfilled, (state, action) => {
                state.spots = Array.isArray(action.payload) ? action.payload : [];
                state.status = 'succeeded';
            })
            .addCase(createSpot.fulfilled, (state, action) => {
                state.spots.push(action.payload);
            })
            .addCase(updateSpot.fulfilled, (state, action) => {
                const index = state.spots.findIndex(spot => spot.id === action.payload.id);
                if (index !== -1) state.spots[index] = action.payload;
            })
            // Handling successful delete action
            .addCase(deleteSpot.fulfilled, (state, action) => {
                state.spots = state.spots.filter(spot => spot.id !== action.payload);
            })
            // Handling fetch failure
            .addCase(fetchSpots.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createSpot.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(updateSpot.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(deleteSpot.rejected, (state, action) => {
                state.error = action.error.message;
            });
            
    }
});

export default spotSlice.reducer;
