/**
 * Blog post: every music, text-to-speech and speech-to-text model on the
 * platform, from the model registry.
 * /[locale]/story/blog/ai-music-and-voice-generators
 *
 * Models, clip lengths, voices, labs and prices are read from
 * src/vibe/agent/{music-generation,text-to-speech,speech-to-text}/models.ts
 * with the same route resolution (cheapest sellable provider) and markup the
 * model pages use. Free credits, plans and limits come from config and the
 * endpoint schemas. Nothing numeric is hardcoded in copy.
 */

import type { Metadata } from "next";
import {
  type AgentEnvAvailability,
  getEnvAvailability,
} from "next-vibe/agent/env-availability";
import { roundMediaCost } from "next-vibe/agent/models/models";
import {
  DEFAULT_MUSIC_GEN_MODEL_SELECTION,
  MUSIC_GEN_ALIAS,
} from "next-vibe/agent/music-generation/constants";
import { MUSIC_DURATION_SECONDS } from "next-vibe/agent/music-generation/enum";
import {
  getMusicGenModelById,
  musicGenModelDefinitions,
  MusicGenModelId,
} from "next-vibe/agent/music-generation/models";
import { ContentLevel, ModelSelectionType } from "next-vibe/agent/skills/enum";
import {
  DEFAULT_STT_MODEL_ID,
  TRANSCRIBE_AUDIO_ALIAS,
} from "next-vibe/agent/speech-to-text/constants";
import {
  sttModelDefinitions,
  SttModelId,
  sttModelOptions,
} from "next-vibe/agent/speech-to-text/models";
import {
  DEFAULT_TTS_VOICE_ID,
  TEXT_TO_SPEECH_ALIAS,
} from "next-vibe/agent/text-to-speech/constants";
import {
  getTtsModelById,
  ttsModelDefinitions,
  TtsModelId,
} from "next-vibe/agent/text-to-speech/models";
import type {
  CountryLanguage,
  Currencies,
} from "next-vibe/core/i18n/core/config";
import { getCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { formatCurrency } from "next-vibe/core/i18n/core/localization-utils";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Mic } from "next-vibe/ui/components/icons/Mic";
import { Music } from "next-vibe/ui/components/icons/Music";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { Volume2 } from "next-vibe/ui/components/icons/Volume2";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import {
  creditValueText,
  formatNumber,
} from "@/_pages/models/_shared/model-format";
import {
  listMediaFacts,
  type MediaType,
} from "@/_pages/models/_shared/model-media-facts";
import { scopedTranslation as modelsScopedTranslation } from "@/_pages/models/i18n";
import { configScopedTranslation } from "@/env/i18n";
import {
  CREDIT_VALUE_USD,
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
  STANDARD_MARKUP_PERCENTAGE,
} from "@/products/constants";
import { ProductIds, productsRepository } from "@/products/platform-products";

import {
  ArticleBody,
  ArticleEnd,
  ArticleH3,
  ArticleHeader,
  ArticleLead,
  ArticleList,
  ArticleP,
  ArticleScroll,
  ArticleSection,
} from "../../_shared/article";
import {
  Callout,
  CardLink,
  Cta,
  Step,
  StepList,
} from "../../_shared/marketing";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "ai-music-and-voice-generators";

/**
 * Rough characters per minute of spoken English (about 150 words of ~6
 * characters incl. spaces). Only used for the "about one minute" estimate,
 * never for billing; billing counts the real characters.
 */
const SPOKEN_CHARS_PER_MINUTE = 900;

/** Text the text-to-speech tool takes per request (definition schema max). */
const TTS_MAX_CHARS = 5000;
/** Prompt the music tool takes (definition schema max). */
const MUSIC_PROMPT_MAX_CHARS = 2000;
/** Per-file size and file count the transcription tool takes (definition schema). */
const STT_MAX_FILE_MB = 25;
const STT_MAX_FILES = 20;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

type Tier = "mainstream" | "open" | "uncensored";

const VOICE_STYLES = [
  "conversational",
  "warm",
  "deep",
  "expressive",
  "calm",
  "friendly",
  "authoritative",
  "clear",
  "soft",
  "steady",
  "confident",
  "british",
  "lively",
  "bright",
  "upbeat",
] as const;
type VoiceStyle = (typeof VOICE_STYLES)[number];

