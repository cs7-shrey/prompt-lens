import axios from "axios"
import { env } from "@prompt-lens/env/web"

const axiosInstance = axios.create({
    baseURL: env.NEXT_PUBLIC_SERVER_URL + "/api" || "http://localhost:3000/api",
    withCredentials: true,
})