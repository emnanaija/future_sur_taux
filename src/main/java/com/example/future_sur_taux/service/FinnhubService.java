package com.example.future_sur_taux.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class FinnhubService {

    private static final String API_URL = "https://finnhub.io/api/v1/quote";
    private static final String API_KEY = "d3ub6h9r01qvr0dmcch0d3ub6h9r01qvr0dmcchg"; // Remplace par ta clé
    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, BigDecimal> getMarketPrices(String[] symbols) {
        Map<String, BigDecimal> prices = new HashMap<>();

        for (String symbol : symbols) {
            try {
                String url = UriComponentsBuilder.fromHttpUrl(API_URL)
                        .queryParam("symbol", symbol)
                        .queryParam("token", API_KEY)
                        .toUriString();

                Map<String, Object> response = restTemplate.getForObject(url, Map.class);
                if (response != null && response.get("c") != null) {
                    BigDecimal price = new BigDecimal(response.get("c").toString());
                    prices.put(symbol, price);
                } else {
                    prices.put(symbol, null);
                }
            } catch (Exception e) {
                e.printStackTrace();
                prices.put(symbol, null);
            }
        }

        return prices;
    }
}
