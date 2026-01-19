import api from "./axios";

export const fetchMe = async () => {
  const response = await api.get("me/");
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("logout/");
  return response.data;
};