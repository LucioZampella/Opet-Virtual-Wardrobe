import React, { useState, useEffect } from 'react';

export default function FollowButton({ currentUserId, profileUserId, isPrivate }) {
    const [status, setStatus] = useState('none'); // 'none' | 'pending' | 'following'
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!currentUserId || !profileUserId) return;
        fetch(`http://localhost:8080/api/friends/status?followerId=${currentUserId}&followingId=${profileUserId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setStatus(data.status)) // espera { status: 'none' | 'pending' | 'following' }
            .catch(err => console.error("Error al verificar seguimiento:", err));
    }, [currentUserId, profileUserId]);

    const handleFollow = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/friends/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ followerId: currentUserId, followingId: profileUserId })
            });
            if (res.ok) {
                setStatus(isPrivate ? 'pending' : 'following');
            }
        } catch (err) {
            console.error("Error al seguir:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnfollow = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8080/api/friends/unfollow?followerId=${currentUserId}&followingId=${profileUserId}`,
                { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (res.ok) setStatus('none');
        } catch (err) {
            console.error("Error al dejar de seguir:", err);
        } finally {
            setLoading(false);
        }
    };

    if (String(currentUserId) === String(profileUserId)) return null;

    const baseClass = "flex-shrink-0 px-5 py-2 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border";

    if (loading) return (
        <button disabled className={`${baseClass} border-[#3a3530] text-[#4a4540] cursor-not-allowed`}>
            ...
        </button>
    );

    if (status === 'following') return (
        <button
            onClick={handleUnfollow}
            className={`${baseClass} border-[#c49a6c] text-[#c49a6c] hover:border-red-900 hover:text-red-700`}
        >
            Siguiendo
        </button>
    );

    if (status === 'pending') return (
        <button
            onClick={handleUnfollow}
            className={`${baseClass} border-[#4a4540] text-[#4a4540] hover:border-red-900 hover:text-red-700`}
        >
            Pendiente
        </button>
    );

    return (
        <button
            onClick={handleFollow}
            className={`${baseClass} border-[#4a4540] text-[#8a7d6e] hover:border-[#c49a6c] hover:text-[#c49a6c]`}
        >
            {isPrivate ? 'Solicitar' : 'Seguir'}
        </button>
    );
}