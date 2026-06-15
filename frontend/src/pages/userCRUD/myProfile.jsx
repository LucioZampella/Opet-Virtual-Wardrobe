import {useEffect, useState} from "react";
import FollowButton from "../FollowButton/FollowButton.jsx";
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
    const [stats, setStats] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [selectedPostDetail, setSelectedPostDetail] = useState(null);
    const [activeProfilePreviewImage, setActiveProfilePreviewImage] = useState("");

    useEffect(() => {
        apiFetch(`/api/stats/user/${userId}`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Error cargando stats", err));
    }, [userId]);

    // --> Al cargar la pagina busca los datos del usuario por su id
    useEffect(() => {
        apiFetch(`/usuarios/profile/${userId}`)
            .then(res => res.json())
            .then(data => { setUser(data); setFormData(data); })
            .catch(err => console.error("Hubo un error al cargar el perfil", err));
    }, [userId]);

    useEffect(() => {
        // Si no hay userId todavía (por ejemplo, mientras carga), frenamos acá
        if (!userId) return;

        // Acoplamos tu endpoint @GetMapping("/user/{userId}")
        apiFetch(`/api/posts/user/${userId}`)
            .then(res => res.json())
            .then(data => {
                console.log("Posts del usuario cargados:", data);
                setMyPosts(data); // El estado dinámico que alimenta el carrusel
            })
            .catch(err => console.error("Error cargando posts del usuario", err));

        // Tus otros fetches para el armario (solo si los necesitas en esta vista)
        apiFetch('/outfit/my-outfits')
            .then(res => res.json())
            .then(data => setOutfits(data))
            .catch(err => console.error("Error cargando outfits", err));

        apiFetch('/clothes/my-clothes')
            .then(res => res.json())
            .then(data => setClothes(data))
            .catch(err => console.error("Error cargando prendas", err));

    }, [userId, token]);

    useEffect(() => {
        if (!isOwner && userId && loggedUserId) {
            apiFetch(`/api/friends/is-following?followerId=${loggedUserId}&followingId=${userId}`)
                .then(res => res.json())
                .then(data => setIsFollowing(data))
                .catch(err => console.error("Error chequeando follow", err));
        }
    }, [userId, loggedUserId]);

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
    // cambio si me perfil es privado o no
    const handleTogglePrivacy = async () => {
        try {
            const response = await apiFetch(`/usuarios/privacy`, { method: "PUT" });
            if (response.ok) {
                setUser(prev => ({ ...prev, isPrivate: !prev.isPrivate }));
                toast.success(user.isPrivate ? "Perfil ahora público" : "Perfil ahora privado");
            } else {
                toast.error("No se pudo cambiar la privacidad");
            }
        } catch {
            toast.error("Error de conexión");
        }
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

    const StatsSection = () => {
        if (!stats) return null;

        const colors = ['#c49a6c','#8a7d6e','#6b6258','#4a4540','#3a3530'];
        const total = stats.totalClothes;

        const BarGroup = ({ data, label }) => {
            if (!data || data.length === 0) return null;
            const max = Math.max(...data.map(d => d.count));
            return (
                <div className="border border-[#3a3530] bg-[#221f1c] p-5">
                    <p className="text-[9px] tracking-[0.25em] uppercase text-[#6b6258] mb-4">{label}</p>
                    <div className="flex flex-col gap-3">
                        {data.map((d, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-[10px] text-[#8a7d6e] w-20 text-right shrink-0">{d.label}</span>
                                <div className="flex-1 h-[2px] bg-[#2a2622]">
                                    <div
                                        className="h-full bg-[#c49a6c] transition-all duration-700"
                                        style={{ width: `${(d.count / max) * 100}%` }}
                                    />
                                </div>
                                <span className="text-[10px] text-[#4a4540] w-5 text-right">{d.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        const DonutColor = () => {
            if (!stats.byColor || stats.byColor.length === 0) return null;
            return (
                <div className="border border-[#3a3530] bg-[#221f1c] p-5">
                    <p className="text-[9px] tracking-[0.25em] uppercase text-[#6b6258] mb-4">Por color</p>
                    <div className="flex flex-col gap-2">
                        {stats.byColor.map((d, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-2 h-2 shrink-0" style={{ background: colors[i % colors.length] }} />
                                <span className="text-[10px] text-[#8a7d6e] flex-1">{d.label}</span>
                                <span className="text-[10px] text-[#4a4540]">{d.count}</span>
                                <span className="text-[9px] text-[#3a3530] w-8 text-right">
                                {total > 0 ? Math.round((d.count / total) * 100) : 0}%
                            </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        const TopClothes = () => {
            if (!stats.topClothesByOutfitUsage || stats.topClothesByOutfitUsage.length === 0) return null;
            const max = Math.max(...stats.topClothesByOutfitUsage.map(d => d.timesUsedInOutfit));
            return (
                <div className="border border-[#3a3530] bg-[#221f1c] p-5">
                    <p className="text-[9px] tracking-[0.25em] uppercase text-[#6b6258] mb-4">Más usadas en outfits</p>
                    <div className="flex flex-col gap-3">
                        {stats.topClothesByOutfitUsage.map((d, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-[10px] text-[#3a3530] w-4">{i + 1}</span>
                                {d.imageUrl
                                    ? <img src={d.imageUrl} className="w-8 h-8 object-cover border border-[#3a3530] shrink-0" />
                                    : <div className="w-8 h-8 bg-[#2a2622] border border-[#3a3530] shrink-0" />
                                }
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] text-[#e8d5b0] truncate">{d.clotheName}</p>
                                    <p className="text-[9px] text-[#4a4540]">{d.timesUsedInOutfit} usos</p>
                                </div>
                                <div className="w-12 h-[2px] bg-[#2a2622]">
                                    <div
                                        className="h-full bg-[#c49a6c]"
                                        style={{ width: `${(d.timesUsedInOutfit / max) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        return (
            <div className="max-w-2xl mx-auto px-6 py-8">

                {/* Título sección */}
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-[#8a7d6e] text-[10px] tracking-[0.3em] uppercase">Estadísticas</span>
                    <div className="flex-1 h-px bg-[#3a3530]" />
                </div>

                {/* Métricas resumen */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { label: "Prendas", value: stats.totalClothes },
                        { label: "Outfits", value: stats.totalOutfits },
                        { label: "Coincidencia prom.", value: `${Math.round(stats.avgOutfitCoincidenceLevel)}` },
                    ].map(m => (
                        <div key={m.label} className="bg-[#221f1c] border border-[#3a3530] p-4">
                            <p className="text-[28px] font-light text-[#e8d5b0] tracking-wide">{m.value}</p>
                            <p className="text-[9px] tracking-[0.2em] uppercase text-[#4a4540] mt-1">{m.label}</p>
                        </div>
                    ))}
                </div>

                {/* Preferencia promedio */}
                <div className="border border-[#3a3530] bg-[#221f1c] p-5 mb-6">
                    <p className="text-[9px] tracking-[0.25em] uppercase text-[#6b6258] mb-3">Nivel de preferencia promedio</p>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-[32px] font-light text-[#c49a6c]">{Math.round(stats.avgPreferenceLevel)}</span>
                        <span className="text-[9px] text-[#4a4540] tracking-[0.2em] uppercase">/ 100</span>
                    </div>
                    <div className="h-[2px] bg-[#2a2622] relative">
                        <div
                            className="h-full bg-[#c49a6c] transition-all duration-700"
                            style={{ width: `${stats.avgPreferenceLevel}%` }}
                        />
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#c49a6c]"
                            style={{ left: `${stats.avgPreferenceLevel}%` }}
                        />
                    </div>
                </div>

                {/* Grilla de gráficos */}
                <div className="grid grid-cols-2 gap-3">
                    <BarGroup data={stats.byType} label="Por tipo" />
                    <DonutColor />
                    <BarGroup data={stats.bySize} label="Por talle" />
                    <BarGroup data={stats.byFit} label="Por fit" />
                    <BarGroup data={stats.byMaterial} label="Por material" />
                    <TopClothes />
                </div>

            </div>
        );
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

                            {isOwner ? (
                                <div className="flex flex-col gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="px-5 py-2 border border-[#4a4540] hover:border-[#c49a6c] text-[#8a7d6e] hover:text-[#c49a6c] text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
                                    >
                                        Editar Perfil
                                    </button>
                                    <button
                                        onClick={handleTogglePrivacy}
                                        className={`px-5 py-2 border text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
                                            user.isPrivate
                                                ? "border-[#c49a6c] text-[#c49a6c] hover:border-[#4a4540] hover:text-[#4a4540]"
                                                : "border-[#4a4540] text-[#4a4540] hover:border-[#c49a6c] hover:text-[#c49a6c]"
                                        }`}
                                    >
                                        {user.isPrivate ? "Perfil privado" : "Perfil público"}
                                    </button>
                                </div>
                            ) : (
                                // Si NO soy el dueño, aparece el botón reutilizable de seguir
                                <FollowButton
                                    currentUserId={loggedUserId}  // Tu ID (el que está logueado)
                                    profileUserId={userId}        // El ID del perfil que estás visitando
                                    isPrivate={user.isPrivate}
                                />
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


                {/* --- SECCIÓN DE PUBLICACIONES --- */}
                {console.log("isOwner:", isOwner)}
                {console.log("isPrivate:", user.isPrivate)}
                {console.log("isFollowing:", isFollowing)}
                {isOwner || !user.isPrivate || isFollowing ? (
                    <div className="max-w-6xl mx-auto px-6 py-8 overflow-hidden">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-[#8a7d6e] text-[10px] tracking-[0.3em] uppercase">Publicaciones</span>
                            <div className="flex-1 h-px bg-[#3a3530]"></div>
                        </div>

                        <div className="flex gap-4 items-start">
                            {/* BOTÓN NUEVO POST */}
                            {isOwner && (
                                <div
                                    onClick={() => setShowCreateModal(true)}
                                    className="w-64 h-[420px] flex-shrink-0 border-2 border-dashed border-[#3a3530] bg-[#2a2622] flex flex-col items-center justify-center hover:border-[#c49a6c] hover:bg-[#221f1c] cursor-pointer transition-all duration-300 group z-10"
                                >
                                    <span className="text-[#3a3530] group-hover:text-[#c49a6c] text-4xl font-thin">+</span>
                                    <span className="text-[#3a3530] group-hover:text-[#c49a6c] text-[8px] tracking-[0.2em] uppercase mt-2">Nuevo Post</span>
                                </div>
                            )}

                            {/* CARRUSEL */}
                            <div className="relative overflow-hidden w-full">
                                <div className="animate-infinite-carousel flex gap-4">
                                    {myPosts.map((post, index) => (
                                        <div
                                            key={`${post.id}-${index}`}
                                            className="w-72 flex-shrink-0 border border-[#3a3530] bg-[#221f1c] overflow-hidden hover:border-[#c49a6c] transition-colors duration-300 shadow-xl"
                                        >
                                            <div
                                                onClick={() => {
                                                    setSelectedPostDetail(post);
                                                    // Si el post tiene un outfit con prendas, seteamos la primera como inicial
                                                    if (post.outfit?.clothes && post.outfit.clothes.length > 0) {
                                                        setActiveProfilePreviewImage(post.outfit.clothes[0].image_url);
                                                    } else if (post.clothe) {
                                                        // Si es una publicación de una sola prenda
                                                        setActiveProfilePreviewImage(post.clothe.image_url);
                                                    }
                                                }}
                                                className="aspect-square bg-[#1c1917] relative group/media overflow-hidden cursor-pointer"
                                            >
                                                {post.outfit ? (
                                                    (() => {
                                                        const clothesCount = post.outfit.clothes?.length || 0;
                                                        const items = post.outfit.clothes || [];

                                                        // CASO 1: Una sola prenda en el outfit (Raro, pero por las dudas)
                                                        if (clothesCount === 1) {
                                                            return <img src={items[0].image_url} className="w-full h-full object-cover" alt="Prenda" />;
                                                        }

                                                        // CASO 2: Dos prendas (Dividido a la mitad vertical, muy limpio)
                                                        if (clothesCount === 2) {
                                                            return (
                                                                <div className="grid grid-cols-2 gap-[2px] h-full bg-[#221f1c]">
                                                                    <img src={items[0].image_url} className="w-full h-full object-cover" alt="Prenda 1" />
                                                                    <img src={items[1].image_url} className="w-full h-full object-cover" alt="Prenda 2" />
                                                                </div>
                                                            );
                                                        }

                                                        // CASO 3: 3 o más prendas (Layout Asimétrico de Revista de Moda)
                                                        // La primera prenda toma todo el lateral izquierdo, las demás se apilan a la derecha
                                                        return (
                                                            <div className="grid grid-cols-3 gap-[2px] h-full bg-[#221f1c]">
                                                                {/* Prenda principal destacada (ocupa 2 columnas de ancho y todo el alto) */}
                                                                <div className="col-span-2 h-full border-r border-[#221f1c]">
                                                                    <img src={items[0].image_url} className="w-full h-full object-cover" alt="Destacado" />
                                                                </div>

                                                                {/* Columna de la derecha para el resto de las prendas */}
                                                                <div className="grid grid-rows-2 gap-[2px] h-full">
                                                                    <div className="h-full relative">
                                                                        <img src={items[1].image_url} className="w-full h-full object-cover" alt="Prenda 2" />
                                                                    </div>
                                                                    <div className="h-full relative">
                                                                        <img src={items[2].image_url} className="w-full h-full object-cover" alt="Prenda 3" />

                                                                        {/* Si hay más de 3 prendas, mostramos un indicador sofisticado encima de la última */}
                                                                        {clothesCount > 3 && (
                                                                            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center backdrop-blur-[2px]">
                                                                                <span className="text-[#e8d5b0] text-sm font-light">+{clothesCount - 3}</span>
                                                                                <span className="text-[#6b6258] text-[7px] tracking-[0.1em] uppercase mt-0.5">Prendas</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()
                                                ) : post.clothe ? (
                                                    // Renderizado simple si es una sola prenda suelta
                                                    <img src={post.clothe.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-105" alt="Prenda suelta" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#4a4540] text-[10px] tracking-widest uppercase">Sin imagen</div>
                                                )}
                                            </div>

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
                                                        <button
                                                            onClick={() => { setEditingPost(post); setEditPostDesc(post.descripcion); }}
                                                            className="flex-1 py-1.5 border border-[#4a4540] hover:border-[#c49a6c] text-[#6b6258] hover:text-[#c49a6c] text-[9px] tracking-[0.15em] uppercase transition-all"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePost(post.id)}
                                                            className="flex-1 py-1.5 border border-[#4a4540] hover:border-red-900 text-[#4a4540] hover:text-red-700 text-[9px] tracking-[0.15em] uppercase transition-all"
                                                        >
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
                        {/* Estadisticas: AHORA SOLO VISIBLES SI SOS EL DUEÑO */}
                        {isOwner && (
                            <StatsSection />
                        )}

                        {/* BOTONES ABAJO DE LAS STATS (SOLO SI SOS EL DUEÑO) */}
                        {isOwner && (
                            <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-[#3a3530]/50 max-w-6xl mx-auto">
                                <button
                                    onClick={logOut}
                                    className="px-5 py-2.5 border border-[#3a3530] hover:border-[#6b6258] text-[#6b6258] hover:text-[#e8d5b0] text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
                                >
                                    Cerrar Sesión
                                </button>
                                <button
                                    onClick={eliminateProfile}
                                    className="px-5 py-2.5 border border-red-950/40 hover:border-red-800 text-red-900/60 hover:text-red-400 text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
                                >
                                    Eliminar Cuenta
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto px-6 py-20 flex flex-col items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#3a3530]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <p className="text-[#4a4540] text-[10px] tracking-[0.3em] uppercase">Perfil privado</p>
                        <p className="text-[#3a3530] text-[11px] tracking-wide">
                            Seguí a este usuario para ver su contenido
                        </p>
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
                {selectedPostDetail && (
                    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-sm animate-fade-in">

                        <div className="bg-[#221f1c] border border-[#3a3530] w-full max-w-5xl h-[85vh] flex flex-col md:flex-row relative shadow-2xl overflow-hidden">

                            {/* BOTÓN CERRAR */}
                            <button
                                onClick={() => setSelectedPostDetail(null)}
                                className="absolute top-4 right-4 z-50 text-[#8a7d6e] hover:text-[#e8d5b0] transition-colors p-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* COLUMNA IZQUIERDA: Visualizador Dinámico Interactuable */}
                            <div className="w-full md:w-1/2 h-2/5 md:h-full bg-[#1a1816] flex items-center justify-center relative border-b md:border-b-0 md:border-r border-[#3a3530]">
                                {activeProfilePreviewImage ? (
                                    <div className="w-full h-full p-6 flex items-center justify-center animate-fade-in">
                                        <img
                                            src={activeProfilePreviewImage}
                                            className="w-full h-full object-contain max-h-[70vh]"
                                            alt="Visualización de prenda"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-[#4a4540] text-[10px] tracking-widest uppercase">Sin imagen</div>
                                )}
                                <div className="absolute bottom-6 left-6 bg-black/60 border border-[#c49a6c]/30 px-3 py-1.5 backdrop-blur-sm">
                                    <span className="text-[#c49a6c] text-[8px] tracking-[0.2em] uppercase font-semibold">Exhibidor de Look</span>
                                </div>
                            </div>

                            {/* COLUMNA DERECHA: Datos del Post y Perchero */}
                            <div className="w-full md:w-1/2 h-3/5 md:h-full flex flex-col bg-[#221f1c]">

                                {/* Cabecera */}
                                <div className="p-6 border-b border-[#3a3530]/60 flex items-center gap-3">
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} className="w-6 h-6 rounded-full object-cover" alt="" />
                                    ) : (
                                        <span className="w-6 h-6 rounded-full bg-[#3a3530] flex items-center justify-center text-[#c49a6c] text-[9px]">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-[#e8d5b0] text-[11px] tracking-widest font-light">@{user?.username}</span>
                                        <span className="text-[#6b6258] text-[8px] tracking-[0.1em] uppercase mt-0.5">
                            {selectedPostDetail.outfit ? 'Colección Outfit' : 'Detalle de Prenda'}
                        </span>
                                    </div>
                                </div>

                                {/* Contenido con scroll */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-elegant">
                                    <div>
                                        <span className="text-[#4a4540] text-[8px] tracking-[0.2em] uppercase font-bold block mb-2">Inspiración</span>
                                        <p className="text-[#8a7d6e] text-xs leading-relaxed font-light italic">
                                            "{selectedPostDetail.descripcion || 'Sin descripción provista.'}"
                                        </p>
                                    </div>

                                    <div className="h-px bg-[#3a3530]/40"></div>

                                    {/* LISTA DE PRENDAS INTERACTIVAS */}
                                    <div>
                        <span className="text-[#4a4540] text-[8px] tracking-[0.2em] uppercase font-bold block mb-4">
                            {selectedPostDetail.outfit ? 'Prendas en este look' : 'Especificaciones'}
                        </span>

                                        <div className="grid grid-cols-1 gap-3">
                                            {selectedPostDetail.outfit ? (
                                                selectedPostDetail.outfit.clothes?.map((clothe) => {
                                                    // Evaluamos si esta es la prenda activa en el visualizador
                                                    const isCurrentlyActive = activeProfilePreviewImage === clothe.image_url;
                                                    return (
                                                        <div
                                                            key={clothe.id}
                                                            onMouseEnter={() => setActiveProfilePreviewImage(clothe.image_url)}
                                                            onClick={() => setActiveProfilePreviewImage(clothe.image_url)}
                                                            className={`flex gap-4 p-3 transition-all duration-300 cursor-pointer border ${isCurrentlyActive ? 'bg-[#1a1816] border-[#c49a6c]/50' : 'bg-[#1a1816]/40 border-[#3a3530]/40 hover:border-[#4a4540]'}`}
                                                        >
                                                            <div className="w-14 h-14 bg-[#161413] flex-shrink-0 overflow-hidden border border-[#3a3530]/60">
                                                                <img src={clothe.image_url} className="w-full h-full object-cover" alt="" />
                                                            </div>
                                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                                <h4 className="text-[#e8d5b0] text-[11px] tracking-wider font-light truncate">
                                                                    {clothe.name || CLOTHING_TYPES.find(t => t.id === clothe.typeId)?.label || "Prenda del Look"}
                                                                </h4>
                                                                <p className="text-[#c49a6c] text-[8px] tracking-widest uppercase mt-1 font-medium">
                                                                    {CLOTHING_TYPES.find(type => type.id === clothe.typeId)?.label || "Colección Privada"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                /* Si es una sola prenda suelta en el post */
                                                <div className="flex gap-4 p-3 bg-[#1a1816]/40 border border-[#c49a6c]/30">
                                                    <div className="w-14 h-14 bg-[#161413] flex-shrink-0 overflow-hidden">
                                                        <img src={selectedPostDetail.clothe?.image_url} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                        <h4 className="text-[#e8d5b0] text-[11px] tracking-wider font-light">
                                                            {selectedPostDetail.clothe?.name || "Pieza Exclusiva"}
                                                        </h4>
                                                        <p className="text-[#c49a6c] text-[8px] tracking-widest uppercase mt-1 font-medium">
                                                            {CLOTHING_TYPES.find(type => type.id === selectedPostDetail.clothe?.typeId)?.label || "Pieza Única"}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-4 bg-[#1a1816]/30 border-t border-[#3a3530]/40 text-center">
                                    <span className="text-[#4a4540] text-[8px] tracking-[0.3em] uppercase">Estilo Curado • OPET Studio</span>
                                </div>

                            </div>
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