package com.ecoweb.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double co2Emission;
    private double pageWeight;
    private int httpsRequests;
    private boolean greenHosting;
    private double score;

    // remove bach ikhdem


    @OneToOne
    @JsonBackReference               // hadi nheyedha bach ikhdem kif9bel
    private Page page;

    // Getters & Setters
    public Long getId() { return id; }

    public double getCo2Emission() { return co2Emission; }
    public void setCo2Emission(double co2Emission) { this.co2Emission = co2Emission; }

    public double getPageWeight() { return pageWeight; }
    public void setPageWeight(double pageWeight) { this.pageWeight = pageWeight; }

    public int getHttpsRequests() { return httpsRequests; }
    public void setHttpsRequests(int httpsRequests) { this.httpsRequests = httpsRequests; }

    public boolean isGreenHosting() { return greenHosting; }
    public void setGreenHosting(boolean greenHosting) { this.greenHosting = greenHosting; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public Page getPage() { return page; }
    public void setPage(Page page) { this.page = page; }
}
