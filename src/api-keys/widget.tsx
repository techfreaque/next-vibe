"use client";

import { useProviderAvailability } from "next-vibe/agent/env-availability-store";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import { UserRole } from "next-vibe/identity/roles/enum";
import { Alert, AlertDescription } from "next-vibe/ui/components/alert";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Input } from "next-vibe/ui/components/input";
import { Link } from "next-vibe/ui/components/link";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import type { JSX } from "react";
import { useState } from "react";

import revokeEndpoints from "./[id]/definition";
import { API_DOCS_PATH } from "./constants";
import apiKeysEndpoints from "./definition";

function buildCurl(baseUrl: string, key: string): string {
  return [
    `curl ${baseUrl}/chat/completions \\`,
    `  -H "Authorization: Bearer ${key}" \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '{"model":"kimi-k2","messages":[{"role":"user","content":"Hello"}]}'`,
  ].join("\n");
}

/** Monospace block with a copy action. */
function CopyBlock({
  text,
  copyLabel,
  copiedLabel,
}: {
  text: string;
  copyLabel: string;
  copiedLabel: string;
}): JSX.Element {
  const [copied, setCopied] = useState(false);
  return (
    <Div className="flex items-start gap-2 rounded-lg border bg-muted/40 p-3">
      <Span className="min-w-0 flex-1 whitespace-pre-wrap break-all font-mono text-xs">
        {text}
      </Span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 shrink-0 gap-1.5"
        onClick={(): void => {
          void (async (): Promise<void> => {
            setCopied(await copyToClipboard(text));
          })();
        }}
      >
        <Copy className="h-4 w-4" />
        {copied ? copiedLabel : copyLabel}
      </Button>
    </Div>
  );
}

