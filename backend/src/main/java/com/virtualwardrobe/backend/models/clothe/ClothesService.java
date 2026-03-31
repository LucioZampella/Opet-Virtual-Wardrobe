package com.virtualwardrobe.backend.models.clothe;

import com.virtualwardrobe.backend.models.user.UserRepositorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class ClothesService {

    @Autowired
    private ClothesRepositorie repo;
    private UserRepositorie repoUsuario;

    public Clothes crear(Clothes clothes) {

        return repo.save(clothes);
    }

    public Clothes modificar(int id,Clothes clothes) {

        Clothes c= repo.findById(id).orElseThrow(() -> new RuntimeException("Error 404: prenda no encontrada"));
        c.setName(clothes.getName());
        c.setFit_id(clothes.getFit_id());
        c.setImage_url(clothes.getImage_url());
        c.setMaterial_id(clothes.getMaterial_id());
        c.setPreference_level(clothes.getPreference_level());
        c.setSize_id(clothes.getSize_id());
        c.setType_id(clothes.getType_id());
        c.setUrl_model(clothes.getUrl_model());
        return repo.save(c);
    }
    public List<Clothes> listarMisPrendas() {
        return repo.findAll();
    }

    public Clothes buscarPorId(int id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Error 404: prenda no encontrada"));
    }
    public void eliminar(int id) {
        if (repo.findById(id).isEmpty()) {
            throw new RuntimeException("Error 404: prenda no encontrado");
        }
        repo.deleteById(id);
    }

    public List<Clothes> listarPrendasDeUsario(int id){
        if (repoUsuario.findById(id).isEmpty()) {
            throw new RuntimeException("Error 404: usuario no encontrada");
        }
        return repo.listarPrendasDeUsuario(id);
    }
}
