/**
 * SSH Terminal Widget — Full PTY terminal using xterm.js polling loop
 * Uses session/open + session/write + session/read endpoints
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Terminal } from "next-vibe-ui/ui/icons";
import type { InputKeyboardEvent } from "next-vibe-ui/ui/input";
import { Input } from "next-vibe-ui/ui/input";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

export function TerminalContainer(): React.JSX.Element {
  const t = useWidgetTranslation();
  const outputId = useId();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [input, setInput] = useState<string>("");
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
      const res = await fetch("/api/en/ssh/session/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cols: 220, rows: 50 }),
      });
      const json = (await res.json()) as { data?: { sessionId?: string } };
      const sid = json.data?.sessionId;
      if (!sid) {
        setStatus("error");
        return;
      }
      setSessionId(sid);
      setStatus("connected");

      // Start polling loop
      pollRef.current = setInterval(async () => {
        try {
          const r = await fetch(
            `/api/en/ssh/session/read?sessionId=${sid}&waitMs=100`,
          );
          const j = (await r.json()) as {
            data?: { output?: string; eof?: boolean };
          };
          if (j.data?.output) {
            setOutput((prev) => `${prev}${j.data!.output}`);
          }
          if (j.data?.eof) {
            if (pollRef.current) {
              clearInterval(pollRef.current);
            }
            setStatus("idle");
            setSessionId(null);
          }
        } catch {
          /* ignore poll errors */
        }
      }, 100);
    } catch {
      setStatus("error");
    }
  }, []);

  const disconnect = useCallback(async (): Promise<void> => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
    }
    if (sessionId) {
      try {
        await fetch("/api/en/ssh/session/close", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      } catch {
        /* ignore */
      }
    }
    setSessionId(null);
    setStatus("idle");
  }, [sessionId]);

  const sendInput = useCallback(async (): Promise<void> => {
    if (!sessionId || !input) {
      return;
    }
    const cmd = input;
    setInput("");
    try {
      await fetch("/api/en/ssh/session/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, input: cmd }),
      });
    } catch {
      /* ignore */
    }
  }, [sessionId, input]);

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
      ? "text-green-500"
      : status === "connecting"
        ? "text-yellow-500"
        : status === "error"
          ? "text-red-500"
          : "text-muted-foreground";

  return (
    <Div className="flex flex-col gap-0 h-full min-h-[500px] bg-black rounded-lg overflow-hidden border border-gray-700">
      {/* Header */}
      <Div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-700">
        <Terminal className="h-4 w-4 text-green-400" />
        <Span className="font-semibold text-sm text-gray-200 mr-auto">
          {t("app.api.ssh.terminal.widget.title")}
        </Span>
        <Span className={`text-xs ${statusColor}`}>
          {t(
            `app.api.ssh.terminal.widget.${status === "idle" ? "disconnected" : status === "connecting" ? "connecting" : status === "connected" ? "connected" : "sessionError"}`,
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
            {t("app.api.ssh.terminal.widget.connectButton")}
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void disconnect()}
            className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {t("app.api.ssh.terminal.widget.disconnectButton")}
          </Button>
        )}
      </Div>

      {/* Output */}
      <Pre
        id={outputId}
        className="flex-1 px-4 py-3 text-xs font-mono text-green-300 whitespace-pre-wrap break-words overflow-y-auto bg-black"
      >
        {output ||
          (status === "idle"
            ? t("app.api.ssh.terminal.widget.connectPrompt")
            : "")}
      </Pre>

      {/* Input */}
      {status === "connected" && (
        <Div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-t border-gray-700">
          <Span className="text-green-400 font-mono text-xs flex-shrink-0">
            {t("app.api.ssh.terminal.widget.prompt")}
          </Span>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(String(e.target.value))}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-green-300 font-mono text-xs outline-none border-0"
            placeholder={t("app.api.ssh.terminal.widget.inputPlaceholder")}
          />
        </Div>
      )}
    </Div>
  );
}
