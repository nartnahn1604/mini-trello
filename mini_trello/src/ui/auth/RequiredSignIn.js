import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useEffect, useState } from "react";
import api from "../../api/api";
import Constants from "../../utils/Constants";
import LibToast from "../../utils/Toast";
import { Utils } from "../../utils/Utils";
import useRefresh from "../../hooks/useRefresh";

export default function RequiredSignIn() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refresh = useRefresh();

  useEffect(() => {
    if (isRefreshing || auth?.isNewUser) {
      return;
    }
    if (auth?.accessToken && auth?.email && auth?.fullname) {
      return;
    }

    setIsRefreshing(true);
  }, [auth, isRefreshing]);

  useEffect(() => {
    if (!isRefreshing) {
      return;
    }
    Utils.progress(true);
    if (!auth?.accessToken) {
      setTimeout(async () => {
        try {
          await refresh();
        } catch (error) {
          LibToast.toast(error.response.data.error, "error");
          navigate("/auth", {
            replace: true,
            state: { from },
          });
        } finally {
          setIsRefreshing(false);
          Utils.progress(false);
        }
      }, 300);
      return;
    }

    if (!auth?.email || !auth?.fullname) {
      setTimeout(async () => {
        try {
          const res = await api.post(Constants.END_POINT.AUTH.VERIFY_ACCESS, {
            accessToken: auth.accessToken,
          });
          setAuth((prev) => ({
            ...prev,
            email: res?.data?.email,
            fullname: res?.data?.fullname,
            ...(res?.data?.fullname
              ? { isNewUser: false }
              : { isNewUser: true }),
          }));
        } catch (error) {
          LibToast.toast(error.response.data.error, "error");
          navigate("/auth", {
            replace: true,
            state: { from },
          });
        } finally {
          setIsRefreshing(false);
          Utils.progress(false);
        }
      }, 300);
    }
  }, [auth, isRefreshing, refresh, setAuth, navigate, from]);
  return auth?.accessToken && auth?.email ? <Outlet /> : null;
}
