import {useEffect, useState} from "react";
import Navbar from "../../components/Navbar.jsx";
import STATUS from "../../constants/statusOptions.js";

const EmptyForm = {
    price: "",
    description: "",
    status: STATUS.ACTIVE,
};


function Store() {

    const [storeListing, setStoreListing] = useState([]);
    const [showStoreListing, setShowStoreListing] = useState(false);
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

    const createStoreListing = async(e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/store`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({

                })
            });
        } catch (error) {

        }
    }


            return <div>Tienda</div>;
}

export default Store;