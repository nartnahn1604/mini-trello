import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Constants from "../../../utils/Constants";
import api from "../../../api/api";
import LibToast from "../../../utils/Toast";
import { useEffect } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { Utils } from "../../../utils/Utils";

export default function useVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const { setAuth } = useAuth();

  useEffect(() => {
    if (!email) {
      navigate("/auth");
    }
  }, [email, navigate]);
  const initialValues = {
    code: "",
  };
  const validationSchema = Yup.object({
    code: Yup.number()
      .integer("The code must be a integer number")
      .required("Please enter a valid code")
      .min(100000, "Code must be 6 digits")
      .max(999999, "Code must be 6 digits"),
  });

  const onSubmit = (values) => {
    Utils.progress(true);
    setTimeout(async () => {
      try {
        const res = await api.post(Constants.END_POINT.AUTH.SIGN_IN, {
          email,
          code: values.code,
        });
        window.localStorage.setItem(
          "rft",
          JSON.stringify(res?.data?.refreshToken)
        );
        LibToast.toast(
          res?.data?.fullname ? "Welcome back!" : "Welcome to HN Trello",
          "info"
        );
        setAuth((prev) => ({
          ...prev,
          accessToken: res?.data?.accessToken,
          fullname: res?.data?.fullname,
        }));
        navigate("/");
      } catch (error) {
        LibToast.toast(error.response.data.error, "error");
      } finally {
        Utils.progress(false);
      }
    }, 300);
  };

  return { initialValues, validationSchema, onSubmit };
}
