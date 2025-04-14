package backend_flebologia.backend_flebologia.controller;

import backend_flebologia.backend_flebologia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // Acá podés seguir agregando endpoints relacionados a usuarios
}
