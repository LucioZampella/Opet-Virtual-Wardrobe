import {useEffect, useState} from "react";
import Navbar from "../../components/Navbar.jsx";
const CLOUDINARY_CLOUD_NAME = "ducp0gbgq";
import { CLOTHING_TYPES, SINGLE_ONLY_TYPES } from "../../constants/clotheOptions.js";
const CLOUDINARY_UPLOAD_PRESET = "opet_avatars"; //--> Import para la api para guardar las fotos de perfil
import toast from "react-hot-toast";
import {useParams} from "react-router-dom";
import { useAuth } from "../../modules/useAuth.js";
import { useApi } from "../../modules/useApi.js";

function MyProfile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const { userId: loggedUserId, token, clearSession} = useAuth();
    const { apiFetch } = useApi();
    const userId = id || loggedUserId;
    const isOwner = String(loggedUserId) === String(userId);
    const [uploading, setUploading] = useState(false);
    const [myPosts, setMyPosts] = useState([]); // mis posts
    const [showCreateModal, setShowCreateModal] = useState(false); // para poner el nuevo post
    const [postFormData, setPostFormData] = useState({descripcion: "", outfitId: null, clothesId: null,type:""});
    const [outfits, setOutfits] = useState([]);
    const [clothes, setClothes] = useState([])
    const [editingPost, setEditingPost] = useState(null);
    const [editPostDesc, setEditPostDesc] = useState("");
    const [postType, setPostType] = useState('OUTFIT'); // OUTFIT o CLOTHE

    // --> Al cargar la pagina busca los datos del usuario por su id
    useEffect(() => {
        apiFetch(`/usuarios/profile/${userId}`)
            .then(res => res.json())
            .then(data => { setUser(data); setFormData(data); })
            .catch(err => console.error("Hubo un error al cargar el perfil", err));
    }, [userId]);


    useEffect(() => {
        apiFetch(`/api/posts/my-posts`)
            .then(res => res.json())
            .then(data => setMyPosts(data))
            .catch(err => console.error("Error cargando posts", err));
        apiFetch('/outfit/my-outfits')
            .then(res => res.json())
            .then(data => setOutfits(data))
            .catch(err => console.error("Error cargando outfits", err));
        apiFetch('/clothes/my-clothes')
            .then(res => res.json())
            .then(data => {
                console.log("Prendas recibidas:", data); // Mira si llegan datos aquí
                setClothes(data);
            })
            .catch(err => console.error( "Error cargando prendas", err))
    }, [userId, token]);

    const logOut = (e) => {
        e.preventDefault();
        clearSession();
        window.location.href = "/login";
    };

    const eliminateProfile = async () => {
        if (!window.confirm("¿Estás seguro que querés eliminar tu cuenta?")) return;
        try {
            const response = apiFetch (`usuarios/{$userId]`, { method: "DELETE"});
            if (response.ok) {
                toast.success("Usuario eliminado");
                clearSession();
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
            const response = await apiFetch(`/api/posts`, {
                method: "POST",
                body: JSON.stringify({
                    descripcion: postFormData.descripcion,
                    type: postFormData.type,
                    // Aseguramos que si están vacíos se envíen como null, no como string vacío ""
                    clothesId: postFormData.clothesId || null,
                    outfitId: postFormData.outfitId || null
                })
            });
            if (response.ok) {
                toast.success("Publicación creada");
                setShowCreateModal(false);
                setPostFormData({descripcion: "", clothesId: "", outfitId: "",type:""});

                // Recargar posts (puedes volver a hacer el fetch o sumarlo al estado)
                window.location.reload();
            }
            else if (!response.ok){
                toast.error("Error " + await response.text())
            }
        } catch {
            toast.error("Error al crear el post");
        }
    };
    const handleUpdatePost = async (e) => {
        e.preventDefault();
        try {
            const response = await apiFetch(`/api/posts/${editingPost.id}`, {
                method: "PUT",
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
            const response = await apiFetch(`/api/posts/${postId}`, { method: "DELETE" });
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
            const response = await apiFetch(`/usuarios/${userId}`, {
                method: "PUT",
                body: JSON.stringify(editPostDesc)
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

            const response = await apiFetch(`/usuarios/${userId}`, {
                method: "PUT",
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

                {/* --- SECCIÓN DE PUBLICACIONES (CARRUSEL INFINITO) --- */}
                <div className="max-w-6xl mx-auto px-6 py-8 overflow-hidden">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-[#8a7d6e] text-[10px] tracking-[0.3em] uppercase">Publicaciones</span>
                        <div className="flex-1 h-px bg-[#3a3530]"></div>
                    </div>

                    <div className="flex gap-4 items-start">
                        {/* 1. BOTÓN NUEVO POST (Fijo a la izquierda) */}
                        {isOwner && (
                            <div
                                onClick={() => setShowCreateModal(true)}
                                className="w-64 h-[420px] flex-shrink-0 border-2 border-dashed border-[#3a3530] bg-[#2a2622] flex flex-col items-center justify-center hover:border-[#c49a6c] hover:bg-[#221f1c] cursor-pointer transition-all duration-300 group z-10"
                            >
                                <span className="text-[#3a3530] group-hover:text-[#c49a6c] text-4xl font-thin">+</span>
                                <span className="text-[#3a3530] group-hover:text-[#c49a6c] text-[8px] tracking-[0.2em] uppercase mt-2">Nuevo Post</span>
                            </div>
                        )}

                        {/* 2. CONTENEDOR DEL MOVIMIENTO */}
                        <div className="relative overflow-hidden w-full">
                            <div className="animate-infinite-carousel flex gap-4">
                                {/* Duplicamos myPosts para el efecto infinito */}
                                {[...myPosts, ...myPosts].map((post, index) => (
                                    <div
                                        key={`${post.id}-${index}`}
                                        className="w-72 flex-shrink-0 border border-[#3a3530] bg-[#221f1c] overflow-hidden hover:border-[#c49a6c] transition-colors duration-300 shadow-xl"
                                    >
                                        {/* LÓGICA DE IMAGEN DINÁMICA */}
                                        <div className="aspect-square bg-[#1a1816]">
                                            {post.outfit ? (
                                                <div className="grid grid-cols-2 gap-0.5 h-full">
                                                    {post.outfit.clothes?.slice(0, 4).map(clothe => (
                                                        <img key={clothe.id} src={clothe.image_url} className="w-full h-full object-cover" />
                                                    ))}
                                                </div>
                                            ) : post.clothe ? (
                                                <img src={post.clothe.image_url} className="w-full h-full object-cover" />
                                            ) : null}
                                        </div>

                                        {/* INFO DEL POST (Tu lógica original) */}
                                        <div className="p-4 flex flex-col gap-3">
                                            <div className="flex items-center gap-2">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} className="w-5 h-5 rounded-full object-cover" />
                                                ) : (
                                                    <span className="w-5 h-5 rounded-full bg-[#3a3530] flex items-center justify-center text-[#c49a6c] text-[8px]">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                                )}
                                                <span className="text-[#c49a6c] text-[10px] tracking-[0.15em]">@{user.username}</span>
                                                <span className="text-[7px] border border-[#c49a6c]/30 px-1 text-[#c49a6c] uppercase ml-1">
                                    {post.outfit ? 'Outfit' : 'Prenda'}
                                </span>
                                            </div>

                                            <p className="text-[#6b6258] text-[10px] leading-relaxed line-clamp-2 h-8">
                                                {post.descripcion}
                                            </p>

                                            {isOwner && (
                                                <div className="flex gap-2 mt-1">
                                                    <button onClick={() => { setEditingPost(post); setEditPostDesc(post.descripcion); }}
                                                            className="flex-1 py-1.5 border border-[#4a4540] hover:border-[#c49a6c] text-[#6b6258] hover:text-[#c49a6c] text-[9px] tracking-[0.15em] uppercase transition-all">
                                                        Editar
                                                    </button>
                                                    <button onClick={() => handleDeletePost(post.id)}
                                                            className="flex-1 py-1.5 border border-[#4a4540] hover:border-red-900 text-[#4a4540] hover:text-red-700 text-[9px] tracking-[0.15em] uppercase transition-all">
                                                        Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

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
                    <div className="bg-[#221f1c] border border-[#3a3530] w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-[#e8d5b0] text-lg font-light tracking-widest mb-1">Nueva Publicación</h3>
                        <div className="w-6 h-px bg-[#c49a6c] mb-6"></div>

                        {/* SELECTOR DE TIPO */}
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setPostFormData({...postFormData, type: 'OUTFIT', clothesId: null})}
                                className={`flex-1 py-2 text-[9px] tracking-[0.2em] uppercase border ${postFormData.type === 'OUTFIT' ? 'border-[#c49a6c] text-[#c49a6c]' : 'border-[#3a3530] text-[#4a4540]'}`}
                            >
                                Outfit
                            </button>
                            <button
                                onClick={() => setPostFormData({...postFormData, type: 'CLOTHE', outfitId: null})}
                                className={`flex-1 py-2 text-[9px] tracking-[0.2em] uppercase border ${postFormData.type === 'CLOTHE' ? 'border-[#c49a6c] text-[#c49a6c]' : 'border-[#3a3530] text-[#4a4540]'}`}
                            >
                                Prenda
                            </button>
                        </div>

                        <form onSubmit={handleCreatePost} className="flex flex-col gap-6">
                            {/* LISTA DE SELECCIÓN CON FOTOS */}
                            {/* 1. Contenedor principal: ahora es una COLUMNA simple */}
                            <div className="max-h-80 overflow-y-auto pr-2 flex flex-col gap-8 bg-[#1a1816]/50 p-4">

                                {postFormData.type === 'OUTFIT' ? (
                                    // Grilla para Outfits
                                    <div className="grid grid-cols-3 gap-3">
                                        {outfits.map((o) => {
                                            const isSelected = postFormData.outfitId === o.id;
                                            return (
                                                <div
                                                    key={o.id}
                                                    onClick={() => setPostFormData({ ...postFormData, outfitId: o.id, clothesId: null })}
                                                    className={`aspect-square border cursor-pointer relative overflow-hidden transition-all ${
                                                        isSelected ? 'border-[#c49a6c] ring-2 ring-[#c49a6c]' : 'border-[#3a3530]'
                                                    }`}
                                                >
                                                    <div className="grid grid-cols-2 h-full opacity-70">
                                                        {o.clothes?.slice(0, 4).map((c) => (
                                                            <img key={c.id} src={c.imageUrl || c.image_url} className="w-full h-full object-cover" />
                                                        ))}
                                                    </div>
                                                    <span className="absolute bottom-0 inset-x-0 bg-black/90 text-[8px] text-[#c49a6c] text-center truncate p-1 uppercase tracking-widest">
                            {o.name}
                        </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    // 2. SECCIÓN DE PRENDAS: Cada tipo es una fila de ancho completo
                                    CLOTHING_TYPES.map(type => {
                                        const prendasDelTipo = clothes.filter(c => c.typeId === type.id);
                                        if (prendasDelTipo.length === 0) return null;

                                        return (
                                            <div key={type.id} className="flex flex-col gap-4">
                                                {/* Título de la categoría con línea elegante */}
                                                <div className="flex items-center gap-4">
                                                    <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8a7d6e] whitespace-nowrap">
                                                        {type.label}
                                                    </h4>
                                                    <div className="h-px bg-[#3a3530] w-full"></div>
                                                </div>

                                                {/* 3. La grilla real: 4 columnas para que las fotos sean grandes */}
                                                <div className="grid grid-cols-4 gap-3">
                                                    {prendasDelTipo.map((c) => {
                                                        const isSelected = postFormData.clothesId === c.id;
                                                        return (
                                                            <div
                                                                key={c.id}
                                                                onClick={() => setPostFormData({ ...postFormData, clothesId: c.id, outfitId: null, type: 'CLOTHE' })}
                                                                className={`aspect-square border cursor-pointer relative overflow-hidden transition-all duration-300 ${
                                                                    isSelected ? 'border-[#c49a6c] ring-2 ring-[#c49a6c] z-10' : 'border-[#3a3530] hover:border-[#4a4540]'
                                                                }`}
                                                            >
                                                                <img
                                                                    src={c.image_url || c.imageUrl}
                                                                    className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-110' : 'hover:scale-105'}`}
                                                                />
                                                                {/* Mini label con nombre solo si está seleccionado */}
                                                                {isSelected && (
                                                                    <div className="absolute inset-0 bg-[#c49a6c]/10 pointer-events-none"></div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>



                            <div>
                                <label className={labelClass}>Descripción</label>
                                <textarea
                                    value={postFormData.descripcion}
                                    onChange={(e) => setPostFormData({...postFormData, descripcion: e.target.value})}
                                    placeholder="Escribe algo sobre esto..."
                                    rows={3}
                                    className={inputClass + " resize-none"}
                                />
                            </div>

                            <div className="flex gap-4">
                                <button type="submit"
                                        className="flex-1 py-3 bg-[#c49a6c] text-[#221f1c] text-xs font-semibold uppercase tracking-widest hover:bg-[#e8d5b0]">
                                    Publicar
                                </button>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 border border-[#4a4540] text-[#6b6258] text-xs uppercase tracking-widest">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                )}
                </div>
                )
            </div> // Cierre del div principal .min-h-screen
            );
            }

export default MyProfile;