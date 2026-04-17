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
    const openEditState = (outfit) => {
        setEditingOutfit(outfit);
        setOutfitName(outfit.name);
        setSelectedClothes(outfit.clothes || []);
    };

    const fetchMyOutfits = async () => {
        setLoading(true);
        const data = await getAllOutfits(token);
        console.log("outfits recibidos:", data);
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
                        onClick={() => { setShowCreateState(true); fetchMyClothes(); }}
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
                        <div key={outfit.id} className="bg-[#221f1c] border border-[#3a3530] hover:border-[#4a4540] transition-all duration-300 overflow-hidden">

                            {/* Preview de prendas - grid de fotos */}
                            <div className="grid grid-cols-3 gap-0.5 aspect-square bg-[#2a2622]">
                                {outfit.clothes?.slice(0, 6).map(clothe => (
                                    <div key={clothe.id} className="aspect-square overflow-hidden">
                                        {clothe.image_url
                                            ? <img src={clothe.image_url} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full bg-[#2a2622] flex items-center justify-center">
                                                <span className="text-[#3a3530] text-[8px]">{clothe.name}</span>
                                            </div>
                                        }
                                    </div>
                                ))}
                            </div>

                            {/* Info */}
                            <div className="p-3 flex items-center justify-between">
                                <div>
                                    <p className="text-[#e8d5b0] text-sm tracking-wide">{outfit.name}</p>
                                    <p className="text-[#6b6258] text-[10px] mt-0.5">{outfit.clothes?.length} prendas</p>
                                    <p className="text-[#c49a6c] text-[10px] mt-0.5">
                                        Nivel de coincidencia: {outfit.level_of_coincidence}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={() => {
                                            openEditState(outfit);
                                            fetchMyClothes();
                                        }}
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

            {/* Modal crear outfit */}
            {showCreateState && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
                    <div
                        className="bg-[#221f1c] border border-[#3a3530] w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-[#e8d5b0] text-lg font-light tracking-widest mb-1">Nuevo outfit</h3>
                        <div className="w-6 h-px bg-[#c49a6c] mb-6"></div>

                        <form onSubmit={handleCreate} className="flex flex-col gap-6">
                            {/* Nombre */}
                            <div>
                                <label
                                    className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8a7d6e] mb-1 block">Nombre</label>
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
                                                        className={`cursor-pointer border aspect-square overflow-hidden transition-all duration-300 ${seleccionada ? 'border-[#c49a6c]' : 'border-[#3a3530] hover:border-[#4a4540]'}`}
                                                    >
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
                                                        className={`cursor-pointer border aspect-square overflow-hidden transition-all duration-300 ${seleccionada ? 'border-[#c49a6c]' : 'border-[#3a3530] hover:border-[#4a4540]'}`}
                                                    >
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