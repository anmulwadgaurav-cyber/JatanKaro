import React, { useEffect } from "react";
import AppRoutes from "./app/app.routes";
import { useAuth } from "./features/auth/hook/useAuth";
import { useDispatch } from "react-redux";
import { setLoading, setUser } from "./features/slices/auth.slice";
import { getMe } from "./features/auth/services/auth.api";
import { ToastContainer } from "react-toastify";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loaduser() {
      try {
        dispatch(setLoading(true));
        const data = await getMe();
        dispatch(setUser(data.user));
      } catch (error) {
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    }
    loaduser();
  }, []);

  return (
    <div className="h-full w-screen font-[mainFont]">
      <AppRoutes />
      <ToastContainer/>
    </div>
  );
};

export default App;
