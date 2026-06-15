import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar.jsx";
import { CLOTHING_TYPES, SINGLE_ONLY_TYPES } from "../../constants/clotheOptions.js";
import { useOutfit } from "./hooker/useOutfit.js";
import toast from "react-hot-toast";


function OutfitBuilder() {
    const [myClothes, setMyClothes] = useState([]);
    const [outfits, setOutfits] = useState([]);
    const [showCreateState, setShowCreateState] = useState(false);
    const [selectedClothes, setSelectedClothes] = useState([]);
    const [outfitName, setOutfitName] = useState("");
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const { createOutfit, getAllOutfits, deleteOutfit, updateOutfit } = useOutfit();
    const [editingOutfit, setEditingOutfit] = useState(null);

    // Estados para el Modal de Detalle e Interactividad de prendas
    const [selectedOutfitDetail, setSelectedOutfitDetail] = useState(null);
    const [activePreviewImage, setActivePreviewImage] = useState("");

    const fetchMyClothes = async () => {
        try {
            const response = await fetch("http://localhost:8080/clothes/my-clothes", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) setMyClothes(await response.json());
        } catch (error) {
            console.error("Error al cargar prendas:", error);
        }
    };

    const openEditState = async (outfit) => {
        setEditingOutfit(outfit);
        setOutfitName(outfit.name);
        setSelectedClothes(outfit.clothes || []);
        await fetchMyClothes();
    };

    const openDetailModal = (outfit) => {
        setSelectedOutfitDetail(outfit);
        // Inicializamos la vista gigante con la primera prenda del outfit
        if (outfit.clothes && outfit.clothes.length > 0) {
            setActivePreviewImage(outfit.clothes[0].image_url);
        } else {
            setActivePreviewImage("");
        }
    };

    const fetchMyOutfits = async () => {
        setLoading(true);
        const data = await getAllOutfits(token);
        if (data && Array.isArray(data)) setOutfits(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMyOutfits();
    }, []);

    const toggleClothe = (clothe) => {
        const yaEsta = selectedClothes.find(c => c.id === clothe.id);
        if (yaEsta) {
            setSelectedClothes(prev => prev.filter(c => c.id !== clothe.id));
            return;
        }
        if (SINGLE_ONLY_TYPES.includes(clothe.typeId)) {
            const hayMismoTipo = selectedClothes.some(c => c.typeId === clothe.typeId);
            if (hayMismoTipo) {
                toast.error("Solo podés agregar una prenda de este tipo");
                return;
            }
        }
        setSelectedClothes(prev => [...prev, clothe]);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (selectedClothes.length === 0) {
            toast.error("Seleccioná al menos una prenda");
            return;
        }
        await createOutfit({
            name: outfitName,
            clothesIds: selectedClothes.map(c => c.id)
        }, token);
        await fetchMyOutfits();
        setShowCreateState(false);
        setSelectedClothes([]);
        setOutfitName("");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (selectedClothes.length === 0) {
            toast.error("Seleccioná al menos una prenda");
            return;
        }
        await updateOutfit(editingOutfit.id, {
            name: outfitName,
            clothesIds: selectedClothes.map(c => c.id)
        }, token);
        await fetchMyOutfits();
        setEditingOutfit(null);
        setSelectedClothes([]);
        setOutfitName("");
    };

    return (
        <div className="min-h-screen bg-[#2a2622]">
            <Navbar />
            <div className="pt-14 pb-20 max-w-2xl mx-auto px-4">

                {/* Header */}
                <div className="flex items-center justify-between py-6 border-b border-[#3a3530]">
                    <div>
                        <h1 className="text-[#e8d5b0] text-xl font-light tracking-widest">Mis Outfits</h1>
                        <p className="text-[#6b6258] text-xs tracking-[0.2em] mt-1">
                            {outfits.length} {outfits.length === 1 ? "outfit" : "outfits"}
                        </p>
                    </div>
                    <button
                        onClick={async () => { setShowCreateState(true); await fetchMyClothes(); }}
                        className="px-5 py-2 border border-[#4a4540] hover:border-[#c49a6c] hover:text-[#c49a6c] text-[#8a7d6e] text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
                    >
                        + Crear outfit
                    </button>
                </div>

                {/* Lista de outfits */}
                {loading && <p className="text-[#6b6258] text-xs text-center mt-10 animate-pulse tracking-[0.3em] uppercase">Cargando...</p>}

                {!loading && outfits.length === 0 && (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <p className="text-[#6b6258] text-xs tracking-[0.3em] uppercase">No tenés outfits todavía</p>
                        <p className="text-[#4a4540] text-xs tracking-wide">Creá tu primer outfit con el botón de arriba</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-6">
                    {outfits.map(outfit => (
                        <div key={outfit.id} className="bg-[#221f1c] border border-[#3a3530] hover:border-[#4a4540] transition-all duration-300 overflow-hidden flex flex-col justify-between">

                            {/* PREVIEW DE PRENDAS ASIMÉTRICO (Al tocar abre el detalle) */}
                            <div
                                onClick={() => openDetailModal(outfit)}
                                className="aspect-square bg-[#1c1917] relative overflow-hidden w-full cursor-pointer group/media"
                            >
                                {(() => {
                                    const clothesCount = outfit.clothes?.length || 0;
                                    const items = outfit.clothes || [];

                                    if (clothesCount === 0) {
                                        return (
                                            <div className="w-full h-full flex items-center justify-center bg-[#1a1816]">
                                                <span className="text-[#4a4540] text-[9px] tracking-wider uppercase">Sin prendas</span>
                                            </div>
                                        );
                                    }

                                    if (clothesCount === 1) {
                                        return <img src={items[0].image_url} className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-500" alt="Prenda" />;
                                    }

                                    if (clothesCount === 2) {
                                        return (
                                            <div className="grid grid-cols-2 gap-[2px] h-full bg-[#221f1c]">
                                                <img src={items[0].image_url} className="w-full h-full object-cover" alt="P1" />
                                                <img src={items[1].image_url} className="w-full h-full object-cover" alt="P2" />
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="grid grid-cols-3 gap-[2px] h-full bg-[#221f1c]">
                                            <div className="col-span-2 h-full border-r border-[#221f1c]">
                                                <img src={items[0].image_url} className="w-full h-full object-cover" alt="Destacado" />
                                            </div>
                                            <div className="grid grid-rows-2 gap-[2px] h-full">
                                                <div className="h-full relative">
                                                    <img src={items[1].image_url} className="w-full h-full object-cover" alt="P2" />
                                                </div>
                                                <div className="h-full relative">
                                                    <img src={items[2].image_url} className="w-full h-full object-cover" alt="P3" />
                                                    {clothesCount > 3 && (
                                                        <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center backdrop-blur-[1px]">
                                                            <span className="text-[#e8d5b0] text-[11px] font-light">+{clothesCount - 3}</span>
                                                            <span className="text-[#6b6258] text-[6px] tracking-[0.1em] uppercase">Prendas</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Info */}
                            <div className="p-3 flex items-center justify-between border-t border-[#3a3530]/40">
                                <div className="min-w-0 flex-1 pr-2">
                                    <p className="text-[#e8d5b0] text-xs tracking-wide truncate font-light">{outfit.name || "Outfit sin nombre"}</p>
                                    <p className="text-[#6b6258] text-[9px] mt-0.5">{outfit.clothes?.length} prendas</p>
                                    {outfit.level_of_coincidence !== undefined && (
                                        <p className="text-[#c49a6c] text-[8px] tracking-wider mt-0.5 uppercase font-medium">
                                            Match: {outfit.level_of_coincidence}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1.5 flex-shrink-0 text-right">
                                    <button
                                        onClick={() => openEditState(outfit)}
                                        className="text-[#6b6258] hover:text-[#c49a6c] text-[9px] tracking-[0.15em] uppercase transition-colors duration-300"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => deleteOutfit(outfit.id, token).then(fetchMyOutfits)}
                                        className="text-[#4a4540] hover:text-red-700 text-[9px] tracking-[0.15em] uppercase transition-colors duration-300"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL DETALLE DE OUTFIT (Interactivo Split-Screen) */}
            {selectedOutfitDetail && (
                <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#221f1c] border border-[#3a3530] w-full max-w-4xl h-[80vh] flex flex-col md:flex-row relative shadow-2xl overflow-hidden">

                        {/* Botón Cerrar */}
                        <button
                            onClick={() => setSelectedOutfitDetail(null)}
                            className="absolute top-4 right-4 z-50 text-[#8a7d6e] hover:text-[#e8d5b0] transition-colors p-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* PANEL IZQUIERDO: Visualizador Dinámico */}
                        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-[#1a1816] flex items-center justify-center relative border-b md:border-b-0 md:border-r border-[#3a3530]">
                            {activePreviewImage ? (
                                <div className="w-full h-full p-8 flex items-center justify-center animate-fade-in">
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

                        {/* PANEL DERECHO: Desglose de Prendas */}
                        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-[#221f1c]">

                            {/* Cabecera */}
                            <div className="p-5 border-b border-[#3a3530]/60">
                                <h4 className="text-[#e8d5b0] text-[13px] tracking-widest font-light uppercase">{selectedOutfitDetail.name || "Outfit Especial"}</h4>
                                <p className="text-[#c49a6c] text-[8px] tracking-[0.15em] uppercase mt-1">
                                    Coincidencia: {selectedOutfitDetail.level_of_coincidence || "N/A"} • {selectedOutfitDetail.clothes?.length} prendas
                                </p>
                            </div>

                            {/* Lista con Interactividad (onMouseEnter o onClick cambia la foto) */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
                                <span className="text-[#4a4540] text-[8px] tracking-[0.2em] uppercase font-bold block mb-1">
                                    Pasá el cursor o tocá una prenda para inspeccionar:
                                </span>

                                {selectedOutfitDetail.clothes?.map((clothe) => {
                                    const isActive = activePreviewImage === clothe.image_url;
                                    return (
                                        <div
                                            key={clothe.id}
                                            onMouseEnter={() => setActivePreviewImage(clothe.image_url)}
                                            onClick={() => setActivePreviewImage(clothe.image_url)}
                                            className={`flex gap-4 p-2.5 transition-all duration-300 cursor-pointer border ${isActive ? 'bg-[#1a1816] border-[#c49a6c]/60' : 'bg-[#1a1816]/30 border-[#3a3530]/40 hover:border-[#4a4540]'}`}
                                        >
                                            <div className="w-12 h-12 bg-[#161413] flex-shrink-0 overflow-hidden border border-[#3a3530]/60">
                                                <img src={clothe.image_url} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <h5 className="text-[#e8d5b0] text-[11px] tracking-wide font-light truncate">{clothe.name || "Prenda de Armario"}</h5>
                                                <p className="text-[#6b6258] text-[8px] tracking-widest uppercase mt-0.5">
                                                    {CLOTHING_TYPES.find(type => type.id === clothe.typeId)?.label || "Prenda"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-3 bg-[#1a1816]/30 border-t border-[#3a3530]/40 text-center">
                                <span className="text-[#4a4540] text-[7px] tracking-[0.3em] uppercase">Vestidor Interactivo • OPET</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Modal crear outfit */}
            {showCreateState && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
                    <div className="bg-[#221f1c] border border-[#3a3530] w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-[#e8d5b0] text-lg font-light tracking-widest mb-1">Nuevo outfit</h3>
                        <div className="w-6 h-px bg-[#c49a6c] mb-6"></div>

                        <form onSubmit={handleCreate} className="flex flex-col gap-6">
                            {/* Nombre */}
                            <div>
                                <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8a7d6e] mb-1 block">Nombre</label>
                                <input
                                    value={outfitName}
                                    onChange={e => setOutfitName(e.target.value)}
                                    placeholder="Ej: Look de verano"
                                    className="w-full bg-transparent border-b border-[#4a4540] text-[#e8d5b0] placeholder-[#6b6258] py-3 px-0 text-sm outline-none focus:border-[#c49a6c] transition-colors duration-300"
                                />
                            </div>

                            {/* Prendas agrupadas por tipo */}
                            {CLOTHING_TYPES.map(type => {
                                const prendasDelTipo = myClothes.filter(c => c.typeId === type.id);
                                if (prendasDelTipo.length === 0) return null;
                                return (
                                    <div key={type.id}>
                                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8a7d6e] mb-2">{type.label}</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {prendasDelTipo.map(clothe => {
                                                const seleccionada = selectedClothes.find(c => c.id === clothe.id);
                                                return (
                                                    <div
                                                        key={clothe.id}
                                                        onClick={() => toggleClothe(clothe)}
                                                        className={`cursor-pointer border aspect-square overflow-hidden transition-all duration-300 relative ${seleccionada ? 'border-[#c49a6c] ring-1 ring-[#c49a6c] brightness-110 scale-95' : 'border-[#3a3530] hover:border-[#4a4540] opacity-60'}`}
                                                    >
                                                        {seleccionada && (
                                                            <div className="absolute inset-0 bg-[#c49a6c]/20 z-10 flex items-center justify-center pointer-events-none">
                                                                <span className="text-[#c49a6c] text-lg">✓</span>
                                                            </div>
                                                        )}
                                                        {clothe.image_url
                                                            ? <img src={clothe.image_url} className="w-full h-full object-cover" />
                                                            : <div className="w-full h-full flex items-center justify-center bg-[#2a2622]">
                                                                <span className="text-[#4a4540] text-[8px] text-center px-1">{clothe.name}</span>
                                                            </div>
                                                        }
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Resumen */}
                            {selectedClothes.length > 0 && (
                                <p className="text-[#c49a6c] text-[10px] tracking-[0.15em]">
                                    ✓ {selectedClothes.length} {selectedClothes.length === 1 ? "prenda seleccionada" : "prendas seleccionadas"}
                                </p>
                            )}

                            <div className="flex gap-4">
                                <button type="submit" className="flex-1 py-3 bg-[#c49a6c] hover:bg-[#d4aa7c] text-[#221f1c] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300">
                                    Crear outfit
                                </button>
                                <button type="button" onClick={() => { setShowCreateState(false); setSelectedClothes([]); setOutfitName(""); }}
                                        className="flex-1 py-3 border border-[#4a4540] hover:border-[#6b6258] text-[#6b6258] text-xs tracking-[0.2em] uppercase transition-all duration-300">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal editar outfit */}
            {editingOutfit && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
                    <div className="bg-[#221f1c] border border-[#3a3530] w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-[#e8d5b0] text-lg font-light tracking-widest mb-1">Editar outfit</h3>
                        <div className="w-6 h-px bg-[#c49a6c] mb-6"></div>

                        <form onSubmit={handleUpdate} className="flex flex-col gap-6">
                            <div>
                                <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8a7d6e] mb-1 block">Nombre</label>
                                <input
                                    value={outfitName}
                                    onChange={e => setOutfitName(e.target.value)}
                                    className="w-full bg-transparent border-b border-[#4a4540] text-[#e8d5b0] placeholder-[#6b6258] py-3 px-0 text-sm outline-none focus:border-[#c49a6c] transition-colors duration-300"
                                />
                            </div>

                            {/* Prendas agrupadas por tipo */}
                            {CLOTHING_TYPES.map(type => {
                                const prendasDelTipo = myClothes.filter(c => c.typeId === type.id);
                                if (prendasDelTipo.length === 0) return null;
                                return (
                                    <div key={type.id}>
                                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8a7d6e] mb-2">{type.label}</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {prendasDelTipo.map(clothe => {
                                                const seleccionada = selectedClothes.find(c => c.id === clothe.id);
                                                return (
                                                    <div
                                                        key={clothe.id}
                                                        onClick={() => toggleClothe(clothe)}
                                                        className={`cursor-pointer border aspect-square overflow-hidden transition-all duration-300 relative ${seleccionada ? 'border-[#c49a6c] ring-1 ring-[#c49a6c] brightness-110 scale-95' : 'border-[#3a3530] hover:border-[#4a4540] opacity-60'}`}
                                                    >
                                                        {seleccionada && (
                                                            <div className="absolute inset-0 bg-[#c49a6c]/20 z-10 flex items-center justify-center pointer-events-none">
                                                                <span className="text-[#c49a6c] text-lg">✓</span>
                                                            </div>
                                                        )}
                                                        {clothe.image_url
                                                            ? <img src={clothe.image_url} className="w-full h-full object-cover" />
                                                            : <div className="w-full h-full flex items-center justify-center bg-[#2a2622]">
                                                                <span className="text-[#4a4540] text-[8px] text-center px-1">{clothe.name}</span>
                                                            </div>
                                                        }
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            {selectedClothes.length > 0 && (
                                <p className="text-[#c49a6c] text-[10px] tracking-[0.15em]">
                                    ✓ {selectedClothes.length} {selectedClothes.length === 1 ? "prenda seleccionada" : "prendas seleccionadas"}
                                </p>
                            )}

                            <div className="flex gap-4">
                                <button type="submit" className="flex-1 py-3 bg-[#c49a6c] hover:bg-[#d4aa7c] text-[#221f1c] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300">
                                    Guardar
                                </button>
                                <button type="button" onClick={() => { setEditingOutfit(null); setSelectedClothes([]); setOutfitName(""); }}
                                        className="flex-1 py-3 border border-[#4a4540] hover:border-[#6b6258] text-[#6b6258] text-xs tracking-[0.2em] uppercase transition-all duration-300">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OutfitBuilder;