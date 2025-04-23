package backend_flebologia.backend_flebologia.dto;

import lombok.Data;

@Data
public class ChatDTO {
    private Long userId;
    private String content;
    private String type;
    private String mediaUrl;
}
