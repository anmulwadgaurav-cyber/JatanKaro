import { createSlice } from "@reduxjs/toolkit";

const displaySlice = createSlice({
  name: "display",
  initialState: {
    createDisplay: false,
    drawerDisplay: false,
    detailedDisplay: false,
  },
  reducers: {
    setCreateDisplay(state, action) {
      state.createDisplay = action.payload;
    },
    setDrawerDisplay(state, action) {
      state.drawerDisplay = action.payload;
    },
    setDetailedDisplay(state, action) {
      state.detailedDisplay = action.payload;
    },
  },
});

export const { setCreateDisplay, setDrawerDisplay, setDetailedDisplay } = displaySlice.actions;
export default displaySlice.reducer;
