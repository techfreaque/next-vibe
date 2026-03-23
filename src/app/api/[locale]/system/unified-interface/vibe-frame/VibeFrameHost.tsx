/**
 * Vibe Frame - React Host Component
 *
 * React component for embedding a vibe-frame on the host page.
 * Alternative to using the standalone embed script.
 * Manages iframe lifecycle and bridge communication via React hooks.
 */

"use client";

import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { createParentBridge, type ParentBridge } from "./bridge";
import type {
  FrameError,
  FrameTheme,
  FrameToParentMessage,
  VibeFrameInstance,
} from "./types";
import { DEFAULT_SANDBOX, generateFrameId } from "./types";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface VibeFrameHostProps {
  /** Base URL of the vibe-frame server */
  serverUrl: string;
  /** Endpoint identifier (e.g. "contact_POST") */
  endpoint: string;
  /** Locale (default: "en-US") */
  locale?: string;
  /** URL path params for parameterized endpoints */
  urlPathParams?: Record<string, string>;
  /** Pre-fill form data */
  data?: Record<string, string>;
  /** Auth token for cross-origin embedding */
  authToken?: string;
  /** Theme */
  theme?: FrameTheme;
  /** CSS custom properties to inject */
  cssVars?: Record<string, string>;
  /** Max height in px */
  maxHeight?: number;
  /** Iframe sandbox permissions override */
  sandbox?: string;
  /** Additional CSS class for the iframe container */
  className?: string;
  /** Callback when frame is ready */
  onReady?: () => void;
  /** Callback when frame requests close */
  onClose?: () => void;
  /** Callback when form submission succeeds */
  onSuccess?: (data: Record<string, string>) => void;
  /** Callback when form submission fails */
  onError?: (error: FrameError) => void;
  /** Callback for navigation events */
  onNavigate?: (path: string) => void;
  /** Callback when frame needs authentication */
  onAuthRequired?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function VibeFrameHost({
  serverUrl,
  endpoint,
  locale = "en-US",
  urlPathParams,
  data,
  authToken,
  theme = "system",
  cssVars,
  maxHeight,
  sandbox,
  className,
  onReady,
  onClose,
  onSuccess,
  onError,
  onNavigate,
  onAuthRequired,
}: VibeFrameHostProps): JSX.Element {
  const [frameId] = useState(() => generateFrameId());
  const [height, setHeight] = useState(100);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bridgeRef = useRef<ParentBridge | null>(null);

  // Store callbacks in refs so bridge doesn't need to be recreated
  const callbacksRef = useRef({
    onReady,
    onClose,
    onSuccess,
    onError,
    onNavigate,
    onAuthRequired,
    maxHeight,
  });
  callbacksRef.current = {
    onReady,
    onClose,
    onSuccess,
    onError,
    onNavigate,
    onAuthRequired,
    maxHeight,
  };

  // Store current theme/data/auth in refs for the onLoad handler
  const propsRef = useRef({ theme, locale, cssVars, authToken });
  propsRef.current = { theme, locale, cssVars, authToken };

  // Stable mount URL - only identity props (endpoint changes = new iframe)
  const mountUrl = useMemo(
    () => buildMountUrl(serverUrl, endpoint, frameId, locale, urlPathParams),
    [serverUrl, endpoint, frameId, locale, urlPathParams],
  );

  // Set up bridge ONCE per iframe identity - uses mountUrl as stable key
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    const serverOrigin = new URL(serverUrl).origin;
    const bridge = createParentBridge({
      iframe,
      frameId,
      allowedOrigin: serverOrigin,
      onMessage: (msg: FrameToParentMessage): void => {
        const cb = callbacksRef.current;
        switch (msg.type) {
          case "vf:ready":
            cb.onReady?.();
            break;
          case "vf:resize":
            setHeight(
              cb.maxHeight ? Math.min(msg.height, cb.maxHeight) : msg.height,
            );
            break;
          case "vf:close":
            cb.onClose?.();
            break;
          case "vf:success":
            cb.onSuccess?.(msg.data);
            break;
          case "vf:error":
            cb.onError?.(msg.error);
            break;
          case "vf:navigate":
            cb.onNavigate?.(msg.path);
            break;
          case "vf:authRequired":
            cb.onAuthRequired?.();
            break;
        }
      },
    });
    bridgeRef.current = bridge;

    // Send init once iframe loads
    function onLoad(): void {
      const p = propsRef.current;
      bridge.send({
        type: "vf:init",
        frameId,
        origin: window.location.origin,
        theme: p.theme,
        locale: p.locale,
        cssVars: p.cssVars ?? {},
      });
      if (p.authToken) {
        bridge.send({ type: "vf:auth", token: p.authToken });
      }
    }

    iframe.addEventListener("load", onLoad);

    return (): void => {
      iframe.removeEventListener("load", onLoad);
      bridge.destroy();
      bridgeRef.current = null;
    };
  }, [frameId, serverUrl, mountUrl, callbacksRef, propsRef]);

  // Forward data changes via bridge (no remount)
  useEffect(() => {
    if (data && bridgeRef.current) {
      bridgeRef.current.send({ type: "vf:data", data });
    }
  }, [data]);

  // Forward theme changes via bridge (no remount)
  useEffect(() => {
    if (bridgeRef.current) {
      bridgeRef.current.send({ type: "vf:theme", theme });
    }
  }, [theme]);

  // Forward auth token changes via bridge (no remount)
  useEffect(() => {
    if (authToken && bridgeRef.current) {
      bridgeRef.current.send({ type: "vf:auth", token: authToken });
    }
  }, [authToken]);

  return (
    // eslint-disable-next-line oxlint-plugin-jsx-capitalization/jsx-capitalization -- Raw iframe needed for cross-origin embed
    <iframe
      ref={iframeRef}
      id={frameId}
      src={mountUrl}
      title="Vibe Frame"
      sandbox={sandbox ?? DEFAULT_SANDBOX}
      className={className}
      style={{
        border: "none",
        width: "100%",
        height: `${height}px`,
        overflow: "hidden",
        transition: "height 0.2s ease",
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
      }}
    />
  );
}

