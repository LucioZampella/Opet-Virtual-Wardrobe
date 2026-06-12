import React, { useState, useEffect, useRef } from "react";

const NotificationBell = ({ token }) => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // 1. Buscamos las notificaciones no leídas
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/my-notifications-not-read", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                }
            } catch (error) {
                console.error("Error al traer notificaciones:", error);
            }
        };

        if (token) fetchNotifications();
    }, [token]);

    // Cerrar si hace clic afuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 2. Borrar notificación al hacer clic en la cruz
    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Evita que se cierre el menú
        try {
            const response = await fetch(`http://localhost:8080/api/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(notifications.filter(n => n.id !== id));
            }
        } catch (error) {
            console.error("Error al borrar notificación:", error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Icono de la campana en SVG nativo */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-[#6b6258] hover:text-[#c49a6c] transition-colors focus:outline-none flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {/* Burbuja roja indicadora de cantidad */}
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* Menú Desplegable con tu paleta de colores */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#221f1c] border border-[#3a3530] rounded shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b border-[#3a3530] flex justify-between items-center bg-[#2a2622]">
                        <span className="text-[#e8d5b0] text-[10px] tracking-widest uppercase">Notificaciones</span>
                    </div>

                    <div className="max-h-60 overflow-y-auto divide-y divide-[#3a3530]">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-[#6b6258] text-[11px] tracking-wide">
                                Sin novedades por ahora
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div key={notif.id} className="p-3 hover:bg-[#2a2622] transition-colors flex items-start justify-between gap-2 group">
                                    <div className="flex-1 min-w-0">
                                        {/* Acá se muestra el tipo y la descripción directa que viene de Java */}
                                        <p className="text-zinc-300 text-xs leading-tight">
                                            <span className="text-[#c49a6c] font-medium mr-1">[{notif.type}]</span>
                                            {notif.description}
                                        </p>
                                    </div>

                                    {/* Botón rápido para descartar/eliminar */}
                                    <button
                                        onClick={(e) => handleDelete(notif.id, e)}
                                        className="text-[#4a4540] hover:text-red-400 text-xs px-1"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;