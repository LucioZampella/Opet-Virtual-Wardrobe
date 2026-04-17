// se concretan las llamadas al api

const API_URL = "http://localhost:8080/outfit";

export const outfitService={
    //1 crear
    create: async(outfitData,token) =>
    {
        const response = await fetch(API_URL,{
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
            body: JSON.stringify(outfitData)

        });
        if (!response.ok) throw new Error(await response.text());
        return true;
    },

    //2 obtener todos  mis outfits
    getAll: async (token) => {
        const response = await fetch(`${API_URL}/my-outfits`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Error al obtener outfits");
        return await response.json();
    },

    //3 update outfits

    update: async (id, outfitData, token) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(outfitData)
        });
        if (!response.ok) throw new Error(await response.text());
        return true;
    },

    // 4. Eliminar
    delete: async (id, token) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Error al eliminar outfit");
        return true;
    }

};



