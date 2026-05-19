package com.virtualwardrobe.backend.models.gemini;

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
            String requestBody = String.format("""
            {
                "model": "%s",
                "messages": [
                    { "role": "user", "content": %s }
                ]
            }
            """, modelId, objectMapper.writeValueAsString(prompt));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(groqUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            // ← AGREGÁ ESTO para ver qué responde Groq
            System.out.println("STATUS: " + response.statusCode());
            System.out.println("BODY: " + response.body());

            JsonNode json = objectMapper.readTree(response.body());
            return json.get("choices").get(0).get("message").get("content").asText();

        } catch (Exception e) {
            throw new RuntimeException("Error al llamar a Groq: " + e.getMessage(), e);
        }
    }
}