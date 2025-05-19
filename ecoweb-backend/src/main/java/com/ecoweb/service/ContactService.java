package com.ecoweb.service;

import com.ecoweb.model.ContactMessage;
import com.ecoweb.repository.ContactMessageRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactMessageRepository contactMessageRepository;
    private final JavaMailSender mailSender;

    @Transactional
    public ContactMessage saveMessage(ContactMessage message) {
        log.info("Saving contact message from: {}", message.getEmail());
        try {
            ContactMessage savedMessage = contactMessageRepository.save(message);
            try {
                sendNotificationEmail(savedMessage);
            } catch (Exception e) {
                log.error("Failed to send notification email, but message was saved: {}", e.getMessage());
                // Ne pas propager l'erreur d'email, car le message a été sauvegardé
            }
            return savedMessage;
        } catch (Exception e) {
            log.error("Error saving contact message: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors de la sauvegarde du message : " + e.getMessage());
        }
    }

    private void sendNotificationEmail(ContactMessage message) {
        try {
            log.info("Sending notification email for message ID: {}", message.getId());
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom("mohammed.hamza.fikri@gmail.com");
            helper.setTo("mohammed.hamza.fikri@gmail.com");
            helper.setSubject("Nouveau message de contact : " + message.getSubject());

            String emailContent = String.format(
                "Nouveau message de contact reçu :\n\n" +
                "De : %s (%s)\n" +
                "Sujet : %s\n\n" +
                "Message :\n%s",
                message.getName(),
                message.getEmail(),
                message.getSubject(),
                message.getMessage()
            );

            helper.setText(emailContent);
            mailSender.send(mimeMessage);
            log.info("Notification email sent successfully for message ID: {}", message.getId());
        } catch (MessagingException e) {
            log.error("Error sending notification email: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors de l'envoi de l'email : " + e.getMessage());
        }
    }
} 