import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import Search from "../searching/Search.jsx";
import FilterSelect from "../../constants/FilterSelect";
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

    // Modal de detalle — igual que OutfitBuilder
    const [selectedPostDetail, setSelectedPostDetail] = useState(null);
    const [activePreviewImage, setActivePreviewImage] = useState("");

    const openDetailModal = (post) => {
        setSelectedPostDetail(post);
        const images = post.clothesImages ?? (post.image_url ? [post.image_url] : []);
        setActivePreviewImage(images[0] ?? "");
    };

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
                    : `/api/feed/feed?${params}`;

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
                        setHasMore(data.last !== undefined ? !data.last : newIncomingPosts.length === 20);
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
    }, [page, filters]);

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
        setFilters(prev => ({ ...prev, name: searchValue }));
        setPage(0);
    };

    // Preview asimétrico — misma lógica que OutfitBuilder
    const renderClothesPreview = (images = []) => {
        const count = images.length;

        if (count === 0) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-[#1a1816]">
                    <span className="text-[#4a4540] text-[9px] tracking-wider uppercase">Sin prendas</span>
                </div>
            );
        }
        if (count === 1) {
            return <img src={images[0]} className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-500" alt="Prenda" />;
        }
        if (count === 2) {
            return (
                <div className="grid grid-cols-2 gap-[2px] h-full bg-[#221f1c]">
                    <img src={images[0]} className="w-full h-full object-cover" alt="P1" />
                    <img src={images[1]} className="w-full h-full object-cover" alt="P2" />
                </div>
            );
        }
        return (
            <div className="grid grid-cols-3 gap-[2px] h-full bg-[#221f1c]">
                <div className="col-span-2 h-full border-r border-[#221f1c]">
                    <img src={images[0]} className="w-full h-full object-cover" alt="Destacado" />
                </div>
                <div className="grid grid-rows-2 gap-[2px] h-full">
                    <div className="h-full relative">
                        <img src={images[1]} className="w-full h-full object-cover" alt="P2" />
                    </div>
                    <div className="h-full relative">
                        <img src={images[2]} className="w-full h-full object-cover" alt="P3" />
                        {count > 3 && (
                            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center backdrop-blur-[1px]">
                                <span className="text-[#e8d5b0] text-[11px] font-light">+{count - 3}</span>
                                <span className="text-[#6b6258] text-[6px] tracking-[0.1em] uppercase">Prendas</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Las imágenes que se usan en el modal de detalle
    const getDetailImages = (post) =>
        post.clothesImages?.length > 0
            ? post.clothesImages
            : post.image_url
                ? [post.image_url]
                : [];

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
                <div className="flex flex-wrap gap-2 pb-4">
                    <FilterSelect label="Tipo" options={CLOTHING_TYPES}
                                  value={CLOTHING_TYPES.find(t => t.id === parseInt(filters.typeId)) || null}
                                  onChange={val => handleFilterChange("typeId", val)} />
                    <FilterSelect label="Talle" options={SIZES}
                                  value={SIZES.find(s => s.id === parseInt(filters.sizeId)) || null}
                                  onChange={val => handleFilterChange("sizeId", val)} />
                    <FilterSelect label="Material" options={MATERIALS}
                                  value={MATERIALS.find(m => m.id === parseInt(filters.materialId)) || null}
                                  onChange={val => handleFilterChange("materialId", val)} />
                    <FilterSelect label="Fit" options={FITS}
                                  value={FITS.find(f => f.id === parseInt(filters.fitId)) || null}
                                  onChange={val => handleFilterChange("fitId", val)} />
                    <FilterSelect label="Colores" options={COLORS} multiple={true}
                                  value={COLORS.filter(c => filters.colorIds.includes(c.id))}
                                  onChange={selectedValues => {
                                      const ids = Array.isArray(selectedValues) ? selectedValues.map(o => o.id) : [];
                                      handleFilterChange("colorIds", ids);
                                  }} />
                </div>

                {/* Clear filters */}
                {hasActiveFilters && (
                    <div className="flex justify-end mb-4">
                        <button onClick={clearFilters}
                                className="text-[9px] tracking-[0.2em] uppercase text-[#6b6258] border border-[#3a3530] px-3 py-1 hover:border-red-900 hover:text-red-700 transition-all duration-300">
                            × Limpiar filtros
                        </button>
                    </div>
                )}

                {/* Loading */}
                {loading && page === 0 && (
                    <div className="flex justify-center py-16">
                        <p className="text-[#6b6258] text-xs tracking-[0.3em] uppercase animate-pulse">Cargando posts...</p>
                    </div>
                )}

                {/* Empty */}
                {!loading && posts.length === 0 && (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <p className="text-[#6b6258] text-xs tracking-[0.3em] uppercase">No se encontraron outfits</p>
                        {hasActiveFilters && (
                            <p className="text-[#4a4540] text-xs tracking-wide">Probá con otros filtros</p>
                        )}
                    </div>
                )}

                {/* Posts grid */}
                {posts.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        {posts.map(post => {
                            const images = post.clothesImages?.length > 0
                                ? post.clothesImages
                                : post.image_url ? [post.image_url] : [];

                            return (
                                <div key={post.id}
                                     className="bg-[#221f1c] border border-[#3a3530] hover:border-[#4a4540] transition-all duration-300 flex flex-col overflow-hidden">

                                    {/* Preview clickeable — lógica asimétrica */}
                                    <div
                                        onClick={() => openDetailModal(post)}
                                        className="aspect-square bg-[#1c1917] relative overflow-hidden w-full cursor-pointer group/media"
                                    >
                                        {renderClothesPreview(images)}
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 flex flex-col gap-1.5">
                                        {post.title && (
                                            <p className="text-[#e8d5b0] text-xs tracking-wide truncate font-light">{post.title}</p>
                                        )}
                                        {post.caption && (
                                            <p className="text-[#6b6258] text-[10px] tracking-wide leading-relaxed line-clamp-2">{post.caption}</p>
                                        )}
                                        {post.username && (
                                            <p className="text-[#6b6258] text-[9px] tracking-[0.15em] uppercase">@{post.username}</p>
                                        )}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-0.5">
                                                {post.tags.map((tag, i) => (
                                                    <span key={i} className="text-[9px] tracking-[0.1em] uppercase text-[#6b6258] border border-[#3a3530] px-2 py-0.5">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Load more */}
                {hasMore && !loading && posts.length > 0 && (
                    <div className="flex justify-center pt-8">
                        <button onClick={handleLoadMore}
                                className="px-8 py-2.5 border border-[#4a4540] hover:border-[#c49a6c] hover:text-[#c49a6c] text-[#8a7d6e] text-[10px] tracking-[0.2em] uppercase transition-all duration-300">
                            Cargar más
                        </button>
                    </div>
                )}

                {loading && page > 0 && (
                    <div className="flex justify-center py-8">
                        <p className="text-[#6b6258] text-xs tracking-[0.3em] uppercase animate-pulse">Cargando más...</p>
                    </div>
                )}
            </div>

            {/* MODAL DETALLE — split-screen igual que OutfitBuilder */}
            {selectedPostDetail && (() => {
                const detailImages = getDetailImages(selectedPostDetail);
                return (
                    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-sm">
                        <div className="bg-[#221f1c] border border-[#3a3530] w-full max-w-4xl h-[80vh] flex flex-col md:flex-row relative shadow-2xl overflow-hidden">

                            {/* Cerrar */}
                            <button
                                onClick={() => setSelectedPostDetail(null)}
                                className="absolute top-4 right-4 z-50 text-[#8a7d6e] hover:text-[#e8d5b0] transition-colors p-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Panel izquierdo — visualizador */}
                            <div className="w-full md:w-1/2 h-1/2 md:h-full bg-[#1a1816] flex items-center justify-center relative border-b md:border-b-0 md:border-r border-[#3a3530]">
                                {activePreviewImage ? (
                                    <div className="w-full h-full p-8 flex items-center justify-center">
                                        <img
                                            src={activePreviewImage}
                                            className="w-full h-full object-contain max-h-[65vh]"
                                            alt="Prenda seleccionada"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-[#4a4540] text-[10px] tracking-widest uppercase">Sin Imagen</span>
                                )}
                                <div className="absolute bottom-4 left-4 bg-black/50 border border-[#c49a6c]/20 px-2.5 py-1 backdrop-blur-xs">
                                    <span className="text-[#c49a6c] text-[7px] tracking-[0.2em] uppercase font-semibold">Exhibidor de Prenda</span>
                                </div>
                            </div>

                            {/* Panel derecho — desglose */}
                            <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-[#221f1c]">

                                <div className="p-5 border-b border-[#3a3530]/60">
                                    <h4 className="text-[#e8d5b0] text-[13px] tracking-widest font-light uppercase">
                                        {selectedPostDetail.title || "Outfit"}
                                    </h4>
                                    {selectedPostDetail.username && (
                                        <p className="text-[#c49a6c] text-[8px] tracking-[0.15em] uppercase mt-1">
                                            @{selectedPostDetail.username} • {detailImages.length} prendas
                                        </p>
                                    )}
                                    {selectedPostDetail.caption && (
                                        <p className="text-[#6b6258] text-[10px] tracking-wide leading-relaxed mt-2 line-clamp-3">
                                            {selectedPostDetail.caption}
                                        </p>
                                    )}
                                </div>

                                {/* Lista de imágenes interactiva */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
                                    {detailImages.length > 0 ? (
                                        <>
                                            <span className="text-[#4a4540] text-[8px] tracking-[0.2em] uppercase font-bold block mb-1">
                                                Pasá el cursor o tocá para inspeccionar:
                                            </span>
                                            {detailImages.map((url, i) => {
                                                const isActive = activePreviewImage === url;
                                                // Si el post tiene clothes con metadata, la usamos
                                                const clothe = selectedPostDetail.clothes?.[i];
                                                return (
                                                    <div
                                                        key={i}
                                                        onMouseEnter={() => setActivePreviewImage(url)}
                                                        onClick={() => setActivePreviewImage(url)}
                                                        className={`flex gap-4 p-2.5 transition-all duration-300 cursor-pointer border ${isActive ? 'bg-[#1a1816] border-[#c49a6c]/60' : 'bg-[#1a1816]/30 border-[#3a3530]/40 hover:border-[#4a4540]'}`}
                                                    >
                                                        <div className="w-12 h-12 bg-[#161413] flex-shrink-0 overflow-hidden border border-[#3a3530]/60">
                                                            <img src={url} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                            <h5 className="text-[#e8d5b0] text-[11px] tracking-wide font-light truncate">
                                                                {clothe?.name || `Prenda ${i + 1}`}
                                                            </h5>
                                                            {clothe?.typeId && (
                                                                <p className="text-[#6b6258] text-[8px] tracking-widest uppercase mt-0.5">
                                                                    {CLOTHING_TYPES.find(t => t.id === clothe.typeId)?.label || "Prenda"}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <span className="text-[#4a4540] text-[9px] tracking-widest uppercase">Sin prendas</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-3 bg-[#1a1816]/30 border-t border-[#3a3530]/40 text-center">
                                    <span className="text-[#4a4540] text-[7px] tracking-[0.3em] uppercase">Vestidor Interactivo • OPET</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}

export default SearchFeed;