import { ChatProvider } from "./features/chat/context";
import { ChatInterface } from "./components/chat-interface";

export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
}
