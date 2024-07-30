import api from "../api/api";
import { useAuth } from "../context/AuthProvider";
import Constants from "../utils/Constants";

const useRefresh = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const params = {
      refreshToken: JSON.parse(window.localStorage.getItem("rft")),
    };

    const response = await api.post(
      Constants.END_POINT.AUTH.VERIFY_REFRESH,
      params
    );
    if (response.status !== 201) {
      window.localStorage.removeItem("rft");
      return null;
    }

    setAuth((prev) => ({
      ...prev,
      accessToken: response.data.accessToken,
    }));

    return response.data.accessToken;
  };
  return refresh;
};

export default useRefresh;
