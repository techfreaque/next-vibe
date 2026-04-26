/**
 * Take Screenshot Widget
 * Form: outputPath + monitorName + maxWidth
 * Result: inline screenshot image, dimensions, file path
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Image } from "next-vibe-ui/ui/image";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { useWidgetValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";
import type { DesktopTakeScreenshotResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function ScreenshotResult({
  data,
}: {
  data: DesktopTakeScreenshotResponseOutput;
}): JSX.Element {
  const hasImage = Boolean(data.imageData);
  const hasScaling =
    data.originalWidth && data.width && data.originalWidth !== data.width;
  const dimStr = hasScaling
    ? `${data.originalWidth}×${data.originalHeight} → ${data.width}×${data.height}`
    : data.width
      ? `${data.width}×${data.height}`
      : null;

  const sizeStr = data.imageData
    ? formatBytes(Math.round((data.imageData.length * 3) / 4))
    : null;

  return (
    <Div className="flex flex-col gap-3">
      {/* Metadata row */}
      <Div className="flex flex-wrap gap-2 items-center">
        {data.capturedMonitor ? (
          <Badge variant="outline" className="text-xs font-mono">
            {data.capturedMonitor}
          </Badge>
        ) : null}
        {dimStr ? (
          <Badge variant="secondary" className="text-xs font-mono">
            {dimStr}
          </Badge>
        ) : null}
        {sizeStr ? (
          <Span className="text-xs text-muted-foreground">{sizeStr}</Span>
        ) : null}
      </Div>

      {/* Inline image */}
      {hasImage ? (
        <Div className="rounded-lg overflow-hidden border bg-muted/30">
          <Image
            src={`data:image/png;base64,${data.imageData}`}
            alt=""
            className="w-full h-auto max-h-[500px] object-contain"
          />
        </Div>
      ) : null}

      {/* File path */}
      {data.imagePath ? (
        <Div className="flex items-center gap-2">
          <Span className="text-xs text-muted-foreground">
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            Saved:
          </Span>
          <Span className="text-xs font-mono text-foreground truncate">
            {data.imagePath}
          </Span>
        </Div>
      ) : null}
    </Div>
  );
}

export function TakeScreenshotWidget({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();

  return (
    <Div className="flex flex-col gap-4">
      <FormAlertWidget field={{}} />

      {/* Form fields */}
      <Div className="grid grid-cols-2 gap-3">
        <TextFieldWidget fieldName="monitorName" field={children.monitorName} />
        <NumberFieldWidget fieldName="maxWidth" field={children.maxWidth} />
      </Div>
      <TextFieldWidget fieldName="outputPath" field={children.outputPath} />

      {/* Actions */}
      <Div className="flex gap-2">
        <NavigateButtonWidget field={{}} />
        <SubmitButtonWidget<typeof definition.POST> field={{}} />
      </Div>

      {/* Result */}
      {data?.success && data.width ? <ScreenshotResult data={data} /> : null}

      {data?.error ? (
        <Span className="text-sm text-destructive">{data.error}</Span>
      ) : null}
    </Div>
  );
}
