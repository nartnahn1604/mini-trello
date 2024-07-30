import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignUp from "./ui/auth/signUp/SignUp";
import Auth from "./ui/auth/Auth";
import Verification from "./ui/auth/verification/Verification";
import Main from "./ui/main/Main";
import Board from "./ui/main/board/Board";
import BoardDetail from "./ui/main/board/boardDetail/BoardDetail";
import RequiredSignIn from "./ui/auth/RequiredSignIn";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />}>
        <Route index element={<SignUp />} />
        <Route path="verify" element={<Verification />} />
      </Route>
      <Route element={<RequiredSignIn />}>
        <Route path="/" element={<Main />}>
          <Route index element={<Board />} />
          <Route path="board/:id" element={<BoardDetail />} />
        </Route>
      </Route>
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
}

export default App;
