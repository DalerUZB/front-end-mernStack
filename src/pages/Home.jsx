import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import moment from "moment";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchTags } from "../redux/slices/post";

export const Home = () => {
  let userDataGlobal = null;
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((data) => data.post);

  const [items, setItems] = useState([]);
  const [value, setValue] = useState(1);

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  if (userData) {
    userDataGlobal = userData;
  }
  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);
  useEffect(() => {
    setItems(posts.items);
  }, [posts]);

  function newFunc() {
    const arr = [...items];
    arr.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setItems(arr);
    setValue(0);
  }

  function topFunc() {
    const arr = [...items];
    arr.sort(function (a, b) {
      return b.viewsCount - a.viewsCount;
    });
    setItems(arr);
    setValue(1);
  }
  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={value}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" onClick={newFunc} />
        <Tab label="Популярные" onClick={topFunc} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {isPostsLoading ? (
            <Post isLoading={true} />
          ) : (
            items?.map((obj) => (
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={`http://localhost:1010/${obj.imageUrl}`}
                user={
                  obj.user !== null && {
                    avatarUrl: `http://localhost:1010/${obj?.user?.avatarUrl}`,
                    fullName: obj.user.fullName,
                  }
                }
                createdAt={moment(obj.createdAt).format("LLLL")}
                viewsCount={obj.viewsCount}
                commentsCount={obj.comments.length}
                comments={obj.comments}
                tags={obj.tags}
                isEditable={
                  Boolean(userData) && obj.user?._id === userDataGlobal._id
                }
              />
            ))
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock
            items={tags.items}
            isLoading={isTagsLoading ? true : false}
          />
          {/* <CommentsBlock
            items={[
              {
                user: { fullName: "daler", avatarUrl: "unfeuinf" },
                text: "daler",
              },
            ]}
            isLoading={false}
          /> */}
        </Grid>
      </Grid>
    </>
  );
};
