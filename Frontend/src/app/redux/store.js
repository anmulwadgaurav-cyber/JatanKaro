import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/slices/auth.slice";
import notificationReducer from "../../features/slices/notification.slice";
import itemReducer from "../../features/slices/items.slice";
import displayReducer from "../../features/slices/display.slice";
import searchReducer from "../../features/slices/search.slice";

export default configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    collection: itemReducer,
    display: displayReducer,
    search: searchReducer,
  },
});
