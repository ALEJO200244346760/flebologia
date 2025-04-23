package backend_flebologia.backend_flebologia.repository;

import backend_flebologia.backend_flebologia.model.ChatMessage;
import backend_flebologia.backend_flebologia.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderOrRecipientOrderByTimestampAsc(User sender, User recipient);
}
