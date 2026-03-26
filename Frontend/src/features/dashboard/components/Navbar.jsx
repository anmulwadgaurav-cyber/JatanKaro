import React, { useState } from "react";
import Drawer from "./Drawer";
import Create from "./Create";
import { useDispatch, useSelector } from "react-redux";
import { setDrawerDisplay, setCreateDisplay } from "../../slices/display.slice";
import SearchBar from "./SearchBar";

const Navbar = () => {
  // const [display, setDisplay] = useState(false); //drawer
  // const [createDisplay, setCreateDisplay] = useState(false);

  const dispatch = useDispatch();
  // const drawerDisplay = useSelector((state) => state.display.drawerDisplay);
  // const createDisplay = useSelector((state) => state.display.createDisplay);

  const { drawerDisplay, createDisplay } = useSelector(
    (state) => state.display,
  );

  function buttonHandler(e) {
    e.preventDefault();
    dispatch(setDrawerDisplay(true));
    // setDisplay(true);
  }

  function createHandler(e) {
    e.preventDefault();
    dispatch(setCreateDisplay(true));
    // setCreateDisplay(true);
  }

  return (
    <section className="text-[16px] border-b border-shade">
      {drawerDisplay && <Drawer />}
      {createDisplay && <Create />}
      <div className="w-full p-4 md:px-10 flex md:justify-center justify-between  items-center">
        <a
          href="/"
          className="text-3xl font-bold w-40  text-primary hidden md:block"
        >
          JatanKaro
        </a>

        <SearchBar />

        <div className="md:w-40 h-full ">
          <div className="h-full w-full flex justify-end ">
            <button
              onClick={createHandler}
              className="py-4 flex items-center md:mr-3 ml-2 justify-center gap-1 px-7 rounded-full bg-card text-text hover:bg-primary  hover:text-black cursor-pointer transition-all ease-in-out duration-200"
            >
              <i className="ri-add-fill text-2xl"></i>
              <p className="font-bold md:block hidden">Create</p>
            </button>
            <button
              onClick={buttonHandler}
              className=" hidden md:block items-center justify-center px-7 rounded-full bg-card text-secondary hover:bg-shade hover:text-text cursor-pointer transition-all ease-in-out duration-200"
            >
              <i className="ri-menu-line text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
