package backend_flebologia.backend_flebologia.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content; // texto del mensaje

    private String type; // TEXT, IMAGE, AUDIO, VIDEO

    private String mediaUrl; // URL del archivo multimedia (si aplica)

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;
}
