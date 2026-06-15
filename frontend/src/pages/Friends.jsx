import { useState, useEffect } from "react"; // 1. Agregamos useEffect
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Search from "../pages/searching/Search.jsx";

function SearchUsers() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [friends, setFriends] = useState([]); // 2. Estado para los amigos
    const [loading, setLoading] = useState(false);
    const [loadingFriends, setLoadingFriends] = useState(true); // Carga inicial de amigos
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // 3. Traer los amigos al cargar el componente
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                // 1. Apuntamos a la nueva ruta /api/friends
                const res = await fetch(`http://localhost:8080/api/friends`, {
                    method: "GET",
                    headers: {
                        // 2. Nos aseguramos de mandar el Bearer completo como espera tu Java
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }

                const data = await res.json();
                setFriends(data); // Guardamos la lista de amigos directos
            } catch (e) {
                console.error("Error cargando amigos:", e);
            } finally {
                setLoadingFriends(false);
            }
        };

        if (token) {
            fetchFriends();
        } else {
            setLoadingFriends(false);
        }
    }, [token]);

    const handleSearch = async (value) => {
        setQuery(value);

        if (value.trim().length < 2) {
            setUsers([]);
            setSearched(false);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/usuarios/search?query=${value}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
            setSearched(true);
        } catch (e) {
            console.error("Error buscando usuarios:", e);
        } finally {
            setLoading(false);
        }
    };

    // 4. Determinar qué lista renderizar y qué título mostrar
    const isSearching = query.trim().length >= 2;
    const displayUsers = isSearching ? users : friends;
    const sectionTitle = isSearching ? "Resultados" : "Mis Amigos";

    return (
        <div className="min-h-screen bg-[#2a2622]">
            <Navbar />
            <div className="pt-14 pb-16 max-w-xl mx-auto px-4">

                <div className="pt-6 pb-2 border-b border-[#3a3530] mb-6">
                    <p className="text-[#6b6258] text-[10px] tracking-[0.3em] uppercase mb-1">Opet</p>
                    <h1 className="text-[#e8d5b0] text-2xl font-light tracking-widest">Buscador</h1>
                    <div className="w-8 h-px bg-[#c49a6c] mt-2"></div>
                </div>

                <Search
                    value={query}
                    onChange={handleSearch}
                    placeholder="BUSCAR USUARIOS..."
                />

                {/* Subtítulo dinámico para saber si estás viendo amigos o resultados */}
                {!loading && !(isSearching && users.length === 0) && (
                    <h2 className="text-[#c49a6c] text-[11px] tracking-[0.2em] uppercase mt-8 mb-4 font-light">
                        {sectionTitle}
                    </h2>
                )}

                {/* Loading de la búsqueda */}
                {loading && (
                    <p className="text-[#6b6258] text-xs text-center tracking-[0.3em] uppercase animate-pulse mt-10">
                        Buscando...
                    </p>
                )}

                {/* Loading inicial de amigos */}
                {loadingFriends && !isSearching && (
                    <p className="text-[#6b6258] text-xs text-center tracking-[0.3em] uppercase animate-pulse mt-10">
                        Cargando amigos...
                    </p>
                )}

                {/* No se encontraron resultados en la búsqueda */}
                {searched && !loading && users.length === 0 && isSearching && (
                    <p className="text-[#6b6258] text-xs text-center tracking-[0.3em] uppercase mt-10">
                        No se encontraron usuarios.
                    </p>
                )}

                {/* No tiene amigos agregados todavía */}
                {!loadingFriends && friends.length === 0 && !isSearching && (
                    <p className="text-[#6b6258] text-xs text-center tracking-[0.15em] mt-10 normal-case italic">
                        Todavía no tenés amigos agregados. ¡Usa el buscador de arriba para encontrar gente!
                    </p>
                )}

                {/* Lista única para renderizar Amigos o Resultados */}
                <div className="flex flex-col gap-3">
                    {displayUsers.map(user => (
                        <div
                            key={user.id}
                            onClick={() => navigate(`/profile/${user.id}`)}
                            className="flex items-center gap-4 px-4 py-4 border border-[#3a3530] bg-[#221f1c] cursor-pointer hover:border-[#c49a6c] transition-colors duration-300"
                        >
                            {/* Avatar */}
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    className="w-12 h-12 rounded-full object-cover border border-[#3a3530] flex-shrink-0"
                                    alt={user.name}
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-[#3a3530] flex items-center justify-center text-[#c49a6c] text-lg flex-shrink-0">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex flex-col">
                                <span className="text-[#e8d5b0] text-sm font-light tracking-wide">
                                    {user.name}
                                </span>
                                <span className="text-[#6b6258] text-xs tracking-[0.15em] mt-0.5">
                                    @{user.username}
                                </span>
                            </div>

                            {/* Flecha */}
                            <svg className="ml-auto w-4 h-4 text-[#3a3530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchUsers;