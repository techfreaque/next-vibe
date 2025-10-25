import type { JSX } from "react";

import { ChatInterface } from "@/app/[locale]/chat/components/chat-interface";
import { ChatProvider } from "@/app/[locale]/chat/features/chat/context";
import type { CountryLanguage } from "@/i18n/core/config";

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
