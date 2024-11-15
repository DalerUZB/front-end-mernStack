import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import axios from "../../axios/axios";
import styles from "../Registration/Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";

export const Registration = () => {
  const [fullName, setFullName] = useState(""); // Full Name
  const [email, setEmail] = useState(""); // Email
  const [password, setPassword] = useState(""); // Password
  const [avatarUrl, setAvatarUrl] = useState(null); // Avatar
  const [uploadAvatar, setUploadAvatar] = useState(null); // Avatar preview

  const [errors, setErrors] = useState({}); // Errors state
  const selectAuth = useSelector(selectIsAuth); // Redux auth state
  const dispatch = useDispatch();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadAvatar(reader.result);
          setAvatarUrl(file); // Store the file
        };
        reader.readAsDataURL(file);
      } else {
        alert("Faqat rasm fayllari (JPEG, PNG) qabul qilinadi!");
        e.target.value = ""; // Faylni tozalash
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    const validationErrors = {};
    if (!fullName) validationErrors.fullName = "Укажите имя";
    if (!email) validationErrors.email = "Укажите емаил";
    if (!password) validationErrors.password = "Укажите парол";
    if (!avatarUrl) validationErrors.avatarUrl = "A picture is required here";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (avatarUrl) {
        const formData = new FormData();
        formData.append("avatarUrl", avatarUrl);

        const imageData = await axios.post("/upload", formData);
        const imageUrl = imageData.data.avatarUrl;

        const value = {
          fullName,
          email,
          password,
          avatarUrl: imageUrl,
        };

        const response = await dispatch(fetchRegister(value));

        if (response.payload.token) {
          window.localStorage.setItem("token", response.payload.token);
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
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
        {uploadAvatar ? (
          <img src={uploadAvatar} width={100} height={100} alt="avatar" />
        ) : (
          <Avatar sx={{ width: 100, height: 100 }} />
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.uploadBtn}>
          <label htmlFor="avatar" className={styles.uploadLabel}>
            <CloudUploadIcon style={{ marginRight: "8px" }} />
            Загрузить фото
          </label>
          <VisuallyHiddenInput
            id="avatar"
            type="file"
            onChange={handleAvatarChange}
          />
        </div>

        <TextField
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={styles.field}
          error={Boolean(errors.fullName)}
          helperText={errors.fullName}
          type="text"
          label="Полное имя"
          autoComplete="off"
          fullWidth
        />
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.field}
          type="email"
          error={Boolean(errors.email)}
          helperText={errors.email}
          label="E-Mail"
          autoComplete="off"
          fullWidth
        />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.field}
          type="password"
          error={Boolean(errors.password)}
          helperText={errors.password}
          label="Пароль"
          autoComplete="off"
          fullWidth
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
