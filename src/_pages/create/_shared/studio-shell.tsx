import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { ArrowLeft } from "next-vibe/ui/components/icons/ArrowLeft";
import { FileText } from "next-vibe/ui/components/icons/FileText";
import { Film } from "next-vibe/ui/components/icons/Film";
import { Image as ImageIcon } from "next-vibe/ui/components/icons/Image";
import { Mic } from "next-vibe/ui/components/icons/Mic";
import { Music } from "next-vibe/ui/components/icons/Music";
import { Link } from "next-vibe/ui/components/link";
import { Nav } from "next-vibe/ui/components/nav";
import { Span } from "next-vibe/ui/components/span";
import { H1, P } from "next-vibe/ui/components/typography";
import type { JSX, ReactNode } from "react";

import { scopedTranslation } from "../i18n";
import { CREATE_KINDS, createHref, type CreateKind } from "./create-kinds";

export const STUDIO_ICONS = {
  image: ImageIcon,
  video: Film,
  music: Music,
  speech: Mic,
  transcribe: FileText,
};
export const STUDIO_PALETTES = {
  image:
    "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200",
  video:
    "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200",
  music:
    "bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-950 dark:text-fuchsia-200",
  speech: "bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200",
  transcribe: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
};

export function StudioShell({
  locale,
  kind,
  children,
}: {
  locale: CountryLanguage;
  kind?: CreateKind;
  children: ReactNode;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const KindIcon = kind ? STUDIO_ICONS[kind] : undefined;
  return (
    <Div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      {kind && (
        <Link
          href={`/${locale}/create`}
          className="mb-4 inline-flex items-center gap-2 rounded text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t("studio")}
        </Link>
      )}
      <Div className="flex items-center gap-3 sm:gap-4">
        {kind && KindIcon && (
          <Span
            className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-14 sm:rounded-2xl ${STUDIO_PALETTES[kind]}`}
          >
            <KindIcon className="size-5 sm:size-7" />
          </Span>
        )}
        <H1 className="m-0 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {kind ? t(`kinds.${kind}.title`) : t("hub.title")}
        </H1>
      </Div>
      <P className="mb-6 mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {kind ? t(`kinds.${kind}.description`) : t("hub.subtitle")}
      </P>
      {kind && (
        <Nav className="mb-5 grid grid-cols-5 gap-1 rounded-xl border bg-muted/40 p-1 sm:mb-6 sm:flex sm:w-fit sm:gap-1.5">
          {CREATE_KINDS.map((item) => {
            const Icon = STUDIO_ICONS[item];
            return (
              <Link
                key={item}
                href={createHref(locale, item)}
                aria-current={item === kind ? "page" : undefined}
                className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-medium leading-tight sm:min-h-10 sm:flex-row sm:gap-1.5 sm:px-4 sm:text-sm ${item === kind ? `${STUDIO_PALETTES[item]} shadow-sm font-semibold` : "text-muted-foreground hover:bg-background hover:text-foreground"}`}
              >
                <Icon className="size-4 shrink-0" />
                <Span className="max-w-full truncate sm:hidden">
                  {t(`kinds.${item}.tab`)}
                </Span>
                <Span className="hidden sm:inline">
                  {t(`kinds.${item}.label`)}
                </Span>
              </Link>
            );
          })}
        </Nav>
      )}
      {children}
    </Div>
  );
}
