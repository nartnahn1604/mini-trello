import update from "immutability-helper";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import Constants from "../../../../utils/Constants";
import { Utils } from "../../../../utils/Utils";
import LibToast from "../../../../utils/Toast";
import useMQTT from "../../../../hooks/useMQTT";
import { useBoardContext } from "../useBoard";

export default function useBoardDetail() {
  const { id } = useParams();
  const [boardDetail, setBoardDetail] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [isAddCard, setIsAddCard] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [isOpenTaskDetail, setIsOpenTaskDetail] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const [cards, setCards] = useState();
  const [cardId, setCardId] = useState(0);
  const [members, setMembers] = useState();
  const cardRef = useRef();

  const { requireUpdate, publishMessage } = useMQTT();
  const { setBoards } = useBoardContext();

  useEffect(() => {
    if (
      requireUpdate?.type &&
      ["card", "board"].includes(requireUpdate.type) &&
      requireUpdate.id === id
    ) {
      setIsFetching(true);
    }
  }, [requireUpdate, id]);

  useEffect(() => {
    if (id) {
      setIsFetching(true);
    }
  }, [id]);

  useEffect(() => {
    if (!isFetching) {
      return;
    }

    Utils.progress(true);
    setTimeout(async () => {
      try {
        const res = await axiosPrivate.get(
          `${Constants.END_POINT.BOARD.GET}?id=${id}`
        );
        var board = res?.data;
        setBoards((prev) => {
          const index = prev.findIndex((b) => b.id === board.id);
          prev[index] = board;
          return [...prev];
        });
        setBoardDetail(board);
        setCards(board.cards);
        setMembers(board.members);
        setIsFetching(false);
      } catch (error) {
        LibToast.toast(error.response.data.error, "error");
      } finally {
        Utils.progress(false);
      }
    }, 300);
  }, [isFetching, axiosPrivate, id]);

  const addCard = (values) => {
    Utils.progress(true);
    setTimeout(async () => {
      try {
        const res = await axiosPrivate.post(Constants.END_POINT.CARD.CREATE, {
          parent: id,
          ...values,
        });
        setCards(res?.data);
        LibToast.toast("Card added!", "info");
        publishMessage("trello/update", JSON.stringify({ type: "card", id }));
        setIsAddCard(false);
      } catch (error) {
        LibToast.toast(error.response.data.error, "error");
      } finally {
        Utils.progress(false);
      }
    }, 300);
  };

  const moveTask = (from, to, task) => {
    if (from === to) return;

    setCards(
      _.cloneDeep(
        cards.map((card) => {
          if (card.id === from) {
            return {
              ...card,
              tasks: card.tasks.filter((t) => t.id !== task.id),
            };
          }
          if (card.id === to) {
            return {
              ...card,
              tasks: [...card.tasks, task],
            };
          }
          return card;
        })
      )
    );
  };

  const findItem = useCallback(
    (cardId, id) => {
      const foundCard = cards.find((c) => `${c.id}` === cardId);
      if (!foundCard)
        return {
          task: null,
          index: -1,
        };
      const foundTask = foundCard.tasks.find((t) => `${t.id}` === id);
      return {
        task: foundTask,
        index: foundCard.tasks.indexOf(foundTask),
      };
    },
    [cards]
  );

  const moveItem = useCallback(
    (cardId, taskId, atIndex, isEnd) => {
      if (isEnd) {
        setIsDropped(true);
        return;
      }
      const { task, index } = findItem(cardId, taskId);
      if (!task) return;
      if (atIndex === index || atIndex < 0) return;

      const newCards = cards.map((card) => {
        if (card.id === cardId) {
          var tasks = card.tasks;
          tasks.splice(index, 1);
          tasks.splice(atIndex, 0, task);
          return update(card, {
            tasks: { $set: tasks },
          });
        }
        return card;
      });
      setCards(_.cloneDeep(newCards));
    },
    [findItem, cards, setCards]
  );

  useEffect(() => {
    if (!isDropped) return;

    setTimeout(async () => {
      Utils.progress(true);
      const newIndexes = cards.map((card, index) => ({
        id: card.id,
        tasks: card.tasks.map((task, index) => ({
          id: task.id,
          index: index,
        })),
      }));
      try {
        await axiosPrivate.put(Constants.END_POINT.TASK.UPDATE_INDEX, {
          indexes: newIndexes,
          parent: id,
        });
        publishMessage(
          "trello/update",
          JSON.stringify({ type: "board", id: id })
        );
      } catch (error) {
        LibToast.toast(error.response?.data?.error, "error");
        return;
      } finally {
        Utils.progress(false);
        setIsDropped(false);
      }
    }, 300);
  }, [isDropped]);

  useEffect(() => {
    if (cardId === 0) return;

    const cardTasks = document.getElementById(`card_${cardId}`);
    const lastTask = cardTasks.getElementsByClassName("tasks")[0].lastChild;
    lastTask.scrollIntoView({ behavior: "smooth" });
    setCardId(0);
  }, [cardId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setIsAddCard(false);
      }
    };
    if (isAddCard) {
      document.addEventListener("mousedown", handleClickOutside);
      document.querySelector(".add-card").scrollIntoView();
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddCard]);

  return {
    boardDetail,
    cards,
    setCards,
    addCard,
    moveTask,
    findItem,
    moveItem,
    members,
    setMembers,
    isAddCard,
    setIsAddCard,
    cardRef,
    isOpenTaskDetail,
    setIsOpenTaskDetail,
  };
}
