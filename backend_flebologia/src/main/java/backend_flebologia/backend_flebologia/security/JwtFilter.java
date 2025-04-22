package backend_flebologia.backend_flebologia.security;

import backend_flebologia.backend_flebologia.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        // Si la ruta no necesita autenticación, dejamos que pase
        if (path.equals("/api/users/register") || path.equals("/api/users/login") || path.equals("/api/payment/webhook")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        String email = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);  // Extraemos el token
            email = jwtUtil.extractUsername(jwt);  // Extraemos el email del token
        }

        // Agregamos logs para verificar el flujo
        if (authHeader == null) {
            System.out.println("❌ No Authorization header");
        } else if (!authHeader.startsWith("Bearer ")) {
            System.out.println("❌ Authorization no empieza con 'Bearer '");
        } else {
            System.out.println("🔐 JWT recibido: " + jwt);
            System.out.println("📧 Usuario del token: " + email);
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Cargamos los detalles del usuario
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // Validamos el token
            if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Establecemos la autenticación en el contexto
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("✅ Autenticación exitosa");
            } else {
                System.out.println("❌ Token inválido");
            }
        }

        // Continuamos con el filtro
        filterChain.doFilter(request, response);
    }
}
