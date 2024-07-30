import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useBoard from "../board/useBoard";
import _ from "lodash";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Utils } from "../../../utils/Utils";
import Constants from "../../../utils/Constants";
import useMQTT from "../../../hooks/useMQTT";
import LibToast from "../../../utils/Toast";

export default function useSideBar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { boards } = useBoard();
  const [board, setBoard] = useState();
  const [isInvite, setIsInvite] = useState(false);
  const [isRemoveBoardMember, setIsRemoveBoardMember] = useState(false);
  const [removeBoardMember, setRemoveBoardMember] = useState();
  const axiosPrivate = useAxiosPrivate();
  const { publishMessage } = useMQTT();

  useEffect(() => {
    if (id && !_.isEmpty(boards)) {
      setBoard(
        boards.map((board) => ({
          ...board,
          active: board.id === id,
        }))
      );
    }
  }, [id, boards]);

  const openBoardDetail = (id) => {
    navigate("/board/" + id);
    setBoard(
      boards.map((board) => ({
        ...board,
        active: board.id === id,
      }))
    );
  };

  const onRemoveBoardMember = () => {
    if (!removeBoardMember) {
      return;
    }

    Utils.progress(true);
    setTimeout(async () => {
      try {
        const res = await axiosPrivate.put(Constants.END_POINT.MEMBER.REMOVE, {
          boardId: id,
          email: removeBoardMember,
        });
        if (res?.data) {
          publishMessage(
            "trello/update",
            JSON.stringify({ type: "board", id: id })
          );
          LibToast.toast("Member removed successfully", "info");
        }
        setIsRemoveBoardMember(false);
        setRemoveBoardMember(null);
      } catch (error) {
        LibToast.toast(error.response.data.error, "error");
      } finally {
        Utils.progress(false);
      }
    }, 300);
  };
  return {
    id,
    board,
    openBoardDetail,
    isInvite,
    setIsInvite,
    isRemoveBoardMember,
    setIsRemoveBoardMember,
    setRemoveBoardMember,
    onRemoveBoardMember,
  };
}
