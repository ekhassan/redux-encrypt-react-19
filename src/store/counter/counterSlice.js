import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    counter: 0,
    lastCount: 0,
};

export const counterSlice = createSlice({
    name: "counter", 
    initialState,
    reducers: {
        setCount: (state, action) => {
            state.counter = action.payload;
        },
        increment: (state) => {
            state.lastCount = state.counter;
            state.counter += 1;
        },
        decrement: (state) => {
            state.lastCount = state.counter;
            state.counter -= 1;
        }
    }
});

export const { setCount, increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;