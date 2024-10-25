import React from "react";
import Button from "@mui/material/Button";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectIsAuth } from "../../redux/slices/auth";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const dispatch = useDispatch();
  const selectAuth = useSelector(selectIsAuth);
  const data = useSelector((data) => data.auth);
  const isAuth = selectAuth;
  const navigate = useNavigate();
  // log out in akkaunt
  const onClickLogout = () => {
    if (window.confirm("ви дисвително хатите выйте")) {
      dispatch(logOut());
      window.localStorage.removeItem("token");
      window.localStorage.clear();
      navigate("/");
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>{Boolean(data.data) ? data.data?.fullName : "Main"}</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Написать статью</Button>
                </Link>

                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
