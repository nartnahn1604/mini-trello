import { useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import useRefresh from "./useRefresh";
import { apiUser } from "../api/api";

const useAxiosPrivate = () => {
  const refresh = useRefresh();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = apiUser.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    const responseIntercept = apiUser.interceptors.response.use(
      (response) => response,
      async (error) => {
        var prevRequest = error?.config;

        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiUser(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiUser.interceptors.request.eject(requestIntercept);
      apiUser.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return apiUser;
};

export default useAxiosPrivate;
