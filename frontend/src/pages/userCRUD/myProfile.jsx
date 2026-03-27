import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";


function MyProfile() {
    const [user, setUser] = useState(null);;
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({})
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8080/usuarios/profile/${userId}`)
            .then(response => response.json()) //--> Agarra la respuesta de java en crudo y la convierte en json
            .then(data => {
                setUser(data); //--> Ya con los datos en limpio, los guardo y
                // "saco una fotocopia" para que al editar aparezcan los datos actuales
                setFormData(data);
            })
            .catch(error => console.error("Hubo un error al cargar el perfil", error))
    }, [userId]);

    const logOut = (e) => {
        e.preventDefault();
        localStorage.removeItem("userId");
        window.location.href = "/login";
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value }); //
    }; //--> con "..." trae todo lo anterior no modificado, y luego define que la
    // variable a cambiar tenga el valor ingresado al modificar

    const updateProfile = async (e) => {
        try {
            const response = await fetch(`http://localhost:8080/usuarios/update/${userId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setUser(formData);
                alert("Cambios Guardados");
                setEditMode(false);
            } else {
                const errorMsg = await response.text();
                alert("Algo fallo:" + errorMsg);
            }
        }
            catch (error) {
                alert("Error de conexión con el servidor");
            }
        }

    useEffect(() => {
        fetch(`http://localhost:8080/usuarios/${userId}`)
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error("Error al cargar perfil:", err));
    }, []);





    if (!user) return <p>Cargando perfil...</p>;

    return (
        <div className="profile-wrapper">
            {editMode ? (
                <form onSubmit={updateProfile}>
                    <h2>Editar Perfil</h2>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" /><br/>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellido" /><br/>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Biografía" /><br/>
                    <input name="ubication" value={formData.ubication} onChange={handleChange} placeholder="Ubicación" /><br/>

                    <button type="submit" style={{ color: 'green' }}>
                        Guardar Cambios
                    </button>
                    <button type="button" onClick={() => setEditMode(false)}>
                        Cancelar
                    </button>
                </form>
            ) : (
            <div>
                <h2>{user.name} {user.lastName}</h2>
                <p>@{user.username}</p>
                <p>{user.email}</p>
                <p>{user.bio}</p>
                <p>{user.ubication}</p>
                <button onClick={() => setEditMode(true)}>
                    Editar Perfil
                </button>
            </div>

                )}

            <div>
            <button type = "button" onClick={logOut} style={{color : 'red'}}>
                Cerrar Sesion
            </button>
            </div>
        </div>
);
}

export default MyProfile;