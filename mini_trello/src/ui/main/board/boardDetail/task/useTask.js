import { useEffect, useRef } from "react";
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import useMQTT from "../../../../../hooks/useMQTT";
import Constants from "../../../../../utils/Constants";
import LibToast from "../../../../../utils/Toast";
import { Utils } from "../../../../../utils/Utils";

export default function useTask(parentID, isAddTask, setIsAddTask, setCards) {
  const addTaskRef = useRef();
  const axiosPrivate = useAxiosPrivate();
  const { publishMessage } = useMQTT();
  const addTask = (value) => {
    Utils.progress(true);
    setTimeout(async () => {
      try {
        const res = await axiosPrivate.post(Constants.END_POINT.TASK.CREATE, {
          parent: parentID,
          ...value,
        });
        setCards((prev) => {
          const index = prev.findIndex((c) => c.id === parentID);
          if (prev[index].tasks) {
            prev[index].tasks.push(res?.data);
          } else {
            prev[index].tasks = [res?.data];
          }
          return [...prev];
        });
        publishMessage(
          "trello/update",
          JSON.stringify({ type: "task", id: parentID })
        );
        setIsAddTask(false);
      } catch (error) {
        LibToast.toast(error.response.data.error, "error");
      } finally {
        Utils.progress(false);
      }
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addTaskRef.current && !addTaskRef.current.contains(e.target)) {
        setIsAddTask(false);
      }
    };
    if (isAddTask) {
      document.addEventListener("mousedown", handleClickOutside);
      document.querySelector(".add-card").scrollIntoView();
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddTask]);

  return { addTask, addTaskRef };
}
