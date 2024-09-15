import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const MatchChat = ({ userId, matchId }) => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const { sendMessage, lastMessage, readyState } = useWebSocket(`wss://bulldog-humane-ram.ngrok-free.app/ws/${userId}`);

  useEffect(() => {
    if (lastMessage !== null) {
      const [senderId, message] = lastMessage.data.split(': ', 2);
      if (senderId === matchId || senderId === userId) {
        setMessageHistory((prev) => [...prev, { senderId, message }]);
      }
    }
  }, [lastMessage, matchId, userId]);

  const handleSendMessage = useCallback(() => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      // setMessageHistory((prev) => [...prev, { senderId: userId, message: inputMessage }]);
      setInputMessage('');
    }
  }, [inputMessage, sendMessage, userId]);
  

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div className="chat-container">
      <div>Chat status: {connectionStatus}</div>
      <div className="message-list">
        {messageHistory.map((msg, idx) => (
          <div key={idx} className={msg.senderId === userId ? 'sent' : 'received'}>
            {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage} disabled={readyState !== ReadyState.OPEN}>
        Send
      </button>
    </div>
  );
};

export default MatchChat;