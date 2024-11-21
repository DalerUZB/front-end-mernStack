import React, { useEffect, useState } from "react";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from "../axios/axios";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

// Import MUI components
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Grid,
} from "@mui/material";

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
      alert("Произошла ошибка при получении статьи.");
    }
  }, [id]);

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box
            sx={{
              backgroundColor: "white",
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
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
              <Typography variant="h4" gutterBottom>
                {onePosts.title}
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  display: "block", // Kerakli joyni to'ldirish
                  maxHeight: "none", // Balandlikni cheklamaysiz
                  overflowY: "auto", // Pastga qarab skroll qilish imkoniyati
                  height: "auto", // Kontentga mos ravishda balandlikni sozlash
                  wordWrap: "break-word", // So'zlarni qisqartirish
                }}
              >
                <ReactMarkdown>{onePosts.text}</ReactMarkdown>
              </Typography>
            </Post>
          </Box>
        </Grid>

        {/* Comments Section */}
        <Grid item xs={12}>
          <CommentsBlock items={[onePosts]} isLoading={false}>
            <Index />
          </CommentsBlock>
        </Grid>
      </Grid>
    </Container>
  );
};
