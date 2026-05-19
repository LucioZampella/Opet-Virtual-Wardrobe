package com.virtualwardrobe.backend.models.friends.CRUD;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepositorie  extends JpaRepository<Friend, Long> {

    Optional<List<Friend>> findByFriendId(int friendId);
    Optional<List<Friend>> findByStatus(boolean status);
    Optional<Friend> findById(int friendId);

}
