import { useEffect, useRef, useState } from "react";

export default function useTaskDetail({ members }) {
  const [detail, setDetail] = useState({
    members: members.slice(0, 6).map((member) => ({
      ...member,
      taskId: Math.random().toString(36).slice(2, 9),
    })),
    isFollow: false,
  });

  const [isAddMemeber, setIsAddMember] = useState(false);
  const membersPopUpRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        membersPopUpRef.current &&
        !membersPopUpRef.current.contains(e.target)
      ) {
        setIsAddMember(false);
      }
    };
    if (isAddMemeber) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddMemeber]);

  return {
    detail,
    setDetail,
    isAddMemeber,
    setIsAddMember,
    membersPopUpRef,
  };
}
