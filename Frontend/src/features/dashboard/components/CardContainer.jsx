import React, { useEffect } from "react";
import Card from "./Card";
import { useSelector } from "react-redux";
import { useItem } from "../hook/useItem";

const CardContainer = () => {
  const { handleGetItems } = useItem();

  const results = useSelector((state) => state.collection.items);

  useEffect(() => {
    async function getItem() {
      await handleGetItems();
    }
    getItem();
  }, []);

  const contents = useSelector((state) => state.collection.items);

  console.log(contents);

  return (
    <div className="p-10 flex gap-5 flex-wrap h-full w-full">
      {results.length > 0 ? (
        contents.map((content, idx) => {
          return (
            <Card
              keyId={idx}
              id={content._id}
              thumbnail={content.thumbnail}
              date={content.createdAt.split("T")[0].replaceAll("-", "/")}
              type={content.type.toUpperCase()}
              title={content.title}
              description={content.description}
              tags={content.tags}
              url={content.url}
            />
          );
        })
      ) : (
        <div className="flex flex-col items-center gap-5 justify-center pt-50 w-full">
          <i className="ri-search-2-line text-6xl"></i>
          <div className="flex flex-col gap-1 items-center text-center">
            <p className="text-2xl">No results found</p>
            <p className="text-[16px] text-secondary">
              Try different keywords or remove search filters
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardContainer;

//  +" · " + content.createdAt.split("T")[1].substring(1, 5);
