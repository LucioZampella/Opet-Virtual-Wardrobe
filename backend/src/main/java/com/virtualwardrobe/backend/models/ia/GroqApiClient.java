package com.virtualwardrobe.backend.models.ia;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Component
public class GroqApiClient {

    @Value("${groq.api.key}")
    private String apiKey;

    // Cambiado a Llama 3.3 o 3.1 estándar si el "instant" te genera demasiado formateo extraño
    private final String modelId = "llama-3.1-8b-instant";
    private final String groqUrl = "https://api.groq.com/openai/v1/chat/completions";

    private HttpClient httpClient;
    private ObjectMapper objectMapper;

    @PostConstruct
    public void init() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public String sendPropt(String prompt) {
        try {

            String requestBody = objectMapper.createObjectNode()
                    .put("model", modelId)
                    .put("temperature", 0.1)
                    .set("messages", objectMapper.createArrayNode()
                            .add(objectMapper.createObjectNode()
                                    .put("role", "user")
                                    .put("content", prompt)))
                    .toString();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(groqUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("STATUS: " + response.statusCode());
            System.out.println("BODY: " + response.body());

            JsonNode json = objectMapper.readTree(response.body());

            if (response.statusCode() == 200) {
                if (json.has("choices") && json.get("choices").isArray() && json.get("choices").size() > 0) {
                    return json.get("choices").get(0).get("message").get("content").asText();
                }
                throw new RuntimeException("Estructura de respuesta inesperada de Groq.");
            } else {
                // Si da 401, 400, etc., exponemos el error real en la consola
                String errorMsg = json.has("error") ? json.get("error").get("message").asText() : "Error desconocido";
                throw new RuntimeException("Groq API Error (" + response.statusCode() + "): " + errorMsg);
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al llamar a Groq: " + e.getMessage(), e);
        }
    }
}