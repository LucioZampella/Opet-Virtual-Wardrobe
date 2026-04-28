export function useAuth() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const saveSession = (userLogged) => {
        localStorage.setItem("userId", userLogged.id);
        localStorage.setItem("token", userLogged.token);
    };

    const clearSession = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
    };

    return { userId, token, saveSession, clearSession };
}