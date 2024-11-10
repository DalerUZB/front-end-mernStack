import React, { useEffect, useState } from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios/axios";
import { Bounce, ToastContainer, toast } from "react-toastify";

export const Index = () => {
  let { id } = useParams();

  const authOptions = useSelector((store) => store.auth.data);
  const avatarOptions = authOptions === null;
  const [value, setValue] = useState("");
  const messageValue = async (value) => {
    setValue(value.target.value);
  };

  const sendObj = async () => {
    const obj = {
      fullName: Boolean(authOptions) === true ? authOptions.fullName : "null",
      avatarUrl: Boolean(authOptions) === true ? authOptions.avatarUrl : "null",
      text: value,
    };

    console.log(obj);

    await axios.patch(`/posts/${id}/comment`, obj).then((response) => {
      if (response.data.message) {
        toast.success(`message sending`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4010);
      }
      <ToastContainer />;
    });
  };

  return (
    <>
      {authOptions && (
        <div className={styles.root}>
          <Avatar
            classes={{ root: styles.avatar }}
            src={
              `http://localhost:1010/${authOptions.avatarUrl}` ||
              "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png"
            }
          />
          <div className={styles.form}>
            <TextField
              onKeyUp={(event) => messageValue(event)}
              label="Написать комментарий"
              variant="outlined"
              maxRows={10}
              multiline
              fullWidth
            />
            <Button onClick={() => sendObj()} variant="contained">
              Отправить
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
