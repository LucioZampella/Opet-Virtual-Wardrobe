import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NotificationBell from "./NotificationBell.jsx";

const CLIMA_CACHE_KEY = "opet_clima_cache";
const CLIMA_TTL_MS = 30 * 60 * 1000; // 30 minutos

function Navbar() {
    const [user, setUser] = useState(null);
    const [clima, setClima] = useState({ temperatura: "", emoji: "", estado: "" });
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // ── Clima con cache de 30 minutos ──────────────────────────────
    useEffect(() => {
        const cargarClima = async () => {
            // 1. Intentar leer del cache
            try {
                const cached = localStorage.getItem(CLIMA_CACHE_KEY);
                if (cached) {
                    const { data, timestamp } = JSON.parse(cached);
                    if (Date.now() - timestamp < CLIMA_TTL_MS) {
                        setClima(data);
                        return; // Todavía es válido, no hacemos nada más
                    }
                }
            } catch (_) { /* cache corrupto, ignorar */ }

            // 2. Cache vencido o inexistente → pedir ubicación
            const fetchClima = async (lat, lon) => {
                try {
                    const res = await fetch(
                        `http://localhost:8080/api/weather/feed-summary?lat=${lat}&lon=${lon}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (res.ok) {
                        const data = await res.json();
                        setClima(data);
                        localStorage.setItem(CLIMA_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
                    }
                } catch (e) {
                    setClima({ temperatura: "--", emoji: "🤷‍♂️", estado: "Error" });
                }
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    ({ coords }) => fetchClima(coords.latitude, coords.longitude),
                    ()          => fetchClima(-34.6037, -58.3816) // fallback Buenos Aires
                );
            } else {
                fetchClima(-34.6037, -58.3816);
            }
        };

        if (token) cargarClima();
    }, [token]);

    // ── Usuario ────────────────────────────────────────────────────
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId && token) {
            fetch(`http://localhost:8080/usuarios/profile/${userId}`, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            })
                .then(r => r.json())
                .then(setUser)
                .catch(e => console.error("Error al cargar usuario en Navbar:", e));
        }
    }, [token]);

    return (
        <>
            {/* Barra superior */}
            <div className="
                fixed top-0 left-0 right-0 z-50
                bg-[#221f1c] border-b border-[#3a3530]
                shadow-[0_4px_24px_rgba(0,0,0,0.4)]
                flex items-center justify-between px-6
                h-14
            ">
                {/* Widget de clima — izquierda */}
                <div className="flex items-center gap-1.5 min-w-[80px]">
                    {clima.temperatura ? (
                        <>
                            <span className="text-lg leading-none">{clima.emoji}</span>
                            <div className="flex flex-col leading-tight">
                                <span className="text-[#c49a6c] text-xs font-medium tracking-wide">
                                    {clima.temperatura}
                                </span>
                                <span className="text-[#6b6258] text-[9px] tracking-[0.1em] uppercase">
                                    {clima.estado}
                                </span>
                            </div>
                        </>
                    ) : (
                        /* Skeleton mientras carga */
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-[#3a3530] animate-pulse" />
                            <div className="flex flex-col gap-1">
                                <div className="w-10 h-2 bg-[#3a3530] rounded animate-pulse" />
                                <div className="w-8 h-1.5 bg-[#3a3530] rounded animate-pulse" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Logo — centro */}
                <img
                    src="/opet_cream.png"
                    className="h-10 object-contain opacity-90 cursor-pointer"
                    alt="Opet"
                    onClick={() => navigate("/feed")}
                />

                {/* Campana + avatar — derecha */}
                <div className="flex items-center gap-2">
                    <NotificationBell token={token} />
                    <button onClick={() => navigate('/profile')} className="group flex items-center gap-2">
                        {user ? (
                            <img
                                src={user.avatar_url || "/default-avatar.png"}
                                className="h-9 w-9 rounded-full object-cover border-2 border-[#3a3530] group-hover:border-[#c49a6c] transition-all"
                                alt="Mi Perfil"
                            />
                        ) : (
                            <div className="h-9 w-9 rounded-full bg-[#3a3530] animate-pulse" />
                        )}
                    </button>
                </div>
            </div>

            {/* Barra inferior — sin cambios */}
            <div className="
                fixed bottom-0 left-0 right-0 z-50
                bg-[#221f1c] border-t border-[#3a3530]
                flex justify-around items-center
                h-16
            ">
                <button onClick={() => navigate("/feed")} className="flex flex-col items-center gap-1 text-[#6b6258] hover:text-[#c49a6c] transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z"/></svg>
                    <span className="text-[9px] tracking-[0.15em] uppercase">Inicio</span>
                </button>
                <button onClick={() => navigate("/friends")} className="flex flex-col items-center gap-1 text-[#6b6258] hover:text-[#c49a6c] transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <span className="text-[9px] tracking-[0.15em] uppercase">Amigos</span>
                </button>
                <button onClick={() => navigate("/wardrobe")} className="flex flex-col items-center gap-1 text-[#6b6258] hover:text-[#c49a6c] transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h18M3 7l2 13h14L21 7M3 7l9-4 9 4"/></svg>
                    <span className="text-[9px] tracking-[0.15em] uppercase">Ropero</span>
                </button>
                <button onClick={() => navigate("/store")} className="flex flex-col items-center gap-1 text-[#6b6258] hover:text-[#c49a6c] transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18l-2 9H5L3 3zm0 0L2 1M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"/></svg>
                    <span className="text-[9px] tracking-[0.15em] uppercase">Tienda</span>
                </button>
                <button onClick={() => navigate("/outfit-builder")} className="flex flex-col items-center gap-1 text-[#6b6258] hover:text-[#c49a6c] transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/></svg>
                    <span className="text-[9px] tracking-[0.15em] uppercase">Outfit</span>
                </button>
                <button onClick={() => navigate("/search")} className="flex flex-col items-center gap-1 text-[#6b6258] hover:text-[#c49a6c] transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/></svg>
                    <span className="text-[9px] tracking-[0.15em] uppercase">Buscador</span>
                </button>
            </div>
        </>
    );
}

export default Navbar;