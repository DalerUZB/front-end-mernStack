import React, { useEffect, useState } from "react";
import { CommentsBlock, Index, Post } from "../components";
import axios from "../axios/axios";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ForTagsComponent } from "../components/ForTagsComponent";

const   FullTags = ({ isLoading }) => {
  const { name } = useParams("name");

  const [datas, setDatas] = useState([]);
  const dataArr = [];
  const data = async () => {
    const { data } = await axios.get("/posts");
    setDatas(data);
  };

  useEffect(() => {
    data();
  }, []);
  const filteredData = datas.filter((item) => item.tags.includes(name));
  console.log(filteredData);
  return (
    <>
      {filteredData.map((obj) => (
        <Post
          key={obj.id}
          id={obj.id}
          title={obj.title}
          imageUrl={`http://localhost:1010/${obj.imageUrl}` || ""}
          user={{
            avatarUrl:
              `http://localhost:1010/${obj.user?.avatarUrl}` ||
              "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png",
            fullName: obj.user?.fullName || "daler",
          }}
          createdAt={obj.createdAt}
          viewsCount={obj.viewsCount}
          commentsCount={obj.comments.length}
          tags={obj.tags}
          isFullPost
        >
          <ReactMarkdown children={obj.text || ""} />
          <ForTagsComponent
            items={obj.comments}
            isLoading={isLoading ? true : false}
          >
            <Index />
          </ForTagsComponent>
        </Post>
      ))}
    </>
  );
};

export default FullTags;
