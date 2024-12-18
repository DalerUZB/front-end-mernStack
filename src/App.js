import Container from "@mui/material/Container";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import FullTags from "./pages/FullTags";
import { fetchAuthMe } from "./redux/slices/auth";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/tags/:name" element={<FullTags />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="*" element={<h1>Not Found 404</h1>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
