package backend_flebologia.backend_flebologia.service;

import backend_flebologia.backend_flebologia.model.User;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class PaymentService {

    private Set<String> emailsQuePagaron = new HashSet<>();

    public void marcarComoPagado(User user) {
        emailsQuePagaron.add(user.getEmail());
    }

    public boolean hasUserPaid(User user) {
        return emailsQuePagaron.contains(user.getEmail());
    }
}
