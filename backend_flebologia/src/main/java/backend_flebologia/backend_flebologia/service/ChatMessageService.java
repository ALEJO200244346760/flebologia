package backend_flebologia.backend_flebologia.service;

import backend_flebologia.backend_flebologia.model.ChatMessage;
import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatMessage saveMessage(String content, String type, String mediaUrl, User sender, User recipient) {
        ChatMessage message = new ChatMessage();
        message.setContent(content);
        message.setType(type);
        message.setMediaUrl(mediaUrl);
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setTimestamp(LocalDateTime.now());
        return chatMessageRepository.save(message);
    }


    public List<ChatMessage> getMessagesForUser(User sender) {
        return chatMessageRepository.findBySender(sender); // ← ✅ Usa este método, no findBySenderId
    }
    public String saveMediaFile(MultipartFile file) throws IOException {
        String uploadDir = "uploads/chat/";
        String originalFilename = file.getOriginalFilename();
        String uniqueFilename = System.currentTimeMillis() + "_" + originalFilename;

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/chat/" + uniqueFilename; // o una URL pública si subís a S3 por ejemplo
    }
    public Set<User> obtenerUsuariosConMensajes() {
        return chatMessageRepository.findAll()
                .stream()
                .map(ChatMessage::getSender)
                .collect(Collectors.toSet());
    }

}
