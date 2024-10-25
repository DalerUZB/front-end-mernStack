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
    axios
      .get(`/posts/${id}`)
      .then(({ data }) => {
        setOnePosts(data);
        setIsloading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("ощибка при получении статьи");
      });
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }
  return (
    <>
      <Post
        id={onePosts._id}
        title={onePosts.title}
        imageUrl={
          onePosts.imageUrl && `http://localhost:1010/${onePosts?.imageUrl}`
        }
        user={
          onePosts.user !== null && {
            avatarUrl: `http://localhost:1010/${onePosts?.user?.avatarUrl}`,
            fullName: onePosts.user.fullName,
          }
        }
        createdAt={moment(onePosts.createdAt).endOf("day").fromNow()}
        viewsCount={onePosts.viewsCount}
        commentsCount={onePosts.comments.length}
        tags={onePosts.tags !== undefined ? onePosts.tags : []}
        isFullPost
      >
        <ReactMarkdown children={onePosts.text} />
      </Post>

      <CommentsBlock items={[onePosts]} isLoading={false}>
        <Index />
      </CommentsBlock>
    </>
  );
};
