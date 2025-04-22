package backend_flebologia.backend_flebologia.controller;

import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.security.CustomUserDetails;
import backend_flebologia.backend_flebologia.service.PaymentService;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
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
    public ResponseEntity<?> createPreference(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            User user = userDetails.getUser();
            MercadoPagoConfig.setAccessToken(mercadoPagoToken);

            PreferenceClient client = new PreferenceClient();

            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .title("Consulta con el Dr. Jorja")
                    .quantity(1)
                    .unitPrice(new BigDecimal("1000"))
                    .build();

            PreferencePayerRequest payerRequest = PreferencePayerRequest.builder()
                    .email(user.getEmail())
                    .build();

            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("https://flebologia.vercel.app/pago-exitoso")
                    .failure("https://flebologia.vercel.app/failure")
                    .pending("https://flebologia.vercel.app/pending")
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(List.of(itemRequest))
                    .payer(payerRequest)
                    .backUrls(backUrls)
                    .build();

            Preference preference = client.create(preferenceRequest);

            return ResponseEntity.ok(Map.of("init_point", preference.getInitPoint()));

        } catch (MPException | MPApiException e) {
            return ResponseEntity.status(500).body("Error creando preferencia de pago: " + e.getMessage());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> checkPaymentStatus(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        boolean hasPaid = paymentService.hasUserPaid(user);
        return ResponseEntity.ok(Map.of("hasPaid", hasPaid));
    }

    @PostMapping("/confirmar-pago")
    public ResponseEntity<?> confirmarPago(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        paymentService.marcarComoPagado(user);
        return ResponseEntity.ok(Map.of("message", "Pago confirmado correctamente"));
    }
}
