import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import Constants from "../../../../../utils/Constants";
import { Utils } from "../../../../../utils/Utils";
import LibToast from "../../../../../utils/Toast";
import useMQTT from "../../../../../hooks/useMQTT";

export default function useCard(card, moveTask, setCards) {
  const axiosPrivate = useAxiosPrivate();
  const { requireUpdate, publishMessage } = useMQTT();
  const drop = (item, monitor) => {
    const type = monitor.getItemType();
    if (type === "task") {
      moveTask(item.parentID, card.id, item);
    }
  };

  const [isEditCard, setIsEditCard] = useState(false);
  const [isDeleteCard, setIsDeleteCard] = useState(false);
  const [isAddTask, setIsAddTask] = useState(false);

  const cardSchema = Yup.object({
    title: Yup.string().required("Please enter a title"),
  });
  const cardHeaderRef = useRef();

  const onUpdateCard = (values) => {
    if (values.title === card.title) return;

    Utils.progress(true);
    setTimeout(async () => {
      try {
        const res = await axiosPrivate.put(Constants.END_POINT.CARD.UPDATE, {
          ...card,
          ...values,
        });

        setCards((prev) => {
          const index = prev.findIndex((c) => c.id === res?.data?.id);
          prev[index] = res?.data;
          return [...prev];
        });
        LibToast.toast("Card updated!", "info");
        publishMessage(
          "trello/update",
          JSON.stringify({ type: "card", id: card.parent })
        );
        setIsEditCard(false);
      } catch (errors) {
        LibToast.toast(
          errors.response?.data?.error || "An error occurs!",
          "error"
        );
      } finally {
        Utils.progress(false);
      }
    }, 300);
  };

  const onDeleteCard = () => {
    Utils.progress(true);
    setTimeout(async () => {
      try {
        const res = await axiosPrivate.delete(
          `${Constants.END_POINT.CARD.DELETE}?id=${card.id}`
        );
        setCards(res?.data);
        LibToast.toast("Card deleted!", "info");
        publishMessage(
          "trello/update",
          JSON.stringify({ type: "card", id: card.parent })
        );
        setIsDeleteCard(false);
      } catch (errors) {
        LibToast.toast(
          errors.response?.data?.error || "An error occurs!",
          "error"
        );
      } finally {
        Utils.progress(false);
      }
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardHeaderRef.current && !cardHeaderRef.current.contains(e.target)) {
        setIsEditCard(false);
      }
    };

    if (isDeleteCard) {
      if (isEditCard) setIsEditCard(false);
      return;
    }

    if (isEditCard) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditCard, isDeleteCard]);

  const fetchTaskInCard = async () => {
    Utils.progress(true);
    try {
      const res = await axiosPrivate.get(
        `${Constants.END_POINT.TASK.GET}?parent=${card.id}`
      );
      return res?.data;
    } catch (error) {
      LibToast.toast(error.response.data.error, "error");
    } finally {
      Utils.progress(false);
    }
  };

  useEffect(() => {
    if (
      requireUpdate?.type &&
      requireUpdate.type === "task" &&
      requireUpdate.id === card?.id
    ) {
      setTimeout(async () => {
        const tasks = await fetchTaskInCard();
        setCards((prev) => {
          const index = prev.findIndex((c) => c.id === card.id);
          prev[index].tasks = tasks;
          return [...prev];
        });
      }, 300);
    }
  }, [requireUpdate]);

  return {
    drop,
    cardHeaderRef,
    isEditCard,
    setIsEditCard,
    isDeleteCard,
    setIsDeleteCard,
    cardSchema,
    onUpdateCard,
    onDeleteCard,
    isAddTask,
    setIsAddTask,
  };
}
