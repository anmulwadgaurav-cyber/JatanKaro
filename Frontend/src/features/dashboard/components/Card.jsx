import React from "react";
import { Link } from "react-router-dom";
import DetailedCard from "./DetailedCard";
import { useDispatch } from "react-redux";
import { setDetailedDisplay } from "../../slices/display.slice";

const Card = ({
  id,
  date,
  title,
  description,
  tags,
  thumbnail,
  type,
  url,
  keyId,
}) => {
  const dispatch = useDispatch();
  return (
    <div
      className="w-93 hover:scale-102 transition-all ease-in-out duration-200 cursor-pointer active:scale-100 relative"
      key={keyId}
      id="card"
    >
      <div className="absolute flex gap-2 " id="links">
        <a
          href={url}
          target="_blank"
          className="h-9 w-9 flex items-center justify-center rounded-full bg-text text-background hover:scale-110 transition-all ease-in-out duration-200"
        >
          <i class="ri-arrow-right-up-line text-xl font-light"></i>
        </a>
        <a
          href={url}
          target="_blank"
          className="h-9 w-9 flex items-center justify-center rounded-full bg-text text-customRed hover:scale-110 transition-all ease-in-out duration-200"
        >
          <i class="ri-heart-line text-xl font-light"></i>
        </a>
      </div>
      <Link
        onClick={() => dispatch(setDetailedDisplay(true))}
        to={`/card/detail/${id}`}
      >
        <img
          src={thumbnail}
          className="w-full rounded-tr-xl rounded-tl-xl h-50 bg-foreground/30 object-cover"
        />
        <div className="w-full h-60 p-5 text-[14px] font-medium bg-card flex flex-col gap-5 rounded-br-xl rounded-bl-xl">
          <div className="flex flex-col justify-between h-full">
            <div>
              <p className="font-light text-[14px] text-secondary/70">
                {date} · {type}
              </p>
              <div>
                <p className="text-[16px] py-2">
                  {title.split("").length > 65
                    ? title.slice(0, 65) + "..."
                    : title}
                </p>
                <p className="text-secondary/70 ">
                  {description.split("").length > 70
                    ? description.slice(0, 70) + "..."
                    : description}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(tags) && tags.length > 0 ? (
                tags.map((tag, idx) => {
                  return (
                    <p
                      key={idx}
                      className="px-4 py-1 text-[14px] bg-shade rounded-full"
                    >
                      {tag}
                    </p>
                  );
                })
              ) : (
                <p className="px-4 py-1 text-[14px] bg-shade rounded-full">
                  No tags
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
