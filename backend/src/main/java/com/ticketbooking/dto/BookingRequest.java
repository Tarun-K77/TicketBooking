package com.ticketbooking.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {
    private Long eventId;
    private List<Long> holdIds;
}
