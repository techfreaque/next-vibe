import { formatSkillId } from "next-vibe/agent/chat/slugify";
import type { UncensoredModelMethod } from "next-vibe/agent/models/models";
import type { SkillGetResponseOutput } from "next-vibe/agent/skills/[id]/definition";
import type { ContentLevelValue } from "next-vibe/agent/skills/enum";
import type { FavoriteCreateRequestOutput } from "next-vibe/agent/skills/favorites/create/definition";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowLeft } from "next-vibe/ui/components/icons/ArrowLeft";
import { DollarSign } from "next-vibe/ui/components/icons/DollarSign";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Link } from "next-vibe/ui/components/link";
import { P } from "next-vibe/ui/components/typography";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import type { JSX } from "react";

import { LeadCaptureIsland, SignedInActions } from "./action-islands";
import { LaunchpadDesign } from "./design-launchpad";
import { scopedTranslation } from "./i18n";
import { LANDING_ACTION_CLASS } from "./landing-action-style";
import type { LandingView } from "./landing-parts";
import type { SkillLandingPageData } from "./loader";
import type { SkillMessagePrice } from "./message-price";

export interface ResolvedVariantInfo {
  id: string;
  displayName: string | null;
  description: string | null;
  strength: string | null;
  weakness: string | null;
  isDefault: boolean;
  chatModelName: string | null;
  /** Public /models/<slug> page of the chat model, null when it has none. */
  chatModelSlug: string | null;
  chatModelContent: typeof ContentLevelValue | null;
  chatModelUncensoredMethod: UncensoredModelMethod | null;
  chatMessagePrice: SkillMessagePrice | null;
}

export interface ResolvedSkillModels {
  variants: ResolvedVariantInfo[];
}

export interface LeadMagnetConfigData {
  headline: string | null;
  buttonText: string | null;
}

export interface RelatedSkill {
  id: string;
  name: string;
  tagline: string | null;
  icon: IconKey | null;
}

function favoriteDataFor(
  skillId: string,
  skill: SkillGetResponseOutput,
  variantId: string | null,
): FavoriteCreateRequestOutput {
  const v =
    skill.variants.find((x) => x.id === variantId) ??
    skill.variants.find((x) => x.isDefault) ??
    skill.variants[0];
  return {
    skillId: v ? formatSkillId(skillId, v.id) : skillId,
    icon: skill.icon ?? undefined,
    modelSelection: v?.modelSelection,
    voiceModelSelection: v?.voiceModelSelection,
    sttModelSelection: v?.sttModelSelection,
    imageVisionModelSelection: v?.imageVisionModelSelection,
    videoVisionModelSelection: v?.videoVisionModelSelection,
    audioVisionModelSelection: v?.audioVisionModelSelection,
    imageGenModelSelection: v?.imageGenModelSelection,
    musicGenModelSelection: v?.musicGenModelSelection,
    videoGenModelSelection: v?.videoGenModelSelection,
  };
}

export function SkillLandingPage({
  locale,
  skillId,
  baseSkillId,
  user,
  refCode,
  resolvedModels,
  activeVariantId,
  skillData: skill,
  examplePrompts,
  categoryLabel,
  relatedSkills,
  creatorSkills,
  structuredData,
  platform,
  leadMagnetConfig,
}: SkillLandingPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const name = skill.name ?? t("hero.tryGeneric");
  const variants = resolvedModels.variants;
  const destination = `/${locale}/threads/${user.isPublic ? "incognito" : "private"}/new`;
  const withRef = (query: URLSearchParams): URLSearchParams => {
    if (refCode) {
      query.set("ref", refCode);
    }
    return query;
  };
  const chatHref = (id: string, prompt?: string): string => {
    const query = withRef(new URLSearchParams({ skill: id }));
    if (prompt) {
      query.set("q", prompt);
    }
    return `${destination}?${query}`;
  };
  const intro = (skill.description || skill.tagline || "")
    .trim()
    .replaceAll(/\s*—\s*/gu, ", ");
  const [summary = "", ...more] = intro.split(/\n\s*\n/u);
  const view: LandingView = {
    locale,
    t,
    skill,
    name,
    plainName:
      name
        .replaceAll(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, "")
        .replaceAll(/\s+/gu, " ")
        .trim() || name,
    tagline:
      skill.tagline && !summary.trim().startsWith(skill.tagline.trim())
        ? skill.tagline.trim()
        : null,
    summary,
    more: more.length > 0 ? more.join("\n\n") : null,
    categoryLabel,
    variants,
    active: variants.find((v) => v.id === activeVariantId) ?? null,
    prompts: examplePrompts,
    isGuest: user.isPublic,
    refCode,
    skillId,
    destination,
    chatHref,
    variantPageHref: (variant) => {
      const query = withRef(new URLSearchParams());
      const suffix = query.size > 0 ? `?${query}` : "";
      return `/${locale}/skill/${encodeURIComponent(formatSkillId(baseSkillId, variant.id))}${suffix}`;
    },
    relatedSkills,
    creatorSkills,
  };

  const topBar = (
    <Link
      href={`/${locale}/skills`}
      className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      {t("breadcrumb.skills")}
    </Link>
  );

  const extras = (
    <>
      <Div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
          "border-t border-border pt-6",
        )}
      >
        <P className="m-0 text-sm text-muted-foreground">
          {t("share.text", { name: view.plainName })}
        </P>
        <Div className="-ml-3.5 flex flex-wrap gap-2 sm:ml-0">
          {user.isPublic ? (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={LANDING_ACTION_CLASS}
            >
              <Link href={`/${locale}/story/earn`}>
                <DollarSign className="h-4 w-4" />
                {t("actions.shareEarn")}
              </Link>
            </Button>
          ) : (
            <SignedInActions
              share={{ locale, user, platform, skillId, skillName: name }}
              add={{
                locale,
                user,
                data: favoriteDataFor(baseSkillId, skill, activeVariantId),
              }}
            />
          )}
        </Div>
      </Div>
      {leadMagnetConfig && (
        <Div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <LeadCaptureIsland
            locale={locale}
            user={user}
            platform={platform}
            skillId={skillId}
            headline={leadMagnetConfig.headline}
            buttonText={leadMagnetConfig.buttonText}
          />
        </Div>
      )}
    </>
  );
  return (
    <Div className="bg-background text-foreground" data-testid="skill-landing">
      {structuredData && (
        <JsonLd id="skill-structured-data" data={structuredData} />
      )}
      <LaunchpadDesign view={view} topBar={topBar} extras={extras} />
    </Div>
  );
}
