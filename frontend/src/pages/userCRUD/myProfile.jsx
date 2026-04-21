import {useEffect, useState} from "react";
import Navbar from "../../components/Navbar.jsx";
const CLOUDINARY_CLOUD_NAME = "ducp0gbgq";
const CLOUDINARY_UPLOAD_PRESET = "opet_avatars"; //--> Import para la api para guardar las fotos de perfil
import toast from "react-hot-toast";
import {useParams} from "react-router-dom";

function MyProfile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const loggedUserId = localStorage.getItem("userId");
    const userId = id || loggedUserId;
    const token = localStorage.getItem("token");
    const isOwner = String(loggedUserId) === String(userId);
    const [uploading, setUploading] = useState(false);
    const [myPosts, setMyPosts] = useState([]); // mis psots
    const [showCreateModal, setShowCreateModal] = useState(false); // para poner el nuevo post
    const [postFormData, setPostFormData] = useState({descripcion: "", outfitId: ""});
    const [outfits, setOutfits] = useState([]); // apra elegir outdfits
    const [editingPost, setEditingPost] = useState(null);
    const [editPostDesc, setEditPostDesc] = useState("");

    // --> Al cargar la pagina busca los datos del usuario por su id
    useEffect(() => {
        fetch(`http://localhost:8080/usuarios/profile/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setUser(data);
                setFormData(data);
            })
            .catch(error => console.error("Hubo un error al cargar el perfil", error));
    }, [userId]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/posts/user/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setMyPosts(data))
            .catch(err => console.error("Error cargando posts", err));

        fetch(`http://localhost:8080/outfit/my-outfits`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setOutfits(data))
            .catch(err => console.error("Error cargando outfits", err));
    }, [userId, token]);

    const logOut = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/login";
    };

    const eliminateProfile = async () => {
        if (!window.confirm("¿Estás seguro que querés eliminar tu cuenta?")) return;
        try {
            const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                toast.success("Usuario eliminado");
                localStorage.removeItem("userId");
                localStorage.removeItem("token");
                window.location.href = "/login";
            } else {
                const errorMsg = await response.text();
                toast.error("Algo falló: " + errorMsg);
            }
        } catch {
            toast.error("Error de conexión con el servidor");
        }
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        //--> con "..." trae todo lo anterior no modificado, y luego define que la
        // variable a cambiar tenga el valor ingresado al modificar
    };
    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(postFormData)
            });
            if (response.ok) {
                toast.success("Publicación creada");
                setShowCreateModal(false);
                setPostFormData({descripcion: "", outfitId: ""});
                // Recargar posts (puedes volver a hacer el fetch o sumarlo al estado)
                window.location.reload();
            }
        } catch (error) {
            toast.error("Error al crear el post");
        }
    };
    const handleUpdatePost = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/posts/${editingPost.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(editPostDesc)
            });
            if (response.ok) {
                toast.success("Post actualizado");
                setEditingPost(null);
                setMyPosts(prev => prev.map(p =>
                    p.id === editingPost.id ? {...p, descripcion: editPostDesc} : p
                ));
            } else {
                const errorMsg = await response.text();
                toast.error(errorMsg);
            }
        } catch {
            toast.error("Error de conexión");
        }
    };
    const handleDeletePost = async (postId) => {
        if (!window.confirm("¿Seguro que querés eliminar este post?")) return;
        try {
            const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success("Post eliminado");
                setMyPosts(prev => prev.filter(p => p.id !== postId));
            } else {
                toast.error("No se pudo eliminar");
            }
        } catch {
            toast.error("Error de conexión");
        }
    };


    const updateProfile = async (e) => {
        e.preventDefault(); // evita que se recargue la pagina antes del fetch
        try {
            const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setUser(formData);
                toast.success("Cambios guardados");
                setEditMode(false);
            } else {
                const errorMsg = await response.text();
                toast.error("Algo falló: " + errorMsg);
            }
        } catch {
            toast.error("Error de conexión con el servidor, intenta mas tarde ");
        }
    };

    const uploadImageToCloudinary = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {method: "POST", body: data}
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

            const dataToUpdate = {
                name: user.name,
                lastName: user.lastName,
                bio: user.bio,
                avatar_url: url
            }; //--> Manda el cambio a la db

            const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(dataToUpdate)
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                toast(
                    "La foto cargo, pero fallo al guardarse" + errorMsg,
                    {
                        icon: '⚠️',
                        style: {
                            background: '#facc15', // Amarillo
                            color: '#000',         // Texto negro para que se lea bien en amarillo
                        },
                    },
                )
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al subir la imagen");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        fetch(`http://localhost:8080/api/posts/my-posts`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setMyPosts(data))
            .catch(err => console.error("Error cargando posts", err));

        fetch(`http://localhost:8080/outfit/my-outfits`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setOutfits(data))
            .catch(err => console.error("Error cargando outfits", err));
    }, [userId, token]);

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
                            {isOwner && (
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
                            )}
                        </div>


                        {/* Estadisticas */}
                        <div className="flex gap-10 border-t border-[#3a3530] pt-6">
                            {[
                                {label: "Publicaciones", value: myPosts.length},
                                {label: "Seguidores", value: 0},
                                {label: "Seguidos", value: 0},
                            ].map(stat => (
                                <div key={stat.label} className="flex flex-col items-center gap-1">
                                    <span className="text-[#e8d5b0] text-lg font-light">{stat.value}</span>
                                    <span
                                        className="text-[#4a4540] text-[10px] tracking-[0.15em] uppercase">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/*publicaciones*/}

                <div className="max-w-2xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-[#8a7d6e] text-[10px] tracking-[0.3em] uppercase">Publicaciones</span>
                        <div className="flex-1 h-px bg-[#3a3530]"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {/* Botón nuevo post */}
                        {isOwner && (
                            <div
                                onClick={() => setShowCreateModal(true)}
                                className="aspect-square border-2 border-dashed border-[#3a3530] bg-[#2a2622] flex flex-col items-center justify-center hover:border-[#c49a6c] hover:bg-[#221f1c] cursor-pointer transition-all duration-300 group"
                            >
                                <span className="text-[#3a3530] group-hover:text-[#c49a6c] text-4xl font-thin">+</span>
                                <span className="text-[#3a3530] group-hover:text-[#c49a6c] text-[8px] tracking-[0.2em] uppercase mt-2">Nuevo Post</span>
                            </div>
                        )}

                        {/* ACÁ VA EL CÓDIGO NUEVO */}
                        {myPosts.map(post => (
                            <div key={post.id} className="border border-[#3a3530] bg-[#221f1c] overflow-hidden">
                                <div className="grid grid-cols-3 gap-0.5 aspect-square">
                                    {post.outfit?.clothes?.slice(0, 9).map(clothe => (
                                        <div key={clothe.id} className="overflow-hidden">
                                            {clothe.image_url
                                                ? <img src={clothe.image_url} className="w-full h-full object-cover" />
                                                : <div className="w-full h-full bg-[#2a2622] flex items-center justify-center">
                                                    <span className="text-[#3a3530] text-[8px]">{clothe.name}</span>
                                                </div>
                                            }
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        {user.avatar_url
                                            ? <img src={user.avatar_url} className="w-5 h-5 rounded-full object-cover" />
                                            : <span className="w-5 h-5 rounded-full bg-[#3a3530] flex items-center justify-center text-[#c49a6c] text-[8px]">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                                        }
                                        <span className="text-[#c49a6c] text-[10px] tracking-[0.15em]">@{user.username}</span>
                                        <span className="text-[#4a4540] text-[9px] ml-auto">{post.dateOfPost}</span>
                                    </div>
                                    <p className="text-[#6b6258] text-[10px] leading-relaxed">{post.descripcion}</p>
                                    {isOwner && (
                                        <div className="flex gap-2 mt-1">
                                            <button onClick={() => {
                                                setEditingPost(post);
                                                setEditPostDesc(post.descripcion);
                                            }}
                                                    className="flex-1 py-1 border border-[#4a4540] hover:border-[#c49a6c] text-[#6b6258] hover:text-[#c49a6c] text-[9px] tracking-[0.15em] uppercase transition-all duration-300">
                                                Editar
                                            </button>
                                            <button onClick={() => handleDeletePost(post.id)}
                                                    className="flex-1 py-1 border border-[#4a4540] hover:border-red-900 text-[#4a4540] hover:text-red-700 text-[9px] tracking-[0.15em] uppercase transition-all duration-300">
                                                Eliminar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div> {/* cierre grid grid-cols-3 */}
            </div> {/* cierre max-w-2xl publicaciones */}

            {/* Acciones de la cuenta */}
            {isOwner && (
                <div className="max-w-2xl mx-auto px-6 pb-12 flex gap-4">
                    <button onClick={logOut} className="px-6 py-3 border border-[#4a4540] hover:border-[#c49a6c] hover:text-[#c49a6c] text-[#6b6258] text-[10px] tracking-[0.2em] uppercase transition-all duration-300">
                        Cerrar sesión
                    </button>
                    <button onClick={eliminateProfile} className="px-6 py-3 border border-[#4a4540] hover:border-red-900 hover:text-red-700 text-[#4a4540] text-[10px] tracking-[0.2em] uppercase transition-all duration-300">
                        Eliminar cuenta
                    </button>
                </div>
            )}


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
            {editingPost && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-6">
                    <div className="bg-[#221f1c] border border-[#3a3530] w-full max-w-md p-8">
                        <h3 className="text-[#e8d5b0] text-lg font-light tracking-widest mb-1">Editar Post</h3>
                        <div className="w-6 h-px bg-[#c49a6c] mb-8"></div>
                        <form onSubmit={handleUpdatePost} className="flex flex-col gap-6">
                            <div>
                                <label className={labelClass}>Descripción</label>
                                <textarea
                                    value={editPostDesc}
                                    onChange={(e) => setEditPostDesc(e.target.value)}
                                    rows={3}
                                    className={inputClass + " resize-none"}
                                />
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" className="flex-1 py-3 bg-[#c49a6c] text-[#221f1c] text-xs font-semibold uppercase tracking-widest hover:bg-[#e8d5b0] transition-all">
                                    Guardar
                                </button>
                                <button type="button" onClick={() => setEditingPost(null)} className="flex-1 py-3 border border-[#4a4540] text-[#6b6258] text-xs uppercase tracking-widest hover:border-[#c49a6c]">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-6">
                    <div className="bg-[#221f1c] border border-[#3a3530] w-full max-w-md p-8">
                        <h3 className="text-[#e8d5b0] text-lg font-light tracking-widest mb-1">Nueva Publicación</h3>
                        <div className="w-6 h-px bg-[#c49a6c] mb-8"></div>
                        <form onSubmit={handleCreatePost} className="flex flex-col gap-6">
                            <div>
                                <label className={labelClass}>Seleccionar Outfit</label>
                                <select
                                    className={inputClass}
                                    value={postFormData.outfitId}
                                    onChange={(e) => setPostFormData({...postFormData, outfitId: e.target.value})}
                                >
                                    <option value="">-- Elegí un outfit --</option>
                                    {outfits.map(o => (
                                        <option key={o.id} value={o.id}>{o.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Descripción</label>
                                <textarea
                                    value={postFormData.descripcion}
                                    onChange={(e) => setPostFormData({...postFormData, descripcion: e.target.value})}
                                    placeholder="¿Qué cuenta este look hoy?"
                                    rows={3}
                                    className={inputClass + " resize-none"}
                                />
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" className="flex-1 py-3 bg-[#c49a6c] text-[#221f1c] text-xs font-semibold uppercase tracking-widest hover:bg-[#e8d5b0] transition-all">
                                    Publicar
                                </button>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 border border-[#4a4540] text-[#6b6258] text-xs uppercase tracking-widest hover:border-[#c49a6c]">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyProfile;