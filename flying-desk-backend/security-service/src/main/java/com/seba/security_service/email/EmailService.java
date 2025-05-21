package com.seba.security_service.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final String TAG = "EMAIL SERVICE - ";
    private final JavaMailSender mailSender;

    public void createMail(EmailStructure emailStructure, String body) {
        log.info(TAG + "Create mail");
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(emailStructure.getEmail());
        simpleMailMessage.setSubject(emailStructure.getEmailType().getSubject());
        simpleMailMessage.setText(body);

        try {
            log.info(TAG + "Sending email...");
            mailSender.send(simpleMailMessage);
            log.info(TAG + "Email sent successfully to: " + emailStructure.getEmail());
        } catch (Exception e) {
            log.error(TAG + "Failed to send email to: " + emailStructure.getEmail(), e);
        }
    }

    public String createBody(EmailType emailType) {
        log.info(TAG + "Create body");
        return switch (emailType) {
            case ANNOUNCEMENT -> "We have an exciting announcement for you! " +
                    "Stay tuned for more details.";
            case PASSWORD_WAS_CHANGED -> "Your password was successfully changed. " +
                    "If you did not perform this action, please contact support immediately.";
            default -> "No body text available for this email type.";
        };
    }

    public String createBody(EmailType emailType, String link) {
        log.info(TAG + "Create body");
        return switch (emailType) {
            case CONFIRM_EMAIL -> "Thank you for signing up! " +
                    "\nPlease confirm your email by clicking on the link below." +
                    "\n Click: " + link;
            case FORGOT_PASSWORD -> "It seems you have forgotten your password. " +
                    "\nPlease use the link below to reset it." +
                    "\n Click: " + link;
            default -> "No body text available for this email type.";
        };
    }

    public String createHtmlBody(EmailType emailType, String token) {
        log.info(TAG + "Create HTML body");

        // Use frontend URLs for activation and password reset
        String activationLink = "http://localhost:3000/activate/" + token;
        String passwordResetLink = "http://localhost:3000/reset-password/" + token;

        if (emailType == EmailType.CONFIRM_EMAIL) {
            return """
                  <html>
                   <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ECECEC; color: #333;">
                       <div style="max-width: 600px; margin: 20px auto; padding: 20px; background: #fff; border: 1px solid #D9D9D9; border-radius: 8px;">
                           <header style="text-align: center; margin-bottom: 30px;">
                               <h1 style="font-size: 32px; margin: 0; font-weight: 200;">
                               <img src="https://raw.githubusercontent.com/sskk4/flying-desk/refs/heads/master/flying-desk-doc/img/logo.png"/>
                               </h1>
                           </header>
                           <main>
                               <h2 style="font-size: 24px; color: #222;">Welcome!</h2>
                               <p style="font-size: 16px; line-height: 1.5; color: #333;">
                                   Thank you for registering at <strong>Flying Desk</strong>. To activate your account, simply click the button below:
                               </p>
                               <div style="text-align: center; margin: 30px 0;">
                                   <a href="%s" style="display: inline-block;
                                                        padding: 10px 25px;
                                                        font-size: 16px;
                                                        color: #fff;
                                                        background-color: #7360DF;
                                                        text-decoration: none;
                                                        border-radius: 20px;">
                                       Activate Account
                                   </a>
                               </div>
                               <p style="font-size: 14px; color: #AAAAAA;">
                                   If you did not create this account, please disregard this email.
                               </p>
                           </main>
                           <footer style="margin-top: 30px; text-align: center; font-size: 12px; color: #AAAAAA;">
                               <hr style="border: 0; border-top: 1px solid #CBCBCB; margin: 20px 0;">
                               <p style="margin: 0;">Flying Desk - Bringing Ideas to Life</p>
                               <p style="margin: 0;">This is an automated message, please do not reply.</p>
                           </footer>
                       </div>
                   </body>
                   </html>
            """.formatted(activationLink);
        } else if (emailType == EmailType.FORGOT_PASSWORD) {
            return """
                  <html>
                   <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ECECEC; color: #333;">
                       <div style="max-width: 600px; margin: 20px auto; padding: 20px; background: #fff; border: 1px solid #D9D9D9; border-radius: 8px;">
                           <header style="text-align: center; margin-bottom: 30px;">
                               <h1 style="font-size: 32px; margin: 0; font-weight: 200;">
                                   <span style="color: #222;">flying</span><span style="color: #7360DF;">desk</span>
                               </h1>
                           </header>
                           <main>
                               <h2 style="font-size: 24px; color: #222;">Password Reset</h2>
                               <p style="font-size: 16px; line-height: 1.5; color: #333;">
                                   You recently requested to reset your password for your <strong>Flying Desk</strong> account. Click the button below to proceed:
                               </p>
                               <div style="text-align: center; margin: 30px 0;">
                                   <a href="%s" style="display: inline-block;
                                                        padding: 10px 25px;
                                                        font-size: 16px;
                                                        color: #fff;
                                                        background-color: #7360DF;
                                                        text-decoration: none;
                                                        border-radius: 20px;">
                                       Reset Password
                                   </a>
                               </div>
                               <p style="font-size: 14px; color: #AAAAAA;">
                                   If you did not request a password reset, please ignore this email or contact support if you have concerns.
                               </p>
                           </main>
                           <footer style="margin-top: 30px; text-align: center; font-size: 12px; color: #AAAAAA;">
                               <hr style="border: 0; border-top: 1px solid #CBCBCB; margin: 20px 0;">
                               <p style="margin: 0;">Flying Desk - Bringing Ideas to Life</p>
                               <p style="margin: 0;">This is an automated message, please do not reply.</p>
                           </footer>
                       </div>
                   </body>
                   </html>
            """.formatted(passwordResetLink);
        } else if (emailType == EmailType.PASSWORD_WAS_CHANGED) {
            return """
                  <html>
                   <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ECECEC; color: #333;">
                       <div style="max-width: 600px; margin: 20px auto; padding: 20px; background: #fff; border: 1px solid #D9D9D9; border-radius: 8px;">
                           <header style="text-align: center; margin-bottom: 30px;">
                               <h1 style="font-size: 32px; margin: 0; font-weight: 200;">
                                   <span style="color: #222;">flying</span><span style="color: #7360DF;">desk</span>
                               </h1>
                           </header>
                           <main>
                               <h2 style="font-size: 24px; color: #222;">Password Changed</h2>
                               <p style="font-size: 16px; line-height: 1.5; color: #333;">
                                   Your password was successfully changed for your <strong>Flying Desk</strong> account.
                               </p>
                               <p style="font-size: 16px; line-height: 1.5; color: #333;">
                                   If you did not perform this action, please contact support immediately.
                               </p>
                           </main>
                           <footer style="margin-top: 30px; text-align: center; font-size: 12px; color: #AAAAAA;">
                               <hr style="border: 0; border-top: 1px solid #CBCBCB; margin: 20px 0;">
                               <p style="margin: 0;">Flying Desk - Bringing Ideas to Life</p>
                               <p style="margin: 0;">This is an automated message, please do not reply.</p>
                           </footer>
                       </div>
                   </body>
                   </html>
            """;
        }

        return "No HTML body text available for this email type.";
    }

    public void sendHtmlEmail(EmailStructure emailStructure, String body) {
        log.info(TAG + "Create HTML email");
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(emailStructure.getEmail());
            helper.setSubject(emailStructure.getEmailType().getSubject());
            helper.setText(body, true);

            log.info(TAG + "Sending HTML email...");
            mailSender.send(mimeMessage);
            log.info(TAG + "HTML email sent successfully to: " + emailStructure.getEmail());
        } catch (MessagingException e) {
            log.error(TAG + "Failed to send HTML email to: " + emailStructure.getEmail(), e);
        }
    }
}