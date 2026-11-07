package org.example.stockmarketapi.service;

import java.util.List;
import java.util.Optional;

import org.example.stockmarketapi.entity.User;
import org.example.stockmarketapi.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User create(User user) {
        user.setId(null);
        return userRepository.save(user);
    }
}