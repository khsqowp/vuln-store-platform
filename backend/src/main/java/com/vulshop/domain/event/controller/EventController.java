package com.vulshop.domain.event.controller;

import com.vulshop.common.response.ApiResponse;
import com.vulshop.domain.event.dto.EventResponse;
import com.vulshop.domain.event.service.EventService;
import com.vulshop.infra.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ApiResponse<List<EventResponse>> getEvents() {
        return ApiResponse.ok(eventService.getAllEvents());
    }

    @PostMapping("/{eventId}/participate")
    public ApiResponse<Void> participateEvent(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long eventId) {
        eventService.participateEvent(userDetails.getUserId(), eventId);
        return ApiResponse.ok(null);
    }
}
