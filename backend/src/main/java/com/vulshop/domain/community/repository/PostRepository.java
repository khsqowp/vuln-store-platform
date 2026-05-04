package com.vulshop.domain.community.repository;

import com.vulshop.domain.community.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    
    // fetch join을 사용하여 N+1 문제를 방지하며 작성자 정보도 함께 가져옴
    @Query("SELECT p FROM Post p JOIN FETCH p.author ORDER BY p.createdAt DESC")
    List<Post> findAllWithAuthor();
}
