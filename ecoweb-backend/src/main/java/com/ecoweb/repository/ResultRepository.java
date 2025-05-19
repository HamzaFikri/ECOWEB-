package com.ecoweb.repository;

import com.ecoweb.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultRepository extends JpaRepository<Result, Long> {
    Result findByPage_Id(Long pageId);
    Result findByPageId(Long pageId);



}




//package com.ecoweb.repository;
//import com.ecoweb.model.Result;
//import com.ecoweb.model.Page;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public interface ResultRepository extends JpaRepository<Result, Long> {
//
//    // Trouver le résultat par la page
//    Result findByPage(Page page);
//
//    // Trouver le résultat par l'ID de la page
//    Result findByPageId(Long pageId);
//}


