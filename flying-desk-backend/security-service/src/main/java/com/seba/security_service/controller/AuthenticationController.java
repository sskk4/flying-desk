package com.seba.security_service.controller;

import com.seba.security_service.email.EmailRequest;
import com.seba.security_service.email.PasswordRecoveryRequest;
import com.seba.security_service.security.request.*;
import com.seba.security_service.security.response.AuthenticationResponse;
import com.seba.security_service.security.response.RefreshTokenResponse;
import com.seba.security_service.security.response.RegisterEmailResponse;
import com.seba.security_service.security.response.RegisterResponse;
import com.seba.security_service.service.AuthenticationService;
import com.seba.security_service.util.SecurityHolder;
import com.seba.security_service.security.request.*;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final String TAG = "AUTHENTICATION CONTROLLER - ";

    private final AuthenticationService authenticationService;

    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register user and get response")
    @PostMapping("/register")
    public RegisterResponse register(
        @RequestBody RegisterRequest request) {
        log.info(TAG + "register:");
        return authenticationService.register(request);
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "login user")
    @PostMapping("/authenticate")
    public AuthenticationResponse login(
            @RequestBody AuthenticationRequest request) {
        log.info(TAG + "authenticate:");
        return authenticationService.authenticate(request);
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "logout user, inactive refresh token")
    @GetMapping("/logout")
    public void logout() {
        log.info(TAG + "logout:");
        authenticationService.logout(SecurityHolder.getPrincipal());
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "refresh token and get response")
    @PostMapping("/refresh")
    public RefreshTokenResponse refreshToken(
            @RequestBody RefreshTokenRequest request) {
        log.info(TAG + "refresh");
        return authenticationService.refreshToken(request);
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "change user password")
    @PostMapping("/pw/change")
    public void changePassword(
            @RequestBody PasswordChangeRequest request) {
        log.info(TAG + "change password:");
        authenticationService.changePassword(request, SecurityHolder.getPrincipal());
    }

   // @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "set role with UserId")
    @PutMapping("/set-role/{userId}")
    public ResponseEntity<String> setRole(
            @PathVariable Long userId,
            @RequestBody SetRoleRequest setRoleRequest) {
        log.info(TAG + "set role for userId:" + userId);
        authenticationService.updateUserRole(userId, setRoleRequest.getRole());
        return ResponseEntity.ok("Role updated successfully");
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "send link to email to recovery password")
    @PostMapping("/pw/recovery")
    public void sendLinkToRecoveryPassword(
            @RequestBody EmailRequest request) {
        log.info(TAG + "send link to email {} to recovery password", request.getEmail());
        authenticationService.forgotPassword(request.getEmail());
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Change password using token and link from email")
    @PostMapping("/pw/recovery/{token}")
    public void recoveryPassword(
            @PathVariable("token") String token,
            @RequestBody PasswordRecoveryRequest request){
        log.info(TAG + "recovery password");
        authenticationService.recoveryPassword(token, request.getPassword());
    }

    @Operation(summary = "Activate user account by link from email")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/activate/{token}")
    public RegisterRequest activate(
            @PathVariable("token") String token) {
        log.info(TAG + "Activate new user");
        authenticationService.activate(token);
        return null;
    }

    @Operation(summary = "Check if email is already taken")
    @GetMapping("/check-email/{email}")
    public ResponseEntity<RegisterEmailResponse> checkEmail(@PathVariable("email") String email) {
        log.info("Checking if email is taken: {}", email);

        boolean isEmailTaken = authenticationService.isEmailTaken(email);

        if (isEmailTaken) {
            log.warn("Email is already taken: {}", email);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RegisterEmailResponse("Email is already taken"));
        } else {
            log.info("Email is available: {}", email);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new RegisterEmailResponse("Email is available"));
        }
    }
}
