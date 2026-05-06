package com.vul.shop.domain.community;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "community_comments")
public class CommunityCommentEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "post_id", nullable = false)
	private CommunityPostEntity post;

	@Column(nullable = false, length = 80)
	private String authorNickname;

	@Column(nullable = false, length = 1000)
	private String body;

	@Column(nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	public static CommunityCommentEntity create(CommunityPostEntity post, String authorNickname, String body, LocalDateTime createdAt) {
		CommunityCommentEntity comment = new CommunityCommentEntity();
		comment.post = post;
		comment.authorNickname = authorNickname;
		comment.body = body;
		comment.createdAt = createdAt;
		return comment;
	}

	public Long getId() {
		return id;
	}

	public String getAuthorNickname() {
		return authorNickname;
	}

	public String getBody() {
		return body;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
