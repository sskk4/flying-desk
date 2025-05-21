package com.seba.security_service.service;

import com.seba.security_service.email.EmailService;
import com.seba.security_service.email.EmailStructure;
import com.seba.security_service.email.EmailType;
import com.seba.security_service.exception.error.AccountNotActivatedException;
import com.seba.security_service.exception.error.ObjectAlreadyExistException;
import com.seba.security_service.exception.error.ResourceNotFoundException;
import com.seba.security_service.exception.error.UserFailedAuthentication;
import com.seba.security_service.model.RefreshToken;
import com.seba.security_service.repository.RefreshTokenRepository;
import com.seba.security_service.model.Role;
import com.seba.security_service.model.User;
import com.seba.security_service.repository.UserRepository;
import com.seba.security_service.security.request.*;
import com.seba.security_service.security.response.AuthenticationResponse;
import com.seba.security_service.security.response.RefreshTokenResponse;
import com.seba.security_service.security.response.RegisterResponse;
import com.seba.security_service.security.response.UserInformationResponse;
import com.seba.security_service.util.SecurityUtils;
import com.seba.security_service.security.CustomPrincipal;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final String TAG = "AUTHENTICATION SERVICE - ";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        log.info(TAG + "Create new user");

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ObjectAlreadyExistException("User with email: {} is already exist");
        }

        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .isActive(false)
                .role(Role.USER)
                .build();

        userRepository.save(user);
        RefreshToken refreshToken = refreshTokenService.generateRefreshToken(user);

        // Generowanie linku aktywacyjnego
        String activationLink = "http://localhost:3000/activate/" + refreshToken.getToken();

        // Wysyłanie maila z przyciskiem aktywacyjnym
        emailService.sendHtmlEmail(
                EmailStructure.builder()
                        .email(user.getEmail())
                        .emailType(EmailType.CONFIRM_EMAIL)
                        .build(),
                emailService.createHtmlBody(EmailType.CONFIRM_EMAIL, activationLink)
        );

        return RegisterResponse.builder()
                .isActive(request.isActive())
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .role(Role.USER)
                .build();
    }

    public void activate(String token) {
        log.info(TAG + "Activate user");

        RefreshToken refreshToken = refreshTokenService.getTokenByToken(UUID.fromString(token))
                .orElseThrow(() -> new ResourceNotFoundException("Invalid token"));
        User user = refreshToken.getUser();
        user.setActive(true);
        refreshTokenService.deleteRefreshToken(user);
        userRepository.save(user);
    }

    @SneakyThrows
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        log.info(TAG + "Authenticate");

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        if (!user.isActive()) {
            throw new AccountNotActivatedException("User account is not activated");
        }

        return getAuthDto(user);
    }

    public void logout(CustomPrincipal principal) {
        log.info(TAG + "Logging out user {}", principal.getName());

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserFailedAuthentication("Authentication failed"));
        refreshTokenService.deleteRefreshToken(user);
        SecurityContextHolder.clearContext();
        log.info(TAG + "logged out user {}", principal.getName());
    }

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {
        log.info(TAG + "Refresh access and refresh tokens for user: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserFailedAuthentication("Authentication failed"));

        if(!refreshTokenService.checkIfTokenValid(UUID.fromString(request.getRefreshToken()), user))
            throw new UserFailedAuthentication("Authentication failed");

        refreshTokenService.deleteRefreshToken(user);

        String jwtToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.generateRefreshToken(user);

        return RefreshTokenResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    public void changePassword(PasswordChangeRequest request, CustomPrincipal principal) {
        log.info(TAG + "Change password for user {}", principal.getName());

        User user = userRepository.getUser(principal.getUserId());
        if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword()))
            throw new UserFailedAuthentication("Password does not match");
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private AuthenticationResponse getAuthDto(User user) {
        log.info(TAG + "Get authentication dto for user with email: {}", user.getEmail());

        refreshTokenService.deleteRefreshToken(user);

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getId())
                .role(user.getRole().name())
                .build();
    }


    @SneakyThrows
    public void forgotPassword(String email) {
        log.info(TAG + "Forgot password for user {}", email);

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserFailedAuthentication("user not found"));
        refreshTokenService.deleteRefreshToken(user);
        RefreshToken refreshToken = refreshTokenService.generateRefreshToken(user);

        emailService.sendHtmlEmail(
                EmailStructure.builder()
                        .email(user.getEmail())
                        .emailType(EmailType.FORGOT_PASSWORD)
                        .build(),
                emailService.createHtmlBody(EmailType.FORGOT_PASSWORD, refreshToken.getToken().toString())
        );
    }

    @SneakyThrows
    public void recoveryPassword(String token, String password) {
        log.info(TAG + "Recovery password for user with token: {}", token);

        RefreshToken tokenFromDB = refreshTokenService.getTokenByToken(UUID.fromString(token))
                .orElseThrow(() -> new UserFailedAuthentication("Authentication failed"));

        var user = userRepository.findById(tokenFromDB.getUser().getId())
                .orElseThrow(() -> new UserFailedAuthentication("user not found"));

        refreshTokenService.deleteRefreshToken(user);

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        emailService.sendHtmlEmail(
                EmailStructure.builder()
                        .email(user.getEmail())
                        .emailType(EmailType.PASSWORD_WAS_CHANGED)
                        .build(),
                emailService.createHtmlBody(EmailType.PASSWORD_WAS_CHANGED, null)
        );
    }

    public void updateUserRole(Long userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserFailedAuthentication("User not found"));
        user.setRole(role);
        userRepository.save(user);
    }

    public boolean isEmailTaken(String email) {
        log.info("Checking if email is already taken: {}", email);
        return userRepository.findByEmail(email).isPresent();
    }

    public UserInformationResponse getCurrentUser(CustomPrincipal principal) {

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserFailedAuthentication("Authentication failed"));

        return UserInformationResponse.builder()
                .firstName(user.getFirstname())
                .lastName(user.getLastname())
                .email(user.getEmail())
                .userId(user.getId())
                .role(user.getRole().name())
                .build();
    }

    public List<UserInformationResponse> getAllUsers() {
        log.info(TAG + "Get all users");
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> UserInformationResponse.builder()
                        .firstName(user.getFirstname())
                        .lastName(user.getLastname())
                        .email(user.getEmail())
                        .userId(user.getId())
                        .role(user.getRole().name())
                        .build())
                .collect(Collectors.toList());
    }

    public UserInformationResponse updateUserInformation(Long userId, UpdateUserRequest request) {
        log.info(TAG + "Update user information for userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setFirstname(request.getFirstName());
        user.setLastname(request.getLastName());
        userRepository.save(user);

        return UserInformationResponse.builder()
                .firstName(user.getFirstname())
                .lastName(user.getLastname())
                .email(user.getEmail())
                .userId(user.getId())
                .role(user.getRole().name())
                .build();
    }
}