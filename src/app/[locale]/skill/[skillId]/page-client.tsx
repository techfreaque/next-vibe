"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Container } from "next-vibe-ui/ui/container";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Link } from "next-vibe-ui/ui/link";
import { Nav } from "next-vibe-ui/ui/nav";
import { Span } from "next-vibe-ui/ui/span";
import { H2, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useCallback, useState } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { scopedTranslation } from "./i18n";

import skillDefs from "@/app/api/[locale]/agent/chat/skills/[id]/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

// ─── types ────────────────────────────────────────────────────────────────────

/** Per-variant resolved model info - all computed server-side to avoid SSR circular deps */
export interface ResolvedVariantInfo {
  id: string;
  displayName: string | null;
  chatModelName: string | null;
  chatProviderName: string | null;
  chatProviderIcon: string | null;
  chatCreditCost: string | null;
  voiceModelName: string | null;
  imageGenModelName: string | null;
  imageGenCreditCost: string | null;
  musicGenModelName: string | null;
  videoGenModelName: string | null;
  hasStt: boolean;
  hasImageVision: boolean;
  hasVideoVision: boolean;
  hasAudioVision: boolean;
  toolCount: number;
}

export interface ResolvedSkillModels {
  variants: ResolvedVariantInfo[];
  voiceName: string | null;
  imageGenName: string | null;
  musicGenName: string | null;
  videoGenName: string | null;
  hasStt: boolean;
}

// ─── types ────────────────────────────────────────────────────────────────────

export interface LeadMagnetConfigData {
  headline: string | null;
  buttonText: string | null;
}

// ─── props ────────────────────────────────────────────────────────────────────

export interface SkillLandingPageProps {
  locale: CountryLanguage;
  skillId: string;
  user: JwtPayloadType;
  /** Pre-built sign-up URL with ref/skillId params, resolved server-side */
  signupUrl: string;
  appName: string;
  resolvedModels: ResolvedSkillModels;
  leadMagnetConfig: LeadMagnetConfigData | null;
}

// ─── lead capture form ────────────────────────────────────────────────────────

type CaptureState = "idle" | "submitting" | "done" | "error";

