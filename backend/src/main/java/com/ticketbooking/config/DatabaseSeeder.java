package com.ticketbooking.config;

import com.ticketbooking.entity.*;
import com.ticketbooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private SeatCategoryRepository seatCategoryRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventSeatRepository eventSeatRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (eventRepository.count() > 0) {
            return; // Already seeded
        }

        // Users
        User organiser = new User();
        organiser.setName("Test Organiser");
        organiser.setEmail("organiser@test.com");
        organiser.setPassword(passwordEncoder.encode("password"));
        organiser.setRole(Role.ORGANISER);
        organiser = userRepository.save(organiser);
        
        User customer = new User();
        customer.setName("Test Customer");
        customer.setEmail("customer@test.com");
        customer.setPassword(passwordEncoder.encode("password"));
        customer.setRole(Role.CUSTOMER);
        customer = userRepository.save(customer);

        // Venues
        Venue stadium = new Venue();
        stadium.setName("National Stadium");
        stadium.setLocation("Mumbai");
        stadium = venueRepository.save(stadium);

        Venue imax = new Venue();
        imax.setName("IMAX Grand");
        imax.setLocation("Delhi");
        imax = venueRepository.save(imax);

        // Categories
        SeatCategory premiumStadium = new SeatCategory();
        premiumStadium.setName("Premium");
        premiumStadium.setVenue(stadium);
        premiumStadium = seatCategoryRepository.save(premiumStadium);

        SeatCategory standardStadium = new SeatCategory();
        standardStadium.setName("Standard");
        standardStadium.setVenue(stadium);
        standardStadium = seatCategoryRepository.save(standardStadium);

        SeatCategory premiumImax = new SeatCategory();
        premiumImax.setName("Premium");
        premiumImax.setVenue(imax);
        premiumImax = seatCategoryRepository.save(premiumImax);

        SeatCategory standardImax = new SeatCategory();
        standardImax.setName("Standard");
        standardImax.setVenue(imax);
        standardImax = seatCategoryRepository.save(standardImax);

        // Seats for Stadium
        createSeats(stadium, premiumStadium, standardStadium);
        // Seats for IMAX
        createSeats(imax, premiumImax, standardImax);

        // Events
        Event coldplay = createEvent("Coldplay - Music of the Spheres", "CONCERT", 
            "Join Coldplay for their spectacular Music of the Spheres World Tour.",
            "/images/concert.jpg",
            stadium, organiser, LocalDate.now().plusDays(30));

        Event inception = createEvent("Inception: IMAX Re-release", "MOVIE", 
            "Experience Christopher Nolan's masterpiece in IMAX.",
            "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
            imax, organiser, LocalDate.now().plusDays(5));

        Event interstellar = createEvent("Interstellar", "MOVIE", 
            "A journey beyond the stars.",
            "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
            imax, organiser, LocalDate.now().plusDays(7));

        Event avatar = createEvent("Avatar: The Way of Water", "MOVIE", 
            "Return to Pandora.",
            "https://upload.wikimedia.org/wikipedia/en/5/54/Avatar_The_Way_of_Water_poster.jpg",
            imax, organiser, LocalDate.now().plusDays(10));

        Event darkKnight = createEvent("The Dark Knight", "MOVIE", 
            "The night is darkest just before the dawn.",
            "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            imax, organiser, LocalDate.now().plusDays(12));

        Event dune = createEvent("Dune: Part Two", "MOVIE", 
            "Long live the fighters.",
            "https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg",
            imax, organiser, LocalDate.now().plusDays(14));

        Event comedy = createEvent("Stand-up Comedy Special", "EVENT", 
            "A night of endless laughter.",
            "/images/event.jpg",
            stadium, organiser, LocalDate.now().plusDays(15));

        // More Movies
        Event oppenheimer = createEvent("Oppenheimer", "MOVIE", 
            "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
            "https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg",
            imax, organiser, LocalDate.now().plusDays(20));

        Event spiderMan = createEvent("Spider-Man: Across the Spider-Verse", "MOVIE", 
            "Miles Morales catapults across the Multiverse.",
            "https://upload.wikimedia.org/wikipedia/en/b/b4/Spider-Man-_Across_the_Spider-Verse_poster.jpg",
            imax, organiser, LocalDate.now().plusDays(21));

        Event johnWick = createEvent("John Wick: Chapter 4", "MOVIE", 
            "John Wick uncovers a path to defeating The High Table.",
            "https://upload.wikimedia.org/wikipedia/en/d/d0/John_Wick_-_Chapter_4_promotional_poster.jpg",
            imax, organiser, LocalDate.now().plusDays(22));

        Event matrix = createEvent("The Matrix Resurrections", "MOVIE", 
            "Return to a world of two realities.",
            "https://upload.wikimedia.org/wikipedia/en/5/50/The_Matrix_Resurrections.jpg",
            imax, organiser, LocalDate.now().plusDays(25));

        Event gladiator = createEvent("Gladiator 2", "MOVIE", 
            "The continuing story of Lucius, the son of Lucilla.",
            "https://upload.wikimedia.org/wikipedia/en/0/04/Gladiator_II_%282024%29_poster.jpg",
            imax, organiser, LocalDate.now().plusDays(30));

        // More Concerts & Events
        Event taylorSwift = createEvent("Taylor Swift - The Eras Tour", "CONCERT", 
            "A journey through the musical eras of Taylor Swift.",
            "/images/concert.jpg",
            stadium, organiser, LocalDate.now().plusDays(40));

        Event edSheeran = createEvent("Ed Sheeran - Mathematics Tour", "CONCERT", 
            "Experience Ed Sheeran live in concert.",
            "/images/concert.jpg",
            stadium, organiser, LocalDate.now().plusDays(45));

        Event foodFest = createEvent("International Food Festival", "EVENT", 
            "Taste culinary masterpieces from around the globe.",
            "/images/festival.jpg",
            stadium, organiser, LocalDate.now().plusDays(10));

        Event techConf = createEvent("Tech Innovators Summit 2026", "EVENT", 
            "The biggest technology conference of the year.",
            "/images/tech.jpg",
            stadium, organiser, LocalDate.now().plusDays(18));

        Event artExhibition = createEvent("Modern Art Exhibition", "EVENT", 
            "Explore contemporary art from emerging artists.",
            "/images/event.jpg",
            stadium, organiser, LocalDate.now().plusDays(25));

        Event hackathon = createEvent("Global Hackathon 2026", "EVENT", 
            "Join developers worldwide to build the future.",
            "/images/tech.jpg",
            stadium, organiser, LocalDate.now().plusDays(35));

        Event weekendFlea = createEvent("Weekend Flea Market", "EVENT", 
            "Discover vintage clothing, handmade crafts, and more.",
            "/images/festival.jpg",
            stadium, organiser, LocalDate.now().plusDays(4));
            
        Event magicShow = createEvent("Grand Magic Illusion Show", "EVENT", 
            "A mind-bending evening of magic and illusions.",
            "/images/event.jpg",
            stadium, organiser, LocalDate.now().plusDays(28));

        // Create EventSeats
        createEventSeats(coldplay, 500.0, 250.0);
        createEventSeats(inception, 300.0, 150.0);
        createEventSeats(interstellar, 300.0, 150.0);
        createEventSeats(avatar, 350.0, 200.0);
        createEventSeats(darkKnight, 300.0, 150.0);
        createEventSeats(dune, 350.0, 200.0);
        createEventSeats(comedy, 200.0, 100.0);
        createEventSeats(oppenheimer, 350.0, 200.0);
        createEventSeats(spiderMan, 300.0, 150.0);
        createEventSeats(johnWick, 300.0, 150.0);
        createEventSeats(matrix, 300.0, 150.0);
        createEventSeats(gladiator, 350.0, 200.0);
        createEventSeats(taylorSwift, 600.0, 300.0);
        createEventSeats(edSheeran, 450.0, 250.0);
        createEventSeats(foodFest, 100.0, 50.0);
        createEventSeats(techConf, 1000.0, 500.0);
        createEventSeats(artExhibition, 150.0, 80.0);
        createEventSeats(hackathon, 50.0, 20.0);
        createEventSeats(weekendFlea, 50.0, 20.0);
        createEventSeats(magicShow, 250.0, 120.0);
    }

    private void createSeats(Venue venue, SeatCategory premium, SeatCategory standard) {
        String[] rows = {"A", "B", "C", "D", "E"};
        for (String row : rows) {
            for (int i = 1; i <= 8; i++) {
                Seat seat = new Seat();
                seat.setVenue(venue);
                seat.setRow(row);
                seat.setNumber(String.valueOf(i));
                seat.setActive(true);
                if (row.equals("A") || row.equals("B")) {
                    seat.setCategory(premium);
                } else {
                    seat.setCategory(standard);
                }
                seatRepository.save(seat);
            }
        }
    }

    private Event createEvent(String name, String type, String desc, String img, Venue venue, User organiser, LocalDate date) {
        Event event = new Event();
        event.setName(name);
        event.setType(type);
        event.setDescription(desc);
        event.setCoverImageUrl(img);
        event.setDate(date);
        event.setStartTime(java.time.LocalTime.of(19, 30));
        event.setEndTime(java.time.LocalTime.of(22, 30));
        event.setVenue(venue);
        event.setOrganiser(organiser);
        return eventRepository.save(event);
    }

    private void createEventSeats(Event event, double premiumPrice, double standardPrice) {
        List<Seat> seats = seatRepository.findByVenueId(event.getVenue().getId());
        for (Seat seat : seats) {
            EventSeat es = new EventSeat();
            es.setEvent(event);
            es.setSeat(seat);
            es.setStatus("AVAILABLE");
            if (seat.getCategory().getName().equals("Premium")) {
                es.setPrice(premiumPrice);
            } else {
                es.setPrice(standardPrice);
            }
            eventSeatRepository.save(es);
        }
    }
}
