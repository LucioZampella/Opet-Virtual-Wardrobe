import React, { useState, useEffect } from 'react';

export default function FollowButton({ currentUserId, profileUserId }) {
    // Estado para saber si ya lo seguimos o no
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token')

    // 1. Opcional: Verificar si ya lo sigues al cargar el perfil
    useEffect(() => {
        if (currentUserId && profileUserId) {
            fetch(`http://localhost:8080/api/friends/check?followerId=${currentUserId}&followingId=${profileUserId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`  // faltaba acá
                }
            })
                .then((res) => res.json())
                .then((alreadyFriends) => setIsFollowing(alreadyFriends))
                .catch((err) => console.error("Error al verificar seguimiento:", err));
        }
    }, [currentUserId, profileUserId]);

    // 2. Función para seguir / dejar de seguir
    const handleFollowAction = async () => {
        setLoading(true);

        try {
            if (!isFollowing) {
                // ACCIÓN: SEGUIR (Crear relación)
                const response = await fetch('http://localhost:8080/api/friends/follow', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`  // esto falta
                    },
                    body: JSON.stringify({
                        followerId: currentUserId,   // Tu ID (el que sigue)
                        followingId: profileUserId,  // El ID del perfil (al que siguen)
                    }),
                });

                if (response.ok) {
                    setIsFollowing(true);
                }
            } else {
                // ACCIÓN: DEJAR DE SEGUIR (Borrar relación - Opcional)
                const response = await fetch(`http://localhost:8080/api/friends/unfollow?followerId=${currentUserId}&followingId=${profileUserId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`  // faltaba acá
                    }
                });

                if (response.ok) {
                    setIsFollowing(false);
                }
            }
        } catch (error) {
            console.error("Hubo un error con la petición:", error);
        } finally {
            setLoading(false);
        }
    };

    // Evitar que un usuario se siga a sí mismo
    if (currentUserId === profileUserId) return null;

    return (
        <button
            onClick={handleFollowAction}
            disabled={loading}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all shadow-sm ${
                loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-600 hover:border-red-200 border border-transparent'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
        >
            {loading ? 'Procesando...' : isFollowing ? 'Siguiendo' : 'Seguir'}
        </button>
    );
}