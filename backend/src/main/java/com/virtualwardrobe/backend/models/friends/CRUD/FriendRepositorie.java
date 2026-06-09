package com.virtualwardrobe.backend.models.friends.CRUD;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepositorie  extends JpaRepository<Follower, Long> {

    List<Follower> findByFollowerId(int friendId);
    Optional<Follower> findById(int friendId);
    Optional<Follower> findByFollowerIdAndFollowingId(int userId, int friendId);
    @Query("SELECT f FROM Follower f WHERE f.status = true AND f.follower.id = :userId")
    List<Follower> findAllFriendsOfUser(@Param("userId") int userId);
    boolean existsByFollowerIdAndFollowingId(int followerId, int followingId);

}
