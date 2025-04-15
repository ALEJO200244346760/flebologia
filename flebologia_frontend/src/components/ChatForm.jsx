import React, { useState } from 'react';
import axios from 'axios';

const ChatForm = () => {
    const [content, setContent] = useState('');
    const [type, setType] = useState('TEXT'); // Puede ser TEXT, IMAGE, AUDIO, VIDEO
    const [mediaFile, setMediaFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
            if (file.type.startsWith('image/')) {
                setType('IMAGE');
            } else if (file.type.startsWith('audio/')) {
                setType('AUDIO');
            } else if (file.type.startsWith('video/')) {
                setType('VIDEO');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('content', content);
        formData.append('type', type);
        if (mediaFile) {
            formData.append('media', mediaFile);
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/api/chat/send',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            console.log('Mensaje enviado:', response.data);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe tu mensaje..."
            />
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Enviar</button>
        </form>
    );
};

export default ChatForm;
