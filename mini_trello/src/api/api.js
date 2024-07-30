import axios from "axios";
import Constants from "../utils/Constants";

const api = axios.create({
  baseURL: Constants.API_URL,
  headers: {
    accept: "application/json",
  },
});

export default api;

export const apiUser = axios.create({
  baseURL: Constants.API_URL,
  headers: {
    accept: "application/json",
  },
});
