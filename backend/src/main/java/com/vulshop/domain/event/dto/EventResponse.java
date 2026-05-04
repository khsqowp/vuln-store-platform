package com.vulshop.domain.event.dto;

import com.vulshop.domain.event.entity.Event;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private Integer rewardMileage;
    private Integer maxParticipants;
    private Integer currentParticipants;

    public static EventResponse from(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .rewardMileage(event.getRewardMileage())
                .maxParticipants(event.getMaxParticipants())
                .currentParticipants(event.getCurrentParticipants())
                .build();
    }
}
