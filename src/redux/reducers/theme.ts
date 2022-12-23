import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
    name: 'theme',
    initialState: {
        status: true
    },
    reducers: {
        setTheme: (state, action) => {
            state.status = action.payload;
        }
    }
});

export const { setTheme } = slice.actions;
export default slice.reducer;