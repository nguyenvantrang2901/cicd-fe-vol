import axios from "axios";
const instance = axios.create({
    baseURL: "https://localhost:7028/api/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add interceptors if needed
instance.interceptors.response.use(
    response => response,
    error => {
        // Handle errors globally
        console.log("API Error:", error);
        return Promise.reject(error);
    }
)

export default instance;
