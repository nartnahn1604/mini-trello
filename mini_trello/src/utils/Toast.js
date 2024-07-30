import { toast } from "react-toastify";

var LibToast = {};
const toastAutoClose = 3000;

LibToast.toast = (message, type, pos = "top-right") => {
  console.log("LibToast.toast -> type", type);
  switch (type) {
    case "info":
      toast.info(message, {
        position: pos,
        autoClose: toastAutoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 10,
      });
      break;
    case "error":
      toast.error(message, {
        position: pos,
        autoClose: toastAutoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 10,
      });
      break;
    case "warn":
      toast.warn(message, {
        position: pos,
        autoClose: toastAutoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 10,
      });
      break;
    case "expired":
      toast.warn(message, {
        position: pos,
        autoClose: toastAutoClose,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        draggablePercent: 10,
      });
      break;
    default:
      break;
  }
};

export default LibToast;
