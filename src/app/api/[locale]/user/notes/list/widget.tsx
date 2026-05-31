/**
 * User Notes List Widget
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { usePickerCallback } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/picker-context";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { UserNoteType } from "@/app/api/[locale]/user/enum";

import type definition from "./definition";

const NOTE_TYPE_STYLES: Record<string, string> = {
  [UserNoteType.NOTE]: "bg-muted text-muted-foreground",
  [UserNoteType.CALL]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [UserNoteType.EMAIL]:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  [UserNoteType.MEETING]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  [UserNoteType.TASK]:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
};

function timeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

type NoteData = NonNullable<
  ReturnType<typeof useWidgetValue<typeof definition.GET>>
>["notes"][number];

export function UserNotesListContainer(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const onPick = usePickerCallback<NoteData>();
  const isPickerMode = !!onPick;

  const handleAddNote = (): void => {
    void (async (): Promise<void> => {
      const createDef =
        await import("@/app/api/[locale]/user/notes/create/definition");
      navigation.push(createDef.default.POST, {
        data: data ? { userId: data.notes[0]?.userId ?? "" } : {},
      });
    })();
  };

  const handleDelete = (noteId: string): void => {
    void (async (): Promise<void> => {
      // Dynamic import of parameterized route - alias avoids bracket resolution issues
      const deleteDef =
        await import("@/app/api/[locale]/user/notes/[noteId]/delete/definition");
      navigation.push(deleteDef.default.POST, {
        urlPathParams: { noteId },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  if (!data) {
    return <Div />;
  }

  const { notes, total } = data;

  return (
    <Div className="space-y-3">
      <Div className="flex items-center justify-between">
        <Span className="text-sm text-muted-foreground">
          {t("get.widget.total")}: {total}
        </Span>
        {!isPickerMode && (
          <Button size="sm" onClick={handleAddNote}>
            {t("get.widget.addNote")}
          </Button>
        )}
      </Div>

      {notes.length === 0 ? (
        <Div className="text-center py-10 text-sm text-muted-foreground">
          {t("get.widget.empty")}
        </Div>
      ) : (
        <Div className="divide-y">
          {notes.map((note) => (
            <NoteRow
              key={note.id}
              note={note}
              t={t}
              onDelete={handleDelete}
              onPick={onPick}
              isPickerMode={isPickerMode}
            />
          ))}
        </Div>
      )}
    </Div>
  );
}

function NoteRow({
  note,
  t,
  onDelete,
  onPick,
  isPickerMode,
}: {
  note: NoteData;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  onDelete: (noteId: string) => void;
  onPick: ((note: NoteData) => void) | undefined;
  isPickerMode: boolean;
}): JSX.Element {
  const preview =
    note.content.length > 120 ? `${note.content.slice(0, 120)}…` : note.content;

  const typeKey = note.type ?? UserNoteType.NOTE;
  const badgeClass =
    NOTE_TYPE_STYLES[typeKey] ?? "bg-muted text-muted-foreground";

  const handleClick = isPickerMode && onPick ? (): void => onPick(note) : undefined;

  return (
    <Div
      className={`flex items-start justify-between gap-4 py-4 px-1${isPickerMode ? " cursor-pointer hover:bg-accent rounded-lg transition-colors" : ""}`}
      onClick={handleClick}
    >
      <Div className="flex-1 min-w-0 space-y-1">
        <Div className="flex items-center gap-2 flex-wrap">
          <Badge className={badgeClass}>{typeKey}</Badge>
          {note.isPrivate ? (
            <Span
              className="text-xs text-muted-foreground border border-muted-foreground/30 rounded px-1"
              title={t("get.widget.private")}
            >
              {t("get.widget.private")}
            </Span>
          ) : null}
          <Span className="text-xs text-muted-foreground tabular-nums">
            {timeAgo(note.createdAt)} {t("get.widget.ago")}
          </Span>
        </Div>
        <Div className="text-sm text-foreground leading-snug">{preview}</Div>
      </Div>
      {!isPickerMode && (
        <Button
          size="sm"
          variant="outline"
          className="text-xs text-destructive shrink-0"
          onClick={(): void => onDelete(note.id)}
        >
          {t("get.widget.delete")}
        </Button>
      )}
    </Div>
  );
}
