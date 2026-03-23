/**
 * Vibe Frame Page — Client Component
 *
 * Renders the target endpoint using EndpointsPage in an isolated context.
 * Communicates with the parent frame via the bridge for resize/success/error.
 */

"use client";

import { useTheme } from "next-themes";
import type { JSX } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type {
  FrameTheme,
  ParentToFrameMessage,
} from "@/app/api/[locale]/system/unified-interface/vibe-frame/types";
import { useFrameBridge } from "@/app/api/[locale]/system/unified-interface/vibe-frame/use-bridge";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { Div } from "next-vibe-ui/ui/div";

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
}

// ─── Component ───────────────────────────────────────────────────────────────

export function VibeFramePageClient({
  endpointId,
  locale,
  frameId,
  theme: initialTheme,
  user,
}: VibeFramePageClientProps): JSX.Element {
  const { setTheme: setNextTheme } = useTheme();
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
            document.documentElement.style.setProperty(key, value);
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
          setError(`Endpoint "${endpointId}" not found`);
          bridge.send({
            type: "vf:error",
            frameId,
            error: {
              message: `Endpoint "${endpointId}" not found`,
              errorType: "NOT_FOUND",
            },
          });
        } else {
          setEndpointDef(def);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load endpoint";
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
  }, [endpointId, frameId, bridge]);

  // ResizeObserver for auto-sizing
  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    let lastHeight = 0;
    const observer = new ResizeObserver((): void => {
      const height = document.documentElement.scrollHeight;
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
      <EndpointsPage endpoint={wrappedEndpoint} locale={locale} user={user} />
    </Div>
  );
}
