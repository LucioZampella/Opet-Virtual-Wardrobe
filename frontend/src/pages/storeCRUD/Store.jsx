import {useEffect, useState} from "react";
import Navbar from "../../components/Navbar.jsx";
import {STATUS} from "../../constants/statusOptions.js";

const EmptyForm = {
    price: "",
    name: "",
    description: "",
    status: STATUS.ACTIVE,
};


function Store() {

    const [storeListing, setStoreListing] = useState([]);
    const [showCreateListing, setShowCreateListing] = useState(false);
    const [editingListing, setEditingListing] = useState(null);
    const token = localStorage.getItem("token");
    const [form, setForm] = useState(EmptyForm);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [filters, setFilters] = useState({
        min: "",
        max: "",
        typeId:     "",
        sizeId:     "",
        materialId: "",
        fitId:      "",
        colorId: "",
        name:  "",
    })

    const fetchAllListings = async() => { // --> Trae todas las listings
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/store/home`, {
                method: "GET"
            });

            if (response.ok) {
                const data = await response.json();
                setStoreListing(data);
            } else {
                console.error("Error al cargar la tienda: ", response.status);
            }
        } catch (error) {
            console.error("Error de conexion: ", error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllListings();
    }, []);

    const fetchWithFilters = async(newFilters) => { // --> Trae todas las listings pero ahora con filtros especificos
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (newFilters.min) params.append("min", newFilters.min);
            if (newFilters.max) params.append("max", newFilters.max);
            if (newFilters.typeId) params.append("typeId", newFilters.typeId);
            if (newFilters.sizeId) params.append("sizeId", newFilters.sizeId);
            if (newFilters.materialId) params.append("materialId", newFilters.materialId);
            if (newFilters.fitId) params.append("fitId", newFilters.fitId);
            if (newFilters.colorId) params.append("colorId", newFilters.colorId);
            if (newFilters.name) params.append("name", newFilters.name);

            const response = await response(`http://localhost:8080/store/filter?${params.toString()}`);

            if (response.ok) {
                const data = response.json();
                setStoreListing(data);
            }
        } catch (error) {
            console.error("Error al filtrar: ", error);
        } finally {
            setLoading(false);
        }

    }

    const handleFormChange = (e) => { // --> Maneja los cambios en los atributos de las listings
        const { name, value } = e.target;
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
            fetchClothes();
        }
    }

    const createStoreListing = async(e) => { // --> Crear una publicacion de venta
        e.preventDefault();
        setShowCreateListing(true);
        try {
            const response = await fetch(`http://localhost:8080/store`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    price: Number(form.price),
                    name: form.name,
                    description: form.description,
                    status: form.status,
                })
            });

            if (response.ok) {
                await fetchAllListings();
                setShowCreateListing(false);
                setForm(EmptyForm);
            } else {
                const errorMsg = await response.text();
                console.error("No se pudo crear la publicación: ", errorMsg);
            }
        } catch (error) {
            console.error("Error de conexión con el servidor: ", error)
        }
    };

    const openEditState = (StoreListing) => { //--> Abre el estado de edicion de una publicacion ya subida
        setEditingListing(StoreListing);
        setForm({
            name:       StoreListing.name       || "",
            price: StoreListing.price || 0,
            description: StoreListing.description || "",
            status: StoreListing.status || STATUS.ACTIVE,
        });
    };

    const updateStoreListing = async (e) => { //--> Update las ediciones realizadas
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/store/${editingListing.listingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
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
                setEditingListing(null);
                setForm(EmptyForm);
            } else {
                const errorMsg = response.text();
                console.error("No se pudo editar la prenda: ", errorMsg);
            }
        } catch (error) {
                console.error("Error de conexion: ", error);
            }
        };

    const deleteListing = async(listingId) => { // --> Borra la publicacion propia seleccionada por el usuario
        if (!window.confirm("¿Estas seguro que queres borrar la publicación?")) return;

        try {
            const response = await fetch (`http://localhost:8080/clothes/${listingId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                setStoreListing(prev => prev.filter(l => l.listingId !== listingId));
            } else {
                const errorMsg = response.text();
                console.error("No se pudo eliminar la prenda: ", errorMsg);
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

    return <div>Tienda</div>;
}

export default Store;