import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (userId) {
            fetch(`http://localhost:8080/usuarios/profile/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setUser(data);
                })
                .catch(error => console.error("Error al cargar usuario en Navbar:", error));
        }
    }, []);

    return (
        <>
            {/* Barra superior con logo */}
            <div className="
                fixed top-0 left-0 right-0 z-50
                bg-[#221f1c] border-b border-[#3a3530]
                shadow-[0_4px_24px_rgba(0,0,0,0.4)]
                flex items-center justify-between px-6
                h-14
            ">
                {/* Div vacío para centrar el logo perfectamente */}
                <div className="w-10"></div>

                <img
                    src="/opet_cream.png"
                    className="h-10 object-contain opacity-90 cursor-pointer"
                    alt="Opet"
                    onClick={() => navigate("/feed")}
                />

                <div className="flex items-center">
                    <button
                        onClick={() =>
                            navigate('/profile')
                    }
                        className="group flex items-center gap-2"
                    >
                        {user ? (
                            <img
                                src={user.avatar_url || "/default-avatar.png"}
                                className="h-9 w-9 rounded-full object-cover border-2 border-[#3a3530] group-hover:border-cream transition-all"
                                alt="Mi Perfil"
                            />
                        ) : (
                            // 2. Corregido: El div del skeleton ahora está bien envuelto
                            <div className="h-9 w-9 rounded-full bg-[#3a3530] animate-pulse" />
                        )}
                    </button>
                </div>
            </div> {/* 3. Corregido: Faltaba cerrar este div de la barra superior */}

            {/* Barra inferior de navegación */}
            <div className="
                fixed bottom-0 left-0 right-0 z-50
                bg-[#221f1c] border-t border-[#3a3530]
                flex justify-around items-center
                h-16
            ">
                <button onClick={() => navigate("/feed")}
                        className="flex flex-col items-center gap-1 text-[#6b6258] hover:text-[#c49a6c] transition-colors duration-300">
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

