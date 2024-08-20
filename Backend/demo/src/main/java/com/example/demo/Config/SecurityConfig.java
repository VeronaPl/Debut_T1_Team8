package com.example.demo.Config;

import com.example.demo.BDData.Person;
import com.example.demo.Service.PersonService;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Configuration
public class SecurityConfig {
	@Lazy
	@Autowired
	private JwtAuthFilter jwtAuthFilter;
	@Autowired
	private PersonService personService;

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}
	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI()
				.components(
						new Components()
								.addSecuritySchemes(
										"bearer-key",
										new SecurityScheme()
												.type(SecurityScheme.Type.HTTP)
												.scheme("bearer")
												.bearerFormat("JWT")
								)
				);
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
		httpSecurity.csrf(csrf -> csrf.disable());
		httpSecurity.headers(h -> h.frameOptions(fo -> fo.disable()));

		httpSecurity.sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		httpSecurity.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

		return httpSecurity.build();
	}
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration corsConfiguration = new CorsConfiguration();

		corsConfiguration.setAllowedOrigins(List.of("http:localhost:8080"));
		corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
		corsConfiguration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", corsConfiguration);
		return source;
	}

	@Bean
	public static NoOpPasswordEncoder passwordEncoder() {
		return (NoOpPasswordEncoder) NoOpPasswordEncoder.getInstance();
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userDetailsService());
		authProvider.setPasswordEncoder(passwordEncoder());
		return authProvider;
	}

	@Bean
	UserDetailsService userDetailsService() {
		return new UserDetailsService() {
			@Override
			public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
				// NOTE: no username, we just use emails internally.
				final String id = username;

				Person pers = personService.getById( Long.parseLong(id));
				if (pers == null){
					throw new UsernameNotFoundException("User " + id + " not found.");
				}

				return new UserDetails() {
					@Override
					public Collection<? extends GrantedAuthority> getAuthorities() {
						return List.of();
					}

					@Override
					public String getPassword() {
						return pers.getPassword();
					}

					@Override
					public String getUsername() {
						return id;
					}
				};
			}
		};
	}
}
