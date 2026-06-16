package com.virtualwardrobe.backend.models.friends.CRUD;

import com.virtualwardrobe.backend.models.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepositorie  extends JpaRepository<Follower, Long> {

    List<Follower> findByFollowerId(int friendId);
    List<Follower> findByFollowingId(int userId);
    Optional<Follower> findById(int friendId);
    Optional<Follower> findByFollowerIdAndFollowingId(int userId, int friendId);

    @Query("SELECT f.following FROM Follower f WHERE f.follower.id = :userId AND " +
            "EXISTS (SELECT f2 FROM Follower f2 WHERE f2.follower.id = f.following.id AND f2.following.id = :userId)")
    List<User> findAllFriendsOfUser(@Param("userId") int userId);
    boolean existsByFollowerIdAndFollowingId(int followerId, int followingId);

}
