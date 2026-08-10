"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Camera } from "next-vibe/ui/components/icons/Camera";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Image } from "next-vibe/ui/components/image";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetIsSubmitting,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import { DesktopNavHeader } from "../shared/nav-header";
import type definition from "./definition";
import type { DesktopTakeScreenshotResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

type T = ReturnType<typeof useWidgetTranslation>;

function ScreenshotResult({
  data,
  isCapturing,
  onListMonitors,
  onRetake,
  t,
}: {
  data: DesktopTakeScreenshotResponseOutput;
  isCapturing: boolean;
  onListMonitors: () => void;
  onRetake: () => void;
  t: T;
}): JSX.Element {
  const hasScaling =
    data.originalWidth && data.width && data.originalWidth !== data.width;
  const dimStr = hasScaling
    ? /* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */
      `${data.originalWidth}×${data.originalHeight} → ${data.width}×${data.height}`
    : data.width
      ? /* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */
        `${data.width}×${data.height}`
      : null;

  const imgSrc =
    data.imageUrl ??
    (data.imageData ? `data:image/png;base64,${data.imageData}` : null);

  return (
    <>
      {/* Result toolbar */}
      <Div className="flex items-center gap-2 px-4 py-2.5 border-b shrink-0 flex-wrap">
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
        <Div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={onListMonitors}
          >
            {t("widget.actionAllMonitors")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1.5"
            disabled={isCapturing}
            onClick={onRetake}
          >
            {isCapturing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Camera className="h-3 w-3" />
            )}
            {isCapturing
              ? t("take-screenshot.form.capturing")
              : t("widget.actionScreenshot")}
          </Button>
        </Div>
      </Div>

      {/* Error */}
      {!data.success && data.error ? (
        <Div className="mx-4 mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {data.error}
        </Div>
      ) : null}

      {/* Image */}
      {imgSrc ? (
        <Div className="flex-1 overflow-auto bg-muted/20 flex items-start justify-center p-2">
          <Image
            src={imgSrc}
            alt=""
            unoptimized
            className="max-w-full h-auto rounded shadow-sm"
          />
        </Div>
      ) : null}

      {/* Saved path */}
      {data.imagePath ? (
        <Div className="flex items-center gap-2 px-4 py-2 border-t shrink-0">
          <Span className="text-xs text-muted-foreground shrink-0">
            {t("widget.labelSaved")}
          </Span>
          <Span className="text-xs font-mono truncate">{data.imagePath}</Span>
        </Div>
      ) : null}
    </>
  );
}

export function TakeScreenshotWidget({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const isCapturing = useWidgetIsSubmitting() ?? false;

  const handleListMonitors = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../list-monitors/definition");
      navigate(def.default.POST, {});
    })();
  };

  const title = data?.capturedMonitor
    ? t("widget.actionScreenshotOnMonitor", { monitor: data.capturedMonitor })
    : t("widget.actionScreenshot");

  return (
    <Div className="flex flex-col h-full">
      <DesktopNavHeader
        title={title}
        right={
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={(): void => {
              onSubmit?.();
            }}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
          </Button>
        }
      />

      {/* Input form — shown when no result yet */}
      {!data && (
        <Div className="flex flex-col gap-5 p-4">
          <Div className="flex flex-col gap-3">
            <Div className="grid grid-cols-2 gap-3">
              <EntityPickerFieldWidget
                fieldName="monitorName"
                field={children.monitorName}
              />
              <NumberFieldWidget
                fieldName="maxWidth"
                field={children.maxWidth}
              />
            </Div>
            <TextFieldWidget
              fieldName="outputPath"
              field={children.outputPath}
            />
          </Div>

          <FormAlertWidget field={{}} />

          <Div className="flex items-center gap-2">
            <Button
              type="submit"
              disabled={isCapturing}
              onClick={onSubmit ?? undefined}
              className="gap-2"
            >
              {isCapturing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              {isCapturing
                ? t("take-screenshot.form.capturing")
                : t("take-screenshot.form.label")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 text-xs ml-auto gap-1.5"
              onClick={handleListMonitors}
            >
              {t("widget.actionAllMonitors")}
            </Button>
          </Div>
        </Div>
      )}

      {/* Result — shown once we have data */}
      {data ? (
        <ScreenshotResult
          data={data}
          isCapturing={isCapturing}
          onListMonitors={handleListMonitors}
          onRetake={(): void => {
            onSubmit?.();
          }}
          t={t}
        />
      ) : null}
    </Div>
  );
}

export default TakeScreenshotWidget;
