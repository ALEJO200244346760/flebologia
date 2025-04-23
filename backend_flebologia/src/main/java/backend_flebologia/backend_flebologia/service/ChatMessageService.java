package backend_flebologia.backend_flebologia.service;

import backend_flebologia.backend_flebologia.model.ChatMessage;
import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final S3Service s3Service; // ☁️ Inyectamos servicio de Amazon S3

    public ChatMessage saveMessage(String content, String type, String mediaUrl, User sender) {
        ChatMessage message = ChatMessage.builder()
                .content(content)
                .type(type)
                .mediaUrl(mediaUrl)
                .sender(sender)
                .build();
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getMessagesForUser(User sender) {
        return chatMessageRepository.findBySender(sender);
    }

    public Set<User> obtenerUsuariosConMensajes() {
        return chatMessageRepository.findAll()
                .stream()
                .map(ChatMessage::getSender)
                .collect(Collectors.toSet());
    }

    public String saveMediaFile(MultipartFile file) throws IOException {
        return s3Service.uploadFile(file); // ✅ Reemplazo de almacenamiento local por S3
    }
}
