import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
    name: 'reverseList',
    initialState: {
        status: false
    },
    reducers: {
        setReverse: (state, action) => {
            state.status = action.payload;
        }
    }
});

export const { setReverse } = slice.actions;
export default slice.reducer;