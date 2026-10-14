package com.project.ecommerce.repository;

import com.project.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;
import com.project.ecommerce.model.UserRole;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPhone(String phone);
    boolean existsByPhone(String phone);
    List<User> findAllByRoleOrderByCreatedAtDesc(UserRole role);
}
