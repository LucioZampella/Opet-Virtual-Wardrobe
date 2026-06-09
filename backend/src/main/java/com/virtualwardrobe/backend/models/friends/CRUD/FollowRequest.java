package com.virtualwardrobe.backend.models.friends.CRUD;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FollowRequest {
    private int followerId;
    private int followingId;
}
