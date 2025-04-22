package backend_flebologia.backend_flebologia.service;

import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final UserRepository userRepository;

    public void marcarComoPagado(User user) {
        if (user != null) {
            user.setHasPaid(true); // Marcar como pagado
            userRepository.save(user); // Persistir cambio en la base de datos
        } else {
            throw new IllegalArgumentException("Usuario no puede ser nulo");
        }
    }

    public boolean hasUserPaid(User user) {
        if (user == null) {
            throw new IllegalArgumentException("Usuario no puede ser nulo");
        }
        return user.isHasPaid(); // Consultar flag persistente
    }
}
