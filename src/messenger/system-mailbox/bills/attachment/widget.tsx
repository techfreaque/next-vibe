"use client";

import { Button } from "next-vibe/ui/components/button";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { downloadBinaryFile } from "next-vibe/ui/lib/download";
import {
  useWidgetIsInteractive,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import type endpoint from "./definition";

export function Evidence(): JSX.Element {
  const data = useWidgetValue<typeof endpoint.GET>();
  const t = useWidgetTranslation<typeof endpoint.GET>();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const { pop, canGoBack } = useWidgetNavigation();
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("attachmentTitle")}
        backButton={
          canGoBack && (
            <Button type="button" variant="ghost" onClick={() => pop()}>
              {t("back")}
            </Button>
          )
        }
      />
      <FormAlertWidget field={{}} />
      {data?.filename && <P>{data.filename}</P>}
      {data?.contents && interactive && !responseOnly && (
        <Button
          type="button"
          className="self-start"
          onClick={() => {
            const raw = atob(data.contents);
            const decoded = new Uint8Array(raw.length);
            for (let i = 0; i < raw.length; i++) {
              decoded[i] = raw.charCodeAt(i);
            }
            downloadBinaryFile(data.filename, decoded);
          }}
        >
          {t("download")}
        </Button>
      )}
    </WidgetShell>
  );
}
