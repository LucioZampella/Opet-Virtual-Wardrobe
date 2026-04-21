import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import {useNavigate} from "react-router-dom";

function Feed() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:8080/api/posts/feed", {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error("Error cargando feed:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-[#2a2622]">
            <Navbar />
            <div className="pt-14 pb-16 max-w-xl mx-auto px-4">

                {/* Header */}
                <div className="py-6 border-b border-[#3a3530] mb-6">
                    <p className="text-[#6b6258] text-[10px] tracking-[0.3em] uppercase mb-1">Opet</p>
                    <h1 className="text-[#e8d5b0] text-2xl font-light tracking-widest">Para ti</h1>
                    <div className="w-8 h-px bg-[#c49a6c] mt-2"></div>
                </div>

                {loading && (
                    <p className="text-[#6b6258] text-xs text-center tracking-[0.3em] uppercase animate-pulse mt-10">Cargando...</p>
                )}

                {!loading && posts.length === 0 && (
                    <p className="text-[#6b6258] text-xs text-center tracking-[0.3em] uppercase mt-10">No hay publicaciones todavía.</p>
                )}

                {/* Posts */}
                <div className="flex flex-col gap-8">
                    {posts.map(post => (
                        <div key={post.id} className="border border-[#3a3530] bg-[#221f1c] overflow-hidden">

                            {/* Header del post */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#3a3530] cursor-pointer"
                                 onClick={() => navigate(`/profile/${post.user?.id}`)}>
                                {post.user?.avatar_url
                                    ? <img src={post.user.avatar_url} className="w-8 h-8 rounded-full object-cover"/>
                                    : <span
                                        className="w-8 h-8 rounded-full bg-[#3a3530] flex items-center justify-center text-[#c49a6c] text-sm">
                                        {post.user?.name?.charAt(0).toUpperCase()}
                                      </span>
                                }
                                <div>
                                    <p className="text-[#c49a6c] text-xs tracking-[0.15em]">@{post.user?.username}</p>
                                    <p className="text-[#4a4540] text-[9px]">{post.dateOfPost}</p>
                                </div>
                            </div>

                            {/* Grid de prendas del outfit */}
                            <div className="grid grid-cols-3 gap-0.5">
                            {post.outfit?.clothes?.slice(0, 9).map(clothe => (
                                    <div key={clothe.id} className="aspect-square overflow-hidden">
                                        {clothe.image_url
                                            ? <img src={clothe.image_url} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full bg-[#2a2622] flex items-center justify-center">
                                                <span className="text-[#3a3530] text-[9px]">{clothe.name}</span>
                                            </div>
                                        }
                                    </div>
                                ))}
                            </div>

                            {/* Footer del post */}
                            <div className="px-4 py-3">
                                <p className="text-[#e8d5b0] text-xs font-light tracking-wide mb-1">{post.outfit?.name}</p>
                                <p className="text-[#6b6258] text-xs leading-relaxed">{post.descripcion}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Feed;