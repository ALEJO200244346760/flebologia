package backend_flebologia.backend_flebologia.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
