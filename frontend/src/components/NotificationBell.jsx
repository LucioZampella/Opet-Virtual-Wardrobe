import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BASE = "http://localhost:8080/api";

const NotificationBell = ({ token }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (token) fetchNotifications();
    }, [token]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${BASE}/notifications/my-notifications`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) return;
            const data = await res.json();
            setNotifications(data);
            await fetchUsernames(data);
        } catch (e) {
            toast.error("No se pudieron cargar las notificaciones.");
        }
    };

    const fetchUsernames = async (notifs) => {
        const ids = [...new Set(notifs.map(n => n.actor_id))];
        const entries = await Promise.all(
            ids.map(async (id) => {
                try {
                    const res = await fetch(`http://localhost:8080/usuarios/profile/${id}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (!res.ok) return [id, `usuario #${id}`];
                    const user = await res.json();
                    return [id, user.username];
                } catch {
                    return [id, `usuario #${id}`];
                }
            })
        );
        setUsernames(Object.fromEntries(entries));
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            const res = await fetch(`${BASE}/notifications/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setNotifications(prev => prev.filter(n => n.id !== id));
                toast.success("Notificación eliminada.");
            } else {
                toast.error("No se pudo eliminar la notificación.");
            }
        } catch (e) {
            toast.error("Error al eliminar la notificación.");
        }
    };

    const handleMarkRead = async (id, e) => {
        e.stopPropagation();
        try {
            const res = await fetch(`${BASE}/notifications/${id}/read`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setNotifications(prev =>
                    prev.map(n => n.id === id ? { ...n, already_read: true } : n)
                );
                toast.success("Marcada como leída.");
            } else {
                toast.error("No se pudo marcar como leída.");
            }
        } catch (e) {
            toast.error("Error al marcar como leída.");
        }
    };
    const handleFollow = async (actorId, currentUserId) => {
        try {
            const res = await fetch(`${BASE}/friends/follow`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    followerId: currentUserId,
                    followingId: actorId
                })
            });
            if (res.ok) {
                toast.success("¡Solicitud enviada!");
            } else {
                toast.error("No se pudo seguir al usuario.");
            }
        } catch (e) {
            toast.error("Error al seguir al usuario.");
        }
    };
    const getUserIdFromToken = (token) => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
    };

    const currentUserId = getUserIdFromToken(token);

    const handleAccept = async (notif, e) => {
        e.stopPropagation();
        try {
            const res = await fetch(
                `${BASE}/friends/accept?followerId=${notif.actor_id}&followingId=${notif.user_id}`,
                { method: "POST", headers: { "Authorization": `Bearer ${token}` } }
            );
            if (res.ok) {
                toast.success("Solicitud aceptada.");
                await fetchNotifications(); // recarga para mostrar el FOLLOW_BACK
            } else {
                toast.error("No se pudo aceptar la solicitud.");
            }
        } catch (e) {
            toast.error("Error al aceptar la solicitud.");
        }
    };

    const handleReject = async (notif, e) => {
        e.stopPropagation();
        try {
            const res = await fetch(
                `${BASE}/friends/unfollow?followerId=${notif.actor_id}&followingId=${notif.user_id}`,
                { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } }
            );
            if (res.ok) {
                setNotifications(prev => prev.filter(n => n.id !== notif.id));
                toast.success("Solicitud rechazada.");
            } else {
                toast.error("No se pudo rechazar la solicitud.");
            }
        } catch (e) {
            toast.error("Error al rechazar la solicitud.");
        }
    };

    const unreadCount = notifications.filter(n => !n.already_read).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-[#6b6258] hover:text-[#c49a6c] transition-colors focus:outline-none flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#221f1c] border border-[#3a3530] rounded shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b border-[#3a3530] bg-[#2a2622]">
                        <span className="text-[#e8d5b0] text-[10px] tracking-widest uppercase">Notificaciones</span>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-[#3a3530]">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-[#6b6258] text-[11px] tracking-wide">
                                Sin novedades por ahora
                            </div>
                        ) : (
                            notifications.map((notif) => {
                                const username = usernames[notif.actor_id] || `usuario #${notif.actor_id}`;
                                const isRead = notif.already_read;
                                const isRequest = notif.type === "FOLLOW_REQUEST";

                                return (
                                    <div
                                        key={notif.id}
                                        className={`p-3 transition-colors flex flex-col gap-2 ${isRead ? "opacity-40" : "hover:bg-[#2a2622]"}`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-zinc-300 text-xs leading-tight flex-1">
                                                <span
                                                    className="font-medium text-[#c49a6c] mr-1 cursor-pointer hover:underline"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/profile/${notif.actor_id}`);
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                 @{username}
                                                </span>
                                                {notif.type === "FOLLOW_REQUEST" ? "quiere seguirte" : notif.description}
                                            </p>
                                            <div className="flex gap-1 flex-shrink-0">
                                                {!isRead && (
                                                    <button
                                                        onClick={(e) => handleMarkRead(notif.id, e)}
                                                        className="text-[#4a4540] hover:text-green-400 text-xs px-1"
                                                        title="Marcar como leída"
                                                    >
                                                        ✓
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => handleDelete(notif.id, e)}
                                                    className="text-[#4a4540] hover:text-red-400 text-xs px-1"
                                                    title="Eliminar"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>

                                        {isRequest && !isRead && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => handleAccept(notif, e)}
                                                    className="text-[11px] px-3 py-1 rounded border border-green-600 text-green-400 hover:bg-green-900/30 transition-colors"
                                                >
                                                    Aceptar
                                                </button>
                                                <button
                                                    onClick={(e) => handleReject(notif, e)}
                                                    className="text-[11px] px-3 py-1 rounded border border-red-700 text-red-400 hover:bg-red-900/30 transition-colors"
                                                >
                                                    Rechazar
                                                </button>
                                            </div>
                                        )}
                                        {/* AGREGÁS ESTO */}
                                        {notif.type === "FOLLOW_BACK" && !isRead && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFollow(notif.actor_id, currentUserId);
                                                    }}
                                                    className="text-[11px] px-3 py-1 rounded border border-[#c49a6c] text-[#c49a6c] hover:bg-[#c49a6c]/10 transition-colors"
                                                >
                                                    Seguir también
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;