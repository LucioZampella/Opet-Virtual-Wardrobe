import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import { STATUS } from "../../constants/statusOptions.js";
import Search from "../../components/Search.jsx";
import toast from "react-hot-toast";
import { useAuth } from "../../modules/useAuth.js";
import { useApi } from "../../modules/useApi.js";

const EmptyForm = {
    price: "",
    name: "",
    description: "",
    status: STATUS.ACTIVE,
};


function Store() {

    const { userId: rawUserId } = useAuth();
    const { apiFetch } = useApi();
    const userId = parseInt(rawUserId);

    const [storeListing, setStoreListing] = useState([]);
    const [myClothes, setMyClothes] = useState([]);
    const [selectedClothe, setSelectedClothe] = useState(null);
    const [showCreateListing, setShowCreateListing] = useState(false);
    const [editingListing, setEditingListing] = useState(null);
    const [form, setForm] = useState(EmptyForm);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [filters, setFilters] = useState({
        min: 0,
        max: 10000001,
        typeId: "",
        sizeId: "",
        materialId: "",
        fitId: "",
        colorId: [],
        name: "",
    })

    const fetchAllListings = async () => { // --> Trae todas las listings
        setLoading(true);
        try {
            const response = await apiFetch(`/store/home`, {
                method: "GET",
            });

            if (response.ok) {
                const data = await response.json();
                setStoreListing(data);
            } else {
                console.error("Error al cargar la tienda: ", response.status);
                toast.error("Error al cargar la tienda, intente mas tarde")
            }
        } catch (error) {
            console.error("Error de conexion: ", error)
            toast.error("error de conexion")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllListings();
    }, []);

    const fetchWithFilters = async (newFilters) => { // --> Trae todas las listings pero ahora con filtros especificos
        setLoading(true);
        try {
            const params = new URLSearchParams();

            Object.keys(newFilters).forEach(key => {
                const value = newFilters[key];
                if (value !== "" && value !== null && value !== undefined) {
                    if (Array.isArray(value)) {
                        value.forEach(v => params.append(key, v));
                    } else {
                        params.append(key, value);
                    }
                }
            });

            const response = await apiFetch(`/store/filter?${params}`, {
                headers: { "Accept": "application/json" }
            });

            if (response.ok) {
                const data = await response.json();
                setStoreListing(data);
                toast.success("Filtro aplicado")
            } else {
                const errorData = await response.json();
                console.error("DETALLE DEL ERROR 500 DESDE EL BACKEND:", errorData);
            }
        } catch (error) {
            console.error("Error al filtrar: ", error);
            toast.error(error)
        } finally {
            setLoading(false);
        }

    }
    // --> me traigo todas mis prendas del usuario
    const fetchMyClothes = async () => {
        try {
            const response = await apiFetch(`/clothes/my-clothes`);
            if (response.ok) {
                const data = await response.json();
                setMyClothes(data);
                console.log(myClothes)
            }
        } catch (error) {
            console.error("Error al cargar prendas: ", error);
            toast.error(error)
        }
    };

    const handleFormChange = (e) => { // --> Maneja los cambios en los atributos de las listings
        const {name, value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilterChange = (e) => { // --> Maneja los cambios de filtros
        const {name, value} = e.target;
        const newFilters = {...filters, [name]: value};
        setFilters(newFilters);

        const hayAlgunFiltro = Object.values(newFilters).some(v => v !== "");
        if (hayAlgunFiltro) {
            fetchWithFilters(newFilters);
        } else {
            fetchAllListings()
        }
    }

    const handleSearching = (searchValue) => { // --> Maneja busquedas de articulos
        setFilters(prev => ({...prev, name: searchValue})); // --> Esto para que se muestre en el
        //input lo que vas escribiendo

        const newFilters = {...filters, name: searchValue}

        if (searchValue.trim() !== "") {
            fetchWithFilters(newFilters)
        } else {
            fetchAllListings();
        }
    };

    const createStoreListing = async (e) => { // --> Crear una publicacion de venta
        e.preventDefault();
        try {
            const response = await apiFetch(`/store`, {
                method: "POST",
                body: JSON.stringify({
                    clothesId: selectedClothe.id,
                    price: Number(form.price),
                    name: form.name,
                    description: form.description,
                    status: form.status,
                })
            });

            if (response.ok) {
                await fetchAllListings();
                toast.success("Venta de prenda  creada exitosamente")
                setShowCreateListing(false);
                setForm(EmptyForm);
            } else {
                const errorMsg = await response.text();
                console.error("No se pudo crear la publicación: ", errorMsg);
                toast.error(errorMsg)
            }
        } catch (error) {
            console.error("Error de conexión con el servidor: ", error)
            toast.error("Error de conexion")
        }
    };

    const openEditState = (StoreListing) => { //--> Abre el estado de edicion de una publicacion ya subida
        setEditingListing(StoreListing);
        setForm({
            name: StoreListing.name || "",
            price: StoreListing.price || 0,
            description: StoreListing.description || "",
            status: StoreListing.status || STATUS.ACTIVE,
        });
    };

    const updateStoreListing = async (e) => { //--> Update las ediciones realizadas
        e.preventDefault();

        try {
            const response = await apiFetch(`/store/${editingListing.listingId}`, {
                method: "PUT",
                body: JSON.stringify({
                    name: form.name,
                    price: Number(form.price),
                    description: form.description,
                    status: form.status
                })
            });

            if (response.ok) {
                setStoreListing(prev =>
                    prev.map(l =>
                        l.listingId === editingListing.listingId
                            ? {
                                ...l, ...form, name: form.name, price: Number(form.price), description: form.description,
                                status: form.status
                            }
                            : l
                    )
                );
                toast.success("Venta actualizada correctamente")
                setEditingListing(null);
                setForm(EmptyForm);
            } else {
                const errorMsg = response.text();
                console.error("No se pudo editar la prenda: ", errorMsg);
                toast.error(errorMsg)
            }
        } catch (error) {
            console.error("Error de conexion: ", error);
        }
    };

    const deleteListing = async (listingId) => { // --> Borra la publicacion propia seleccionada por el usuario
        try {
            const response = await apiFetch(`/store/${listingId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setStoreListing(prev => prev.filter(l => l.listingId !== listingId));
                toast.success("Venta eliminada")
            } else {
                const errorMsg = response.text();
                console.error("No se pudo eliminar la venta: ", errorMsg);
                toast.error(errorMsg)
            }
        } catch (error) {
            console.error("Error de conexion: ", error);
        }
    };

    const inputClass = `
        w-full bg-transparent border-b border-[#4a4540]
        text-[#e8d5b0] placeholder-[#6b6258]
        py-3 px-0 text-sm tracking-wide
        outline-none focus:border-[#c49a6c]
        transition-colors duration-300
    `;

    const labelClass = "text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8a7d6e] mb-1 block";

    const selectClass = `
        w-full bg-[#2a2622] border-b border-[#4a4540]
        text-[#e8d5b0] py-3 px-0 text-sm
        outline-none focus:border-[#c49a6c]
        transition-colors duration-300 cursor-pointer
    `;

    return (
        <div className="min-h-screen bg-[#2a2622]">
            <Navbar/>
            <div className="pt-14 pb-16 max-w-2xl mx-auto px-6">

                {/* Header */}
                <div className="flex items-center justify-between py-8">
                    <div>
                        <p className="text-[#6b6258] text-[10px] tracking-[0.3em] uppercase mb-1">Opet</p>
                        <h2 className="text-[#e8d5b0] text-2xl font-light tracking-widest">Tienda</h2>
                        <div className="w-8 h-px bg-[#c49a6c] mt-2"></div>
                    </div>
                    <button
                        onClick={() => {
                            setShowCreateListing(true);
                            fetchMyClothes();
                        }}
                        className="px-5 py-2 bg-[#c49a6c] hover:bg-[#d4aa7c] text-[#221f1c] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300"
                    >
                        + Publicar
                    </button>
                </div>

                <Search
                    value = {filters.name}
                    onChange={handleSearching}
                    placeholder="BUSCAR..."
                    />

                {loading && <p className="text-[#6b6258] text-xs text-center mt-10 animate-pulse">Cargando...</p>}

                {!loading && storeListing.length === 0 && (
                    <p className="text-[#6b6258] text-xs text-center mt-10">No hay publicaciones todavía.</p>
                )}

                <div className="grid grid-cols-2 gap-4 mt-6">
                    {storeListing.map(listing => (
                        <div key={listing.listingId}
                             className="border border-[#3a3530] bg-[#221f1c] hover:border-[#4a4540] transition-colors duration-300">
                            {listing.clothe?.image_url
                                ? <img src={listing.clothe.image_url} className="w-full aspect-square object-cover"/>
                                : <div className="w-full aspect-square flex items-center justify-center bg-[#2a2622]">
                                    <span className="text-[#3a3530] text-xs">Sin imagen</span>
                                </div>
                            }
                            <div className="p-3 flex flex-col gap-1">
                                <p className="text-[#e8d5b0] text-sm tracking-wide">{listing.clothe?.name}</p>
                                <p className="text-[#c49a6c] text-xs tracking-[0.15em]">${listing.price}</p>
                                <p className="text-[#6b6258] text-[10px] leading-relaxed">{listing.description}</p>

                                {listing.sellerId === userId && (
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => openEditState(listing)}
                                            className="flex-1 py-2 border border-[#4a4540] hover:border-[#c49a6c] text-[#6b6258] hover:text-[#c49a6c] text-[9px] tracking-[0.15em] uppercase transition-all duration-300"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => deleteListing(listing.listingId)}
                                            className="flex-1 py-2 border border-[#4a4540] hover:border-red-900 text-[#4a4540] hover:text-red-700 text-[9px] tracking-[0.15em] uppercase transition-all duration-300"
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

            {/* como creo una publicacion de tienda  */}
            {showCreateListing && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
                    <div className="bg-[#221f1c] border border-[#3a3530] w-full max-w-md p-8">
                        <h3 className="text-[#e8d5b0] text-lg font-light tracking-widest mb-1">Nueva publicación</h3>
                        <div className="w-6 h-px bg-[#c49a6c] mb-8"></div>

                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto mb-6">
                            {myClothes.map(clothe => (
                                <div
                                    key={clothe.id}
                                    onClick={() => setSelectedClothe(clothe)}
                                    className={`
                                    cursor-pointer border aspect-square overflow-hidden
                                    transition-all duration-300
                                    ${selectedClothe?.id === clothe.id
                                        ? 'border-[#c49a6c]'
                                        : 'border-[#3a3530] hover:border-[#4a4540]'}
                                `}
                                >
                                    {clothe.image_url
                                        ? <img src={clothe.image_url} className="w-full h-full object-cover"/>
                                        : <div className="w-full h-full flex items-center justify-center">
                                            <span
                                                className="text-[#4a4540] text-[9px] text-center px-1">{clothe.name}</span>
                                        </div>
                                    }
                                </div>
                            ))}
                        </div>

                        {selectedClothe && (
                            <form onSubmit={createStoreListing} className="flex flex-col gap-6 mt-4">
                                <div>
                                    <label className={labelClass}>Precio</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleFormChange}
                                        placeholder="0"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Descripción</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleFormChange}
                                        placeholder="Describí tu prenda..."
                                        rows={3}
                                        className={inputClass + " resize-none"}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-[#c49a6c] hover:bg-[#d4aa7c] text-[#221f1c] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300"
                                    >
                                        Publicar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateListing(false)}
                                        className="flex-1 py-3 border border-[#4a4540] hover:border-[#6b6258] text-[#6b6258] text-xs tracking-[0.2em] uppercase transition-all duration-300"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            )}
            {editingListing && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
                    <div className="bg-[#221f1c] border border-[#3a3530] w-full max-w-md p-8">
                        <h3 className="text-[#e8d5b0] text-lg font-light tracking-widest mb-1">Editar publicación</h3>
                        <div className="w-6 h-px bg-[#c49a6c] mb-8"></div>

                        <form onSubmit={updateStoreListing} className="flex flex-col gap-6">
                            <div>
                                <label className={labelClass}>Precio</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleFormChange}
                                    placeholder="0"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Descripción</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleFormChange}
                                    rows={3}
                                    className={inputClass + " resize-none"}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Estado</label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleFormChange}
                                    className={selectClass}
                                >
                                    <option value="ACTIVE">Activo</option>
                                    <option value="SOLD">Vendido</option>
                                    <option value="PAUSED">Pausado</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-[#c49a6c] hover:bg-[#d4aa7c] text-[#221f1c] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300"
                                >
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingListing(null)}
                                    className="flex-1 py-3 border border-[#4a4540] hover:border-[#6b6258] text-[#6b6258] text-xs tracking-[0.2em] uppercase transition-all duration-300"
                                >
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
export default Store;