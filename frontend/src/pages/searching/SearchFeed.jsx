import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import Search from "../searching/Search.jsx";
import GenericSelect from "../../constants/GenericSelect";
import { CLOTHING_TYPES, COLORS, SIZES, FITS, MATERIALS } from "../../constants/clotheOptions.js";
import toast from "react-hot-toast";
import { useApi } from "../../modules/useApi.js";

function SearchFeed() {
    const { apiFetch } = useApi();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        typeId:          "",
        sizeId:          "",
        materialId:      "",
        fitId:           "",
        colorIds:        [],
        preferenceLevel: "",
        name: ""
    });

    useEffect(() => {
        let isSubscribed = true;

        const loadData = async () => {
            if (!isSubscribed) return;
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append("page", page);
                params.append("size", 20);

                Object.keys(filters).forEach(key => {
                    const value = filters[key];
                    if (value !== "" && value !== null && value !== undefined) {
                        if (Array.isArray(value)) {
                            value.forEach(v => params.append(key, v));
                        } else {
                            params.append(key, value);
                        }
                    }
                });

                const isFiltering = Object.values(filters).some(
                    v => v !== "" && v !== null && !(Array.isArray(v) && v.length === 0)
                );
                const endpoint = isFiltering
                    ? `/api/feed/filter?${params}`
                    : `/api/feed/feed?${params}`;;

                const response = await apiFetch(endpoint);

                if (response.ok) {
                    const data = await response.json();
                    const newIncomingPosts = data.content ?? data;

                    if (isSubscribed) {
                        setPosts(prev => {
                            if (page === 0) return newIncomingPosts;
                            const combined = [...prev, ...newIncomingPosts];
                            return Array.from(new Map(combined.map(p => [p.id, p])).values());
                        });
                        setHasMore(data.last !== undefined ? !data.last: newIncomingPosts.length === 20);
                    }
                } else {
                    toast.error("Error al cargar los posts, intentá más tarde");
                }
            } catch {
                toast.error("Error de conexión");
            } finally {
                if (isSubscribed) setLoading(false);
            }
        };

        loadData();
        return () => { isSubscribed = false; };
    }, [page, filters]); // ← apiFetch and fetchPosts removed

    const handleLoadMore = () => setPage(prev => prev + 1);

    const handleFilterChange = (name, newValue) => {
        let selectedValue;
        if (name === "colorIds") {
            selectedValue = Array.isArray(newValue) ? newValue : [];
        } else {
            selectedValue = newValue ? newValue.id : "";
        }
        setFilters(prev => ({ ...prev, [name]: selectedValue }));
        setPage(0);
    };

    const clearFilters = () => {
        setFilters({
            typeId: "", sizeId: "", materialId: "",
            fitId: "", colorIds: [], preferenceLevel: "",
        });
        setPage(0);
    };

    const hasActiveFilters = Object.values(filters).some(
        v => v !== "" && !(Array.isArray(v) && v.length === 0)
    );

    const handleSearching = (searchValue) => {
        setSearchQuery(searchValue);

        setFilters(prev => ({
            ...prev,
            name: searchValue
        }));

        setPage(0);
    };

    return (
        <div className="min-h-screen bg-[#2a2622]">
            <Navbar />

            <div className="pt-14 pb-20 max-w-2xl mx-auto px-4">

                {/* Header */}
                <div className="py-6 border-b border-[#3a3530] mb-6">
                    <h1 className="text-[#e8d5b0] text-xl font-light tracking-widest">Explorar</h1>
                    <p className="text-[#6b6258] text-xs tracking-[0.2em] mt-1">
                        Descubrí outfits de la comunidad
                    </p>
                </div>

                {/* Search bar */}
                <Search
                    value={searchQuery}
                    onChange={handleSearching}
                    placeholder="BUSCAR OUTFITS..."
                />
                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pb-4">
                    <GenericSelect
                        label="Tipo"
                        options={CLOTHING_TYPES}
                        value={CLOTHING_TYPES.find(t => t.id === parseInt(filters.typeId)) || null}
                        onChange={val => handleFilterChange("typeId", val)}
                    />
                    <GenericSelect
                        label="Talle"
                        options={SIZES}
                        value={SIZES.find(s => s.id === parseInt(filters.sizeId)) || null}
                        onChange={val => handleFilterChange("sizeId", val)}
                    />
                    <GenericSelect
                        label="Material"
                        options={MATERIALS}
                        value={MATERIALS.find(m => m.id === parseInt(filters.materialId)) || null}
                        onChange={val => handleFilterChange("materialId", val)}
                    />
                    <GenericSelect
                        label="Fit"
                        options={FITS}
                        value={FITS.find(f => f.id === parseInt(filters.fitId)) || null}
                        onChange={val => handleFilterChange("fitId", val)}
                    />
                    <GenericSelect
                        label="Colores"
                        options={COLORS}
                        multiple={true}
                        value={COLORS.filter(c => filters.colorIds.includes(c.id))}
                        onChange={selectedValues => {
                            const ids = Array.isArray(selectedValues)
                                ? selectedValues.map(o => o.id)
                                : [];
                            handleFilterChange("colorIds", ids);
                        }}
                    />
                </div>

                {/* Clear filters pill */}
                {hasActiveFilters && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={clearFilters}
                            className="
                                text-[9px] tracking-[0.2em] uppercase
                                text-[#6b6258] border border-[#3a3530]
                                px-3 py-1 hover:border-red-900 hover:text-red-700
                                transition-all duration-300
                            "
                        >
                            × Limpiar filtros
                        </button>
                    </div>
                )}

                {/* Loading state */}
                {loading && page === 0 && (
                    <div className="flex justify-center py-16">
                        <p className="text-[#6b6258] text-xs tracking-[0.3em] uppercase animate-pulse">
                            Cargando posts...
                        </p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && posts.length === 0 && (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <p className="text-[#6b6258] text-xs tracking-[0.3em] uppercase">
                            No se encontraron outfits
                        </p>
                        {hasActiveFilters && (
                            <p className="text-[#4a4540] text-xs tracking-wide">
                                Probá con otros filtros
                            </p>
                        )}
                    </div>
                )}

                {/* Posts grid */}
                {posts.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        {posts.map(post => (
                            <div
                                key={post.id}
                                className="
                                    bg-[#221f1c] border border-[#3a3530]
                                    hover:border-[#4a4540] transition-all duration-300
                                    flex flex-col overflow-hidden cursor-pointer
                                "
                            >
                                {/* Post image */}
                                <div className="relative aspect-square bg-[#2a2622]">
                                    {post.image_url ? (
                                        <img
                                            src={post.image_url}
                                            alt={post.title ?? "Outfit"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-[#3a3530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Post info */}
                                <div className="p-3 flex flex-col gap-2">
                                    {post.title && (
                                        <p className="text-[#e8d5b0] text-sm tracking-wide truncate">
                                            {post.title}
                                        </p>
                                    )}

                                    {/* Author */}
                                    {post.username && (
                                        <p className="text-[#6b6258] text-[10px] tracking-[0.15em] uppercase">
                                            @{post.username}
                                        </p>
                                    )}

                                    {/* Tags */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {post.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="text-[9px] tracking-[0.1em] uppercase text-[#6b6258] border border-[#3a3530] px-2 py-0.5"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Load more */}
                {hasMore && !loading && posts.length > 0 && (
                    <div className="flex justify-center pt-8">
                        <button
                            onClick={handleLoadMore}
                            className="
                                px-8 py-2.5 border border-[#4a4540]
                                hover:border-[#c49a6c] hover:text-[#c49a6c]
                                text-[#8a7d6e] text-[10px] tracking-[0.2em] uppercase
                                transition-all duration-300
                            "
                        >
                            Cargar más
                        </button>
                    </div>
                )}

                {/* Inline loading for pagination */}
                {loading && page > 0 && (
                    <div className="flex justify-center py-8">
                        <p className="text-[#6b6258] text-xs tracking-[0.3em] uppercase animate-pulse">
                            Cargando más...
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}

export default SearchFeed;