function LeadCaptureForm({
  skillId,
  config,
  signupUrl,
  locale,
  t,
}: {
  skillId: string;
  config: LeadMagnetConfigData;
  signupUrl: string;
  locale: CountryLanguage;
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
}): JSX.Element {
  const [state, setState] = useState<CaptureState>("idle");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [resolvedSignupUrl, setResolvedSignupUrl] = useState(signupUrl);

  const handleSubmit = useCallback((): void => {
    if (!firstName.trim() || !email.trim()) {
      return;
    }
    setState("submitting");
    void (async (): Promise<void> => {
      try {
        const [{ apiClient }, captureDef] = await Promise.all([
          import("@/app/api/[locale]/system/unified-interface/react/hooks/store"),
          import("@/app/api/[locale]/lead-magnet/capture/definition"),
        ]);
        const logger = createEndpointLogger(false, Date.now(), locale);
        const result = await apiClient.mutate(
          captureDef.POST,
          logger,
          { id: "", isPublic: true, roles: [], leadId: "" } as never,
          { skillId, firstName: firstName.trim(), email: email.trim() },
          undefined,
          locale,
        );
        if (result.success) {
          setResolvedSignupUrl(result.data.signupUrl);
          setState("done");
        } else {
          setState("error");
        }
      } catch {
        setState("error");
      }
    })();
  }, [skillId, firstName, email, locale]);

  const headline =
    config.headline ?? t("list.headline", { name: "", creatorName: "" });
  const buttonLabel = config.buttonText ?? t("list.send");

  if (state === "done") {
    return (
      <Div
        style={{
          padding: "32px 24px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "center",
        }}
      >
        <H2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
          {t("list.doneHeading")}
        </H2>
        <P style={{ color: "rgba(255,255,255,0.55)", margin: 0 }}>
          {t("list.doneSub")}
        </P>
        <Link href={resolvedSignupUrl} className="no-underline">
          <Span className="text-sm font-semibold px-5 py-2 rounded-lg bg-violet-600 text-white cursor-pointer">
            {t("list.doneAction")}
          </Span>
        </Link>
      </Div>
    );
  }

  return (
    <Div
      style={{
        padding: "36px 24px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <H2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>
        {headline}
      </H2>
      <Div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
          maxWidth: 380,
        }}
      >
        <Input
          value={firstName}
          onChange={(e): void => {
            setFirstName(e.target.value);
          }}
          placeholder={t("list.namePlaceholder")}
          disabled={state === "submitting"}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500"
        />
        <Input
          type="email"
          value={email}
          onChange={(e): void => {
            setEmail(e.target.value);
          }}
          placeholder={t("list.emailPlaceholder")}
          disabled={state === "submitting"}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500"
        />
        <Button
          onClick={handleSubmit}
          disabled={
            state === "submitting" || !firstName.trim() || !email.trim()
          }
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          {state === "submitting" ? t("list.sending") : buttonLabel}
        </Button>
        {state === "error" && (
          <Span style={{ fontSize: 12, color: "rgba(255,100,100,0.8)" }}>
            {t("list.error")}
          </Span>
        )}
      </Div>
      <Span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
        {t("list.finePrint")}
      </Span>
    </Div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function SkillLandingPage({
  locale,
  skillId,
  user,
  signupUrl,
  appName,
  leadMagnetConfig,
}: SkillLandingPageProps): JSX.Element {
  const isGuest = !user || user.isPublic;
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div
      style={{
        minHeight: "100vh",
        background: "#16082a",
        color: "#fff",
        fontFamily: "inherit",
      }}
    >
      {/* ── NAV ── */}
      <Nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(22,8,42,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Link
          href={`/${locale}`}
          className="text-xs no-underline text-white/60 hover:text-white/90 transition-colors"
        >
          {t("nav.backArrow")} {appName}
        </Link>
        <Div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {isGuest ? (
            <>
              <Link
                href={`/${locale}/user/login`}
                className="text-xs no-underline px-3 py-1.5 opacity-45 text-white"
              >
                {t("nav.enter")}
              </Link>
              <Link href={signupUrl} className="no-underline">
                <Span className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-violet-600 text-white cursor-pointer">
                  {t("nav.join")}
                </Span>
              </Link>
            </>
          ) : (
            <Link
              href={`/${locale}/threads`}
              className="text-xs no-underline px-3 py-1.5 text-white/60"
            >
              {t("nav.allSkills")} {t("nav.forwardArrow")}
            </Link>
          )}
        </Div>
      </Nav>

      {/* ── SKILL WIDGET - full page, IS the hero ── */}
      <Container
        size="lg"
        style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 720 }}
      >
        <EndpointsPage
          endpoint={skillDefs}
          endpointOptions={{
            read: {
              urlPathParams: { id: skillId },
              queryOptions: { staleTime: 60_000 },
            },
            update: { urlPathParams: { id: skillId } },
            delete: { urlPathParams: { id: skillId } },
          }}
          locale={locale}
          user={user}
          forceMethod="GET"
        />
      </Container>

      {/* ── LEAD CAPTURE ── */}
      {leadMagnetConfig && (
        <Container size="lg" style={{ maxWidth: 720 }}>
          <LeadCaptureForm
            skillId={skillId}
            config={leadMagnetConfig}
            signupUrl={signupUrl}
            locale={locale}
            t={t}
          />
        </Container>
      )}

      {/* ── FOOTER ── */}
      <Div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "20px 24px",
        }}
      >
        <Container size="lg">
          <Div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <Span style={{ fontSize: 12, opacity: 0.4 }}>
              {t("nav.copyright")} {appName}
            </Span>
            {isGuest && (
              <Link href={signupUrl} className="no-underline">
                <Span className="text-xs font-semibold px-4 py-1.5 rounded-lg border border-white/10 text-white/60 cursor-pointer">
                  {t("nav.join")} {t("nav.forwardArrow")}
                </Span>
              </Link>
            )}
          </Div>
        </Container>
      </Div>
    </Div>
  );
}
