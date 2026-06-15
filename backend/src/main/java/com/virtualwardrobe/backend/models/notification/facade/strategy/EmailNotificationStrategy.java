package com.virtualwardrobe.backend.models.notification.facade.strategy;

import com.virtualwardrobe.backend.exceptions.UserException.InvalidUserException;
import com.virtualwardrobe.backend.models.user.User;
import com.virtualwardrobe.backend.models.user.UserRepositorie;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class EmailNotificationStrategy implements NotificationStrategy {

    private final JavaMailSender mailSender;

    @Autowired
    private UserRepositorie userRepository;

    public EmailNotificationStrategy(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void notify(int actorId, int ReceiverId, String type, String description) {
        User receiver = userRepository.findById(ReceiverId)
                .orElseThrow(() -> new InvalidUserException("User not found"));

        try {
            MimeMessage message = mailSender.createMimeMessage();
            // Usamos 'false' porque ya NO necesitamos que sea multipart para adjuntar archivos locales
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            helper.setTo(receiver.getEmail());
            helper.setSubject("Nueva notificación en OPET Studio");

            // --- OPCIÓN DEFINITIVA: URL DEL LOGO ---
            // Ponemos una URL directa de tu logo. Podés usar la de tu frontend local (si tenés la imagen en public/logo.png):
            // String logoUrl = "http://localhost:5173/logo.png";
            // O una subida a internet de forma gratuita para que Gmail la renderice al 100% sin bloquearla:
            String logoUrl = "https://i.ibb.co/v4C6Xf2M/opet-cream-and-grey.png";

            String htmlContent =
                    "<html>" +
                            "<body style='margin: 0; padding: 0; background-color: #2a2622; font-family: Arial, sans-serif; color: #e8d5b0;'>" +
                            "  <table align='center' border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px; background-color: #221f1c; margin: 40px auto; border: 1px solid #3a3530;'>" +
                            "    <tr>" +
                            "      <td align='center' style='padding: 40px 0 20px 0; border-bottom: 1px solid #3a3530;'>" +
                            "        " +
                            "        <img src='" + logoUrl + "' alt='OPET Studio' width='150' style='display: block; border: 0;' />" +
                            "      </td>" +
                            "    </tr>" +
                            "    <tr>" +
                            "      <td style='padding: 40px 30px;'>" +
                            "        <h1 style='color: #e8d5b0; font-size: 18px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px;'>¡Hola, @" + receiver.getUsername() + "!</h1>" +
                            "        <p style='color: #8a7d6e; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 0;'>Tienes una nueva actualización</p>" +
                            "        <div style='width: 30px; height: 1px; background-color: #c49a6c; margin: 20px 0;'></div>" +
                            "        <div style='background-color: #1a1816; border: 1px solid #3a3530; padding: 20px; margin-top: 25px;'>" +
                            "          <p style='color: #c49a6c; font-size: 9px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; margin: 0 0 5px 0;'>Tipo de evento</p>" +
                            "          <p style='color: #e8d5b0; font-size: 13px; margin: 0 0 15px 0; font-weight: 300;'>" + type + "</p>" +
                            "          <p style='color: #4a4540; font-size: 9px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; margin: 0 0 5px 0;'>Detalle</p>" +
                            "          <p style='color: #8a7d6e; font-size: 12px; margin: 0; font-style: italic; line-height: 1.5;'>\"" + description + "\"</p>" +
                            "        </div>" +
                            "        <table align='center' border='0' cellpadding='0' cellspacing='0' style='margin-top: 35px;'>" +
                            "          <tr>" +
                            "            <td align='center' style='background-color: #c49a6c;'>" +
                            "              <a href='http://localhost:5173/profile' style='display: inline-block; padding: 12px 35px; color: #221f1c; text-decoration: none; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;'>Ver en la App</a>" +
                            "            </td>" +
                            "          </tr>" +
                            "        </table>" +
                            "      </td>" +
                            "    </tr>" +
                            "    <tr>" +
                            "      <td align='center' style='padding: 20px; background-color: #1a1816; border-top: 1px solid #3a3530;'>" +
                            "        <p style='color: #4a4540; font-size: 8px; letter-spacing: 3px; text-transform: uppercase; margin: 0;'>Estilo Curado • OPET Studio</p>" +
                            "      </td>" +
                            "    </tr>" +
                            "  </table>" +
                            "</body>" +
                            "</html>";

            // Seteamos el contenido HTML
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("¡CORREO ENVIADO CON ÉXITO a: " + receiver.getEmail() + "!");

        } catch (MessagingException e) {
            System.err.println("❌ ERROR DE ESTRUCTURA: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("❌ ERROR GENÉRICO INESPERADO: " + e.getMessage());
            e.printStackTrace();
        }
    }
}