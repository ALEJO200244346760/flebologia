package backend_flebologia.backend_flebologia.service;

import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Buscamos el usuario en la base de datos por email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // Retornamos el UserDetails necesario para Spring Security
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())  // Usamos el email como username
                .password(user.getPassword())  // La contraseña encriptada
                .authorities(user.getRole().name())  // Asignamos el rol del usuario
                .build();
    }
}
