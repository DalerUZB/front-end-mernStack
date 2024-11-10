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
  console.log(imageUrl);
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("postFile", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.postFileUrl);
    } catch (error) {
      console.log(error);
      alert("ошибка при загрузке файла!");
    }
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const fileds = {
        title,
        text,
        tags,
        imageUrl,
        user: userData._id,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fileds)
        : await axios.post("/posts", fileds);
      const _id = isEditing ? id : data.post._id;
      navigate(`/posts/${_id}`);
    } catch (error) {
      console.log(error);
      alert("ошибка при созданиыа стати!");
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
          alert("ошибка при получения стати");
        });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
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
  const isCheking = Boolean(userData?._id === getPosts.user?._id);
  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  if (getPosts.user?._id !== undefined) {
    if (!isCheking) {
      return <Navigate to="/" />;
    }
  }
  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputRef.current.click()}
        variant="outlined"
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
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:1010/${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}

      <br />
      <br />
      <TextField
        value={title}
        classes={{ root: styles.title }}
        onChange={(e) => setTitle(e.target.value)}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
      />
      <TextField
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button
          onClick={() => {
            onSubmit();
          }}
          size="large"
          variant="contained"
        >
          {isEditing ? "сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
