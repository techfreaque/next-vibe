/**
 * Vibe Frame Page - Client Component
 *
 * Renders the target endpoint using EndpointsPage in an isolated context.
 * Communicates with the parent frame via the bridge for resize/success/error.
 */

"use client";

import { useTheme } from "next-themes";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import type {
  FrameTheme,
  ParentToFrameMessage,
} from "next-vibe/platforms/vibe-frame/types";
import { useFrameBridge } from "next-vibe/platforms/vibe-frame/use-bridge";
import { Div } from "next-vibe/ui/components/div";
import { setRootCssVar } from "next-vibe/ui/lib/css-vars";
import { getDocumentScrollHeight } from "next-vibe/ui/lib/dom";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getEndpoint } from "@/generated/endpoints/endpoint";

import { scopedTranslation as pageT } from "../../[...notFound]/i18n";

// ─── Props ───────────────────────────────────────────────────────────────────

interface VibeFramePageClientProps {
  endpointId: string;
  locale: CountryLanguage;
  frameId: string;
  theme: FrameTheme;
  authToken?: string;
  urlPathParams: Record<string, string>;
  data: Record<string, string>;
  user: JwtPayloadType;
  platform: Platform;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function VibeFramePageClient({
  endpointId,
  locale,
  frameId,
  theme: initialTheme,
  user,
  platform,
}: VibeFramePageClientProps): JSX.Element {
  const { setTheme: setNextTheme } = useTheme();
  // scopedT builds a fresh closure per call; memoize so `t` stays a stable
  // effect dependency and does not re-trigger the endpoint load every render.
  const { t } = useMemo(() => pageT.scopedT(locale), [locale]);
  const [endpointDef, setEndpointDef] = useState<Awaited<
    ReturnType<typeof getEndpoint>
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  const bridge = useFrameBridge(frameId);

  // Apply initial theme from parent
  useEffect(() => {
    setNextTheme(initialTheme);
  }, [initialTheme, setNextTheme]);

  // Bridge for parent communication
  const handleParentMessage = useCallback(
    (msg: ParentToFrameMessage) => {
      switch (msg.type) {
        case "vf:theme":
          setNextTheme(msg.theme);
          break;
        case "vf:init":
          setNextTheme(msg.theme);
          Object.entries(msg.cssVars).forEach(([key, value]) => {
            setRootCssVar(key, value);
          });
          break;
        case "vf:navigate":
          if (msg.action === "close") {
            bridge.send({ type: "vf:close", frameId });
          }
          break;
      }
    },
    [frameId, bridge, setNextTheme],
  );

  // Register parent message handler
  useEffect(() => {
    // The bridge's lastMessage changes trigger this
    if (bridge.lastMessage) {
      handleParentMessage(bridge.lastMessage);
    }
  }, [bridge.lastMessage, handleParentMessage]);

  // Load endpoint definition
  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const def = await getEndpoint(endpointId);
        if (!def) {
          const notFoundMessage = t("pages.frame.endpointNotFound", {
            endpointId,
          });
          setError(notFoundMessage);
          bridge.send({
            type: "vf:error",
            frameId,
            error: {
              message: notFoundMessage,
              errorType: "NOT_FOUND",
            },
          });
        } else {
          setEndpointDef(def);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : t("pages.frame.endpointLoadFailed");
        setError(message);
        bridge.send({
          type: "vf:error",
          frameId,
          error: { message, errorType: "SERVER_ERROR" },
        });
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [endpointId, frameId, bridge, t]);

  // ResizeObserver for auto-sizing
  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    let lastHeight = 0;
    const observer = new ResizeObserver((): void => {
      const height = getDocumentScrollHeight();
      if (height !== lastHeight) {
        lastHeight = height;
        bridge.send({ type: "vf:resize", frameId, height });
      }
    });

    observer.observe(rootRef.current);

    return (): void => {
      observer.disconnect();
    };
  }, [bridge, frameId]);

  if (loading) {
    return (
      <Div
        ref={rootRef}
        style={{
          padding: "32px",
          textAlign: "center",
          color: "#666",
          fontFamily: "system-ui",
        }}
      >
        Loading...
      </Div>
    );
  }

  if (error || !endpointDef) {
    return (
      <Div
        ref={rootRef}
        style={{
          padding: "16px",
          color: "#dc2626",
          background: "#fef2f2",
          borderRadius: "8px",
          fontFamily: "system-ui",
        }}
      >
        {error ?? "Failed to load endpoint"}
      </Div>
    );
  }

  // Wrap into method-keyed object for EndpointsPage
  const wrappedEndpoint: {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  } = { [endpointDef.method]: endpointDef };

  return (
    <Div ref={rootRef}>
      <EndpointsPage
        endpoint={wrappedEndpoint}
        locale={locale}
        user={user}
        platform={platform}
      />
    </Div>
  );
}
