import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatMessages = () => {
    const [messages, setMessages] = useState([]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('https://flebologia-production.up.railway.app/api/chat/mensajes');
            setMessages(response.data);
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []); // Solo se ejecuta una vez al cargar el componente

    return (
        <div>
            {messages.map((msg) => (
                <div key={msg.id} className="message">
                    <div>{msg.sender.email}</div>
                    <div>{msg.content}</div>
                    {msg.type === 'IMAGE' && <img src={`http://localhost:8080${msg.mediaUrl}`} alt="Imagen" />}
                    {msg.type === 'AUDIO' && <audio controls><source src={`http://localhost:8080${msg.mediaUrl}`} /></audio>}
                    {msg.type === 'VIDEO' && <video controls><source src={`http://localhost:8080${msg.mediaUrl}`} /></video>}
                </div>
            ))}
        </div>
    );
};

export default ChatMessages;
