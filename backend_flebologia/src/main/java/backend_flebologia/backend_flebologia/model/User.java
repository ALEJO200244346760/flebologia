package backend_flebologia.backend_flebologia.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;
import java.util.Collections;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean hasPaid = false; // por defecto, no ha pagado

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Retornamos el rol como un authority
        return Collections.singletonList(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;  // El username será el email
    }

    @Override
    public String getPassword() {
        return password;  // El password será el almacenado
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;  // Se puede ajustar si se quiere controlar expiración de cuenta
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;  // Se puede ajustar si se quiere bloquear cuentas
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // Se puede ajustar si se quiere controlar expiración de credenciales
    }

    @Override
    public boolean isEnabled() {
        return true;  // Se puede ajustar si se quiere habilitar/deshabilitar la cuenta
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isHasPaid() {
        return hasPaid;
    }

    public void setHasPaid(boolean hasPaid) {
        this.hasPaid = hasPaid;
    }
}
