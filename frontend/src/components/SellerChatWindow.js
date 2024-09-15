import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Text, Button, useTheme } from '@geist-ui/core';
import SellerChat from './SellerChat.jsx';

function ChatWindow() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { dish } = location.state || {};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ backgroundColor: theme.palette.background }}>
      <Card width="100%" maxWidth="500px">
        <Card.Content>
          <Text h3>{dish ? dish.title : 'Chat Window'}</Text>
          {dish ? (
            <Text p>{dish.description}</Text>
          ) : (
            <Text p>Welcome to the chat. Here you can communicate with buyers or sellers.</Text>
          )}
          <SellerChat/>
        </Card.Content>
        <Card.Footer>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default ChatWindow;