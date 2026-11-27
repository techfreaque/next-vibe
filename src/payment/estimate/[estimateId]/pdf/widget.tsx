"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Download } from "next-vibe/ui/components/icons/Download";
import { SectionGroup } from "next-vibe/ui/components/section-group";
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

import type definition from "./definition";

function downloadBase64Pdf(base64: string, filename: string): void {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  downloadBinaryFile(filename, bytes, "application/pdf");
}

export function EstimatePdfWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const { pop, canGoBack } = useWidgetNavigation();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;

  const backButton = canGoBack ? (
    <Button type="button" variant="ghost" size="sm" onClick={() => pop()}>
      <ChevronLeft className="h-4 w-4" />
      {t("pdf.back")}
    </Button>
  ) : undefined;

  const downloadAction =
    interactive && data ? (
      <Button
        type="button"
        size="sm"
        onClick={() => downloadBase64Pdf(data.pdfBase64, data.filename)}
      >
        <Download className="h-4 w-4" />
        {t("pdf.downloadAction")}
      </Button>
    ) : undefined;

  return (
    <WidgetShell layout="page" className="mx-auto max-w-3xl">
      <WidgetHeader
        size="page"
        title={t("pdf.estimateTitle")}
        subtitle={data?.documentNumber ?? t("pdf.estimateDescription")}
        backButton={backButton}
        actions={downloadAction}
      />
      <FormAlertWidget field={{}} />
      {data && (
        <SectionGroup title={t("pdf.estimateTitle")}>
          <DetailGrid columns={2}>
            <DetailField
              label={t("pdf.documentNumber")}
              value={data.documentNumber}
            />
            <DetailField label={t("pdf.filename")} value={data.filename} />
          </DetailGrid>
        </SectionGroup>
      )}
    </WidgetShell>
  );
}
