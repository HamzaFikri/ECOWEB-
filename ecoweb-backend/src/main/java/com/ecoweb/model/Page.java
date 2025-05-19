package com.ecoweb.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Page {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    @ManyToOne
    private Project project;


    //******************* hadi t7eyed bach irje3 ikhdem


//    @OneToOne(mappedBy = "page", cascade = CascadeType.ALL)
//    @JsonManagedReference
//    private Result result;
//
//    public Result getResult() {
//        return result;
//    }
//
//    public void setResult(Result result) {
//        this.result = result;
//    }


//**************************************************






    // Getters & setters
    public Long getId() { return id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
}