export function ApiKeysContainer(): JSX.Element {
  const data = useWidgetValue<typeof apiKeysEndpoints.GET>();
  const { pop, canGoBack } = useWidgetNavigation();
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof apiKeysEndpoints.GET>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const availability = useProviderAvailability();
  const isAdmin = !user.isPublic && user.roles.includes(UserRole.ADMIN);
  const modelCount = getAvailableChatModelCount(isAdmin, availability);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);

  const handleCreate = (): void => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    setCreating(true);
    setError(null);
    void (async (): Promise<void> => {
      const result = await apiClient.mutate(
        apiKeysEndpoints.POST,
        logger,
        user,
        { name: trimmed },
        undefined,
        locale,
      );
      setCreating(false);
      if (!result.success) {
        setError(result.message ?? t("widget.createFailed"));
        return;
      }
      setNewKey(result.data.key);
      setName("");
      endpointMutations?.read?.refetch?.();
    })();
  };

  const handleRevoke = (id: string): void => {
    setRevoking(id);
    setError(null);
    void (async (): Promise<void> => {
      const result = await apiClient.mutate(
        revokeEndpoints.DELETE,
        logger,
        user,
        undefined,
        { id },
        locale,
      );
      setRevoking(null);
      if (!result.success) {
        setError(result.message ?? t("widget.revokeFailed"));
        return;
      }
      endpointMutations?.read?.refetch?.();
    })();
  };

  if (!data) {
    return <LoadingBlock message={t("widget.loading")} />;
  }

  return (
    <WidgetShell className="gap-4">
      <WidgetHeader
        title={t("list.title")}
        backButton={
          canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(): void => {
                pop();
              }}
              className="gap-1.5 -ml-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("widget.back")}
            </Button>
          ) : undefined
        }
      />

      <P className="m-0 px-1 text-sm text-muted-foreground">
        {t("widget.intro", { modelCount })}
      </P>

      {error ? (
        <Alert variant="destructive" className="mx-1">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : undefined}

      {data.isPaid ? undefined : (
        <Div className="flex flex-col gap-2 rounded-xl border border-primary/40 bg-primary/5 p-4">
          <Span className="text-sm font-semibold">
            {t("widget.upgradeTitle")}
          </Span>
          <P className="m-0 text-xs text-muted-foreground">
            {t("widget.upgradeBody")}
          </P>
          <Link
            href={`/${locale}/subscription`}
            className="inline-flex h-10 items-center self-start rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t("widget.upgradeCta")}
          </Link>
        </Div>
      )}

      {newKey ? (
        <Div className="flex flex-col gap-2 rounded-xl border border-primary/40 bg-primary/5 p-4">
          <Span className="text-sm font-semibold">
            {t("widget.newKeyTitle")}
          </Span>
          <P className="m-0 text-xs text-muted-foreground">
            {t("widget.newKeyHint")}
          </P>
          <CopyBlock
            text={newKey}
            copyLabel={t("widget.copy")}
            copiedLabel={t("widget.copied")}
          />
          <Button
            type="button"
            variant="outline"
            className="h-10 self-start"
            onClick={(): void => {
              setNewKey(null);
            }}
          >
            {t("widget.dismiss")}
          </Button>
        </Div>
      ) : undefined}

      <Div className="flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm">
        <Span className="text-sm font-semibold">
          {t("widget.baseUrlTitle")}
        </Span>
        <CopyBlock
          text={data.baseUrl}
          copyLabel={t("widget.copy")}
          copiedLabel={t("widget.copied")}
        />
        <P className="m-0 text-xs text-muted-foreground">
          {t("widget.baseUrlHint")}
        </P>
        <Span className="mt-2 text-sm font-semibold">
          {t("widget.exampleTitle")}
        </Span>
        <CopyBlock
          text={buildCurl(data.baseUrl, newKey ?? t("widget.keyPlaceholder"))}
          copyLabel={t("widget.copy")}
          copiedLabel={t("widget.copied")}
        />
        <P className="m-0 text-xs text-muted-foreground">
          {t("widget.billingNote")}
        </P>
        <Link
          href={`/${locale}/${API_DOCS_PATH}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("widget.docsLink")}
        </Link>
      </Div>

      {data.isPaid ? (
        <Div className="flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm">
          <Span className="text-sm font-semibold">{t("widget.nameLabel")}</Span>
          <Div className="flex flex-col gap-2 sm:flex-row">
            <Input
              name="apiKeyName"
              value={name}
              onChange={(e): void => setName(e.target.value)}
              onKeyDown={(e): void => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreate();
                }
              }}
              placeholder={t("widget.namePlaceholder")}
              aria-label={t("widget.nameLabel")}
              disabled={creating}
              className="h-10 flex-1"
            />
            <Button
              type="button"
              className="h-10 shrink-0"
              disabled={creating || name.trim().length === 0}
              onClick={handleCreate}
            >
              {creating ? t("widget.creating") : t("widget.create")}
            </Button>
          </Div>
        </Div>
      ) : undefined}

      <Span className="px-1 text-sm font-semibold">
        {t("widget.keysTitle")}
      </Span>
      {data.keys.length === 0 ? (
        <EmptyBlock
          icon={<Key />}
          title={t("widget.empty")}
          message={t("widget.emptyHint")}
        />
      ) : (
        <Div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border bg-card shadow-sm">
          {data.keys.map((k) => (
            <Div
              key={k.id}
              className="flex min-h-16 items-center gap-3 px-4 py-3"
            >
              <Span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Key className="h-4 w-4" />
              </Span>
              <Div className="min-w-0 flex-1">
                <Span className="block truncate text-sm font-medium">
                  {k.name}
                </Span>
                <Span className="block truncate font-mono text-xs text-muted-foreground">
                  {t("widget.maskedKey", { prefix: k.keyPrefix })}
                </Span>
                <Span className="block text-xs text-muted-foreground">
                  {t("widget.meta", {
                    lastUsed: k.lastUsedAt
                      ? `${t("widget.lastUsed")} ${new Date(k.lastUsedAt).toLocaleString(locale)}`
                      : t("widget.neverUsed"),
                    created: new Date(k.createdAt).toLocaleDateString(locale),
                    rate: t("widget.rateLimit", { n: k.rateLimitPerMinute }),
                  })}
                </Span>
              </Div>
              <Button
                variant="outline"
                disabled={revoking === k.id}
                className="h-10 shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={(): void => handleRevoke(k.id)}
              >
                {revoking === k.id ? t("widget.revoking") : t("widget.revoke")}
              </Button>
            </Div>
          ))}
        </Div>
      )}
    </WidgetShell>
  );
}
