import React, { useEffect, useState } from "react";
import { useItem } from "../hook/useItem";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  errorMessageToast,
  successMessageToast,
} from "../../slices/notification.slice";
import { setCreateDisplay } from "../../slices/display.slice";

const FetchURL = () => {
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState({
    tags: [],
  });
  const dispatch = useDispatch();
  const { itemLoading } = useSelector((state) => state.collection);

  const navigate = useNavigate();

  const { handleCreateItem } = useItem();

  async function submitHandler(e) {
    e.preventDefault();
    if (url !== "") {
      await handleCreateItem({
        url,
        title: "",
        description: "",
        thumbnail: "",
        type: "",
        tags: tags?.tags || [],
      });
      dispatch(successMessageToast("Item added to dashboard"));
      dispatch(setCreateDisplay(false));
      navigate("/");
    } else {
      dispatch(errorMessageToast("URL field cannot empty"));
    }
  }

  return (
    <form onSubmit={submitHandler} className="flex flex-col w-full">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        type="text"
        placeholder="Paste URL"
        className="p-5 w-full bg-background outline-none rounded-tl-2xl rounded-tr-2xl border-b border-shade"
      />

      <input
        value={tags.tags.join(", ")}
        onChange={(e) =>
          setTags({
            ...tags,
            tags: e.target.value.split(",").map((t) => t.trim()),
          })
        }
        type="text"
        placeholder="Tags (Ai, Product, etc.)"
        className="p-5 w-full bg-background outline-none"
      />

      <button className="p-5 w-full bg-shade outline-none rounded-bl-2xl rounded-br-2xl border-t border-shade cursor-pointer hover:text-black hover:bg-foreground">
        {itemLoading ? <p>Fetching item...</p> : <p>Add to dashbaord</p>}
      </button>
    </form>
  );
};

export default FetchURL;
