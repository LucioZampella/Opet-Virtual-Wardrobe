package com.virtualwardrobe.backend.models.gemini;

import com.virtualwardrobe.backend.models.clothe.Clothe;
import com.virtualwardrobe.backend.models.clothe.ClotheRepositorie;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.color.Color;
import com.virtualwardrobe.backend.models.user.UserRepositorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroqService {

    @Autowired
    private UserRepositorie userRepo;

    @Autowired
    private ClotheRepositorie clotheRepo;

    @Autowired
    private GroqApiClient apiClient;

    public String getRecommendation(String input, int userId) {
        List<Clothe> clothes = clotheRepo.findByUserId(userId);

        List<Clothe> sorted = getSortedPreferences(clothes);

        StringBuilder clothesTextBuilder = new StringBuilder();
        for (Clothe clothe : sorted) {
            clothesTextBuilder.append("- ").append(clotheToText(clothe)).append("\n");
        }

        String prompt = """
Actúa como un recomendador de outfits automatizado. 
Tu tarea es evaluar el mensaje del usuario y las prendas disponibles para devolver ÚNICAMENTE el outfit recomendado final junto a una breve descripción.

El formato a elegir para la respuestas es el siguiente:
"Outfit recomendado:
    - (prendas que recomendas) (explicacion acotada de porque esa prenda se ajusta al pedido)

REGLAS ESTRICTAS:
- Evaluá el "Mensaje del usuario". Si este mensaje NO es una petición de outfit o ropa para un contexto en especifico (por ejemplo: insultos, charlas informales, preguntas personales, etc..."), respondé ÚNICAMENTE con: "No puedo responderte eso".
- NO incluyas análisis previos de la petición.
- NO listes el análisis de las prendas disponibles por separado.
- NO uses introducciones como "Análisis de la petición:" o "Recomendación basada en...".
- Si es una petición válida, empezá tu respuesta directamente con el título "Outfit Recomendado:".

Mensaje del usuario: "%s"

Datos de las prendas disponibles:
%s
""".formatted(input, clothesTextBuilder.toString());

        return apiClient.sendPropt(prompt);
    }

    public List<Clothe> getSortedPreferences(List<Clothe> clothes) {
        return clothes.stream()
                .sorted((a, b) -> Integer.compare(b.getPreferenceLevel(), a.getPreferenceLevel()))
                .collect(Collectors.toList());
    }

    public String clotheToText(Clothe clothe) {
        String colorsLikeText = "Sin color";

        if (clothe.getColorIds() != null && !clothe.getColorIds().isEmpty()) {
            colorsLikeText = clothe.getColorIds().stream()
                    .map(Color::getId)
                    .map(this::resolveColor)
                    .collect(Collectors.joining(", "));
        }

        return clothe.getName() + " - " + resolveType(clothe.getTypeId()) +
                " - Colores: " + colorsLikeText +
                " - Material: " + resolveMaterial(clothe.getMaterialId()) +
                " - Fit: " + resolveFit(clothe.getFitId()) +
                " - Talle: " + resolveSize(clothe.getSizeId()) +
                " - Preferencia: " + clothe.getPreferenceLevel();
    }

    private String resolveColor(int id) {
        return switch (id) {
            case 1 -> "Negro";
            case 2 -> "Blanco";
            case 3 -> "Gris";
            case 4 -> "Beige";
            case 5 -> "Crema";
            case 6 -> "Rojo";
            case 7 -> "Azul";
            case 8 -> "Amarillo";
            case 9 -> "Verde";
            case 10 -> "Naranja";
            case 11 -> "Violeta";
            case 12 -> "Rosa";
            case 13 -> "Cian";
            case 14 -> "Turquesa";
            case 15 -> "Burdeos";
            case 16 -> "Mostaza";
            case 17 -> "Oliva";
            case 18 -> "Terracota";
            case 19 -> "Celeste";
            case 20 -> "Lila";
            case 21 -> "Marrón";
            case 22 -> "Dorado";
            case 23 -> "Plateado";
            default -> "Desconocido";
        };
    }

    private String resolveType(int id) {
        return switch(id) {
            case 1 -> "Remera";
            case 2 -> "Vestido";
            case 3 -> "Zapatillas";
            case 4 -> "Zapatos";
            case 5 -> "Camisa";
            case 6 -> "Pantalón";
            case 7 -> "Short";
            case 8 -> "Sombrero";
            case 9 -> "Top";
            case 10 -> "Musculosa";
            case 11 -> "Buzo";
            case 12 -> "Campera";
            case 13 -> "Impermeable";
            case 14 -> "Saco";
            case 15 -> "Taco";
            case 16 -> "Gorra";
            case 17 -> "Bufanda";
            case 18 -> "Medias";
            case 19 -> "Calzas";
            case 20 -> "Malla/Traje de baño";
            case 21 -> "Cinturón";
            case 22 -> "Corbata";
            case 23 -> "Guantes";
            case 24 -> "Lentes de sol";
            case 25 -> "Cartera / Bolso";
            case 26 -> "Mochila";
            case 27 -> "Sandalias";
            case 28 -> "Traje";
            case 29 -> "Reloj";
            case 30 -> "Pulseras";
            case 31 -> "Collares";
            case 32 -> "Anillos";
            case 33 -> "Brazaletes";
            case 34 -> "Aros";
            case 35 -> "Cadenas";
            default -> "Desconocido";
        };
    }

    private String resolveMaterial(int id) {
        return switch (id) {
            case 1 -> "Algodón";
            case 2 -> "Jean/Denim";
            case 3 -> "Lana";
            case 4 -> "Lino";
            case 5 -> "Seda";
            case 6 -> "Cuero";
            case 7 -> "Cuerina/Eco-cuero";
            case 8 -> "Gamuza";
            case 9 -> "Terciopelo";
            case 10 -> "Satén";
            case 11 -> "Encaje";
            case 12 -> "Tul";
            case 13 -> "Nailon";
            case 14 -> "Poliéster";
            case 15 -> "Elastano/Lycra";
            case 16 -> "Viscosa";
            case 17 -> "Polar";
            case 18 -> "Gabardina";
            case 19 -> "Pana";
            case 20 -> "Microfibra";
            case 21 -> "Piel sintética";
            case 22 -> "Lona";
            case 23 -> "Red";
            case 24 -> "Goma";
            case 25 -> "Plástico";
            case 26 -> "Oro";
            case 27 -> "Plata";
            case 28 -> "Acero quirúrgico";
            case 29 -> "Fantasía";
            default -> "Desconocido";
        };
    }

    private String resolveFit(int id) {
        return switch(id) {
            case 1 -> "Slim Fit";
            case 2 -> "Regular Fit";
            case 3 -> "Relaxed Fit";
            case 4 -> "Oversize";
            case 5 -> "Cropped";
            case 6 -> "Asimétrico";
            case 7 -> "Skinny";
            case 8 -> "Chupín";
            case 9 -> "Recto";
            case 10 -> "Wide Leg";
            case 11 -> "Palazzo";
            case 12 -> "Oxford";
            case 13 -> "Bootcut";
            case 14 -> "Mom";
            case 15 -> "Boyfriend";
            case 16 -> "Cargo";
            case 17 -> "Jogger";
            case 18 -> "Tiro Alto";
            case 19 -> "Tiro Medio";
            case 20 -> "Tiro Bajo";
            default -> "Desconocido";
        };
    }

    private String resolveSize(int id) {
        return switch(id) {
            case 1 -> "XXS";
            case 2 -> "XS";
            case 3 -> "S";
            case 4 -> "M";
            case 5 -> "L";
            case 6 -> "XL";
            case 7 -> "XXL";
            case 8 -> "XXXL";
            default -> "Desconocido";
        };
    }
}