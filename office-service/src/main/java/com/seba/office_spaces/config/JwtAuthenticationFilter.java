package com.seba.office_spaces.config;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    public String SECRET_KEY = "6f0b41da298209dd3add47aea08b03aedbb55f7df68f47fc3970a737b06a82ac";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        String jwt = authHeader.substring(7);
        Claims claims;
        try {
            claims = Jwts.parser()
                    .setSigningKey(getSignInKey())
                    .parseClaimsJws(jwt)
                    .getBody();
            if (claims.getExpiration().before(new Date())) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token is expired");
                return;
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token");
            return;
        }
        String userEmail = claims.getSubject();
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {


            // todo: tu powinno byc zwracanie listy w mikroserwisie security ale omijamy tym cudnym podejsciem
            Object roleObject = claims.get("role");
            List<String> role;

            if (roleObject instanceof String) {
                role = List.of((String) roleObject);
            } else if (roleObject instanceof List) {
                role = (List<String>) roleObject;
            } else {
                throw new IllegalArgumentException("Unexpected type for 'role': " + roleObject.getClass());
            }

            CustomPrincipal principal = new CustomPrincipal(claims);
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    principal, null,
                    role.stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList())
            );
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        filterChain.doFilter(request, response);
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}