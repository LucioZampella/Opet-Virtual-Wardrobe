const BASE_URL = "http://localhost:8080/User";
// npm install react-router-dom

// es el encargado de hacer las consultas http por el front y conectarlo con el backend
export const getAllUsers = async () => {
    const res = await fetch(BASE_URL);
    return res.json();
};

export const getUserById = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    return res.json();
};

export const updateUser = async (id, userData) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });
    return res.json();
};

export const deleteUser = async (id) => {
    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
};