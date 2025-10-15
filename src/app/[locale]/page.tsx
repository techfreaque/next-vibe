import type { JSX } from "react";

import { ChatInterface } from "./chat/components/chat-interface";
import { ChatProvider } from "./chat/features/chat/context";

export default function ChatPage(): JSX.Element {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
}
