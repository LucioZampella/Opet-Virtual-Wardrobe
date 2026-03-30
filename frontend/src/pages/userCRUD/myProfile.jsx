import {useEffect, useState} from "react";
import Navbar from "../../components/Navbar.jsx";
const CLOUDINARY_CLOUD_NAME = "ducp0gbgq";
const CLOUDINARY_UPLOAD_PRESET = "opet_avatars"; //--> Import para la api para guardar las fotos de perfil

function MyProfile() {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const userId = localStorage.getItem("userId");
    const [uploading, setUploading] = useState(false);

    // --> Al cargar la pagina busca los datos del usuario por su id
    useEffect(() => {
        fetch(`http://localhost:8080/usuarios/profile/${userId}`)
            .then(response => response.json()) //--> Agarra la respuesta de java en crudo y la convierte en json
            .then(data => {
                setUser(data); //--> Ya con los datos en limpio, los guardo y
                // "saco una fotocopia" para que al editar aparezcan los datos actuales
                setFormData(data);
            })
            .catch(error => console.error("Hubo un error al cargar el perfil", error));
    }, [userId]);

    const logOut = (e) => {
        e.preventDefault();
        localStorage.removeItem("userId"); //--> Borra el id guardado y manda al login
        window.location.href = "/login";
    };

    const eliminateProfile = async () => {
        if (!window.confirm("¿Estás seguro que querés eliminar tu cuenta?")) return;
        try {
            const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
                method: "DELETE"
            });
            if (response.ok) {
                alert("Usuario eliminado");
                localStorage.removeItem("userId");
                window.location.href = "/login";
            } else {
                const errorMsg = await response.text();
                alert("Algo falló: " + errorMsg);
            }
        } catch {
            alert("Error de conexión con el servidor");
        }
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        //--> con "..." trae todo lo anterior no modificado, y luego define que la
        // variable a cambiar tenga el valor ingresado al modificar
    };

    const updateProfile = async (e) => {
        e.preventDefault(); // evita que se recargue la pagina antes del fetch
        try {
            const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setUser(formData);
                alert("Cambios guardados");
                setEditMode(false);
            } else {
                const errorMsg = await response.text();
                alert("Algo falló: " + errorMsg);
            }
        } catch {
            alert("Error de conexión con el servidor");
        }
    };

    const uploadImageToCloudinary = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: data }
        );
        const result = await response.json();
        return result.secure_url; // --> Esta es la URL que se guarda en la db
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImageToCloudinary(file); //--> Sube la imagen a cloudinary
            setUser(prev => ({...prev, avatar_url: url})); // --> Hace que la imagen aparezca
            setFormData(prev => ({...prev, avatar_url: url}));

            const updatedUser = { ...user, avatar_url: url }; //--> Manda el cambio a la db
            const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(updatedUser)
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                alert("La foto cargó, pero falló al guardarse" + errorMsg);
            }
        } catch (error) {
            console.error(error);
            alert("Error al subir la imagen");
        } finally {
            setUploading(false);
        }
    };

    const inputClass = `
        w-full bg-transparent border-b border-[#4a4540]
        text-[#e8d5b0] placeholder-[#6b6258]
        py-3 px-0 text-sm tracking-wide
        outline-none focus:border-[#c49a6c]
        transition-colors duration-300
    `;
    const labelClass = "text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8a7d6e] mb-1 block";

    if (!user) return (
        // --> Pantalla de carga mientras llegan los datos
        <div className="min-h-screen bg-[#2a2622] flex items-center justify-center">
            <p className="text-[#6b6258] text-xs tracking-[0.3em] uppercase animate-pulse">Cargando perfil...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#2a2622]">

            {/* Navbar fija con el logo arriba de todo */}
            <Navbar/>

            <div className="pt-14">

                {/* Header perfil */}
                <div className="bg-[#221f1c] border-b border-[#3a3530] px-6 py-8">
                    <div className="max-w-2xl mx-auto">

                        {/* avatar + info + boton editar */}
                        <div className="flex items-start gap-6 mb-8">

                            {/* Avatar margenn */}
                            <div
                                className="relative w-20 h-20 rounded-full flex-shrink-0border
                                 border-[#4a4540] bg-[#2a2622]
                                 flex items-center justify-center overflow-hidden
                                 group cursor-pointer" onClick={() => !uploading && document.getElementById("avatarInput").click()}>

                                {/* Imagen*/}
                                {user.avatar_url
                                    ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="Perfil"/>
                                    : <span className="text-[#c49a6c] text-2xl font-light">
                                        {user.name?.charAt(0).toUpperCase()}
                                </span>
                                }

                                {/* Overlay oscuro al hacer hover */}
                                <div className="
                                absolute inset-0 bg-black/60
                                flex items-center justify-center
                                opacity-0 group-hover:opacity-100
                                transition-opacity duration-300">

                                    <span className="text-[#e8d5b0] text-[8px] text-center font-semibold tracking-[0.2em] uppercase px-1">
                                        {uploading ? "Subiendo" : "Cambiar"}
                                    </span>
                                </div>
                            </div>

                            {/* Input oculto */}
                            <input
                                type="file"
                                accept="image/*"
                                id="avatarInput"
                                className="hidden"
                                onChange={handleAvatarChange}
                                disabled={uploading}
                            />

                            {/* Nombre, username y bio */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-[#e8d5b0] text-lg font-light tracking-widest">
                                    {user.name} {user.lastName}
                                </h2>
                                <p className="text-[#c49a6c] text-xs tracking-[0.2em] mt-1">@{user.username}</p>
                                {user.bio && (
                                    <p className="text-[#6b6258] text-xs tracking-wide mt-3 leading-relaxed">
                                        {user.bio}
                                    </p>
                                )}
                            </div>

                            {/* editar perfil */}
                            <button
                                onClick={() => setEditMode(true)}
                                className="
                                    flex-shrink-0 px-5 py-2
                                    border border-[#4a4540] hover:border-[#c49a6c]
                                    text-[#8a7d6e] hover:text-[#c49a6c]
                                    text-[10px] tracking-[0.2em] uppercase
                                    transition-all duration-300
                                "
                            >
                                Editar
                            </button>
                        </div>

                        {/* Estadisticas */}
                        <div className="flex gap-10 border-t border-[#3a3530] pt-6">
                            {[
                                {label: "Publicaciones", value: 0},
                                {label: "Seguidores", value: 0},
                                {label: "Seguidos", value: 0},
                            ].map(stat => (
                                <div key={stat.label} className="flex flex-col items-center gap-1">
                                    <span className="text-[#e8d5b0] text-lg font-light">{stat.value}</span>
                                    <span className="text-[#4a4540] text-[10px] tracking-[0.15em] uppercase">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Publicaciones */}
                <div className="max-w-2xl mx-auto px-6 py-8">

                    {/* Titulo */}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-[#8a7d6e] text-[10px] tracking-[0.3em] uppercase">Publicaciones</span>
                        <div className="flex-1 h-px bg-[#3a3530]"></div>
                    </div>

                    {/* 3 columnas. por ahora vacia, aca van las publicaciones despues */}
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            // --> Placeholder de publicacion para cuando lo hagamos
                            <div
                                key={i}
                                className="
                                    aspect-square border border-[#3a3530]
                                    bg-[#221f1c] flex items-center justify-center
                                    hover:border-[#4a4540] transition-colors duration-300
                                "
                            >
                                {/* Placeholder camara */}
                                <svg className="w-6 h-6 text-[#3a3530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Acciones de la cuentarda */}
                <div className="max-w-2xl mx-auto px-6 pb-12 flex gap-4">
                    <button
                        onClick={logOut}
                        className="
                            px-6 py-3 border border-[#4a4540]
                            hover:border-[#c49a6c] hover:text-[#c49a6c]
                            text-[#6b6258] text-[10px] tracking-[0.2em] uppercase
                            transition-all duration-300
                        "
                    >
                        Cerrar sesión
                    </button>
                    <button
                        onClick={eliminateProfile}
                        className="
                            px-6 py-3 border border-[#4a4540]
                            hover:border-red-900 hover:text-red-700
                            text-[#4a4540] text-[10px] tracking-[0.2em] uppercase
                            transition-all duration-300
                        "
                    >
                        Eliminar cuenta
                    </button>
                </div>
            </div>

            {editMode && (
                // Fondo oscuro semitransparente
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
                    <div className="bg-[#221f1c] border border-[#3a3530] w-full max-w-md p-8">

                        {/* Titulo del modal */}
                        <h3 className="text-[#e8d5b0] text-lg font-light tracking-widest mb-1">Editar perfil</h3>
                        <div className="w-6 h-px bg-[#c49a6c] mb-8"></div>

                        <form onSubmit={updateProfile} className="flex flex-col gap-6">
                            <div>
                                <label className={labelClass}>Nombre</label>
                                <input name="name" value={formData.name || ''} onChange={handleChange}
                                       placeholder="Juan" className={inputClass}/>
                            </div>
                            <div>
                                <label className={labelClass}>Apellido</label>
                                <input name="lastName" value={formData.lastName || ''} onChange={handleChange}
                                       placeholder="Pérez" className={inputClass}/>
                            </div>
                            <div>
                                <label className={labelClass}>Biografía</label>
                                <textarea name="bio" value={formData.bio || ''} onChange={handleChange}
                                          placeholder="Contá algo sobre vos..."
                                          rows={3}
                                          className={inputClass + " resize-none"}/>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-4 mt-2">
                                <button
                                    type="submit"
                                    className="
                                        flex-1 py-3
                                        bg-[#c49a6c] hover:bg-[#e8d5b0]
                                        text-[#221f1c] text-xs font-semibold
                                        tracking-[0.2em] uppercase
                                        transition-all duration-300
                                    "
                                >
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditMode(false)}
                                    className="
                                        flex-1 py-3 border border-[#4a4540]
                                        hover:border-[#6b6258]
                                        text-[#6b6258] text-xs
                                        tracking-[0.2em] uppercase
                                        transition-all duration-300
                                    "
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyProfile;