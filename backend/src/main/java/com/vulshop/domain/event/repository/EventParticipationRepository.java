package com.vulshop.domain.event.repository;

import com.vulshop.domain.event.entity.EventParticipation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventParticipationRepository extends JpaRepository<EventParticipation, Long> {
    boolean existsByEventIdAndUserId(Long eventId, Long userId);
}
