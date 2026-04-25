package com.campusconnect.config.Security;

import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
public SecurityFilterChain filterChain(HttpSecurity http, JWTAuthenticationFilter jwtFilter) throws Exception {

    http
        .cors(cors -> {})
        .csrf(csrf -> csrf.disable())        
        .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                .requestMatchers("/api/users/**").permitAll()
                
                .requestMatchers("/api/roles/all").permitAll()
                .requestMatchers("/api/roles/**").hasRole("ADMIN")

                .requestMatchers("/api/batches/**").permitAll()
                
                .requestMatchers("/api/campus/**").permitAll()

                .requestMatchers("/api/faculties/**").permitAll()

                .requestMatchers("/api/programs/**").permitAll()

                .requestMatchers("/api/curriculums/**").permitAll()
                
                .requestMatchers("/api/semesters/**").permitAll()
                
                .requestMatchers("/api/subjects/**").permitAll()

                .requestMatchers("/api/resources/getBySubject").permitAll()
                .requestMatchers("/api/resources/get").permitAll()
                .requestMatchers("/api/resources/create").permitAll()
                .requestMatchers("/api/resources/update").permitAll()

                .requestMatchers("/api/group-members/**").permitAll()

                .requestMatchers("/api/groups/**").permitAll()


                .anyRequest().authenticated()
        )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}