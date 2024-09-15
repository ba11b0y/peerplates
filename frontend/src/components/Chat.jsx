import { useCallback } from 'react';
import Talk from 'talkjs';
import { Session, Chatbox } from '@talkjs/react';

function Chat() {
  const syncUser = useCallback(
    () =>
      new Talk.User({
        id: 'rishith',
        name: 'Rishith',
        email: 'rishith@example.com',
        photoUrl: 'https://vthackspeerplates.blob.core.windows.net/peerplatesimages/rishith.jpg',
        welcomeMessage: 'Hi!',
      }),
    []
  );

  const syncConversation = useCallback((session) => {
    // JavaScript SDK code here
    const conversationId = Math.random().toString(36).substring(2, 15);
    const conversation = session.getOrCreateConversation(conversationId);

    const other = new Talk.User({
      id: 'rahul',
      name: 'Rahul',
      email: 'rahul@example.com',
      photoUrl: 'https://vthackspeerplates.blob.core.windows.net/peerplatesimages/good_pop copy.jpeg',
    });
    conversation.setParticipant(session.me);
    conversation.setParticipant(other);

    return conversation;
  }, []);

  return (
    <Session appId="tQQluRwm" syncUser={syncUser}>
      <Chatbox
        syncConversation={syncConversation}
        style={{ width: '100%', height: '500px' }}
      ></Chatbox>
    </Session>
  );
}

export default Chat;