package com.ecoweb.controller;

import com.ecoweb.model.Result;
import com.ecoweb.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @PostMapping("/analyze/{pageId}")
    public Result analyze(@PathVariable Long pageId) {
        return resultService.analyzePage(pageId);
    }

    @GetMapping("/page/{pageId}")
    public Result getByPage(@PathVariable Long pageId) {
        return resultService.getByPageId(pageId);
    }

}
