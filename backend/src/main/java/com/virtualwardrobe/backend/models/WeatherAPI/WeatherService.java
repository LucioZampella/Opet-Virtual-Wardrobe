package com.virtualwardrobe.backend.models.WeatherAPI;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;



import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class WeatherService {

    private final String API_KEY = "2589db99f28850742045089cb3aa2594";
    private final RestClient restClient = RestClient.create();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getWeatherSummary(double lat, double lon) {
        try {
            String url = String.format(
                    "https://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&appid=%s&units=metric&lang=es",
                    lat, lon, API_KEY
            );
            String jsonResponse = restClient.get().uri(url).retrieve().body(String.class);
            JsonNode root = objectMapper.readTree(jsonResponse);
            // Extraemos datos específicos para simplificar el prompt de la IA
            double temp = root.path("main").path("temp").asDouble();
            double feelsLike = root.path("main").path("feels_like").asDouble();
            String description = root.path("weather").get(0).path("description").asText();
            String city = root.path("name").asText();

            return String.format("Ciudad: %s, Temperatura: %.1f°C (Sensación térmica: %.1f°C), Estado: %s",
                    city, temp, feelsLike, description);

        } catch (Exception e) {
            System.out.println("--- ERROR AL TRAER EL CLIMA ---");
            e.printStackTrace();

            return "No disponible (usar criterio general de estación).";
        }
    }
}