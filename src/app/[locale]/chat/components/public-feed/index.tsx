"use client";

import type { JSX } from "react";
import React from "react";

import type { UseChatReturn } from "@/app/api/[locale]/v1/core/agent/chat/hooks/hooks";
import type { CountryLanguage } from "@/i18n/core/config";

import { RedditStyleView } from "./views/reddit-style-view";

interface PublicFeedProps {
  chat: UseChatReturn;
  locale: CountryLanguage;
}

export function PublicFeed({ chat, locale }: PublicFeedProps): JSX.Element {
  return <RedditStyleView chat={chat} locale={locale} />;
}
