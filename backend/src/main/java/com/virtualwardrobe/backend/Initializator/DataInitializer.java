package com.virtualwardrobe.backend.Initializator;

import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.color.Color;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.color.ColorRepository;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.fit.ClothesFit;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.fit.ClothesFitRepositorie;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.material.ClothesMaterial;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.material.ClothesMaterialRepositorie;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.size.ClothesSize;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.size.ClothesSizeRepositorie;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.type.ClothesType;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.type.ClothesTypeRepositorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired  private ColorRepository c;
    @Autowired  private ClothesTypeRepositorie typeRepo;
    @Autowired  private ClothesSizeRepositorie sizeRepo;
    @Autowired  private ClothesFitRepositorie fitRepo;
    @Autowired  private ClothesMaterialRepositorie materialRepo;


    @Override
    public void run(String... args) throws Exception {

        if(c.count()==0){
            c.saveAll(List.of(
                    new Color("Negro"),
                    new Color("Blanco"),
                    new Color("Gris"),
                    new Color("Beige"),
                    new Color("Crema"),

                    // Colores Vivos
                    new Color("Rojo"),
                    new Color("Azul"),
                    new Color("Amarillo"),
                    new Color("Verde"),
                    new Color("Naranja"),
                    new Color("Violeta"),
                    new Color("Rosa"),

                    // Tonos Específicos (Moda)
                    new Color("Cian"),
                    new Color("Turquesa"),
                    new Color("Burdeos"),
                    new Color("Mostaza"),
                    new Color("Oliva"),
                    new Color("Terracota"),
                    new Color("Celeste"),
                    new Color("Lila"),
                    new Color("Marrón"),
                    new Color("Dorado"),
                    new Color("Plateado")

            ));
        }
        if (typeRepo.count() == 0) {
            typeRepo.saveAll(List.of(
                    new ClothesType(1, "Remera"), new ClothesType(2, "Vestido"),
                    new ClothesType(3, "Zapatillas"), new ClothesType(4, "Zapatos"),
                    new ClothesType(5, "Camisa"), new ClothesType(6, "Pantalón"),
                    new ClothesType(7, "Short"), new ClothesType(8, "Sombrero"),
                    new ClothesType(9, "Top"), new ClothesType(10, "Musculosa"),
                    new ClothesType(11, "Buzo"), new ClothesType(12, "Campera"),
                    new ClothesType(13, "Impermeable"), new ClothesType(14, "Saco"),
                    new ClothesType(15, "Taco"), new ClothesType(16, "Gorra"),
                    new ClothesType(17, "Bufanda"), new ClothesType(18, "Medias"),
                    new ClothesType(19, "Calzas"), new ClothesType(20, "Malla/Traje de baño"),
                    new ClothesType(21, "Cinturón"), new ClothesType(22, "Corbata"),
                    new ClothesType(23, "Guantes"), new ClothesType(24, "Lentes de sol"),
                    new ClothesType(25, "Cartera / Bolso"), new ClothesType(26, "Mochila"),
                    new ClothesType(27, "Sandalias"), new ClothesType(28, "Traje"),
                    new ClothesType(29, "Reloj"), new ClothesType(30, "Pulseras"),
                    new ClothesType(31, "Collares"), new ClothesType(32, "Anillos"),
                    new ClothesType(33, "Brazaletes"), new ClothesType(34, "Aros"),
                    new ClothesType(35, "Cadenas")
            ));
        }

        if (sizeRepo.count() == 0) {
            sizeRepo.saveAll(List.of(
                    new ClothesSize(1, "XXS"), new ClothesSize(2, "XS"),
                    new ClothesSize(3, "S"), new ClothesSize(4, "M"),
                    new ClothesSize(5, "L"), new ClothesSize(6, "XL"),
                    new ClothesSize(7, "XXL"), new ClothesSize(8, "XXXL")
            ));
        }

        if (fitRepo.count() == 0) {
            fitRepo.saveAll(List.of(
                    new ClothesFit(1, "Slim Fit"), new ClothesFit(2, "Regular Fit"),
                    new ClothesFit(3, "Relaxed Fit"), new ClothesFit(4, "Oversize"),
                    new ClothesFit(5, "Cropped"), new ClothesFit(6, "Asimétrico"),
                    new ClothesFit(7, "Skinny"), new ClothesFit(8, "Chupín"),
                    new ClothesFit(9, "Recto"), new ClothesFit(10, "Wide Leg"),
                    new ClothesFit(11, "Palazzo"), new ClothesFit(12, "Oxford"),
                    new ClothesFit(13, "Bootcut"), new ClothesFit(14, "Mom"),
                    new ClothesFit(15, "Boyfriend"), new ClothesFit(16, "Cargo"),
                    new ClothesFit(17, "Jogger"), new ClothesFit(18, "Tiro Alto"),
                    new ClothesFit(19, "Tiro Medio"), new ClothesFit(20, "Tiro Bajo")
            ));
        }

        if (materialRepo.count() == 0) {
            materialRepo.saveAll(List.of(
                    new ClothesMaterial(1, "Algodón"), new ClothesMaterial(2, "Jean/Denim"),
                    new ClothesMaterial(3, "Lana"), new ClothesMaterial(4, "Lino"),
                    new ClothesMaterial(5, "Seda"), new ClothesMaterial(6, "Cuero"),
                    new ClothesMaterial(7, "Cuerina/Eco-cuero"), new ClothesMaterial(8, "Gamuza"),
                    new ClothesMaterial(9, "Terciopelo"), new ClothesMaterial(10, "Satén"),
                    new ClothesMaterial(11, "Encaje"), new ClothesMaterial(12, "Tul"),
                    new ClothesMaterial(13, "Nailon"), new ClothesMaterial(14, "Poliéster"),
                    new ClothesMaterial(15, "Elastano/Lycra"), new ClothesMaterial(16, "Viscosa"),
                    new ClothesMaterial(17, "Polar"), new ClothesMaterial(18, "Gabardina"),
                    new ClothesMaterial(19, "Pana"), new ClothesMaterial(20, "Microfibra"),
                    new ClothesMaterial(21, "Piel sintética"), new ClothesMaterial(22, "Lona"),
                    new ClothesMaterial(23, "Red"), new ClothesMaterial(24, "Goma"),
                    new ClothesMaterial(25, "Plástico"), new ClothesMaterial(26, "Oro"),
                    new ClothesMaterial(27, "Plata"), new ClothesMaterial(28, "Acero quirúrgico"),
                    new ClothesMaterial(29, "Fantasía")
            ));
        }

    }
}
