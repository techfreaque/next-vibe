import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Image } from "next-vibe/ui/components/image";
import { Li } from "next-vibe/ui/components/li";
import { ExternalLink } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { Ul } from "next-vibe/ui/components/ul";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import type { FeaturedOnBadge } from "./featured-on-badges";
import { FEATURED_ON_BADGES } from "./featured-on-badges";
import { scopedTranslation } from "./i18n";

/** Rendered badge height in px. Width follows each badge's aspect ratio. */
const BADGE_HEIGHT = 28;

/**
 * Footer "Featured on" row: directory badges and backlinks.
 *
 * Badge images are self-hosted copies (see featured-on-badges.ts), sized from
 * intrinsic dimensions so the row never shifts layout. Dark-variant badges
 * swap via the `dark` class.
 */
export function FeaturedOn({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col gap-3">
      <Span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
        {t("footer.featuredOn.title")}
      </Span>
      <Ul
        aria-label={t("footer.featuredOn.ariaLabel", {
          appName: configT("appName"),
        })}
        className="flex flex-wrap items-center gap-x-3 gap-y-2.5"
      >
        {FEATURED_ON_BADGES.map((badge) => (
          <Li key={badge.slug} className="flex">
            <FeaturedOnItem badge={badge} />
          </Li>
        ))}
      </Ul>
    </Div>
  );
}

function FeaturedOnItem({ badge }: { badge: FeaturedOnBadge }): JSX.Element {
  const linkClass =
    "inline-flex items-center rounded-md opacity-75 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  if (badge.kind === "text") {
    return (
      <ExternalLink
        href={badge.href}
        rel={badge.rel}
        target="_blank"
        title={badge.name}
        className={`${linkClass} h-7 border border-border bg-background px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground`}
      >
        {badge.name}
      </ExternalLink>
    );
  }

  // Intrinsic-ratio width at the row height; h-7 + w-auto keeps the ratio and
  // max-w-full lets wide badges shrink instead of overflowing on phones.
  const width = Math.round((badge.width / badge.height) * BADGE_HEIGHT);
  const imgClass = "h-7 w-auto max-w-full object-contain";

  return (
    <ExternalLink
      href={badge.href}
      rel={badge.rel}
      target="_blank"
      title={badge.name}
      className={linkClass}
    >
      <Image
        src={badge.img}
        alt={badge.alt}
        width={width}
        height={BADGE_HEIGHT}
        unoptimized
        className={`${imgClass} ${badge.imgDark ? "block dark:hidden" : "block"}`}
      />
      {badge.imgDark ? (
        <Image
          src={badge.imgDark}
          alt={badge.alt}
          width={width}
          height={BADGE_HEIGHT}
          unoptimized
          className={`${imgClass} hidden dark:block`}
        />
      ) : null}
    </ExternalLink>
  );
}
