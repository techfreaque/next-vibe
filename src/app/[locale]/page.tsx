import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { ChatInterface } from "./chat/components/chat-interface";
import { ChatProvider } from "./chat/features/chat/context";

interface ChatPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function ChatPage({
  params,
}: ChatPageProps): Promise<JSX.Element> {
  const { locale } = await params;

  return (
    <ChatProvider locale={locale}>
      <ChatInterface />
    </ChatProvider>
  );
}
