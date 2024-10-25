import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import auth, { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "../../axios/axios";

export const Registration = () => {
  const [uploadAvatar, setUploadAvatar] = useState(null);
  const selectAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      avatarUrl: null,
    },
    mode: "onChange",
  });

  const watchPhoto = watch("avatarUrl");
  useEffect(() => {
    if (watchPhoto && watchPhoto.length > 0) {
    }
  }, [watchPhoto]);
  const onSubmit = async (event) => {
    try {
      const formData = new FormData();

      formData.append(
        "avatarUrl",
        event.avatarUrl[0],
        `${event.avatarUrl[0].name}`
      );
      const dataimageUrl = await axios.post("/upload", formData);

      const value = {
        fullName: event.fullName,
        email: event.email,
        password: event.password,
        avatarUrl: dataimageUrl.data.url,
      };
      const data = await dispatch(fetchRegister(value));
      if (!data.payload) {
        return alert("не удалось Регистрация");
      }
      if (data.payload.token) {
        window.localStorage.setItem("token", data.payload.token);
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (selectAuth) {
    return <Navigate to="/" />;
  }
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>

      <div className={styles.avatar}>
        <img
          src={`http://localhost:1010/${uploadAvatar}`}
          width={100}
          height={100}
          alt=""
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="file"
            {...register("avatarUrl", {
              required: "a picture is required here",
            })}
          />
        </div>
        <TextField
          {...register("fullName", { required: "укажите имя" })}
          className={styles.field}
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          type="name"
          label="Полное имя"
          autoComplete="off"
          fullWidth
        />
        <TextField
          {...register("email", { required: "укажите емаил" })}
          className={styles.field}
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          label="E-Mail"
          autoComplete="off"
          fullWidth
        />
        <TextField
          {...register("password", { required: "укажите парол" })}
          type="password"
          className={styles.field}
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          label="Пароль"
          autoComplete="off"
          fullWidth
        />
        <Button
          type="submit"
          disabled={false}
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
