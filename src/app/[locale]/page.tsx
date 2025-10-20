import type { JSX } from "react";

import { ChatProvider } from "@/app/[locale]/chat/features/chat/context";
import type { CountryLanguage } from "@/i18n/core/config";

import { ChatInterface } from "./chat/components/chat-interface";

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