function isVoiceStyle(value: string | undefined): value is VoiceStyle {
  return VOICE_STYLES.some((style) => style === value);
}

export interface MusicModelRow {
  id: MusicGenModelId;
  slug: string;
  name: string;
  lab: string;
  tier: Tier;
  /** Clip lengths a request can land on, in seconds, ascending. */
  lengths: number[];
  /** Charged credits per clip (markup included, billing rounding). */
  clipCredits: number;
  clipPrice: string;
}

export interface VoiceRow {
  id: TtsModelId;
  slug: string;
  name: string;
  lab: string;
  tier: Tier;
  gender: "male" | "female" | "neutral" | null;
  style: VoiceStyle | null;
  /** Charged credits per 1,000 characters (markup included). */
  creditsPer1k: number;
  /** Price of about one minute of speech. */
  minutePrice: string;
}

export interface SttRow {
  id: SttModelId;
  slug: string;
  name: string;
  lab: string;
  tier: Tier;
  /** Charged credits per minute of audio (markup included). */
  creditsPerMinute: number;
  hourPrice: string;
}

export interface AudioPostPageData {
  locale: CountryLanguage;
  music: MusicModelRow[];
  voices: VoiceRow[];
  stt: SttRow[];
  labCount: number;
  defaultMusicName: string;
  defaultVoiceName: string;
  defaultSttName: string;
  subPrice: string;
  subCredits: number;
  packPrice: string;
  packCredits: number;
}

function tierOf(content: string): Tier {
  if (content === ContentLevel.UNCENSORED) {
    return "uncensored";
  }
  if (content === ContentLevel.OPEN) {
    return "open";
  }
  return "mainstream";
}

/** What the user is charged per unit: provider rate plus the standard markup. */
function charged(providerCredits: number): number {
  return providerCredits * (1 + STANDARD_MARKUP_PERCENTAGE);
}

/** Same rule as the model pages: 1 credit = 0.01 EUR in DE, else 0.01 USD. */
function creditCurrency(locale: CountryLanguage): Currencies {
  return getCountryFromLocale(locale) === "DE" ? "EUR" : "USD";
}

/** Currency with enough decimals for sub-cent amounts (0.0021 instead of 0.00). */
function formatSmallCurrency(
  amount: number,
  currency: Currencies,
  locale: CountryLanguage,
): string {
  if (amount >= 0.1) {
    return formatCurrency(amount, currency, locale);
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumSignificantDigits: 2,
  }).format(amount);
}

function facts(
  type: MediaType,
  id: string,
  availability: AgentEnvAvailability,
): {
  slug: string;
  lab: string;
  isLegacy: boolean;
} | null {
  const found = listMediaFacts(availability).find(
    (f) => f.type === type && f.modelId === id,
  );
  return found
    ? { slug: found.slug, lab: found.labName, isLegacy: found.isLegacy }
    : null;
}

function buildMusicRow(
  id: MusicGenModelId,
  locale: CountryLanguage,
  currency: Currencies,
  availability: AgentEnvAvailability,
): MusicModelRow | null {
  const fact = facts("audio", id, availability);
  const option = getMusicGenModelById(id);
  if (!fact || fact.isLegacy || !option) {
    return null;
  }
  // The generator snaps every request to the model's supported lengths after
  // clamping to its minimum (music-generation/repository.ts).
  const listed = (option.supportedDurations ?? []).map(
    (d) => MUSIC_DURATION_SECONDS[d] ?? Number(d),
  );
  const lengths = [
    ...new Set(
      (listed.length > 0 ? listed : [option.defaultDurationSeconds])
        .filter((s) => Number.isFinite(s))
        .map((s) => Math.max(s, option.minDurationSeconds ?? 0)),
    ),
  ].toSorted((a, b) => a - b);
  const clipCredits = roundMediaCost(charged(option.creditCostPerClip));
  return {
    id,
    slug: fact.slug,
    name: musicGenModelDefinitions[id].name,
    lab: fact.lab,
    tier: tierOf(musicGenModelDefinitions[id].content),
    lengths,
    clipCredits,
    clipPrice: formatCurrency(clipCredits * CREDIT_VALUE_USD, currency, locale),
  };
}

