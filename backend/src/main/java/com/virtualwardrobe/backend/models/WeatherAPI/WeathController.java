package com.virtualwardrobe.backend.models.WeatherAPI;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/weather")
public class WeathController {

    @Autowired
    private WeatherService weatherService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/feed-summary")
    public ResponseEntity<Map<String, Object>> getWeatherForFeed(@RequestParam double lat, @RequestParam double lon) {
        try {
            // 1. Obtenemos el JSON crudo desde tu servicio centralizado
            String jsonResponse = weatherService.getRawWeather(lat, lon);

            JsonNode root = objectMapper.readTree(jsonResponse);

            // 2. Extraemos la temperatura
            double temp = root.path("main").path("temp").asDouble();

            // 3. Extraemos el ID del clima
            int weatherId = root.path("weather").get(0).path("id").asInt();

            // CORRECCIÓN: Llamamos al método local de esta clase con 'this'
            String emoji = this.obtenerEmojiClima(weatherId);

            // 4. Extraemos la descripción
            String descripcion = root.path("weather").get(0).path("description").asText();

            // 5. Armamos la respuesta para el front
            Map<String, Object> response = Map.of(
                    "temperatura", String.format("%.1f°C", temp),
                    "emoji", emoji,
                    "estado", descripcion
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Imprimimos el error real en la consola de IntelliJ para saber si pasa otra cosa
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "temperatura", "--°C",
                    "emoji", "🤷‍♂️",
                    "estado", "No disponible"
            ));
        }
    }

    // Agregamos el método que se había perdido para mapear los emojis
    private String obtenerEmojiClima(int weatherId) {
        if (weatherId >= 200 && weatherId < 300) return "⛈️"; // Tormenta
        if (weatherId >= 300 && weatherId < 400) return "🌧️";  // Llovizna
        if (weatherId >= 500 && weatherId < 600) return "☔";  // Lluvia
        if (weatherId >= 600 && weatherId < 700) return "❄️";  // Nieve
        if (weatherId >= 700 && weatherId < 800) return "🌫️";  // Niebla
        if (weatherId == 800) return "☀️";                     // Sol
        if (weatherId > 800) return "☁️";                      // Nubes
        return "🌡️";
    }
}