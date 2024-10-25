import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios/axios";

export const fetchRegister = createAsyncThunk(
  "fetchRegister",
  async (params) => {
    const { data } = await axios.post("/auth/register", params);
    return data;
  }
);
export const fetchLogin = createAsyncThunk("fetchLogin", async (params) => {
  const { data } = await axios.post("/auth/login", params);
  return data;
});

export const fetchAuthMe = createAsyncThunk("fetchAuthMe", async () => {
  const { data } = await axios.get("/auth/me");
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.data = null;
    },
  },
  extraReducers: {
    // fetchLogin
    [fetchLogin.pending](state) {
      state.status = "loading";
      state.data = null;
    },
    [fetchLogin.fulfilled](state, { payload }) {
      state.status = "loaded";
      state.data = payload;
    },
    [fetchLogin.rejected](state) {
      state.status = "error";
      state.data = null;
    },
    // fetchAuthMe
    [fetchAuthMe.pending](state) {
      state.status = "loading";
      state.data = null;
    },
    [fetchAuthMe.fulfilled](state, { payload }) {
      state.status = "loaded";
      state.data = payload;
    },
    [fetchAuthMe.rejected](state) {
      state.status = "error";
      state.data = null;
    },

    // fetch Register
    [fetchRegister.pending](state) {
      state.status = "loading";
      state.data = null;
    },
    [fetchRegister.fulfilled](state, { payload }) {
      state.status = "loaded";
      state.data = payload;
    },
    [fetchRegister.rejected](state) {
      state.status = "error";
      state.data = null;
    },
  },
});
export const { logOut } = auth.actions;

export const selectIsAuth = (state) => Boolean(state.auth.data);

export default auth.reducer;
