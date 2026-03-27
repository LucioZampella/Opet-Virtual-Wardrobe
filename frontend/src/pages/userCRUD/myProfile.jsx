import { useEffect, useState } from "react";

function MyProfile() {
    const [user, setUser] = useState(null);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetch(`http://localhost:8080/usuarios/${userId}`)
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error("Error al cargar perfil:", err));
    }, []);

    if (!user) return <p>Cargando perfil...</p>;

    return (
        <div>
            <h2>{user.name} {user.lastName}</h2>
            <p>@{user.username}</p>
            <p>{user.email}</p>
            <p>{user.bio}</p>
            <p>{user.ubication}</p>
        </div>
    );
}

export default MyProfile;