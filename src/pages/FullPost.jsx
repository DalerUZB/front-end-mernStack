import React, { useEffect, useState } from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from "../axios/axios";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

export const FullPost = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);

  const { id } = useParams();

  const [onePosts, setOnePosts] = useState([]);

  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    try {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setOnePosts(data);
        setIsloading(false);
      });
    } catch (error) {
      console.warn(error);
      alert("ощибка при получении статьи  ");
    }
  }, []);
  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      {isLoading ? (
        <div>... Loading</div>
      ) : (
        <>
          <Post
            id={onePosts._id}
            title={onePosts.title}
            imageUrl={
              onePosts.imageUrl &&
              `${process.env.REACT_APP_URL}/${onePosts?.imageUrl}`
            }
            user={{
              avatarUrl: `${process.env.REACT_APP_URL}/${onePosts?.user?.avatarUrl}`,
              fullName: onePosts.user?.fullName,
            }}
            createdAt={moment(onePosts.createdAt).endOf("day").fromNow()}
            viewsCount={onePosts.viewsCount}
            commentsCount={onePosts.comments?.length}
            tags={onePosts.tags}
            isFullPost
          >
            <ReactMarkdown children={onePosts.text} />
          </Post>

          <CommentsBlock items={[onePosts]} isLoading={false}>
            <Index />
          </CommentsBlock>
        </>
      )}
    </>
  );
};
