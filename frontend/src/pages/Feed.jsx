import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";

function Feed() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("global"); // "global" para el feed general, "friends" para amigos
    const token = localStorage.getItem("token");

    useEffect(() => {
        setLoading(true);
        setPosts([]);
        const endpoint = activeTab === "global"
            ? "http://localhost:8080/api/feed/feed"
            : "http://localhost:8080/api/feed/friends";

        fetch(endpoint, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                // Al usar Page<PostResponseDTO> en el backend, los datos están encapsulados en .content
                if (data && data.content) {
                    setPosts(data.content);
                } else {
                    setPosts([]);
                }
            })
            .catch(err => console.error("Error cargando feed:", err))
            .finally(() => setLoading(false));
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-[#2a2622]">
            <Navbar />
            <div className="pt-14 pb-16 max-w-xl mx-auto px-4">

                {/* Header & Tabs */}
                <div className="pt-6 pb-2 border-b border-[#3a3530] mb-6 flex flex-col gap-4">
                    <div>
                        <p className="text-[#6b6258] text-[10px] tracking-[0.3em] uppercase mb-1">Opet</p>
                        <h1 className="text-[#e8d5b0] text-2xl font-light tracking-widest">
                            {activeTab === "global" ? "Para ti" : "Amigos"}
                        </h1>
                        <div className="w-8 h-px bg-[#c49a6c] mt-2"></div>
                    </div>
                    <div className="flex gap-6 mt-2 text-xs tracking-[0.2em] uppercase font-light">
                        <button
                            onClick={() => setActiveTab("global")}
                            className={`pb-2 transition-all duration-300 relative ${
                                activeTab === "global"
                                    ? "text-[#c49a6c] font-normal"
                                    : "text-[#6b6258] hover:text-[#e8d5b0]"
                            }`}
                        >
                            Para ti
                            {activeTab === "global" && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c49a6c] transition-all" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("friends")}
                            className={`pb-2 transition-all duration-300 relative ${
                                activeTab === "friends"
                                    ? "text-[#c49a6c] font-normal"
                                    : "text-[#6b6258] hover:text-[#e8d5b0]"
                            }`}
                        >
                            Amigos
                        </button>
                    </div>
                </div>

                {loading && (
                    <p className="text-[#6b6258] text-xs text-center tracking-[0.3em] uppercase animate-pulse mt-10">Cargando...</p>
                )}

                {!loading && posts.length === 0 && (
                    <p className="text-[#6b6258] text-xs text-center tracking-[0.3em] uppercase mt-10">
                        {activeTab === "global"
                            ? "No hay publicaciones todavía."
                            : "Tus amigos no han publicado nada aún."}
                    </p>
                )}

                {/* Posts */}
                <div className="flex flex-col gap-8">
                    {posts.map(post => (
                        <div key={post.id} className="border border-[#3a3530] bg-[#221f1c] overflow-hidden">

                            {/* Header del post */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#3a3530] cursor-pointer"
                                 onClick={() => navigate(`/profile/${post.userId}`)}>
                                {post.avatarUrl
                                    ? <img src={post.user.avatar_url} className="w-8 h-8 rounded-full object-cover"/>
                                    : <span
                                        className="w-8 h-8 rounded-full bg-[#3a3530] flex items-center justify-center text-[#c49a6c] text-sm">
                                        {post.user?.name?.charAt(0).toUpperCase()}
                                      </span>
                                }
                                <div>
                                    <p className="text-[#c49a6c] text-xs tracking-[0.15em]">@{post.username || post.user?.username}</p>
                                    <p className="text-[#4a4540] text-[9px]">{post.dateOfPost}</p>
                                </div>
                            </div>

                            <div className="relative bg-[#2a2622]">
                                {post.image_url ? (
                                    <img src={post.image_url} className="w-full aspect-square object-cover" />
                                ) : post.clothesImages && post.clothesImages.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-0.5">
                                        {post.clothesImages.slice(0, 4).map((imgUrl, idx) => (
                                            <img key={idx} src={imgUrl} className="w-full aspect-square object-cover" />
                                        ))}
                                    </div>
                                ) : post.outfit ? (
                                    /* 3. Fallback si lee el objeto completo outfit */
                                    <div className="grid grid-cols-2 gap-0.5">
                                        {post.outfit.clothes?.slice(0, 4).map(clothe => (
                                            <img key={clothe.id} src={clothe.image_url} className="w-full aspect-square object-cover" />
                                        ))}
                                    </div>
                                ) : (
                                    /* 4. Placeholder si no hay nada */
                                    <div className="aspect-square flex items-center justify-center text-[#3a3530]">
                                        <p className="text-[10px] tracking-widest">SIN IMAGEN</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer del post */}
                            <div className="px-4 py-3">
                                <p className="text-[#e8d5b0] text-xs font-light tracking-wide mb-1">{post.title || post.outfit?.name}</p>
                                <p className="text-[#6b6258] text-xs leading-relaxed">{post.caption || post.descripcion}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Feed;