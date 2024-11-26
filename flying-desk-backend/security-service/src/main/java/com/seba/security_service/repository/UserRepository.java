package com.seba.security_service.repository;

import com.seba.security_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.id  = ?1")
    User getUser(Long id);

    boolean existsByEmail(String email);
}
