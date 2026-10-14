package com.project.ecommerce.service;

import com.project.ecommerce.dto.CustomerResponse;
import com.project.ecommerce.model.UserRole;
import com.project.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class AdminCustomerService {
    private final UserRepository userRepository;

    public AdminCustomerService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<CustomerResponse> findAllCustomers() {
        return userRepository.findAllByRoleOrderByCreatedAtDesc(UserRole.USER).stream()
                .map(user -> new CustomerResponse(user.getId(), user.getName(), user.getPhone(),
                        user.getCity(), user.getRole().name(), user.getOrders().size(), user.getCreatedAt()))
                .toList();
    }
}
