import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { selectIsAuth } from "../../redux/slices/auth";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios/axios";
import { Box, Container, Grid, Typography } from "@mui/material";

export const AddPost = () => {
  const userData = useSelector((state) => state.auth.data);
  const { posts } = useSelector((data) => data.post);
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);

  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [getPosts, setGetPosts] = React.useState([]);

  const inputRef = useRef(null);

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const isEditing = Boolean(id);
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("postFile", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.postFileUrl);
    } catch (error) {
      console.log(error);
      alert("Ошибка при загрузке файла!");
    }
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const fields = {
        title,
        text,
        tags,
        imageUrl,
        user: userData._id,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);
      const _id = isEditing ? id : data.post._id;
      navigate(`/posts/${_id}`);
    } catch (error) {
      console.log(error);
      alert("Ошибка при создании статьи!");
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setImageUrl(data.imageUrl);
          setTitle(data.title);
          setTags(data.tags.join(","));
          setText(data.text);
          setGetPosts(data);
        })
        .catch((err) => {
          console.warn(err);
          alert("Ошибка при получении статьи");
        });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "250px", // Bu yerda heightni qisqartirdik
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  const isChecking = Boolean(userData?._id === getPosts.user?._id);

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  if (getPosts.user?._id !== undefined) {
    if (!isChecking) {
      return <Navigate to="/" />;
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          {isEditing ? "Редактировать статью" : "Создать новую статью"}
        </Typography>

        <Button
          onClick={() => inputRef.current.click()}
          variant="outlined"
          fullWidth
          size="large"
        >
          Загрузить превью
        </Button>
        <input
          ref={inputRef}
          type="file"
          onChange={(event) => handleChangeFile(event)}
          hidden
        />
        {imageUrl && (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={() => onClickRemoveImage()}
              sx={{ marginTop: 2 }}
            >
              Удалить
            </Button>
            <Box sx={{ marginTop: 2 }}>
              <img
                className={styles.image}
                src={`${process.env.REACT_APP_URL}/${imageUrl}`}
                alt="Uploaded"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Box>
          </>
        )}

        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="standard"
          placeholder="Заголовок статьи..."
          fullWidth
          sx={{ marginTop: 2 }}
        />

        <TextField
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          variant="standard"
          placeholder="Тэги"
          fullWidth
          sx={{ marginTop: 2 }}
        />

        <SimpleMDE
          className={styles.editor}
          value={text}
          onChange={onChange}
          options={options}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 3,
          }}
        >
          <Button
            onClick={() => {
              onSubmit();
            }}
            size="large"
            variant="contained"
            fullWidth
            sx={{ marginRight: 2 }}
          >
            {isEditing ? "Сохранить" : "Опубликовать"}
          </Button>
          <Button size="large" variant="outlined" fullWidth href="/">
            Отмена
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
