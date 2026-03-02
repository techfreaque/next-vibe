"use client";

import type { JSX } from "react";
import React from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { RedditStyleView } from "./views/reddit-style-view";

interface PublicFeedProps {
  locale: CountryLanguage;
}

export function PublicFeed({ locale }: PublicFeedProps): JSX.Element {
  return <RedditStyleView locale={locale} />;
}
