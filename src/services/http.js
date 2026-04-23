import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { store } from "@/store";
import { BASE_URL } from "@/constants/services";
import { logout } from "@/store/slices/authSlice";
import {
  requestFinished,
  requestStarted,
  resetRequests,
} from "@/store/slices/networkSlice";
import routes from "@/constants/routes";

const HttpService = axios.create({
  baseURL: BASE_URL,
});

HttpService.interceptors.request.use(
  (config) => {
    store.dispatch(requestStarted());
    const token = store.getState()?.auth?.token;
    if (token) {
      config.headers.authorization = token;
    }
    return config;
  },
  (error) => {
    store.dispatch(requestFinished());
    return Promise.reject(error);
  },
);

const AxiosInterceptor = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = HttpService.interceptors.response.use(
      (response) => {
        store.dispatch(requestFinished());
        if (response?.data?.tokenExpired) {
          dispatch(logout());
          store.dispatch(resetRequests());
          navigate(routes.home, { replace: true });
          return false;
        }
        return response;
      },
      (error) => {
        store.dispatch(requestFinished());
        return Promise.reject(error);
      },
    );

    return () => {
      HttpService.interceptors.response.eject(interceptor);
    };
  }, [dispatch, navigate]);

  return children;
};

export default HttpService;
export { AxiosInterceptor };
