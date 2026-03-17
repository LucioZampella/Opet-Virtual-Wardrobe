package com.virtualwardrobe.models.user;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.ListCrudRepository;


@Repository
public interface UserRepositorie extends JpaRepository<User, Long>{

}


