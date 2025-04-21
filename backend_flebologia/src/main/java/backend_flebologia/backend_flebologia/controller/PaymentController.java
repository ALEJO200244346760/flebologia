package backend_flebologia.backend_flebologia.controller;

import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.service.PaymentService;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import com.mercadopago.exceptions.MPApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Value("${mercadopago.access.token}")
    private String mercadoPagoToken;

    @PostMapping("/create_preference")
    public ResponseEntity<?> createPreference(@AuthenticationPrincipal User user) {
        try {
            // Configurar el token de acceso
            MercadoPagoConfig.setAccessToken(mercadoPagoToken);

            // Crear el cliente de preferencias
            PreferenceClient client = new PreferenceClient();

            // Crear ítem de la preferencia
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .title("Consulta con el Dr. Jorja")
                    .quantity(1)
                    .unitPrice(new BigDecimal("1000"))
                    .build();

            // Crear pagador
            PreferencePayerRequest payerRequest = PreferencePayerRequest.builder()
                    .email(user.getEmail())
                    .build();

            // Crear back URLs
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("https://flebologia.vercel.app/chat")
                    .failure("https://flebologia.vercel.app/failure")
                    .pending("https://flebologia.vercel.app/pending")
                    .build();

            // Crear preferencia
            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(List.of(itemRequest))
                    .payer(payerRequest)
                    .backUrls(backUrls)
                    .build();

            // Guardar preferencia
            Preference preference = client.create(preferenceRequest);

            // Retornar el init_point (link de pago)
            return ResponseEntity.ok(Map.of("init_point", preference.getInitPoint()));

        } catch (MPException | com.mercadopago.exceptions.MPApiException e) {
            return ResponseEntity.status(500).body("Error creando preferencia de pago: " + e.getMessage());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> checkPaymentStatus(@AuthenticationPrincipal User user) {
        boolean hasPaid = paymentService.hasUserPaid(user);
        return ResponseEntity.ok(Map.of("hasPaid", hasPaid));
    }
}
