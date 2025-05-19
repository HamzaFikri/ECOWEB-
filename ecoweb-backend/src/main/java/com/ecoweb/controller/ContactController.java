package com.ecoweb.controller;

import com.ecoweb.model.ContactMessage;
import com.ecoweb.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {
    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<?> sendMessage(@Valid @RequestBody ContactMessage message) {
        log.info("Received contact message request: {}", message);
        try {
            ContactMessage savedMessage = contactService.saveMessage(message);
            log.info("Message saved successfully with ID: {}", savedMessage.getId());
            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            log.error("Error processing contact message: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur lors de l'envoi du message : " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        log.error("Validation error: {}", ex.getMessage());
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
            log.error("Field: {}, Error: {}", fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }
} 