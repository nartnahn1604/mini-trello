import { useAuth } from "../../context/AuthProvider";
import * as Yup from "yup";
import Constants from "../../utils/Constants";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import LibToast from "../../utils/Toast";
import { Utils } from "../../utils/Utils";

export default function useMain() {
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const initValues = {
    fullname: "",
  };
  const validationSchema = Yup.object().shape({
    fullname: Yup.string().required("Please enter your fullname"),
  });

  const onSubmit = (values) => {
    Utils.progress(true);
    setTimeout(async () => {
      try {
        const res = await axiosPrivate.post(
          Constants.END_POINT.AUTH.UPDATE,
          values
        );
        setAuth((prev) => ({
          ...prev,
          fullname: res?.data?.fullname,
        }));
      } catch (error) {
        LibToast.toast(error.response.data.error, "error");
      } finally {
        Utils.progress(false);
      }
    }, 300);
  };

  return { auth, initValues, validationSchema, onSubmit };
}
