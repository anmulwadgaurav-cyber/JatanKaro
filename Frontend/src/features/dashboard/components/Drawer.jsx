import React, { useState } from "react";
import { useAuth } from "../../auth/hook/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { setDrawerDisplay } from "../../slices/display.slice";

const Drawer = () => {
  const { handleLogout } = useAuth();
  const dispatch = useDispatch();
  const { drawerDisplay } = useSelector((state) => state.display);

  function buttonHandler(e) {
    e.preventDefault();
    dispatch(setDrawerDisplay(false));
    // setDisplay(false);
  }

  async function logoutButton(e) {
    e.preventDefault();
    await handleLogout();
  }

  return (
    <div className="h-screen w-full bg-background/50 fixed backdrop-blur-sm z-10">
      <div
        className={
          drawerDisplay
            ? "h-screen absolute bg-card w-[60%] shadow-2xl md:right-0 md:w-[20%]"
            : "hidden md:hidden"
        }
      >
        <div className="w-full h-full relative">
          <div className="absolute top-5 px-5 w-full flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary md:hidden">
              JatanKaro
            </h1>
            <button onClick={buttonHandler}>
              <i className="ri-close-large-line text-xl cursor-pointer p-3 rounded-full hover:bg-shade transition-all ease-in-out duration-200"></i>
            </button>
          </div>
          <div className="absolute top-20 px-5 text-xl md:text-[16px] flex flex-col gap-4 md:gap-2 w-full">
            <button className="flex gap-3 cursor-pointer md:py-2 md:px-3 rounded-full hover:bg-shade w-full items-center transition-all ease-in-out duration-200">
              <i className="ri-user-3-line text-xl text-secondary"></i>
              Account
            </button>
            <button className="flex gap-3 cursor-pointer md:py-2 md:px-3 rounded-full hover:bg-shade w-full items-center transition-all ease-in-out duration-200">
              <i className="ri-settings-line text-xl text-secondary"></i>
              Settings
            </button>
            <button
              onClick={logoutButton}
              className="flex gap-3 cursor-pointer md:py-2 md:px-3 rounded-full hover:bg-shade w-full items-center transition-all ease-in-out duration-200"
            >
              <i className="ri-logout-box-line text-xl text-secondary"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
