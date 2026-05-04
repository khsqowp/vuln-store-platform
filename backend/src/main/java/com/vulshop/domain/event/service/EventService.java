package com.vulshop.domain.event.service;

import com.vulshop.common.exception.CustomException;
import com.vulshop.common.exception.ErrorCode;
import com.vulshop.domain.event.dto.EventResponse;
import com.vulshop.domain.event.entity.Event;
import com.vulshop.domain.event.entity.EventParticipation;
import com.vulshop.domain.event.repository.EventParticipationRepository;
import com.vulshop.domain.event.repository.EventRepository;
import com.vulshop.domain.user.entity.User;
import com.vulshop.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventParticipationRepository eventParticipationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(EventResponse::from)
                .collect(Collectors.toList());
    }

    // 취약점 49 (동시성 제어 누락 - Race Condition): 
    // 이벤트 참여 시 synchronized나 DB Lock(Pessimistic/Optimistic)이 없어
    // 동시에 여러 요청을 보내면 1인 1회 제한이나 선착순 인원을 초과하여 마일리지 중복 획득 가능.
    @Transactional
    public void participateEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "이벤트를 찾을 수 없습니다."));

        if (eventParticipationRepository.existsByEventIdAndUserId(eventId, userId)) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "이미 참여한 이벤트입니다.");
        }

        if (event.getCurrentParticipants() >= event.getMaxParticipants()) {
            throw new CustomException(ErrorCode.BAD_REQUEST, "선착순 모집이 마감되었습니다.");
        }

        // 인원 증가 및 참여 이력 저장
        event.incrementParticipants();
        eventParticipationRepository.save(new EventParticipation(event, user));

        // 마일리지 지급 (동시성 취약점으로 인해 무한 증식 가능)
        user.addMileage(event.getRewardMileage());
    }
}
