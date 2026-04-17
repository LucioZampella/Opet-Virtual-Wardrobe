import { useState } from 'react';
import { outfitService } from '../service/OutfitService.js'
import { toast } from 'react-hot-toast';

export const useOutfit = () => {
    const [loading, setLoading] = useState(false);

    // 1. Crear
    const createOutfit = async (outfitData, token) => {
        setLoading(true);
        try {
            await outfitService.create(outfitData, token);
            toast.success("¡Outfit creado con éxito!");
        } catch (err) {
            toast.error(err.message, { icon: '⚠️' });
        } finally {
            setLoading(false);
        }
    };

    // 2. Obtener todos
    const getAllOutfits = async (token) => {
        setLoading(true);
        try {
            return await outfitService.getAll(token);
        } catch (err) {
            toast.error("Error al cargar los outfits: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // 3. Actualizar
    const updateOutfit = async (id, outfitData, token) => {
        setLoading(true);
        try {
            await outfitService.update(id, outfitData, token);
            toast.success("Outfit actualizado correctamente");
        } catch (err) {
            toast.error(err.message, { icon: '⚠️' });
        } finally {
            setLoading(false);
        }
    };

    // 4. Eliminar
    const deleteOutfit = async (id, token) => {
        setLoading(true);
        try {
            await outfitService.delete(id, token);
            toast.success("Outfit eliminado");
        } catch (err) {
            toast.error("Error al eliminar: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return { createOutfit, getAllOutfits, updateOutfit, deleteOutfit, loading };
};