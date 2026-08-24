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
        String content = "To: " + to + "\nSubject: " + subject + "\n\nYour booking is confirmed!\nReference: " + bookingRef + "\nWe have attached your QR ticket data (Base64 for now):\n" + qrBase64;
        saveEmailLocally(to, subject, content);
    }
    
    public void sendWaitlistOffer(String to, String eventName) {
        String subject = "Tickets Available - Complete Your Booking";
        String content = "To: " + to + "\nSubject: " + subject + "\n\nGood news! Tickets for " + eventName + " are now available. Please log in to complete your booking before the offer expires.";
        saveEmailLocally(to, subject, content);
    }
    
    private void saveEmailLocally(String to, String subject, String content) {
        try {
            java.io.File dir = new java.io.File("outbox");
            if (!dir.exists()) dir.mkdir();
            
            String filename = "outbox/" + System.currentTimeMillis() + "_" + to + ".txt";
            java.nio.file.Files.write(java.nio.file.Paths.get(filename), content.getBytes());
            System.out.println("====== EMAIL SENT ======");
            System.out.println("Saved email to: " + filename);
            System.out.println("Subject: " + subject);
            System.out.println("========================");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
