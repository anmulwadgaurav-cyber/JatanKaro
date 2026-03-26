import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {},
  reducers: {
    successMessageToast: (state, action) => {
      toast.success(action.payload, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    errorMessageToast: (state, action) => {
      toast.error(action.payload, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  },
});

export const { successMessageToast, errorMessageToast } =
  notificationSlice.actions;
export default notificationSlice.reducer;
