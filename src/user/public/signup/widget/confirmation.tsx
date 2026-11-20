"use client";

import { broadcastAuthChange } from "next-vibe/identity/auth/tab-sync";
import { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/components/card";
import { Div } from "next-vibe/ui/components/div";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { Link } from "next-vibe/ui/components/link";
import { getCurrentUrl, replaceUrl } from "next-vibe/ui/lib/location";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { executeMutation } from "next-vibe/unified-ui/hooks/mutation-executor";
import { useCallback, useEffect, useRef, useState } from "react";

import definition, {
  type SignupPatchRequestOutput,
  type SignupPatchResponseOutput,
} from "../definition";
import { suggestSignupEmail } from "../email-suggestion";
import { scopedTranslation } from "../i18n";

export function SignupConfirmationWidget(): React.JSX.Element {
  const data = useWidgetValue<typeof definition.PATCH>();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("confirmation.title")}</CardTitle>
        <CardDescription>
          {data?.message ?? t("confirmation.description")}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function SignupConfirmationStep({
  pendingId,
  magicLink,
}: {
  pendingId?: string;
  magicLink: boolean;
}): React.JSX.Element {
  const user = useWidgetUser();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const platform = useWidgetPlatform();
  const { t } = scopedTranslation.scopedT(locale);
  const [status, setStatus] = useState<SignupPatchResponseOutput>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState("");
  const [code, setCode] = useState("");
  const [now, setNow] = useState(Date.now);
  const busyRef = useRef(false);
  const hasStatus = useRef(false);
  const revision = useRef(0);
  const fired = useRef(false);
  const focusedBounce = useRef(false);
  const addressActionsRef = useRef<HTMLDivElement>(null);
  const run = useCallback(
    async (
      data: SignupPatchRequestOutput,
      background = false,
    ): Promise<void> => {
      if (busyRef.current) {
        return;
      }
      const generation = ++revision.current;
      if (!background) {
        busyRef.current = true;
        setBusy(true);
        setError("");
      }
      try {
        const response = await executeMutation({
          endpoint: definition.PATCH,
          requestData: data,
          pathParams: undefined,
          user,
          locale,
          logger,
        });
        if (revision.current !== generation) {
          return;
        }
        if (!response.success) {
          if (
            !background ||
            !hasStatus.current ||
            data.token !== undefined ||
            response.errorType.errorCode === 404
          ) {
            setError(response.message);
          }
          if (
            response.errorType.errorCode === 404 ||
            data.token !== undefined
          ) {
            setUnavailable(true);
          }
          return;
        }
        if (!hasStatus.current) {
          setError("");
        }
        hasStatus.current = true;
        setStatus(response.data);
        if (response.data.redirectTo) {
          broadcastAuthChange("signup", logger);
          if (platform !== Platform.CLI && platform !== Platform.MCP) {
            replaceUrl(response.data.redirectTo);
          }
        } else if (!background) {
          setEditing(false);
          setCode("");
          setNow(Date.now());
        }
      } finally {
        if (!background) {
          busyRef.current = false;
          setBusy(false);
        }
      }
    },
    [user, locale, logger, platform],
  );
  useEffect(() => {
    if (magicLink && !fired.current) {
      fired.current = true;
      const token = new URL(getCurrentUrl()).hash.slice(1);
      void run({ token }, true);
    } else if (pendingId && !magicLink) {
      const initial = setTimeout(() => {
        void run({ pendingId }, true);
      }, 0);
      const poll = setInterval(() => {
        void run({ pendingId }, true);
      }, 15000);
      return (): void => {
        clearTimeout(initial);
        clearInterval(poll);
      };
    }
    return undefined;
  }, [magicLink, pendingId, run]);
  const bounced = status?.bounced;
  useEffect(() => {
    if (!bounced) {
      focusedBounce.current = false;
      return;
    }
    if (focusedBounce.current || editing || busy || unavailable) {
      return;
    }
    const button = addressActionsRef.current?.querySelector?.("button");
    button?.focus();
    focusedBounce.current = Boolean(button);
  }, [bounced, editing, busy, unavailable]);
  const deadline = status?.resendAt ?? 0;
  useEffect(() => {
    if (deadline <= Date.now()) {
      return;
    }
    const tick = setInterval(() => {
      setNow(Date.now());
      if (Date.now() >= deadline) {
        clearInterval(tick);
      }
    }, 1000);
    return (): void => clearInterval(tick);
  }, [deadline]);
  const seconds = Math.max(0, Math.ceil((deadline - now) / 1000));
  const suggestion = suggestSignupEmail(address);
  const submit = (): void => {
    if (busy || !pendingId) {
      return;
    }
    if (editing && address.trim()) {
      void run({ pendingId, newEmail: address });
    } else if (!editing && code.length === 6) {
      void run({ pendingId, code });
    }
  };
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="items-center gap-2 p-6 pb-2 text-center sm:p-8 sm:pb-2">
        <Div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Mail className="h-6 w-6" />
        </Div>
        <CardTitle className="text-2xl tracking-tight">
          {t(
            magicLink
              ? "confirmation.link"
              : bounced
                ? "confirmation.bouncedTitle"
                : "confirmation.title",
          )}
        </CardTitle>
        {status &&
          (bounced ? (
            <Div role="alert" className="text-sm text-destructive">
              {status.message}
            </Div>
          ) : (
            <CardDescription>{status.message}</CardDescription>
          ))}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6 pt-4 sm:p-8 sm:pt-4">
        {error && (
          <Div role="alert" className="text-sm text-destructive">
            {error}
          </Div>
        )}
        {unavailable ? (
          <Link href={`/${locale}/user/signup`}>{t("confirmation.retry")}</Link>
        ) : (
          pendingId &&
          status &&
          !status.redirectTo && (
            <>
              <Label htmlFor="signup-confirm-input">
                {t(editing ? "confirmation.email" : "confirmation.code")}
              </Label>
              <Input
                key={editing ? "address" : "code"}
                id="signup-confirm-input"
                type={editing ? "email" : "text"}
                autoComplete={editing ? "email" : "one-time-code"}
                keyboardType={editing ? "email-address" : "numeric"}
                maxLength={editing ? 254 : 6}
                className={
                  editing
                    ? "h-12"
                    : "h-14 text-center font-mono text-2xl tracking-[0.35em]"
                }
                value={editing ? address : code}
                onChangeText={
                  editing
                    ? setAddress
                    : (value) => setCode(value.replace(/\D/g, "").slice(0, 6))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    submit();
                  }
                }}
              />
              {editing && suggestion && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setAddress(suggestion)}
                >
                  {t("confirmation.suggestion", { email: suggestion })}
                </Button>
              )}
              <Button
                type="button"
                size="lg"
                disabled={
                  busy ||
                  (editing
                    ? !address.trim() || address.trim() === status.address
                    : code.length !== 6)
                }
                onClick={submit}
              >
                {t(editing ? "confirmation.save" : "confirmation.confirm")}
              </Button>
              <Div
                ref={addressActionsRef}
                className="flex flex-col items-center gap-1 border-t pt-3"
              >
                <Button
                  type="button"
                  variant={bounced && !editing ? "default" : "link"}
                  disabled={busy}
                  onClick={() => {
                    setEditing(!editing);
                    setAddress(status.address);
                    setError("");
                  }}
                >
                  {t(
                    editing
                      ? "confirmation.cancel"
                      : bounced
                        ? "confirmation.changeAddress"
                        : "confirmation.change",
                  )}
                </Button>
                {!editing && (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={busy || seconds > 0}
                    onClick={() => void run({ pendingId, resend: true })}
                  >
                    {seconds
                      ? t("confirmation.countdown", { seconds })
                      : t("confirmation.resend")}
                  </Button>
                )}
              </Div>
            </>
          )
        )}
      </CardContent>
    </Card>
  );
}
