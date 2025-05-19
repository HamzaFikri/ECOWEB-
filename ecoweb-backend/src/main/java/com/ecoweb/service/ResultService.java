package com.ecoweb.service;

import com.ecoweb.model.Page;
import com.ecoweb.model.Result;
import com.ecoweb.repository.PageRepository;
import com.ecoweb.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;

@Service
public class ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private PageRepository pageRepository;

//    public Result analyzePage(Long pageId) {
//        Page page = pageRepository.findById(pageId).orElse(null);
//
//        if (page == null || page.getUrl() == null || page.getUrl().isEmpty()) {
//            System.out.println("❌ Page introuvable ou URL vide.");
//            return null;
//        }
//
//        String apiUrl = "https://api.websitecarbon.com/site?url=" + page.getUrl();
//        System.out.println("🔍 Analyzing: " + apiUrl);
//
//        try {
//            RestTemplate restTemplate = new RestTemplate();
//            String json = restTemplate.getForObject(apiUrl, String.class);
//
//            JSONObject response = new JSONObject(json);
//            JSONObject stats = response.getJSONObject("statistics");
//            JSONObject co2 = stats.getJSONObject("co2");
//
//            // ✅ Corrigé ici : lire grams depuis co2.grid
//            double co2GridGrams = co2.getJSONObject("grid").getDouble("grams");
//            double adjustedBytes = stats.getDouble("adjustedBytes");
//
//            Result result = new Result();
//            result.setPage(page);
//            result.setCo2Emission(co2GridGrams);
//            result.setPageWeight(adjustedBytes / 1024);
//            result.setGreenHosting(response.getBoolean("green"));
//            result.setHttpsRequests(0);
//            result.setScore(100 - (co2GridGrams * 100));
//
//            System.out.println("✅ Analyse OK : " + co2GridGrams + " g CO2");
//
//            return resultRepository.save(result);
//
//        } catch (Exception e) {
//            System.out.println("❌ Analyse échouée : " + e.getMessage());
//            e.printStackTrace();
//            return null;
//        }
//    }

    public Result getByPageId(Long pageId) {
        return resultRepository.findByPageId(pageId);
    }


    public Result analyzePage(Long pageId) {
        Page page = pageRepository.findById(pageId).orElse(null);

        if (page == null || page.getUrl() == null || page.getUrl().isEmpty()) {
            System.out.println("❌ Page introuvable ou URL vide.");
            return null;
        }

        String apiUrl = "https://api.websitecarbon.com/site?url=" + page.getUrl();
        System.out.println("🔍 Analyzing: " + apiUrl);

        try {
            RestTemplate restTemplate = new RestTemplate();
            String json = restTemplate.getForObject(apiUrl, String.class);

            JSONObject response = new JSONObject(json);
            JSONObject stats = response.getJSONObject("statistics");
            JSONObject co2 = stats.getJSONObject("co2");

            double co2Grid = co2.getJSONObject("grid").getDouble("grams"); // ✅ Corrigé ici
            double adjustedBytes = stats.getDouble("adjustedBytes");
            boolean green = false;
            if (response.has("green") && !response.isNull("green")) {
                try {
                    green = response.getBoolean("green");
                } catch (Exception e) {
                    green = false;
                }
            }

            Result result = new Result();
            result.setPage(page);
            result.setCo2Emission(co2Grid);
            result.setPageWeight(adjustedBytes / 1024); // en Ko
            result.setGreenHosting(green);
            result.setHttpsRequests(0); // à implémenter si tu veux
            result.setScore(100 - (co2Grid * 100));

            System.out.println("✅ Analyse réussie : " + co2Grid + " gCO2");

            return resultRepository.save(result);

        } catch (Exception e) {
            System.out.println("❌ Analyse échouée : " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

}
