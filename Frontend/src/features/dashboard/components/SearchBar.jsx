import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDrawerDisplay } from "../../slices/display.slice";
import { useItem } from "../hook/useItem";
import CardContainer from "./CardContainer";
import { setActiveTabs } from "../../slices/search.slice";
import { errorMessageToast } from "../../slices/notification.slice";

const SearchBar = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  const { handleGetItems } = useItem();
  const activeTab = useSelector((state) => state.search.activeTab);

  console.log(activeTab);

  async function submitHandler(e) {
    e.preventDefault();

    if (query === "") {
      dispatch(errorMessageToast("Search field cannot be empty"));
    }

    if (activeTab.toLowerCase() === "query") {
      await handleGetItems({ q: query });
    } else if (activeTab.toLowerCase() === "type") {
      await handleGetItems({ type: query });
    } else if (activeTab.toLowerCase() === "tags") {
      await handleGetItems({ tag: query });
    }

    // setQuery("");
  }

  function buttonHandler(e) {
    e.preventDefault();
    dispatch(setDrawerDisplay(true));
    // setDisplay(true);
  }
  return (
    <form
      onSubmit={submitHandler}
      className="w-full flex justify-center items-center"
    >
      <button type="button" onClick={buttonHandler}>
        <i className="ri-menu-2-line text-3xl pr-5 md:hidden"></i>
      </button>
      <div>
        <button
          onClick={() => dispatch(setActiveTabs("query"))}
          className={
            activeTab === "query"
              ? "p-5 w-25 rounded-tl-2xl rounded-bl-2xl bg-customBlue/20 text-customBlue border-r border-shade cursor-pointer"
              : "p-5 w-25 text-secondary hover:text-text hover:bg-shade cursor-pointer rounded-tl-2xl rounded-bl-2xl bg-card border-r border-shade"
          }
        >
          Query
        </button>
        <button
          onClick={() => dispatch(setActiveTabs("type"))}
          className={
            activeTab === "type"
              ? "p-5 w-25 bg-customBlue/20 text-customBlue border-r border-shade cursor-pointer"
              : "p-5 w-25 text-secondary hover:text-text hover:bg-shade cursor-pointer bg-card border-r border-shade"
          }
        >
          Type
        </button>
        <button
          onClick={() => dispatch(setActiveTabs("tags"))}
          className={
            activeTab === "tags"
              ? "p-5 w-25 bg-customBlue/20 text-customBlue border-r border-shade cursor-pointer"
              : "p-5 w-25 text-secondary hover:text-text hover:bg-shade cursor-pointer bg-card border-r border-shade"
          }
        >
          Tag
        </button>
      </div>
      <div className="p-5 bg-card w-full rounded-2xl md:rounded-none flex items-center gap-3 md:w-130 border border-card hover:bg-shade transition-all ease-in-out duration-200">
        <i className="ri-search-line text-secondary"></i>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search anything"
          className="outline-none w-full"
        />
      </div>
      <button
        type="submit"
        className="hidden md:block py-5 px-10 rounded-tr-2xl rounded-br-2xl bg-card border-l border-shade text-secondary hover:bg-primary hover:text-black cursor-pointer hover:border-primary transition-all ease-in-out duration-200"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
