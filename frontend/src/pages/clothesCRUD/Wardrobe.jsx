import {useEffect, useState} from "react";
import Navbar from "../../components/Navbar.jsx";
import GenericSelect from "../../constants/GenericSelect";
const CLOUDINARY_CLOUD_NAME = "ducp0gbgq";
const CLOUDINARY_UPLOAD_PRESET = "opet_clothes";
import { CLOTHING_TYPES, COLORS, SIZES, FITS, MATERIALS } from "../../constants/clotheOptions.js";
import toast from "react-hot-toast";

const EmptyForm = {
    name:       "", // --> Por defecto arrancan vacios
    typeId:     "",
    sizeId:     "",
    materialId: "",
    fitId:      "",
    colorIds: [],
    image_url:  "",
    preferenceLevel: 50,
};



function Wardrobe() {
    const [clothes, setClothes] = useState([]);
    const [showCreateState, setShowCreateState] = useState(false); // --> Con esto se define si el "creador de prendas" esta abierto o no
    const [editingClothe, setEditingClothe] = useState(null); // --> Null significa que no esta siendo editada
    const [filters, setFilters] = useState({
        typeId:     "", // --> Si es un string vacio, no filtra por nada, por eso se inicializa asi
        sizeId:     "",
        materialId: "",
        fitId:      "",
        colorIds: [],
        preferenceLevel: "",
    });

    const [form, setForm] = useState(EmptyForm);
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchClothes = async () => { // --> Trae todas las prendas del usuario loggeado
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/clothes/my-clothes`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                    // No hace falta "Content-Type" en un GET porque no mandamos body
                }
            });

            if (response.ok) {
                const data = await response.json();
                setClothes(data);
            } else {
                console.error("Error al cargar prendas:", response.status);
                toast.error("No se cargaron todas las prendas")
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        } finally {
            setLoading(false);
        }
};

    useEffect(() => {
        fetchClothes();
    }, []);

    const fetchWithFilters = async (newFilters) => { // --> Trae todas las prendas pero ahora con filtros especificos
        setLoading(true);
        try {
            const params = new URLSearchParams(); // --> URLSearchParams arma la cadena "?typeId=1&sizeId=3" automáticamente
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== "") {
                    if (Array.isArray(value)) {
                        value.forEach(v => params.append(key, v));
                    } else {
                        params.append(key, value);
                    }
                }
            });

            const url = `http://localhost:8080/clothes/filter?${params.toString()}`;
            console.log("URL QUE ESTOY MANDANDO AL BACKEND:", url); // <--- ESTO ES LO QUE NECESITO VER

            const response = await fetch(`http://localhost:8080/clothes/filter?${params.toString()}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                toast.success("Filtro aplicado")
                setClothes(data);
            }
        } catch (error) {
            console.error("Error al filtrar:", error);
            toast.error("Error al filtrar prendas")
        } finally {
            setLoading(false);
        }
    };

    const uploadImageToCloudinary = async (file) => { // --> Sube la imagen y guarda la url a esa imagne
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: data }
        );
        const result = await response.json();
        return result.secure_url;
    };

    const handleImageChange = async (e) => { // --> Maneja los cambios de imagenes
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);

        try {
            const url = await uploadImageToCloudinary(file);
            setForm(prev => ({ ...prev, image_url: url }));
        } catch (error) {
            console.error("Error al subir la imagen: ", error);
        } finally {
            setUploading(false);
        }
    };

    const handleFormChange = (e) => { // --> Maneja los cambios en los atributos de la ropa
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    // funcione que controla los botones de colores
    const toggleColor = (id) => {
        setForm(prev => {
            const currentIds = prev.colorIds || [];
            const newIds = currentIds.includes(id)
                ? currentIds.filter(cId => cId !== id)
                : [...currentIds, id];
            return { ...prev, colorIds: newIds };
        });
    };

    const handleFilterChange = (name, newValue) => {
        let selectedValue;

        if (name === "colorIds") {
            selectedValue = Array.isArray(newValue) ? newValue : [];
        } else {
            selectedValue = newValue ? newValue.id : "";
        }

        const newFilters = { ...filters, [name]: selectedValue };
        setFilters(newFilters);

        const hayAlgunFiltro = Object.values(newFilters).some(v => v !== "" && v !== undefined);

        if (hayAlgunFiltro) {
            fetchWithFilters(newFilters);
        } else {
            fetchClothes();
        }
    };

    const createClothe = async (e) => { // --> Crea una prenda tras un submit
        e.preventDefault();

        if (!form.image_url) {
            toast.error("Primero subí una foto de la prenda");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/clothes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name:       form.name,
                    image_url:  form.image_url,
                    typeId:     Number(form.typeId),
                    sizeId:     Number(form.sizeId),
                    materialId: Number(form.materialId),
                    fitId:      Number(form.fitId),
                    colorIds: form.colorIds,
                    preferenceLevel: Number(form.preferenceLevel),
                })
            });

            if (response.ok) {
                await fetchClothes();
                toast.success("Creaste la prenda!")
                setShowCreateState(false);
                setForm(EmptyForm);
            } else {
                const errorMsg = await response.text();
                console.error("Error al crear la prenda: " + errorMsg);
                toast.error("No se creo la prenda ")
            }
        } catch (error) {
            console.error("Error de conexión con el servidor: ", error);
        }
    };

    const openEditState = (clothe) => { // --> Abre el estado de creacion de una prenda para el usuario
        setEditingClothe(clothe);
        setForm({
            name:       clothe.name       || "",
            image_url:  clothe.image_url  || "",
            typeId:     clothe.typeId     || 0,
            sizeId:     clothe.sizeId     || 0,
            materialId: clothe.materialId || 0,
            fitId:      clothe.fitId      || 0,
            colorIds:  clothe.colorIds ? clothe.colorIds.map(c => typeof c === 'object' ? c.id : c) : [],
            preferenceLevel: clothe.preferenceLevel || 50,
        });
    };

    const updateClothe = async (e) => { // --> Guarda el edit que el usuario hizo a la prenda
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/clothes/${editingClothe.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name:       form.name,
                    image_url:  form.image_url,
                    typeId:     Number(form.typeId),
                    sizeId:     Number(form.sizeId),
                    materialId: Number(form.materialId),
                    fitId:      Number(form.fitId),
                    colorIds: form.colorIds,
                    preferenceLevel: Number(form.preferenceLevel),
                })
            });

            if (response.ok) {
                setClothes(prev =>
                        prev.map(c =>
                            c.id === editingClothe.id
                                ? { ...c, ...form }
                                : c
                        )
                    );
                toast.success("Actualizaste la prenda")
                setEditingClothe(null);
                setForm(EmptyForm);
            } else {
                const errorMsg = await response.text();
                console.error("Error al actualizar: " + errorMsg);
                toast.error("No se pudo actualizar")
            }
        } catch (error) {
            console.error("Error de conexión: ", error);
        }
    };

    const deleteClothe = async (id) => { // --> Borra la prenda seleccionada por el usuario
        if (!window.confirm("¿Estás seguro de que querés eliminar esta prenda?")) return;

        try {
            const response = await fetch(`http://localhost:8080/clothes/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                setClothes(prev => prev.filter(c => c.id !== id)); // --> Un nuevo array de prendas sin la que acabamos de borrar
                toast.success("Eliminaste la prenda")
            } else {
                const errorMsg = await response.text();
                console.error("Error al eliminar: " + errorMsg);
                toast.error("Error al eliminar ")
            }
        } catch (error) {
            toast.error("Error de conexión");
            console.error(error);
        }
    };

    const getLabelById = (lista, id) => { // --> Al filtrar por una categoria, en vez de mostrar el id muestra su label (en vez de 1, muestra remera)
        const item = lista.find(i => i.id === id);
        return item ? item.label : "—";
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
            <Navbar />

            <div className="pt-14 pb-20 max-w-2xl mx-auto px-4">
                <div className="flex items-center justify-between py-6 border-b border-[#3a3530]">
                    <div>
                        <h1 className="text-[#e8d5b0] text-xl font-light tracking-widest">Mi Ropero</h1>
                        {/* Muestra la cantidad de prendas cargadas */}
                        <p className="text-[#6b6258] text-xs tracking-[0.2em] mt-1">
                            {clothes.length} {clothes.length === 1 ? "prenda" : "prendas"}
                        </p>
                    </div>

                    {/* Botón para abrir el estado de creación */}
                    <button
                        onClick={() => {
                            setForm(EmptyForm);
                            setShowCreateState(true);
                        }}
                        className="
                            px-5 py-2 border border-[#4a4540]
                            hover:border-[#c49a6c] hover:text-[#c49a6c]
                            text-[#8a7d6e] text-[10px] tracking-[0.2em] uppercase
                            transition-all duration-300
                        "
                    >
                        + Agregar prenda
                    </button>
                </div>


                {/* Filtros, los cuales solo se muestran con 1 prenda o mas*/}

                {/*CAMBIOOO, ahora se mostrara todo el tiempo con el objetivo de que cuando no encuentre nada con el filtro*/}
                {/*Siga estando los filtros arriba y no se crashee todo */}


                {(clothes.length > 0 || Object.values(filters).some(v => v !== "")) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 py-2">
                        <GenericSelect
                            label="Tipo"
                            options={CLOTHING_TYPES}
                            value={CLOTHING_TYPES.find(t => t.id === parseInt(filters.typeId)) || null}
                            onChange={(val) => handleFilterChange("typeId", val)}
                        />
                        <GenericSelect
                            label="Talle"
                            options={SIZES}
                            value={SIZES.find(s => s.id === parseInt(filters.sizeId)) || null}
                            onChange={(val) => handleFilterChange("sizeId", val)}
                        />

                        <GenericSelect
                            label="Material"
                            options={MATERIALS}
                            value={MATERIALS.find(m => m.id === parseInt(filters.materialId)) || null}
                            onChange={(val) => handleFilterChange("materialId", val)}
                        />

                        <GenericSelect
                            label="Fit"
                            options={FITS}
                            value={FITS.find(f => f.id === parseInt(filters.fitId)) || null}
                            onChange={(val) => handleFilterChange("fitId", val)}
                        />
                        <GenericSelect
                            label="Todos los Colores"
                            options={COLORS}
                            multiple={true}
                            value={COLORS.filter(c => filters.colorIds.includes(c.id)) || []}
                            onChange={(selectedValues) => {
                                const ids = Array.isArray(selectedValues) ?
                                    selectedValues.map(o => o.id) :
                                    [];
                                handleFilterChange("colorIds", ids);
                                }
                            }
                        />
                    </div>)}

                {loading && (
                    <div className="flex justify-center py-16">
                        <p className="text-[#6b6258] text-xs tracking-[0.3em] uppercase animate-pulse">
                            Cargando ropero...
                        </p>
                    </div>
                )}

                {/* Se muestra cuando no hay prendas :( */}
                {!loading && clothes.length === 0 && (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <p className="text-[#6b6258] text-xs tracking-[0.3em] uppercase">
                            Tu ropero está vacío
                        </p>
                        <p className="text-[#4a4540] text-xs tracking-wide">
                            Agregá tu primera prenda con el botón de arriba
                        </p>
                    </div>
                )}


                {/* Cuanto tenemos prendas */}
                {!loading && clothes.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        {/* clothes.map() recorre el array y genera una "tarjeta" (no se como describirlo) por prenda */}
                        {clothes.map(clothe => (
                            <div
                                key={clothe.id}
                                className="
                                    bg-[#221f1c] border border-[#3a3530]
                                    hover:border-[#4a4540] transition-all duration-300
                                    flex flex-col overflow-hidden
                                "
                            >
                                {/* Imagen de la prenda */}
                                <div className="relative aspect-square bg-[#2a2622]">
                                    {clothe.image_url
                                        ? <img
                                            src={clothe.image_url}
                                            alt={clothe.name}
                                            className="w-full h-full object-cover"
                                        />
                                        : /* Si no hay imagen, se muestra un placeholder */
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-[#3a3530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                            </svg>
                                        </div>
                                    }
                                </div>

                                {/* Info y acciones */}
                                <div className="p-3 flex flex-col gap-2">
                                    <p className="text-[#e8d5b0] text-sm tracking-wide truncate">
                                        {clothe.name}
                                    </p>

                                    {/* Tags de categorías */}
                                    <div className="flex flex-wrap gap-1">
                                        {/* Primero, las etiquetas que son IDs únicos */}
                                        {[
                                            getLabelById(CLOTHING_TYPES, clothe.typeId),
                                            getLabelById(SIZES, clothe.sizeId),
                                            getLabelById(MATERIALS, clothe.materialId),
                                            getLabelById(FITS, clothe.fitId)
                                        ].filter(label => label).map((label, i) => (
                                            <span key={`attr-${i}`} className="text-[9px] tracking-[0.1em] uppercase text-[#6b6258] border border-[#3a3530] px-2 py-0.5">{label}</span>
                                        ))}

                                        {/* Ahora, mapeamos la lista de colores (ManyToMany) */}
                                        {clothe.colorIds && clothe.colorIds.map(colorIds => (
                                            <span
                                                key={`color-${colorIds.id}`}
                                                className="text-[9px] tracking-[0.1em] uppercase text-[#6b6258] border border-[#3a3530] px-2 py-0.5"
                                            >
                                            {colorIds.name} {/* Aquí accedes directamente al nombre del color */}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Botones editar / eliminar */}
                                    <div className="flex gap-2 mt-1">
                                        <button
                                            onClick={() => openEditState(clothe)}
                                            className="
                                                flex-1 py-1.5 text-[9px] tracking-[0.15em] uppercase
                                                border border-[#4a4540] text-[#6b6258]
                                                hover:border-[#c49a6c] hover:text-[#c49a6c]
                                                transition-all duration-300
                                            "
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => deleteClothe(clothe.id)}
                                            className="
                                                flex-1 py-1.5 text-[9px] tracking-[0.15em] uppercase
                                                border border-[#4a4540] text-[#4a4540]
                                                hover:border-red-900 hover:text-red-700
                                                transition-all duration-300
                                            "
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* Crear prenda */}
            {showCreateState && (
                <div
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
                    onClick={() => setShowCreateState(false)} // --> cierra al hacer clic en el fondo
                >
                    {/* stopPropagation evita que el clic dentro cierre el modal */}
                    <div
                        className="bg-[#221f1c] border border-[#3a3530] w-full max-w-md p-8 max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-[#e8d5b0] text-lg font-light tracking-widest mb-1">Nueva prenda</h3>
                        <div className="w-6 h-px bg-[#c49a6c] mb-8"></div>

                        <form onSubmit={createClothe} className="flex flex-col gap-6">

                            {/* Foto de la prenda */}
                            <div>
                                <label className={labelClass}>Foto de la prenda</label>

                                {/* Si ya subió la foto, se muestra */}
                                {form.image_url && (
                                    <img
                                        src={form.image_url}
                                        alt="Preview"
                                        className="w-full h-48 object-cover mb-3 border border-[#3a3530]"
                                    />
                                )}

                                {/* Input de archivo --> al cambiar llama a handleImageChange */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={uploading}
                                    className="text-[#6b6258] text-xs w-full"
                                />
                            </div>

                            {/* Nombre de la prenda */}
                            <div>
                                <label className={labelClass}>Nombre</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleFormChange}
                                    placeholder="Ej: Remera blanca de algodón"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            {/* Tipo de prenda */}
                            <div>
                                <label className={labelClass}>Tipo de prenda</label>
                                <select name="typeId" value={form.typeId} onChange={handleFormChange} required className={selectClass}>
                                    <option value={""} disabled>Seleccioná un tipo</option>
                                    {CLOTHING_TYPES.map(t => (
                                        <option key={t.id} value={t.id}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Talle */}
                            <div>
                                <label className={labelClass}>Talle</label>
                                <select name="sizeId" value={form.sizeId} onChange={handleFormChange} required className={selectClass}>
                                    <option value={""} disabled>Seleccioná un talle</option>
                                    {SIZES.map(t => (
                                        <option key={t.id} value={t.id}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Material */}
                            <div>
                                <label className={labelClass}>Material</label>
                                <select name="materialId" value={form.materialId} onChange={handleFormChange} required className={selectClass}>
                                    <option value={""} disabled>Seleccioná un material</option>
                                    {MATERIALS.map(m => (
                                        <option key={m.id} value={m.id}>{m.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Fit */}
                            <div>
                                <label className={labelClass}>Corte (Fit)</label>
                                <select name="fitId" value={form.fitId} onChange={handleFormChange} required className={selectClass}>
                                    <option value={""} disabled>Seleccioná un corte</option>
                                    {FITS.map(f => (
                                        <option key={f.id} value={f.id}>{f.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/*Cambio el coso de colores para que ahora sea con tags y no con select*/}
                            <div className="flex flex-wrap gap-2">
                                {COLORS.map(c => {
                                    const isSelected = form.colorIds?.includes(c.id);
                                    return (
                                        <button
                                            type="button"
                                            key={c.id}
                                            onClick={() => toggleColor(c.id)}
                                            className={isSelected ? "bg-blue-500" : "bg-gray-200"}
                                        >
                                            {c.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Nivel de preferencia
                                </label>

                                {/* slider */}
                                <input
                                    type="range"
                                    name="preferenceLevel"
                                    min={1}
                                    max={100}
                                    value={form.preferenceLevel}
                                    onChange={handleFormChange}
                                    className="w-full accent-[#c49a6c] mt-2"
                                />

                                {/* muestra el valor actual mientras vas moviendo el slider */}
                                <div className="flex justify-between mt-1">
                                    <span className="text-[#4a4540] text-[10px] tracking-[0.15em] uppercase">No me gusta</span>
                                    <span className="text-[#c49a6c] text-sm font-light">{form.preferenceLevel}</span>
                                    <span className="text-[#4a4540] text-[10px] tracking-[0.15em] uppercase">Favorita</span>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-4 mt-2">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="
                                        flex-1 py-3
                                        bg-[#c49a6c] hover:bg-[#e8d5b0]
                                        text-[#221f1c] text-xs font-semibold
                                        tracking-[0.2em] uppercase
                                        transition-all duration-300
                                        disabled:opacity-40 disabled:cursor-not-allowed
                                    "
                                >
                                    Guardar prenda
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowCreateState(false); setForm(EmptyForm); }}
                                    className="
                                        flex-1 py-3 border border-[#4a4540]
                                        hover:border-[#6b6258] text-[#6b6258]
                                        text-xs tracking-[0.2em] uppercase
                                        transition-all duration-300
                                    "
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Editar prenda */}
            {editingClothe && (
                <div
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
                    onClick={() => { setEditingClothe(null); setForm(EmptyForm); }}
                >
                    <div
                        className="bg-[#221f1c] border border-[#3a3530] w-full max-w-md p-8 max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-[#e8d5b0] text-lg font-light tracking-widest mb-1">Editar prenda</h3>
                        <div className="w-6 h-px bg-[#c49a6c] mb-8"></div>

                        <form onSubmit={updateClothe} className="flex flex-col gap-6">

                            {/* Foto --> si ya tiene imagen la mostramos como preview */}
                            <div>
                                <label className={labelClass}>Foto de la prenda</label>
                                {form.image_url && (
                                    <img src={form.image_url} alt="Preview"
                                         className="w-full h-48 object-cover mb-3 border border-[#3a3530]"/>
                                )}
                                <input
                                    type="file" accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={uploading}
                                    className="text-[#6b6258] text-xs w-full"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Nombre</label>
                                <input name="name" value={form.name} onChange={handleFormChange}
                                       required className={inputClass}/>
                            </div>

                            <div>
                                <label className={labelClass}>Tipo de prenda</label>
                                <select name="typeId" value={form.typeId} onChange={handleFormChange} required
                                        className={selectClass}>
                                    <option value={""} disabled>Seleccioná un tipo</option>
                                    {CLOTHING_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Talle</label>
                                <select name="sizeId" value={form.sizeId} onChange={handleFormChange} required
                                        className={selectClass}>
                                    <option value={""} disabled>Seleccioná un talle</option>
                                    {SIZES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Material</label>
                                <select name="materialId" value={form.materialId} onChange={handleFormChange} required
                                        className={selectClass}>
                                    <option value={""} disabled>Seleccioná un material</option>
                                    {MATERIALS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {COLORS.map(c => {
                                    const isSelected = form.colorIds?.includes(c.id);
                                    return (
                                        <button
                                            type="button"
                                            key={c.id}
                                            onClick={() => toggleColor(c.id)}
                                            className={isSelected ? "bg-blue-500" : "bg-gray-200"}
                                        >
                                            {c.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div>
                                <label className={labelClass}>Corte (Fit)</label>
                                <select name="fitId" value={form.fitId} onChange={handleFormChange} required
                                        className={selectClass}>
                                    <option value={""} disabled>Seleccioná un corte</option>
                                    {FITS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Nivel de preferencia
                                </label>

                                <input
                                    type="range"
                                    name="preferenceLevel"
                                    min={1}
                                    max={100}
                                    value={form.preferenceLevel}
                                    onChange={handleFormChange}
                                    className="w-full accent-[#c49a6c] mt-2"
                                />

                                <div className="flex justify-between mt-1">
                                    <span
                                        className="text-[#4a4540] text-[10px] tracking-[0.15em] uppercase">No me gusta</span>
                                    <span className="text-[#c49a6c] text-sm font-light">{form.preferenceLevel}</span>
                                    <span
                                        className="text-[#4a4540] text-[10px] tracking-[0.15em] uppercase">Favorita</span>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-2">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="
                                        flex-1 py-3 bg-[#c49a6c] hover:bg-[#e8d5b0]
                                        text-[#221f1c] text-xs font-semibold
                                        tracking-[0.2em] uppercase transition-all duration-300
                                        disabled:opacity-40 disabled:cursor-not-allowed
                                    "
                                >
                                    Guardar cambios
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingClothe(null);
                                        setForm(EmptyForm);
                                    }}
                                    className="
                                        flex-1 py-3 border border-[#4a4540]
                                        hover:border-[#6b6258] text-[#6b6258]
                                        text-xs tracking-[0.2em] uppercase transition-all duration-300
                                    "
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


export default Wardrobe;