package com.ticketbooking.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@Data
public class EventRequest {
    private String name;
    private String type;
    private String description;
    private String coverImageUrl;
    private Long venueId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Map<Long, Double> categoryPrices; // categoryId -> price
}
