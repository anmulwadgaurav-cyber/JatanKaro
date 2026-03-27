import React, { useState } from "react";
import FetchURL from "./FetchURL";
import Manual from "./Manual";
import { setCreateDisplay } from "../../slices/display.slice";
import { useDispatch, useSelector } from "react-redux";

const Create = () => {
  const [form, setForm] = useState(true);
  const dispatch = useDispatch();
  const { createDisplay } = useSelector((state) => state.display);

  function fetchURLForm() {
    setForm(true);
  }
  function fetchManualForm() {
    setForm(false);
  }

  function buttonHandler(e) {
    e.preventDefault();
    dispatch(setCreateDisplay(false));
  }
  return (
    <div className="h-screen w-full bg-background/20 backdrop-blur-sm flex justify-center pt-25 fixed z-10">
      <div
        className={
          createDisplay
            ? !form
              ? "w-100 md:w-150 h-151 bg-card/95 border border-shade rounded-3xl relative"
              : "w-100 md:w-150 h-88 bg-card/95 border border-shade rounded-3xl relative"
            : "hidden"
        }
      >
        <div className="absolute right-0 top-4 w-full flex justify-between items-center px-5">
          <div className="text-xl font-medium flex gap-2 items-center ">
            <i className="ri-apps-2-add-line text-2xl"></i>{" "}
            <p>Create resource</p>
          </div>
          <button onClick={buttonHandler}>
            <i className="ri-close-large-line text-xl cursor-pointer rounded-full text-secondary hover:text-primary"></i>
          </button>
        </div>
        <div className="px-5 absolute top-17 w-full flex flex-col items-center gap-5">
          <div className="flex gap-1 bg-shade p-1 rounded-full">
            <button
              onClick={fetchURLForm}
              className={
                form
                  ? "py-1 px-5 text-black bg-primary rounded-full cursor-pointer"
                  : "bg-none px-5 py-1 cursor-pointer text-secondary"
              }
            >
              Fetch URL
            </button>
            <button
              onClick={fetchManualForm}
              className={
                form
                  ? "py-1 px-5 rounded-full cursor-pointer text-secondary"
                  : "py-1 px-5 bg-primary rounded-full text-black"
              }
            >
              Manual
            </button>
          </div>
          {form ? <FetchURL /> : <Manual />}
        </div>
      </div>
    </div>
  );
};

export default Create;
