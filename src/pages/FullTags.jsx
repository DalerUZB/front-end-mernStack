import React, { useEffect, useState } from "react";
import { CommentsBlock, Index, Post } from "../components";
import axios from "../axios/axios";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ForTagsComponent } from "../components/ForTagsComponent";

const FullTags = () => {
  const { name } = useParams();
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const data = async () => {
    try {
      const { data } = await axios.get("/posts");
      setDatas(data);
    } catch (err) {
      setError("Ma'lumotni olishda xatolik yuz berdi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    data();
  }, []);
  const filteredData = datas.filter((item) => item.tags.includes(name));

  if (loading) {
    return <p>...Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (filteredData.length === 0) {
    return <p>No tag with this name was found</p>;
  }
  return (
    <>
      {filteredData?.map((obj) => (
        <Post
          key={obj.id}
          id={obj.id}
          title={obj.title}
          imageUrl={`${process.env.REACT_APP_URL}/${obj.imageUrl}` || ""}
          user={{
            avatarUrl:
              `${process.env.REACT_APP_URL}/${obj.user?.avatarUrl}` ||
              "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png",
            fullName: obj.user?.fullName || "?",
          }}
          createdAt={obj.createdAt}
          viewsCount={obj.viewsCount}
          commentsCount={obj.comments.length}
          tags={obj.tags}
          isFullPost
        >
          <ReactMarkdown children={obj.text || ""} />
          <ForTagsComponent items={obj.comments} isLoading={false}>
            <Index />
          </ForTagsComponent>
        </Post>
      ))}
    </>
  );
};

export default FullTags;
