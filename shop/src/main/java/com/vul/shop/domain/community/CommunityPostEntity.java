package com.vul.shop.domain.community;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "community_posts")
public class CommunityPostEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 160)
	private String title;

	@Column(nullable = false, length = 4000)
	private String body;

	@Column(nullable = false, length = 80)
	private String authorNickname;

	@Column(length = 1000)
	private String imageUrl;

	private Integer likeCount = 0;

	@Column(nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	@OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CommunityCommentEntity> comments = new ArrayList<>();

	public static CommunityPostEntity create(String title, String body, String authorNickname, String imageUrl, Integer likeCount, LocalDateTime createdAt) {
		CommunityPostEntity post = new CommunityPostEntity();
		post.title = title;
		post.body = body;
		post.authorNickname = authorNickname;
		post.imageUrl = imageUrl;
		post.likeCount = likeCount;
		post.createdAt = createdAt;
		return post;
	}

	public void addComment(String authorNickname, String body, LocalDateTime createdAt) {
		this.comments.add(CommunityCommentEntity.create(this, authorNickname, body, createdAt));
	}

	public Long getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public String getBody() {
		return body;
	}

	public String getAuthorNickname() {
		return authorNickname;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public Integer getLikeCount() {
		return likeCount;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public List<CommunityCommentEntity> getComments() {
		return comments;
	}
}
