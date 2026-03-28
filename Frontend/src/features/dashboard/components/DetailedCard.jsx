import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useItem } from "../hook/useItem";
import { setDetailedDisplay } from "../../slices/display.slice";
import { successMessageToast } from "../../slices/notification.slice";
import { addParticularItem } from "../../slices/items.slice";

const DetailedCard = () => {
  const params = useParams();
  const itemId = params.id;
  const {
    handleGetItemById,
    handleUpdateItemById,
    handleDeleteItemById,
    handleRealtedItemsById,
  } = useItem();
  const display = useSelector((state) => state.display.detailedDisplay);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.collection.selectedItem);
  const related = useSelector((state) => state.collection.relatedItem);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
  });

  //prefill data
  useEffect(() => {
    if (data) {
      setFormData({
        title: data?.title || "",
        description: data?.description || "",
        tags: data?.tags || [],
      });
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      handleRealtedItemsById(itemId);
    }
  }, [data]);

  function updateHandler() {
    // e.preventDefault();
    handleUpdateItemById({
      id: itemId,
      title: formData.title,
      description: formData.description,
      tags: formData.tags,
      type: data.type,
      thumbnail: data.thumbnail,
    });
    console.log(data);
    dispatch(successMessageToast("Item updated successfully"));
    setIsEditing(false);
  }

  function deleteHandler() {
    handleDeleteItemById(itemId);
    dispatch(successMessageToast("Item deleted successfully"));
    dispatch(setDetailedDisplay(false));
    navigate("/");
  }

  const getYoutubeId = (url) => {
    if (!url) return "";
    if (url.includes("youtu.be")) return url.split("/").pop();
    return url.split("v=")[1]?.split("&")[0];
  };

  const date = new Date(data?.createdAt).toLocaleDateString("en-GB");

  const videoId = getYoutubeId(data?.url);

  function closeDisplayHandler() {
    dispatch(setDetailedDisplay(false));
    return navigate("/");
  }
  useEffect(() => {
    handleGetItemById(itemId);
  }, [itemId]);

  function relatedItemClickHandler(item) {
    if (item._id === data._id) return;
    setIsEditing(false);
    dispatch(addParticularItem(item));
    // handleGetItemById(item._id);
    handleRealtedItemsById(item._id);
  }

  return (
    <div
      className={
        display
          ? "backdrop-blur-sm w-full h-screen text-text fixed flex items-center justify-center text-[16px] z-10"
          : "hidden"
      }
    >
      <div className="bg-card/95 w-350 h-190 text-text rounded-2xl border border-shade flex flex-col overflow-hidden">
        <div className="border-b border-shade px-10 py-5 flex justify-between items-center uppercase ">
          <div className="flex gap-5 items-center">
            <p className="text-secondary">{data?.type}</p>
            <p> · </p>
            <p className="text-secondary capitalize">{date}</p>
            <p> · </p>
            <a
              href={data?.url}
              target="_blank"
              className="flex items-center gap-2 cursor-pointer hover:text-customBlue"
            >
              <p>Go to Url</p>
              <i className="ri-external-link-line text-2xl"></i>
            </a>
            {isEditing ? (
              <p className="text-customBlue bg-customBlue/20 px-4 rounded-full">
                Edit Mode
              </p>
            ) : (
              ""
            )}
          </div>
          <button
            onClick={closeDisplayHandler}
            className="text-end hover:text-primary cursor-pointer"
          >
            <i className="ri-close-fill text-3xl"></i>
          </button>
        </div>
        <div className="p-5 w-full h-full flex">
          {data?.type === "image" ? (
            <img
              src={
                data.thumbnail.includes("Image_not_available")
                  ? data?.url
                  : data.thumbnail
              }
              alt=""
              className="h-100 rounded-tl-xl rounded-bl-xl w-170 object-cover"
            />
          ) : (
            <iframe
              src={
                data?.url.includes("youtube" || "youtu.be")
                  ? `https://www.youtube.com/embed/${videoId}`
                  : `https://docs.google.com/viewer?url=${data.url}&embedded=true`
              }
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-170 h-100 aspect-video rounded-tl-xl rounded-bl-xl"
            />
          )}
          <div className="flex flex-col bg-background h-100 w-170 rounded-tr-xl rounded-br-xl">
            <div className="border-b border-shade p-5 h-30 flex items-center">
              {isEditing ? (
                <textarea
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full font-medium text-2xl border-b border-secondary max-h-fit outline-none pb-1"
                  placeholder="Edit title"
                />
              ) : (
                <p className="text-2xl w-full font-medium py-2">
                  {data?.title}
                </p>
              )}
            </div>
            <div className="p-5 border-b border-shade h-32 flex items-start">
              {isEditing ? (
                <textarea
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full text-text border-b max-h-fit border-secondary h-full outline-none pb-1"
                  placeholder="Edit description"
                />
              ) : (
                <p className="w-full text-secondary">{data?.description}</p>
              )}
            </div>
            <div className="px-5 py-3 border-b border-shade flex gap-2 h-18 items-center">
              {isEditing ? (
                <input
                  value={formData.tags.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value.split(",").map((t) => t.trim()),
                    })
                  }
                  placeholder="AI, Maketing, Jobs"
                  className="w-full outline-none bg-transparent border-b border-secondary pb-1 text-text"
                />
              ) : data?.tags && data.tags.length > 0 ? (
                data.tags.map((tag) => {
                  return (
                    <p className=" text-secondary px-5 py-2 rounded-full bg-card h-fit capitalize">
                      {tag}
                    </p>
                  );
                })
              ) : (
                <p className="text-secondary px-5 py-2 rounded-full bg-card h-fit">
                  No tags
                </p>
              )}
            </div>

            {isEditing ? (
              <div className="p-5 flex gap-2">
                <button
                  onClick={() => {
                    updateHandler();
                  }}
                  className="px-5 py-3 flex items-center gap-1 bg-customBlue/20 rounded-full text-customBlue hover:bg-text  cursor-pointer active:scale-95"
                >
                  <i className="ri-save-line text-xl"></i>
                  <p>Save Changes</p>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-3 flex items-center gap-1 border border-secondary rounded-full text-secondary hover:border-text hover:text-text  cursor-pointer active:scale-95"
                >
                  <i className="ri-close-large-line text-xl"></i>
                  <p>Cancel</p>
                </button>
              </div>
            ) : (
              <div className="p-5 flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(true);
                  }}
                  className="px-5 py-3 flex items-center gap-1 bg-text rounded-full text-background hover:bg-text/90  cursor-pointer active:scale-95"
                >
                  <i className="ri-pencil-line text-xl"></i>
                  <p>Update</p>
                </button>
                <button
                  onClick={() => {
                    deleteHandler();
                  }}
                  className="px-5 py-3 flex items-center gap-1 border border-text rounded-full text-text hover:border-customRed hover:text-customRed  cursor-pointer active:scale-95"
                >
                  <i className="ri-delete-bin-7-line text-xl"></i>
                  <p>Delete</p>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className=" p-5 h-full border-t border-shade flex gap-5">
          {related?.map((item) => {
            return (
              <Link
                onClick={() => relatedItemClickHandler(item)}
                to={`/card/detail/${itemId}`}
                className="hover:scale-102 transition-all ease-in-out duration-200"
              >
                {item.type?.toLowerCase() === "article" ? (
                  <img
                    src="https://www.scriptorium.com/wp-content/uploads/2025/01/Blog-featured-images-3.png"
                    className="w-55 h-35 object-cover rounded-xl"
                  />
                ) : (
                  <img
                    src={
                      item.thumbnail.includes("Image_not_available")
                        ? item.url
                        : item.thumbnail
                    }
                    className="w-55 h-35 object-cover rounded-xl"
                  />
                )}
                <div className="w-50 text-[14px]">
                  <p>{item.title.slice(0, 40) + "..."}</p>
                  <p className="text-secondary text-sm">
                    {new Date(item.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DetailedCard;
