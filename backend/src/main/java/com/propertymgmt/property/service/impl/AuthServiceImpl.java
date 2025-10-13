package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.config.JwtTokenProvider;
import com.propertymgmt.property.dto.LoginRequest;
import com.propertymgmt.property.dto.LoginResponse;
import com.propertymgmt.property.model.User;
import com.propertymgmt.property.repository.UserRepository;
import com.propertymgmt.property.service.AuthService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(UserRepository userRepository,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public LoginResponse authenticate(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new IllegalArgumentException("用户名或密码错误"));

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new IllegalArgumentException("账号已被停用，请联系管理员");
        }

        user.setLastLoginAt(LocalDateTime.now());

        String token = jwtTokenProvider.generateToken(authentication);
        long expiresIn = jwtTokenProvider.getExpirationMinutes() * 60;
        List<String> roles = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .toList();

        return new LoginResponse(token, "Bearer", expiresIn, user.getUsername(), user.getFullName(), roles);
    }
}
