package br.com.empresa_area.ms_auth.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmail(String email, String password) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("Bem-vindo(a) à nossa plataforma!");
            helper.setText(corpoEmail(password));
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar email para " + email, e);
        }
    }

    private String corpoEmail(String password) {
        return new StringBuilder()
            .append("Olá!\n\n")
            .append("Sua conta foi criada com sucesso.\n")
            .append("Sua senha temporária é: ")
            .append(password)
            .toString();
    }
}