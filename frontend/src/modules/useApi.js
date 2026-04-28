const BASE_URL = "http://localhost:8080";
import { useAuth } from "./useAuth.js"

export function useApi() {
    const { token } = useAuth();

    const apiFetch = async (url, options = {}) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                ...options.headers,
            },
        });
        return response;
    };

    return { apiFetch };
}