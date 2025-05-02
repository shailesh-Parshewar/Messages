import axios from "axios";
export const axiosClient = axios.create({
    baseURL: import.meta.env.MODE === "development" ?  "http://localhost:5100/api" : "/api",
    withCredentials: true
})