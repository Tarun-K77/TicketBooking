package com.ticketbooking.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender emailSender;

    public void sendBookingConfirmation(String to, String eventName, String bookingRef, String qrBase64) {
        String subject = "Booking Confirmed - " + eventName;
        String content = "Your booking is confirmed!\nReference: " + bookingRef + "\nWe have attached your QR ticket data (Base64 for now):\n" + qrBase64;
        sendRealEmail(to, subject, content);
    }
    
    public void sendWaitlistOffer(String to, String eventName) {
        String subject = "Tickets Available - Complete Your Booking";
        String content = "Good news! Tickets for " + eventName + " are now available. Please log in to complete your booking before the offer expires.";
        sendRealEmail(to, subject, content);
    }
    
    private void sendRealEmail(String to, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@showpass.com"); // Usually overridden by SMTP server
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            emailSender.send(message);
            System.out.println("====== REAL EMAIL SENT ======");
            System.out.println("To: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("========================");
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ". Please check your SMTP configuration in application.properties or environment variables.");
            e.printStackTrace();
        }
    }
}
