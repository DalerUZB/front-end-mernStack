import { configureStore } from "@reduxjs/toolkit";
import post from "./slices/post";
import auth from "./slices/auth";

const reducer = {
  post,
  auth,
};
export const store = configureStore({ reducer });