function buildVoiceRow(
  id: TtsModelId,
  locale: CountryLanguage,
  currency: Currencies,
  availability: AgentEnvAvailability,
): VoiceRow | null {
  const fact = facts("tts", id, availability);
  const option = getTtsModelById(id);
  if (!fact || fact.isLegacy || !option) {
    return null;
  }
  const def = ttsModelDefinitions[id];
  const perChar = charged(option.creditCostPerCharacter);
  const style = def.voiceMeta?.style;
  return {
    id,
    slug: fact.slug,
    name: def.name,
    lab: fact.lab,
    tier: tierOf(def.content),
    gender: def.voiceMeta?.gender ?? null,
    style: isVoiceStyle(style) ? style : null,
    creditsPer1k: perChar * 1000,
    minutePrice: formatSmallCurrency(
      perChar * SPOKEN_CHARS_PER_MINUTE * CREDIT_VALUE_USD,
      currency,
      locale,
    ),
  };
}

function buildSttRow(
  id: SttModelId,
  locale: CountryLanguage,
  currency: Currencies,
  availability: AgentEnvAvailability,
): SttRow | null {
  const fact = facts("stt", id, availability);
  // Options are sorted cheapest provider first per model.
  const option = sttModelOptions.find((o) => o.id === id);
  if (!fact || fact.isLegacy || !option) {
    return null;
  }
  const def = sttModelDefinitions[id];
  const perSecond = charged(option.creditCostPerSecond);
  return {
    id,
    slug: fact.slug,
    name: def.name,
    lab: fact.lab,
    tier: tierOf(def.content),
    creditsPerMinute: perSecond * 60,
    hourPrice: formatSmallCurrency(
      perSecond * 3600 * CREDIT_VALUE_USD,
      currency,
      locale,
    ),
  };
}

