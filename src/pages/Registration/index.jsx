import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "../../axios/axios";
import styles from "./Login.module.scss";
import auth, { fetchRegister, selectIsAuth } from "../../redux/slices/auth"; // redux import

export const Registration = () => {
  const [uploadAvatar, setUploadAvatar] = useState(null); // To store avatar preview URL
  const selectAuth = useSelector(selectIsAuth); // Redux state check
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
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
    if (watchPhoto && watchPhoto[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadAvatar(reader.result);
      };
      reader.readAsDataURL(watchPhoto[0]);
    }
  }, [watchPhoto]);

  const onSubmit = async (data) => {
    try {
      if (data.avatarUrl && data.avatarUrl[0]) {
        const formData = new FormData();
        formData.append("avatarUrl", data.avatarUrl[0]);

        const imageData = await axios.post("/upload", formData);
        const imageUrl = imageData.data.avatarUrl;

        const value = {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          avatarUrl: imageUrl,
        };
        console.log(value);

        const response = await dispatch(fetchRegister(value));
        console.log(response);

        if (response.payload.token) {
          window.localStorage.setItem("token", response.payload.token);
          window.location.reload();
        }
      } else {
        console.error("Avatar file is required");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (selectAuth) {
    return <Navigate to="/" />;
  }

  // Styled input for hidden file input
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
        {uploadAvatar ? (
          <img src={uploadAvatar} width={100} height={100} alt="avatar" />
        ) : (
          <Avatar sx={{ width: 100, height: 100 }} />
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="file"
            {...register("avatarUrl", {
              required: "A picture is required here",
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
