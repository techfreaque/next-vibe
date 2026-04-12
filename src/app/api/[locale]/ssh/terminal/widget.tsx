/**
 * SSH Terminal Widget - Full PTY terminal using xterm.js polling loop
 * Uses session/open + session/write + session/read endpoints
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import type { InputKeyboardEvent } from "next-vibe-ui/ui/input";
import { Input } from "next-vibe-ui/ui/input";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import {
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import {
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_HEADER_NAME,
} from "@/config/constants";

import sessionCloseEndpoints from "../session/close/definition";
import sessionOpenEndpoints from "../session/open/definition";
import sessionReadEndpoints from "../session/read/definition";
import sessionWriteEndpoints from "../session/write/definition";
import type endpoints from "./definition";

function getCsrfToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CSRF_TOKEN_COOKIE_NAME}=`));
  return match ? (match.split("=")[1] ?? null) : null;
}

// Strip ANSI/VT escape sequences so raw shell output renders cleanly.
// Covers: CSI sequences, OSC strings, DCS, private modes (e.g. ?2004h for bracketed paste).
// Control characters are required here intentionally - disable the rule.
// eslint-disable-next-line no-control-regex, no-useless-escape
const ANSI_RE =
  // eslint-disable-next-line no-control-regex
  /\x1b(?:\[[0-9;?]*[a-zA-Z]|\][^\x07\x1b]*(?:\x07|\x1b\\)|[()][AB012]|[PXZM78=>]|c)/g;
function stripAnsi(str: string): string {
  return str.replace(ANSI_RE, "").replace(/\r/g, "");
}

function postHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const csrf = getCsrfToken();
  if (csrf) {
    headers[CSRF_TOKEN_HEADER_NAME] = csrf;
  }
  return headers;
}

export function TerminalContainer(): React.JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const locale = useWidgetLocale();
  const outputId = useId();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [connectionLabel, setConnectionLabel] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "error"
  >("idle");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll output via DOM
  useEffect(() => {
    const el = document.getElementById(outputId);
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [output, outputId]);

  const connect = useCallback(async (): Promise<void> => {
    setStatus("connecting");
    setOutput("");
    try {
      const res = await fetch(
        `/api/${locale}/${sessionOpenEndpoints.POST.path.join("/")}`,
        {
          method: "POST",
          headers: postHeaders(),
          body: JSON.stringify({ cols: 220, rows: 50 }),
        },
      );
      const json = (await res.json()) as {
        data?: { sessionId?: string; shell?: string };
        message?: string;
      };
      const sid = json.data?.sessionId;
      if (!sid) {
        setOutput(json.message ?? t("widget.sessionError"));
        setStatus("error");
        return;
      }
      setSessionId(sid);
      setConnectionLabel(json.data?.shell ?? "");
      setStatus("connected");

      // Start polling loop
      pollRef.current = setInterval(async () => {
        try {
          const r = await fetch(
            `/api/${locale}/${sessionReadEndpoints.GET.path.join("/")}?sessionId=${sid}&waitMs=100`,
          );
          const j = (await r.json()) as {
            data?: { output?: string; eof?: boolean };
          };
          if (j.data?.output) {
            setOutput((prev) => `${prev}${stripAnsi(j.data!.output!)}`);
          }
          if (j.data?.eof) {
            if (pollRef.current) {
              clearInterval(pollRef.current);
            }
            setStatus("idle");
            setSessionId(null);
            setConnectionLabel("");
          }
        } catch {
          /* ignore poll errors */
        }
      }, 100);
    } catch (err) {
      setOutput(err instanceof Error ? err.message : t("widget.sessionError"));
      setStatus("error");
    }
  }, [locale, t]);

  const disconnect = useCallback(async (): Promise<void> => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
    }
    if (sessionId) {
      try {
        await fetch(
          `/api/${locale}/${sessionCloseEndpoints.POST.path.join("/")}`,
          {
            method: "POST",
            headers: postHeaders(),
            body: JSON.stringify({ sessionId }),
          },
        );
      } catch {
        /* ignore */
      }
    }
    setSessionId(null);
    setConnectionLabel("");
    setStatus("idle");
  }, [locale, sessionId]);

  const sendInput = useCallback(async (): Promise<void> => {
    if (!sessionId || !input) {
      return;
    }
    const cmd = input;
    setInput("");
    try {
      await fetch(
        `/api/${locale}/${sessionWriteEndpoints.POST.path.join("/")}`,
        {
          method: "POST",
          headers: postHeaders(),
          body: JSON.stringify({ sessionId, input: cmd }),
        },
      );
    } catch {
      /* ignore */
    }
  }, [locale, sessionId, input]);

  const handleKeyDown = useCallback(
    (e: InputKeyboardEvent<"text">): void => {
      if (e.key === "Enter") {
        void sendInput();
      }
    },
    [sendInput],
  );

  // Cleanup on unmount
  useEffect(() => {
    return (): void => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

  const statusColor =
    status === "connected"
      ? "text-success"
      : status === "connecting"
        ? "text-yellow-500"
        : status === "error"
          ? "text-destructive"
          : "text-muted-foreground";

  return (
    <Div className="flex flex-col gap-0 h-full min-h-[500px] bg-black rounded-lg overflow-hidden border border-gray-700">
      {/* Header */}
      <Div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-700">
        <Terminal className="h-4 w-4 text-green-400" />
        <Span className="font-semibold text-sm text-gray-200">
          {t("widget.title")}
        </Span>
        {connectionLabel ? (
          <Span className="text-xs text-gray-400 font-mono mr-auto">
            {connectionLabel}
          </Span>
        ) : (
          <Span className="mr-auto" />
        )}
        <Span className={`text-xs ${statusColor}`}>
          {t(
            `widget.${status === "idle" ? "disconnected" : status === "connecting" ? "connecting" : status === "connected" ? "connected" : "sessionError"}`,
          )}
        </Span>
        {status === "idle" || status === "error" ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void connect()}
            className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {t("widget.connectButton")}
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void disconnect()}
            className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {t("widget.disconnectButton")}
          </Button>
        )}
      </Div>

      {/* Output */}
      <Pre
        id={outputId}
        className="flex-1 px-4 py-3 text-xs font-mono text-green-300 whitespace-pre-wrap break-words overflow-y-auto bg-black"
      >
        {output ||
          (status === "idle" || status === "error"
            ? t("widget.connectPrompt")
            : "")}
      </Pre>

      {/* Input */}
      {status === "connected" && (
        <Div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-t border-gray-700">
          <Span className="text-green-400 font-mono text-xs flex-shrink-0">
            {t("widget.prompt")}
          </Span>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(String(e.target.value))}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-green-300 font-mono text-xs outline-none border-0"
            placeholder={t("widget.inputPlaceholder")}
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => void sendInput()}
            className="text-xs text-green-400 hover:bg-gray-700 px-2 flex-shrink-0"
          >
            {t("widget.sendButton")}
          </Button>
        </Div>
      )}
    </Div>
  );
}
