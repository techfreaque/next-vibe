"use client";

/**
 * Share a skill with your referral link.
 * One dialog used everywhere a skill appears (skill page, favorites menu, skill browser),
 * so "Share & earn" is never more than one menu away.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "next-vibe/ui/components/dialog";
import { Div } from "next-vibe/ui/components/div";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { LogIn } from "next-vibe/ui/components/icons/LogIn";
import { UserPlus } from "next-vibe/ui/components/icons/UserPlus";
import { Input } from "next-vibe/ui/components/input";
import { Span } from "next-vibe/ui/components/span";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { getCurrentOrigin } from "next-vibe/ui/lib/location";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, useEffect, useState } from "react";

import { scopedTranslation } from "./i18n";

interface ReferralCode {
  code: string;
  label: string | null;
}

interface ShareSkillDialogProps {
  /** Public skill id/slug used in the /skill/<id> URL */
  skillId: string;
  skillName: string | null;
  locale: CountryLanguage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareSkillDialog({
  skillId,
  skillName,
  locale,
  open,
  onOpenChange,
}: ShareSkillDialogProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[calc(100%-2rem)] max-w-md gap-4 rounded-xl"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {skillName
              ? t("get.share.titleNamed", { name: skillName })
              : t("get.share.title")}
          </DialogTitle>
          <DialogDescription>{t("get.share.description")}</DialogDescription>
        </DialogHeader>
        {open && (
          <SharePanel
            skillId={skillId}
            locale={locale}
            onNavigateAway={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function SharePanel({
  skillId,
  locale,
  onNavigateAway,
}: {
  skillId: string;
  locale: CountryLanguage;
  onNavigateAway: () => void;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const navigation = useWidgetNavigation();
  const [codes, setCodes] = useState<ReferralCode[] | null>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [newCode, setNewCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user.isPublic) {
      return;
    }
    let cancelled = false;
    void (async (): Promise<void> => {
      const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
      const codesListDef = await import("@/referral/codes/list/definition");
      const result = await apiClient.fetch(
        codesListDef.default.GET,
        logger,
        user,
        {},
        undefined,
        locale,
      );
      if (cancelled) {
        return;
      }
      const fetched = result.success
        ? result.data.codes.map((c) => ({ code: c.code, label: c.label }))
        : [];
      setCodes(fetched);
      setSelectedCode(fetched[0]?.code ?? null);
    })();
    return (): void => {
      cancelled = true;
    };
  }, [user, logger, locale]);

  const goTo = (target: "signup" | "login"): void => {
    onNavigateAway();
    void (async (): Promise<void> => {
      const def =
        target === "signup"
          ? await import("@/user/public/signup/definition")
          : await import("@/user/public/login/definition");
      navigation.push(def.default.POST);
    })();
  };

  const handleCreate = async (): Promise<void> => {
    const code = newCode.trim();
    if (code.length < 3) {
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
      const referralDef = await import("@/referral/definition");
      const result = await apiClient.fetch(
        referralDef.default.POST,
        logger,
        user,
        { fieldsGrid: { code } },
        undefined,
        locale,
      );
      if (result.success) {
        setCodes((prev) => [{ code, label: null }, ...(prev ?? [])]);
        setSelectedCode(code);
        setNewCode("");
      } else {
        // Repository messages arrive translated (e.g. "code already exists")
        setCreateError(result.message || t("get.share.createFailed"));
      }
    } catch {
      setCreateError(t("get.share.createFailed"));
    } finally {
      setCreating(false);
    }
  };

  const shareUrl = selectedCode
    ? `${getCurrentOrigin()}/track?ref=${encodeURIComponent(selectedCode)}&url=${encodeURIComponent(`/${locale}/skill/${skillId}`)}`
    : null;

  const handleCopy = async (): Promise<void> => {
    if (!shareUrl) {
      return;
    }
    await copyToClipboard(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (user.isPublic) {
    return (
      <Div className="flex flex-col gap-3">
        <Span className="text-sm text-muted-foreground">
          {t("get.share.authRequired")}
        </Span>
        <Button className="h-11 gap-2" onClick={() => goTo("signup")}>
          <UserPlus className="h-4 w-4" />
          {t("get.share.signup")}
        </Button>
        <Button
          variant="ghost"
          className="h-10 gap-2 text-muted-foreground"
          onClick={() => goTo("login")}
        >
          <LogIn className="h-4 w-4" />
          {t("get.share.login")}
        </Button>
      </Div>
    );
  }

  if (codes === null) {
    return (
      <Div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      {codes.length > 0 ? (
        <>
          {codes.length > 1 && (
            <Div className="flex flex-col gap-2">
              <Span className="text-xs font-medium text-muted-foreground">
                {t("get.share.selectCode")}
              </Span>
              <Div className="flex flex-wrap gap-2">
                {codes.map((c) => (
                  <Button
                    key={c.code}
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-pressed={selectedCode === c.code}
                    className={cn(
                      "h-9 gap-1.5 font-mono text-xs",
                      selectedCode === c.code &&
                        "border-primary bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                    )}
                    onClick={() => setSelectedCode(c.code)}
                  >
                    {selectedCode === c.code && <Check className="h-3 w-3" />}
                    {c.code}
                  </Button>
                ))}
              </Div>
            </Div>
          )}
          {shareUrl && (
            <Div className="flex flex-col gap-2">
              <Span className="text-xs font-medium text-muted-foreground">
                {t("get.share.linkReady")}
              </Span>
              <Div className="break-all rounded-lg border bg-muted/50 px-3 py-2.5 font-mono text-xs leading-relaxed">
                {shareUrl}
              </Div>
              <Button className="h-11 gap-2" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    {t("get.share.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {t("get.share.copyLink")}
                  </>
                )}
              </Button>
            </Div>
          )}
        </>
      ) : (
        <Div className="flex flex-col gap-2">
          <Span className="text-sm text-muted-foreground">
            {t("get.share.noCodesYet")}
          </Span>
          <Div className="flex gap-2">
            <Input
              value={newCode}
              onChange={(e) => {
                setNewCode(e.target.value);
                setCreateError(null);
              }}
              aria-invalid={createError !== null}
              placeholder={t("get.share.codePlaceholder")}
              className="h-10 font-mono text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void handleCreate();
                }
              }}
            />
            <Button
              onClick={handleCreate}
              disabled={creating || newCode.trim().length < 3}
              className="h-10 shrink-0"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("get.share.createCode")
              )}
            </Button>
          </Div>
          {createError && (
            <Span role="alert" className="text-xs text-destructive">
              {createError}
            </Span>
          )}
        </Div>
      )}
    </Div>
  );
}
