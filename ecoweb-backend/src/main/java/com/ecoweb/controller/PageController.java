package com.ecoweb.controller;

import com.ecoweb.model.Page;
import com.ecoweb.model.Result;
import com.ecoweb.model.Project;
import com.ecoweb.repository.PageRepository;
import com.ecoweb.repository.ProjectRepository;
import com.ecoweb.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/pages")
public class PageController {

    @Autowired
    private PageRepository pageRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ResultRepository resultRepository;

    @PostMapping("/project/{projectId}")
    public Page createPage(@PathVariable Long projectId, @RequestBody Page page) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        page.setProject(project);
        return pageRepository.save(page);
    }

    @GetMapping("/project/{projectId}")
    public List<Page> getPagesByProject(@PathVariable Long projectId) {
        return pageRepository.findByProjectId(projectId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePage(@PathVariable Long id) {
        try {
            // Delete associated result first if it exists
            Result result = resultRepository.findByPageId(id);
            if (result != null) {
                resultRepository.delete(result);
            }
            pageRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }







}
