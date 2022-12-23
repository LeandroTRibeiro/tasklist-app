import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
    name: 'loading',
    initialState: {
        status: true
    },
    reducers: {
        setLoading: (state, action) => {
            state.status = action.payload;
        }
    }
});

export const { setLoading } = slice.actions;
export default slice.reducer;