// Expose instance methods via ref
export function useVibeFrameInstance(
  frameId: string,
  bridgeRef: React.RefObject<ParentBridge | null>,
): VibeFrameInstance | null {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (!bridgeRef.current || !iframeRef.current) {
    return null;
  }

  return {
    id: frameId,
    iframe: iframeRef.current,
    setData: (d) => bridgeRef.current?.send({ type: "vf:data", data: d }),
    setTheme: (t) => bridgeRef.current?.send({ type: "vf:theme", theme: t }),
    authenticate: (token) =>
      bridgeRef.current?.send({ type: "vf:auth", token }),
    back: () =>
      bridgeRef.current?.send({ type: "vf:navigate", action: "back" }),
    close: () =>
      bridgeRef.current?.send({ type: "vf:navigate", action: "close" }),
    destroy: () => bridgeRef.current?.destroy(),
  };
}

// ─── URL Builder ─────────────────────────────────────────────────────────────

function buildMountUrl(
  serverUrl: string,
  endpoint: string,
  frameId: string,
  locale: string,
  urlPathParams?: Record<string, string>,
): string {
  const base = serverUrl.replace(/\/$/, "");
  // Use the Next.js frame page which provides full SSR + hydration
  // The endpoint ID uses underscores (e.g. "contact_POST") - pass as path segment
  const url = new URL(`${base}/${locale}/frame/${endpoint}`);
  url.searchParams.set("frameId", frameId);
  if (urlPathParams && Object.keys(urlPathParams).length > 0) {
    url.searchParams.set("urlPathParams", JSON.stringify(urlPathParams));
  }
  return url.toString();
}
