package backend_flebologia.backend_flebologia.repository;

import backend_flebologia.backend_flebologia.model.Role;
import backend_flebologia.backend_flebologia.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role); // 👈 AÑADIR ESTA LÍNEA
}
