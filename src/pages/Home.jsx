import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchTags } from "../redux/slices/post";
import { CircularProgress } from "@mui/material";

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags, comments } = useSelector((state) => state.post);

  const [items, setItems] = useState([]);
  const [value, setValue] = useState(0);

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);
  useEffect(() => {
    if (posts.items) setItems(posts.items);
  }, [posts]);

  const sortByDate = () => {
    const sortedItems = [...items].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setItems(sortedItems);
    setValue(0);
  };

  const sortByPopularity = () => {
    const sortedItems = [...items].sort((a, b) => b.viewsCount - a.viewsCount);
    setItems(sortedItems);
    setValue(1);
  };
  console.log(procces);
  return (
    <>
      <Tabs
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        aria-label="sort tabs"
        style={{ marginBottom: 15 }}
      >
        <Tab label="Новые" onClick={sortByDate} />
        <Tab label="Популярные" onClick={sortByPopularity} />
      </Tabs>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {isPostsLoading ? (
            <div style={{ textAlign: "center", width: "100%" }}>
              <CircularProgress />
            </div>
          ) : items.length ? (
            items.map((obj) => (
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={`http://localhost:1010/${obj.imageUrl}`}
                user={
                  obj.user
                    ? {
                        avatarUrl: `http://localhost:1010/${obj.user.avatarUrl}`,
                        fullName: obj.user?.fullName,
                      }
                    : {}
                }
                createdAt={new Intl.DateTimeFormat("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(obj.createdAt))}
                viewsCount={obj.viewsCount}
                commentsCount={obj.comments?.length}
                comments={obj.comments}
                tags={obj.tags}
                isEditable={userData && obj.user?._id === userData._id}
              />
            ))
          ) : (
            <div>No posts available</div>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {isTagsLoading ? (
            <CircularProgress />
          ) : (
            <TagsBlock items={tags.items} />
          )}
        </Grid>
      </Grid>
    </>
  );
};
