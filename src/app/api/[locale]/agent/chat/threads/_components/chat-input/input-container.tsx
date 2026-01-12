"use client";

import { useSafeAreaInsets } from "next-vibe-ui/hooks/use-safe-area-insets";
import type { DivRefObject } from "next-vibe-ui/ui/div";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { platform } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

import { ChatInput } from "./input";

interface ChatInputContainerProps {
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
  inputContainerRef: React.RefObject<DivRefObject | null>;
}

/**
 * Container wrapper for the chat input component.
 * Handles positioning, safe area insets, and pointer events for web/native.
 *
 * On web: Absolutely positioned at bottom with pointer-events management
 * On native: Regular flex layout with safe area bottom padding
 */
export function ChatInputContainer({
  locale,
  logger,
  user,
  inputContainerRef,
}: ChatInputContainerProps): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <Div
      ref={inputContainerRef}
      className={
        platform.isReactNative
          ? "w-full z-20"
          : "absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
      }
    >
      <Div
        style={
          platform.isReactNative
            ? { paddingBottom: insets.bottom || 16 }
            : undefined
        }
      >
        <Div
          className={
            platform.isReactNative
              ? "max-w-3xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10"
              : "max-w-3xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10 pointer-events-auto"
          }
        >
          <ChatInput locale={locale} logger={logger} user={user} />
        </Div>
      </Div>
    </Div>
  );
}
