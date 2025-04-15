import React from 'react';
import ChatMessages from './ChatMessages';
import ChatForm from './ChatForm';

const ChatPage = () => {
    return (
        <div>
            <h1>Chat con el Dr. Jorja</h1>
            <ChatMessages />
            <ChatForm />
        </div>
    );
};

export default ChatPage;
