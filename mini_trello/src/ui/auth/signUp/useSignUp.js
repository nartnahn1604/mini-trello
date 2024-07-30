import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import api from "../../../api/api";
import LibToast from "../../../utils/Toast";
import Constants from "../../../utils/Constants";
import { Utils } from "../../../utils/Utils";

export default function useSignUp() {
  const navigate = useNavigate();
  const initialValues = {
    email: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Please enter your email")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email"
      ),
  });

  const onSubmit = (values) => {
    Utils.progress(true);
    setTimeout(async () => {
      try {
        const res = await api.post(Constants.END_POINT.AUTH.SIGN_UP, values);
        LibToast.toast(res?.data?.message, "info");
        navigate("/auth/verify", { state: { email: values.email } });
      } catch (error) {
        LibToast.toast(error.response.data.error, "error");
      } finally {
        Utils.progress(false);
      }
    }, 300);
  };

  return { initialValues, validationSchema, onSubmit };
}
