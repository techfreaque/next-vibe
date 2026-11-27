"use client";

import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { Button } from "next-vibe/ui/components/button";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Nav } from "next-vibe/ui/components/nav";
import { Span } from "next-vibe/ui/components/span";
import { useSilentHistory } from "next-vibe/ui/hooks/use-navigation";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import { type JSX, useState } from "react";

import { DEFAULT_FOLDER_CONFIGS } from "../../../../../../chat/config";
import { NEW_MESSAGE_ID } from "../../../../../../chat/enum";
import { scopedTranslation as folders } from "../../../../../../chat/folders/[rootFolderId]/i18n";
import { FolderAccessModal } from "../../../../../../chat/folders/[rootFolderId]/widget/folder-access-modal";
import { useChatNavigationStore } from "../../../../../../chat/hooks/use-chat-navigation-store";
import { getFolderTourAttr, TOUR_DATA_ATTRS } from "../../data-attrs";
import { scopedTranslation } from "./i18n";
import { spaceTone } from "./palette";
import { spaceEntries, type SpaceEntry } from "./roots";

/** One-line hint under a switcher when a guest sees locked spaces. */
function LockedHint({
  locale,
  show,
  className,
  short = false,
}: {
  locale: CountryLanguage;
  show: boolean;
  className?: string;
  short?: boolean;
}): JSX.Element | null {
  if (!show) {
    return null;
  }
  return (
    <Span
      className={cn(
        "flex items-start justify-center gap-1.5 text-[11px] leading-snug text-muted-foreground [&>svg]:mt-0.5",
        className,
      )}
    >
      <Lock className="size-3 shrink-0" />
      <Span>
        {scopedTranslation
          .scopedT(locale)
          .t(short ? "lockedHintShort" : "lockedHint")}
      </Span>
    </Span>
  );
}

interface SpacesState {
  active: DefaultFolderId;
  entries: SpaceEntry[];
  name: (id: DefaultFolderId) => string;
  select: (entry: SpaceEntry) => void;
  modal: JSX.Element | null;
}

function useSpaces(locale: CountryLanguage, user: JwtPayloadType): SpacesState {
  const active = useChatNavigationStore((s) => s.currentRootFolderId);
  const setNavigation = useChatNavigationStore((s) => s.setNavigation);
  const clearSearch = useChatNavigationStore((s) => s.setSidebarSearchQuery);
  const { pushState } = useSilentHistory();
  const [lockedId, setLockedId] = useState<DefaultFolderId | null>(null);
  const { t } = folders.scopedT(locale);
  const select = ({ id, locked }: SpaceEntry): void => {
    if (locked) {
      setLockedId(id);
      return;
    }
    const compose =
      id === DefaultFolderId.INCOGNITO ||
      id === DefaultFolderId.PRIVATE ||
      id === DefaultFolderId.SHARED;
    clearSearch("");
    setNavigation({
      currentRootFolderId: id,
      currentSubFolderId: null,
      activeThreadId: compose ? NEW_MESSAGE_ID : null,
    });
    pushState(`/${locale}/threads/${id}${compose ? `/${NEW_MESSAGE_ID}` : ""}`);
  };
  return {
    active,
    entries: spaceEntries(user),
    name: (id) => t(`widget.config.foldersShort.${id}`),
    select,
    modal: lockedId ? (
      <FolderAccessModal
        open
        onOpenChange={(open) => !open && setLockedId(null)}
        folderId={lockedId}
        locale={locale}
      />
    ) : null,
  };
}

export function SegmentSpaces({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  const spaces = useSpaces(locale, user);
  const hasLocked = spaces.entries.some((entry) => entry.locked);
  const count = spaces.entries.length;
  // Six-column track: three tiles per row (span 2), four as 2x2 (span 3).
  // Five spaces keep the three-column rhythm; for guests the free sixth cell
  // explains the locked spaces. Every tile has the same size, labels fit.
  const span =
    count === 1
      ? "col-span-6"
      : count === 2 || count === 4
        ? "col-span-3"
        : "col-span-2";
  return (
    <Nav
      aria-label={scopedTranslation.scopedT(locale).t("locations")}
      data-tour={TOUR_DATA_ATTRS.ROOT_FOLDERS}
    >
      <Span className="grid grid-cols-6 gap-1">
        {spaces.entries.map((entry) => {
          const selected = entry.id === spaces.active;
          const entryTone = spaceTone(entry.id);
          const name = spaces.name(entry.id);
          return (
            <Button
              key={entry.id}
              variant="ghost"
              size="unset"
              aria-pressed={selected}
              aria-label={name}
              title={name}
              data-tour={getFolderTourAttr(entry.id)}
              onClick={() => spaces.select(entry)}
              className={cn(
                span,
                "relative min-w-0 flex-col gap-0.5 rounded-lg border px-1 py-1.5 text-[11px] font-medium leading-tight",
                selected
                  ? cn(entryTone.tint, "border-transparent")
                  : "border-border/60 text-muted-foreground hover:bg-accent",
                entry.locked && !selected && "border-dashed opacity-70",
              )}
            >
              <Span className="shrink-0">
                <Icon
                  icon={DEFAULT_FOLDER_CONFIGS[entry.id].icon}
                  className={cn("size-4", entry.locked && "opacity-60")}
                />
              </Span>
              <Span className="max-w-full truncate">{name}</Span>
            </Button>
          );
        })}
        {hasLocked && count % 3 !== 0 && count > 4 && (
          <LockedHint
            locale={locale}
            show
            short
            className="col-span-2 items-center justify-start px-1.5 text-left"
          />
        )}
      </Span>
      <LockedHint
        locale={locale}
        show={hasLocked && !(count % 3 !== 0 && count > 4)}
        className="pt-1.5"
      />
      {spaces.modal}
    </Nav>
  );
}
