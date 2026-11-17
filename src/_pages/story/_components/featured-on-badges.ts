/**
 * Directory badges shown in the story footer ("Featured on").
 *
 * Several directories list us for free only while their badge or a crawlable
 * link to them stays on the site. Keep each entry's href, rel and image
 * exactly as the directory's official snippet asks; removing one can get the
 * listing dropped.
 */

interface FeaturedOnBase {
  /** Stable key */
  slug: string;
  /** Directory name, used as link title (and label for text links) */
  name: string;
  /** Exact link target from the directory's snippet */
  href: string;
  /** rel the directory requires; most free tiers want a followed link */
  rel: string;
}

interface FeaturedOnImageBadge extends FeaturedOnBase {
  kind: "image";
  /** Hotlinked badge image (light theme, or the only variant) */
  img: string;
  /** Optional dark-theme variant */
  imgDark?: string;
  alt: string;
  /** Intrinsic size, used for the aspect ratio so the row never shifts */
  width: number;
  height: number;
}

interface FeaturedOnTextLink extends FeaturedOnBase {
  kind: "text";
}

export type FeaturedOnBadge = FeaturedOnImageBadge | FeaturedOnTextLink;

/**
 * Images are self-hosted under /public/badges (copies of each directory's
 * official badge), so visitors never load third-party images from our footer.
 * The directories' checkers look for the link to them, which stays exact.
 * Researched 2026-11-17. Not added (yet): TheSaaSDir, tools.cafe, Fazier,
 * EffectHub, neeed (their href is our listing page, which only exists after
 * approval), AITrustList (needs DR 25), DokeyAI (links a third party),
 * Vantaige (rejects uncensored tools).
 */
export const FEATURED_ON_BADGES: readonly FeaturedOnBadge[] = [
  // Already listed
  {
    kind: "image",
    slug: "aitoolscapital",
    name: "AI Tools Capital",
    href: "https://aitoolscapital.com/tools/unbottled-ai?utm_source=badge&utm_medium=referral&utm_campaign=featured_badge",
    rel: "noopener",
    img: "/images/badges/aitoolscapital-light.svg",
    imgDark: "/images/badges/aitoolscapital-dark.svg",
    alt: "Featured on AI Tools Capital",
    width: 260,
    height: 60,
  },
  {
    kind: "text",
    slug: "kisyndikat",
    name: "KI-Syndikat",
    href: "https://www.ki-syndikat.de/",
    rel: "noopener",
  },
  {
    kind: "text",
    slug: "alleki",
    name: "alleKI",
    href: "https://alleki.de/ki-tool/unbottled-ai/",
    rel: "noopener",
  },
  // Free listing requires the badge or a followed link
  {
    kind: "image",
    slug: "opensourcealternatives",
    name: "Open Source Alternatives",
    href: "https://www.opensourcealternatives.to",
    rel: "noopener",
    img: "/images/badges/opensourcealternatives.svg",
    alt: "As seen on Open Source Alternatives",
    width: 378,
    height: 28,
  },
  {
    kind: "image",
    slug: "dang",
    name: "DANG!",
    href: "https://dang.ai",
    rel: "noopener",
    img: "/images/badges/dang-light.png",
    imgDark: "/images/badges/dang-dark.png",
    alt: "Verified on DANG!",
    width: 550,
    height: 198,
  },
  {
    kind: "image",
    slug: "postmake",
    name: "Postmake",
    href: "https://postmake.io/submit",
    rel: "noopener",
    img: "/images/badges/postmake-light.png",
    imgDark: "/images/badges/postmake-dark.png",
    alt: "Featured on the Postmake directory",
    width: 606,
    height: 192,
  },
  {
    // Text link: their SVG badge depends on a web font, so in an <img> the
    // label overlaps the star. A plain followed link is accepted.
    kind: "text",
    slug: "101aitools",
    name: "101 AI Tools",
    href: "https://101aitools.com",
    rel: "noopener",
  },
  {
    kind: "image",
    slug: "bestekitools",
    name: "Beste KI Tools",
    href: "https://bestekitools.com",
    rel: "noopener",
    img: "/images/badges/bestekitools-light.svg",
    imgDark: "/images/badges/bestekitools-dark.svg",
    alt: "Vorgestellt auf Beste KI Tools",
    width: 239,
    height: 64,
  },
  {
    kind: "image",
    slug: "toolpilot",
    name: "ToolPilot",
    href: "https://www.toolpilot.ai",
    rel: "noopener",
    img: "/images/badges/toolpilot-light.png",
    imgDark: "/images/badges/toolpilot-dark.png",
    alt: "Featured on ToolPilot",
    width: 300,
    height: 66,
  },
  {
    kind: "image",
    slug: "whatsthebigdata",
    name: "What's the Big Data",
    href: "https://whatsthebigdata.com/ai-tools/",
    rel: "noopener",
    img: "/images/badges/whatsthebigdata.jpg",
    alt: "Whatsthebigdata AI Tools Directory",
    width: 1024,
    height: 331,
  },
  {
    kind: "text",
    slug: "aitooltrek",
    name: "AI Tool Trek",
    href: "https://aitooltrek.com",
    rel: "noopener",
  },
  {
    kind: "text",
    slug: "t0ai",
    name: "T0AI",
    href: "https://t0ai.com",
    rel: "noopener",
  },
];
