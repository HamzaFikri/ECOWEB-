package com.ecoweb.repository;

import com.ecoweb.model.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PageRepository extends JpaRepository<Page, Long> {
    List<Page> findByProjectId(Long projectId);
}
