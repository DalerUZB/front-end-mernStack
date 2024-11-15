import axios from "../../axios/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk actions
export const fetchPosts = createAsyncThunk("posts", async () => {
  const response = await axios.get("/posts");
  return response;
});
export const fetchTags = createAsyncThunk("tags", async () => {
  const response = await axios.get("/tags");
  return response;
});
export const fetchPostDelete = createAsyncThunk(
  "fetchPostDelete",
  async (id) => {
    const response = await axios.delete(`/posts/${id}`);
    return response;
  }
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

// Create slice with builder callback
export const postUser = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch posts
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.posts.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, { payload }) => {
        state.posts.items = payload.data;
        state.posts.status = "loaded";
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = "error";
      });

    // Fetch tags
    builder
      .addCase(fetchTags.pending, (state) => {
        state.tags.status = "loading";
      })
      .addCase(fetchTags.fulfilled, (state, { payload }) => {
        state.tags.items = payload.data;
        state.tags.status = "loaded";
      })
      .addCase(fetchTags.rejected, (state) => {
        state.tags.items = [];
        state.tags.status = "error";
      });

    // Fetch post delete
    builder.addCase(fetchPostDelete.pending, (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    });
  },
});

export const {} = postUser.actions;
export default postUser.reducer;