export async function tanstackLoader({
  params,
}: Props): Promise<AudioPostPageData> {
  const { locale } = await params;
  const currency = creditCurrency(locale);
  const availability = await getEnvAvailability();
  const products = productsRepository.getProducts(locale);
  const subscription = products[ProductIds.SUBSCRIPTION];
  const pack = products[ProductIds.CREDIT_PACK];
  const music = Object.values(MusicGenModelId)
    .flatMap((id) => {
      const row = buildMusicRow(id, locale, currency, availability);
      return row ? [row] : [];
    })
    .toSorted((a, b) => a.clipCredits - b.clipCredits);
  const voices = Object.values(TtsModelId)
    .flatMap((id) => {
      const row = buildVoiceRow(id, locale, currency, availability);
      return row ? [row] : [];
    })
    .toSorted((a, b) => a.creditsPer1k - b.creditsPer1k);
  const stt = Object.values(SttModelId)
    .flatMap((id) => {
      const row = buildSttRow(id, locale, currency, availability);
      return row ? [row] : [];
    })
    .toSorted((a, b) => a.creditsPerMinute - b.creditsPerMinute);
  const defaultMusicId =
    DEFAULT_MUSIC_GEN_MODEL_SELECTION.selectionType ===
    ModelSelectionType.MANUAL
      ? DEFAULT_MUSIC_GEN_MODEL_SELECTION.manualModelId
      : MusicGenModelId.LYRIA_3;
  return {
    locale,
    music,
    voices,
    stt,
    labCount: new Set([...music, ...voices, ...stt].map((r) => r.lab)).size,
    defaultMusicName: musicGenModelDefinitions[defaultMusicId].name,
    defaultVoiceName: ttsModelDefinitions[DEFAULT_TTS_VOICE_ID].name,
    defaultSttName: sttModelDefinitions[DEFAULT_STT_MODEL_ID].name,
    subPrice: formatCurrency(subscription.price, subscription.currency, locale),
    subCredits: subscription.credits,
    packPrice: formatCurrency(pack.price, pack.currency, locale),
    packCredits: pack.credits,
  };
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const { music, voices, stt } = await tanstackLoader({ params });
  const counts = {
    appName,
    musicCount: music.length,
    voiceCount: voices.length,
    sttCount: stt.length,
  };
  return metadataGenerator(locale, {
    path: `story/blog/${SLUG}`,
    title: t("meta.title", counts),
    category: t("meta.category"),
    description: t("meta.description", counts),
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

const LINK_CLASS =
  "font-medium text-primary underline-offset-4 hover:underline";

function headCell(label: string, key: string): JSX.Element {
  return (
    <TableHead
      key={key}
      className="text-xs font-semibold uppercase tracking-wide"
    >
      {label}
    </TableHead>
  );
}

function ModelLink({
  slug,
  name,
  locale,
}: {
  slug: string;
  name: string;
  locale: CountryLanguage;
}): JSX.Element {
  return (
    <Link href={`/${locale}/models/${slug}`} className={LINK_CLASS}>
      {name}
    </Link>
  );
}

type MusicPick = "songs" | "beats" | "short";
const MUSIC_PICKS: readonly {
  key: MusicPick;
  models: readonly MusicGenModelId[];
}[] = [
  {
    key: "songs",
    models: [
      MusicGenModelId.SONAUTO_SONG,
      MusicGenModelId.ELEVENLABS_MUSIC,
      MusicGenModelId.LYRIA_3_PRO_PREVIEW,
      MusicGenModelId.LYRIA_3,
    ],
  },
  {
    key: "beats",
    models: [
      MusicGenModelId.MUSICGEN_STEREO,
      MusicGenModelId.MUSIC_GEN,
      MusicGenModelId.LYRIA_3,
    ],
  },
  {
    key: "short",
    models: [
      MusicGenModelId.LYRIA_3_CLIP_PREVIEW,
      MusicGenModelId.MUSICGEN_STEREO,
    ],
  },
];

type VoicePick =
  | "everyday"
  | "natural"
  | "multilingual"
  | "expressive"
  | "budget";
const VOICE_PICKS: readonly {
  key: VoicePick;
  models: readonly TtsModelId[];
  keep: (row: VoiceRow) => boolean;
}[] = [
  {
    key: "everyday",
    models: [
      TtsModelId.OPENAI_NOVA,
      TtsModelId.OPENAI_ALLOY,
      TtsModelId.OPENAI_ONYX,
    ],
    keep: () => true,
  },
  {
    key: "natural",
    models: [
      TtsModelId.ELEVENLABS_RACHEL,
      TtsModelId.ELEVENLABS_JOSH,
      TtsModelId.ELEVENLABS_BELLA,
      TtsModelId.ELEVENLABS_ADAM,
    ],
    keep: () => true,
  },
  {
    key: "multilingual",
    models: [TtsModelId.GEMINI_ZEPHYR, TtsModelId.GEMINI_PUCK],
    keep: () => true,
  },
  {
    key: "expressive",
    models: [
      TtsModelId.XAI_EVE,
      TtsModelId.OPENAI_FABLE,
      TtsModelId.INWORLD_MINI_ASHLEY,
    ],
    keep: () => true,
  },
  {
    key: "budget",
    models: [
      TtsModelId.KOKORO_BELLA,
      TtsModelId.KOKORO_MICHAEL,
      TtsModelId.KOKORO_EMMA,
      TtsModelId.KOKORO_GEORGE,
    ],
    keep: (row) => row.tier === "uncensored",
  },
];

type SttPick = "cheapest" | "accuracy" | "languages" | "fast";
const STT_PICKS: readonly {
  key: SttPick;
  models: readonly SttModelId[];
}[] = [
  { key: "cheapest", models: [SttModelId.WHISPER_LARGE_V3] },
  {
    key: "accuracy",
    models: [SttModelId.GPT4O_MINI_TRANSCRIBE, SttModelId.OPENAI_WHISPER],
  },
  {
    key: "languages",
    models: [
      SttModelId.WHISPER_LARGE_V3,
      SttModelId.NEMOTRON_ASR,
      SttModelId.VOXTRAL_MINI_TRANSCRIBE,
    ],
  },
  {
    key: "fast",
    models: [SttModelId.DEEPGRAM_NOVA_2, SttModelId.NEMOTRON_ASR],
  },
];

const CHAT_STEPS: readonly (
  | "song"
  | "voice"
  | "dictate"
  | "transcribe"
  | "call"
)[] = ["song", "voice", "dictate", "transcribe", "call"];

const FAQ_KEYS: readonly (
  | "bestMusic"
  | "suno"
  | "vocals"
  | "bestVoice"
  | "free"
  | "transcribeCost"
  | "cloning"
  | "uncensored"
)[] = [
  "bestMusic",
  "suno",
  "vocals",
  "bestVoice",
  "free",
  "transcribeCost",
  "cloning",
  "uncensored",
];

export function TanstackPage({
  locale,
  music,
  voices,
  stt,
  labCount,
  defaultMusicName,
  defaultVoiceName,
  defaultSttName,
  subPrice,
  subCredits,
  packPrice,
  packCredits,
}: AudioPostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const { t: modelsT } = modelsScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const num = (value: number): string => formatNumber(value, locale);
  const fine = (value: number): string =>
    new Intl.NumberFormat(locale, { maximumSignificantDigits: 2 }).format(
      value,
    );

  const musicById = new Map(music.map((row) => [row.id, row]));
  const voiceById = new Map(voices.map((row) => [row.id, row]));
  const sttById = new Map(stt.map((row) => [row.id, row]));

  const cheapMusic = music[0];
  const priceyMusic = music.at(-1);
  const longestMusic = Math.max(0, ...music.flatMap((r) => r.lengths));
  const cheapVoice = voices[0];
  const priceyVoice = voices.at(-1);
  const cheapStt = stt[0];
  const priceySttRow = stt.at(-1);
  const uncensoredVoiceCount = voices.filter(
    (r) => r.tier === "uncensored",
  ).length;
  const freeClips =
    cheapMusic && cheapMusic.clipCredits > 0
      ? Math.floor(FREE_CREDIT_SIGNED_IN_TOTAL / cheapMusic.clipCredits)
      : 0;
  const freeVoiceMinutes =
    cheapVoice && cheapVoice.creditsPer1k > 0
      ? Math.floor(
          FREE_CREDIT_SIGNED_IN_TOTAL /
            ((cheapVoice.creditsPer1k * SPOKEN_CHARS_PER_MINUTE) / 1000),
        )
      : 0;
  const subSttHours =
    cheapStt && cheapStt.creditsPerMinute > 0
      ? Math.floor(subCredits / (cheapStt.creditsPerMinute * 60))
      : 0;

  const stats = {
    appName,
    musicCount: music.length,
    voiceCount: voices.length,
    sttCount: stt.length,
    modelCount: music.length + voices.length + stt.length,
    labCount,
    uncensoredVoiceCount,
    markup: Math.round(STANDARD_MARKUP_PERCENTAGE * 100),
    creditValue: creditValueText(locale, modelsT),
    defaultMusic: defaultMusicName,
    defaultVoice: defaultVoiceName,
    defaultStt: defaultSttName,
    cheapMusicName: cheapMusic?.name ?? "",
    cheapMusicCredits: num(cheapMusic?.clipCredits ?? 0),
    cheapMusicPrice: cheapMusic?.clipPrice ?? "",
    priceyMusicName: priceyMusic?.name ?? "",
    priceyMusicCredits: num(priceyMusic?.clipCredits ?? 0),
    priceyMusicPrice: priceyMusic?.clipPrice ?? "",
    longestMusic,
    cheapVoiceName: cheapVoice?.name ?? "",
    cheapVoiceCredits: fine(cheapVoice?.creditsPer1k ?? 0),
    cheapVoiceMinute: cheapVoice?.minutePrice ?? "",
    priceyVoiceName: priceyVoice?.name ?? "",
    priceyVoiceCredits: fine(priceyVoice?.creditsPer1k ?? 0),
    priceyVoiceMinute: priceyVoice?.minutePrice ?? "",
    cheapSttName: cheapStt?.name ?? "",
    cheapSttCredits: fine(cheapStt?.creditsPerMinute ?? 0),
    cheapSttHour: cheapStt?.hourPrice ?? "",
    priceySttName: priceySttRow?.name ?? "",
    priceySttCredits: fine(priceySttRow?.creditsPerMinute ?? 0),
    priceySttHour: priceySttRow?.hourPrice ?? "",
    charsPerMinute: num(SPOKEN_CHARS_PER_MINUTE),
    ttsMaxChars: num(TTS_MAX_CHARS),
    promptMaxChars: num(MUSIC_PROMPT_MAX_CHARS),
    sttMaxMb: STT_MAX_FILE_MB,
    sttMaxFiles: STT_MAX_FILES,
    guestCredits: FREE_CREDIT_ALLOWANCE.guest,
    freeCredits: FREE_CREDIT_SIGNED_IN_TOTAL,
    maxCredits: FREE_CREDIT_MAX_TOTAL,
    freeClips,
    freeVoiceMinutes,
    subSttHours,
    subPrice,
    subCredits,
    packPrice,
    packCredits,
  };

  const tierText = (tier: Tier): string => t(`tiers.${tier}`);
  const lengthText = (row: MusicModelRow): string =>
    row.lengths.length > 1
      ? t("music.lengthChoice", {
          lengths: row.lengths.join(" / "),
        })
      : t("music.lengthFixed", { seconds: row.lengths[0] ?? 0 });
  const voiceText = (row: VoiceRow): string => {
    const gender = row.gender ? t(`voices.gender.${row.gender}`) : "";
    const style = row.style ? t(`voices.style.${row.style}`) : "";
    return [gender, style].filter((part) => part.length > 0).join(", ");
  };

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        post={{ slug: SLUG, locale }}
        title={t("hero.title", stats)}
        subtitle={t("hero.subtitle", stats)}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.lead")}</ArticleLead>
          <ArticleP>{t("intro.p2", stats)}</ArticleP>
          <ArticleList
            items={[
              t("intro.songs", stats),
              t("intro.beats", stats),
              t("intro.voiceovers", stats),
              t("intro.transcription", stats),
            ]}
          />
        </Div>

        {/* ── Music ─────────────────────────────────────────────── */}
        <ArticleSection
          id="music"
          title={t("music.title", stats)}
          intro={t("music.intro", stats)}
        >
          <ArticleScroll>
            <Div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table className="min-w-[40rem]">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    {headCell(t("music.colModel"), "model")}
                    {headCell(t("music.colLength"), "length")}
                    {headCell(t("music.colTier"), "tier")}
                    {headCell(t("music.colCredits"), "credits")}
                    {headCell(t("music.colPrice"), "price")}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {music.map((row) => (
                    <TableRow key={row.id} data-model={row.id}>
                      <TableCell className="align-top">
                        <ModelLink
                          slug={row.slug}
                          name={row.name}
                          locale={locale}
                        />
                        <Span className="block text-xs text-muted-foreground">
                          {row.lab}
                        </Span>
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums text-muted-foreground">
                        {lengthText(row)}
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {tierText(row.tier)}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums text-foreground">
                        {num(row.clipCredits)}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums font-semibold text-foreground">
                        {row.clipPrice}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Div>
          </ArticleScroll>
          <ArticleP>{t("music.footnote", stats)}</ArticleP>

          {MUSIC_PICKS.map((group) => {
            const picked = group.models.flatMap((id) => {
              const row = musicById.get(id);
              return row ? [row] : [];
            });
            if (picked.length === 0) {
              return null;
            }
            return (
              <Div key={group.key} className="flex flex-col gap-3">
                <ArticleH3>{t(`music.picks.${group.key}.title`)}</ArticleH3>
                <ArticleP>{t(`music.picks.${group.key}.body`, stats)}</ArticleP>
                <ArticleList
                  items={picked.map((row) => (
                    <Span key={row.id} className="flex flex-col gap-0.5">
                      <ModelLink
                        slug={row.slug}
                        name={row.name}
                        locale={locale}
                      />
                      <Span className="text-sm text-muted-foreground">
                        {t("music.factLine", {
                          credits: num(row.clipCredits),
                          price: row.clipPrice,
                          length: lengthText(row),
                        })}
                      </Span>
                    </Span>
                  ))}
                />
              </Div>
            );
          })}
          <Callout icon={Scale} tone="neutral">
            {t("music.suno", stats)}
          </Callout>
          <CardLink
            href={`/${locale}/tools/${MUSIC_GEN_ALIAS}`}
            label={t("music.toolLink")}
          />
        </ArticleSection>

        {/* ── Voices (TTS) ──────────────────────────────────────── */}
        <ArticleSection
          id="voices"
          title={t("voices.title", stats)}
          intro={t("voices.intro", stats)}
        >
          <ArticleScroll>
            <Div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table className="min-w-[40rem]">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    {headCell(t("voices.colVoice"), "voice")}
                    {headCell(t("voices.colCharacter"), "character")}
                    {headCell(t("voices.colTier"), "tier")}
                    {headCell(t("voices.colCredits"), "credits")}
                    {headCell(t("voices.colMinute", stats), "minute")}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {voices.map((row) => (
                    <TableRow key={row.id} data-model={row.id}>
                      <TableCell className="align-top">
                        <ModelLink
                          slug={row.slug}
                          name={row.name}
                          locale={locale}
                        />
                        <Span className="block text-xs text-muted-foreground">
                          {row.lab}
                        </Span>
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {voiceText(row)}
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {tierText(row.tier)}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums text-foreground">
                        {fine(row.creditsPer1k)}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums font-semibold text-foreground">
                        {row.minutePrice}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Div>
          </ArticleScroll>
          <ArticleP>{t("voices.footnote", stats)}</ArticleP>

          {VOICE_PICKS.map((group) => {
            const picked = group.models.flatMap((id) => {
              const row = voiceById.get(id);
              return row && group.keep(row) ? [row] : [];
            });
            if (picked.length === 0) {
              return null;
            }
            return (
              <Div key={group.key} className="flex flex-col gap-3">
                <ArticleH3>{t(`voices.picks.${group.key}.title`)}</ArticleH3>
                <ArticleP>
                  {t(`voices.picks.${group.key}.body`, stats)}
                </ArticleP>
                <ArticleList
                  items={picked.map((row) => (
                    <Span key={row.id} className="flex flex-col gap-0.5">
                      <ModelLink
                        slug={row.slug}
                        name={row.name}
                        locale={locale}
                      />
                      <Span className="text-sm text-muted-foreground">
                        {t("voices.factLine", {
                          credits: fine(row.creditsPer1k),
                          minute: row.minutePrice,
                          character: voiceText(row),
                        })}
                      </Span>
                    </Span>
                  ))}
                />
              </Div>
            );
          })}
          <ArticleP>{t("voices.languages", stats)}</ArticleP>
          <CardLink
            href={`/${locale}/tools/${TEXT_TO_SPEECH_ALIAS}`}
            label={t("voices.toolLink")}
          />
        </ArticleSection>

        {/* ── Transcription (STT) ───────────────────────────────── */}
        <ArticleSection
          id="transcription"
          title={t("stt.title", stats)}
          intro={t("stt.intro", stats)}
        >
          <ArticleScroll>
            <Div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table className="min-w-[36rem]">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    {headCell(t("stt.colModel"), "model")}
                    {headCell(t("stt.colTier"), "tier")}
                    {headCell(t("stt.colCredits"), "credits")}
                    {headCell(t("stt.colHour"), "hour")}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stt.map((row) => (
                    <TableRow key={row.id} data-model={row.id}>
                      <TableCell className="align-top">
                        <ModelLink
                          slug={row.slug}
                          name={row.name}
                          locale={locale}
                        />
                        <Span className="block text-xs text-muted-foreground">
                          {row.lab}
                        </Span>
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {tierText(row.tier)}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums text-foreground">
                        {fine(row.creditsPerMinute)}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums font-semibold text-foreground">
                        {row.hourPrice}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Div>
          </ArticleScroll>
          <ArticleP>{t("stt.footnote", stats)}</ArticleP>

          {STT_PICKS.map((group) => {
            const picked = group.models.flatMap((id) => {
              const row = sttById.get(id);
              return row ? [row] : [];
            });
            if (picked.length === 0) {
              return null;
            }
            return (
              <Div key={group.key} className="flex flex-col gap-3">
                <ArticleH3>{t(`stt.picks.${group.key}.title`)}</ArticleH3>
                <ArticleP>{t(`stt.picks.${group.key}.body`, stats)}</ArticleP>
                <ArticleList
                  items={picked.map((row) => (
                    <Span key={row.id} className="flex flex-col gap-0.5">
                      <ModelLink
                        slug={row.slug}
                        name={row.name}
                        locale={locale}
                      />
                      <Span className="text-sm text-muted-foreground">
                        {t("stt.factLine", {
                          credits: fine(row.creditsPerMinute),
                          hour: row.hourPrice,
                        })}
                      </Span>
                    </Span>
                  ))}
                />
              </Div>
            );
          })}
          <CardLink
            href={`/${locale}/tools/${TRANSCRIBE_AUDIO_ALIAS}`}
            label={t("stt.toolLink")}
          />
        </ArticleSection>

        {/* ── In chat ───────────────────────────────────────────── */}
        <ArticleSection
          id="chat"
          title={t("chat.title")}
          intro={t("chat.intro", stats)}
        >
          <StepList>
            {CHAT_STEPS.map((step, index) => (
              <Step
                key={step}
                number={index + 1}
                title={t(`chat.steps.${step}.title`)}
                description={t(`chat.steps.${step}.body`, stats)}
              />
            ))}
          </StepList>
          <ArticleP>{t("chat.toolPages", stats)}</ArticleP>
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/tools/${MUSIC_GEN_ALIAS}`}
              label={t("music.toolLink")}
            />
            <CardLink
              href={`/${locale}/tools/${TEXT_TO_SPEECH_ALIAS}`}
              label={t("voices.toolLink")}
            />
            <CardLink
              href={`/${locale}/tools/${TRANSCRIBE_AUDIO_ALIAS}`}
              label={t("stt.toolLink")}
            />
          </Div>
        </ArticleSection>

        {/* ── Pricing ───────────────────────────────────────────── */}
        <ArticleSection
          id="pricing"
          title={t("pricing.title")}
          intro={t("pricing.intro", stats)}
        >
          <ArticleList
            items={[
              t("pricing.music", stats),
              t("pricing.voice", stats),
              t("pricing.stt", stats),
              t("pricing.failed", stats),
            ]}
          />
          <ArticleList
            items={[
              t("pricing.free", stats),
              t("pricing.sub", stats),
              t("pricing.pack", stats),
            ]}
          />
          <CardLink
            href={`/${locale}/subscription`}
            label={t("pricing.link")}
          />
        </ArticleSection>

        {/* ── Limits ────────────────────────────────────────────── */}
        <ArticleSection
          id="limits"
          title={t("limits.title")}
          intro={t("limits.intro", stats)}
        >
          <ArticleList
            items={[
              t("limits.musicLength", stats),
              t("limits.musicFlat", stats),
              t("limits.noSuno", stats),
              t("limits.ttsLength", stats),
              t("limits.sttFiles", stats),
              t("limits.noCloning", stats),
              t("limits.filters", stats),
            ]}
          />
          <Callout icon={AlertTriangle} tone="warning">
            {t("limits.callout", stats)}
          </Callout>
        </ArticleSection>

        {/* ── FAQ ───────────────────────────────────────────────── */}
        <ArticleSection id="faq" title={t("faq.title")}>
          <JsonLd
            id="faq-structured-data"
            data={buildFaqStructuredData(
              FAQ_KEYS.map((key) => ({
                question: t(`faq.${key}.q`, stats),
                answer: t(`faq.${key}.a`, stats),
              })),
            )}
          />
          {FAQ_KEYS.map((key) => (
            <Div key={key} className="flex flex-col gap-2">
              <ArticleH3>{t(`faq.${key}.q`, stats)}</ArticleH3>
              <ArticleP>{t(`faq.${key}.a`, stats)}</ArticleP>
            </Div>
          ))}
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/models`}
              label={t("faq.modelsLink", stats)}
            />
            <CardLink
              href={`/${locale}/story/blog/ai-video-generators-compared`}
              label={t("faq.videoLink")}
            />
            <CardLink
              href={`/${locale}/subscription`}
              label={t("faq.pricingLink")}
            />
          </Div>
        </ArticleSection>

        <Callout icon={Wallet} tone="primary">
          <Span>{t("partners.body", stats)}</Span>{" "}
          <Link href={`/${locale}/story/partners`} className={LINK_CLASS}>
            {t("partners.link")}
          </Link>
        </Callout>

        <ArticleEnd
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle", stats)}
          actions={
            <>
              <Cta
                href={`/${locale}/tools/${MUSIC_GEN_ALIAS}`}
                label={t("cta.music")}
                icon={Music}
              />
              <Cta
                href={`/${locale}/tools/${TEXT_TO_SPEECH_ALIAS}`}
                label={t("cta.voice")}
                icon={Volume2}
                variant="secondary"
              />
              <Cta
                href={`/${locale}/tools/${TRANSCRIBE_AUDIO_ALIAS}`}
                label={t("cta.transcribe")}
                icon={Mic}
                variant="secondary"
              />
              <Cta
                href={`/${locale}/models`}
                label={t("cta.models")}
                icon={Layers}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function MusicVoicePostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
