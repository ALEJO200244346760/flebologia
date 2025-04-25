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
            user.setHasPaid(true);
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("Usuario no puede ser nulo");
        }
    }

    public boolean hasUserPaid(User user) {
        if (user == null) {
            throw new IllegalArgumentException("Usuario no puede ser nulo");
        }
        return user.isHasPaid();
    }

    // ✅ Arreglado: persistir el cambio en la base de datos
    public void revocarPago(User user) {
        if (user != null) {
            user.setHasPaid(false);
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("Usuario no puede ser nulo");
        }
    }
}
