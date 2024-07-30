import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Utils } from "../../../utils/Utils";
import Constants from "../../../utils/Constants";
import useMQTT from "../../../hooks/useMQTT";
import LibToast from "../../../utils/Toast";
import * as Yup from "yup";

const BoardContext = createContext();

export const useBoardContext = () => {
  return useContext(BoardContext);
};

export function BoardProvider({ children }) {
  const [boards, setBoards] = useState();
  return (
    <BoardContext.Provider
      value={{
        boards,
        setBoards,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoardComponent(board, setBoards) {
  const boardHeaderRef = useRef();
  const [isEditBoard, setIsEditBoard] = useState(false);
  const [isDeleteBoard, setIsDeleteBoard] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { publishMessage } = useMQTT();
  const boardSchema = Yup.object({
    name: Yup.string().required("Please enter a name"),
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        boardHeaderRef.current &&
        !boardHeaderRef.current.contains(e.target)
      ) {
        setIsEditBoard(false);
      }
    };
    if (isEditBoard) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditBoard]);

  const onDeleteBoard = () => {
    console.log(Constants.END_POINT.BOARD.DELETE, board.id);
    Utils.progress(true);
    setTimeout(async () => {
      try {
        const res = await axiosPrivate.delete(
          Constants.END_POINT.BOARD.DELETE + "?id=" + board.id
        );
        setBoards(res?.data);
        LibToast.toast("Delete board successfully", "info");
        publishMessage("trello/update", JSON.stringify({ type: "board" }));
        setIsDeleteBoard(false);
      } catch (error) {
        LibToast.toast(error.response.data.error, "error");
      } finally {
        Utils.progress(false);
      }
    }, 300);
  };

  const onUpdateBoard = (values) => {
    Utils.progress(true);
    setTimeout(async () => {
      try {
        const res = await axiosPrivate.put(Constants.END_POINT.BOARD.UPDATE, {
          ...board,
          name: values.name,
          members: board.members.map((member) => member.email),
        });
        setBoards(res?.data);
        publishMessage("trello/update", JSON.stringify({ type: "board" }));
        setIsEditBoard(false);
      } catch (error) {
        LibToast.toast(error.response.data.error, "error");
      } finally {
        Utils.progress(false);
      }
    }, 300);
  };
  return {
    boardHeaderRef,
    isEditBoard,
    setIsEditBoard,
    isDeleteBoard,
    setIsDeleteBoard,
    onDeleteBoard,
    onUpdateBoard,
    boardSchema,
  };
}

export default function useBoard() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { boards, setBoards } = useBoardContext();
  const [isFetching, setIsFetching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const boardRef = useRef();
  const location = useLocation();
  const from = location.state?.from || "/";
  const { publishMessage, requireUpdate } = useMQTT();
  const boardSchema = Yup.object({
    name: Yup.string().required("Please enter a name"),
  });

  useEffect(() => {
    if (isFetching || boards?.length > 0) {
      return;
    }

    setIsFetching(true);
    Utils.progress(true);
  }, [isFetching, boards]);

  useEffect(() => {
    if (
      requireUpdate?.type &&
      requireUpdate.type === "board" &&
      !isFetching &&
      !isAdding &&
      !requireUpdate?.id
    ) {
      setIsFetching(true);
    }
  }, [requireUpdate]);

  useEffect(() => {
    if (!isFetching) {
      return;
    }
    setTimeout(async () => {
      try {
        const res = await axiosPrivate.get(Constants.END_POINT.BOARD.GET);
        setBoards(res?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
        Utils.progress(false);
      }
    }, 300);
  }, [isFetching, axiosPrivate]);

  const addBoard = (value) => {
    Utils.progress(true);
    setTimeout(async () => {
      try {
        const res = await axiosPrivate.post(
          Constants.END_POINT.BOARD.CREATE,
          value
        );
        setBoards(res?.data);
        publishMessage("trello/update", JSON.stringify({ type: "board" }));
      } catch (error) {
        LibToast.toast(error.response.data.error, "error");
      } finally {
        Utils.progress(false);
        setIsAdding(false);
      }
    }, 300);
  };

  const openBoardDetail = (id) => {
    navigate("/board/" + id, { replace: true, state: { from } });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boardRef.current && !boardRef.current.contains(e.target)) {
        setIsAdding(false);
      }
    };
    if (isAdding) {
      document.addEventListener("mousedown", handleClickOutside);
      document.querySelector(".create-button").scrollIntoView();
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdding]);

  return {
    boards,
    boardRef,
    openBoardDetail,
    isAdding,
    setIsAdding,
    addBoard,
    setBoards,
    boardSchema,
  };
}
