import axios from "axios";

const useAxios = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_URL}`,

  headers: { Authorization: localStorage.getItem("accessToken") },
});

export default useAxios;
