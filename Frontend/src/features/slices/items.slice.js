import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "./auth.slice";

const itemSlice = createSlice({
  name: "collection",
  initialState: {
    items: [],
    selectedItem: null,
    itemLoading: false,
    error: null,
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      state.items.unshift(action.payload); // top pe add (latest feel) unshift adds item to the beginning of and array
    },
    addParticularItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    updateItem: (state, action) => {
      const updatedItem = action.payload;
      // console.log("PAYLOAD", action.payload)
      //Update List
      state.items = state.items.map((item) =>
        item._id === updatedItem._id ? updatedItem : item,
      );

      // update detailed view
      if (state.selectedItem?._id === updatedItem._id) {
        state.selectedItem = updatedItem;
      }
    },
    setItemLoading(state, action) {
      state.itemLoading = true;
      state.error = null;
    },
    setItemError(state, action) {
      state.error = action.payload;
      state.itemLoading = false;
    },
  },
});

export const {
  addItem,
  setItems,
  updateItem,
  setItemError,
  setItemLoading,
  addParticularItem,
} = itemSlice.actions;
export default itemSlice.reducer;
