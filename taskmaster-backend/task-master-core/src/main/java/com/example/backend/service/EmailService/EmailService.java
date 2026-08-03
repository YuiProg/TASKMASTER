package com.example.backend.service.EmailService;

import com.example.backend.model.EmailTemplate;
import com.example.backend.repository.EmailTemplateRepository;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final EmailTemplateRepository templateRepository;

    @Value("${RESEND_API_KEY:}")
    private String resendApiKey;

    @Value("${RESEND_FROM_EMAIL:onboarding@resend.dev}")
    private String fromEmail;

    @Async
    public void sendTemplatedEmail(String toEmail, String templateCode, Map<String, String> variables) {
        if (!isApiKeyConfigured()) return;

        EmailTemplate template = templateRepository.findByTemplateCode(templateCode)
                .orElseThrow(() -> new RuntimeException("Email template not found for code: " + templateCode));

        String subject = template.getSubject();
        String htmlBody = template.getBodyHtml();

        if (variables != null) {
            for (Map.Entry<String, String> entry : variables.entrySet()) {
                String placeholder = "{{" + entry.getKey() + "}}";
                String value = entry.getValue() != null ? entry.getValue() : "";

                subject = subject.replace(placeholder, value);
                htmlBody = htmlBody.replace(placeholder, value);
            }
        }

        sendHtmlEmail(toEmail, subject, htmlBody);
    }

    @Async
    public void sendSimpleEmail(String toEmail, String subject, String body) {
        if (!isApiKeyConfigured()) return;

        Resend resend = new Resend(resendApiKey);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(fromEmail)
                .to(toEmail)
                .subject(subject)
                .text(body)
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(params);
            System.out.println("Email sent successfully via Resend API. ID: " + response.getId());
        } catch (ResendException e) {
            System.err.println("Resend API Error (Simple Email): " + e.getMessage());
        }
    }

    @Async
    public void sendHtmlEmail(String toEmail, String subject, String htmlBody) {
        if (!isApiKeyConfigured()) return;

        Resend resend = new Resend(resendApiKey);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(fromEmail)
                .to(toEmail)
                .subject(subject)
                .html(htmlBody)
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(params);
            System.out.println("HTML Email sent successfully via Resend API. ID: " + response.getId());
        } catch (ResendException e) {
            System.err.println("Resend API Error (HTML Email): " + e.getMessage());
        }
    }

    private boolean isApiKeyConfigured() {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            System.err.println("RESEND_API_KEY is missing! Skipping email dispatch.");
            return false;
        }
        return true;
    }
}