/**
 * Entity Picker Field Widget
 *
 * Renders a picker for fields that normally receive their value injected by
 * navigation context (e.g. an entity ID pre-filled when opened from a list).
 *
 * Visibility rules:
 *   - Field was filled on initial render → hidden. The injected value is used
 *     silently; no UI is shown and the user cannot change it here.
 *   - Field was empty on initial render → always visible, even after a value
 *     is picked (so the user can change their selection).
 *
 * Per platform:
 *   - Web / interactive CLI: "Select [Label]" button → navigation.push with
 *     pickerCallback + renderInModal. The list widget detects usePickerCallback
 *     and renders a keyboard-navigable Select instead of navigating on click.
 *   - MCP / AI: compact hint text pointing to the list alias.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { ReactFormFieldProps } from "next-vibe-ui/unified/_shared/react-types";
import type { FieldUsageConfig } from "next-vibe-ui/unified/_shared/types";
import {
  useIsMcp,
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { type JSX, useRef, useState } from "react";

import { scopedTranslation as unifiedInterfaceScopedTranslation } from "@/app/api/[locale]/system/unified-interface/i18n";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { getPreferredToolName } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import type { StringWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { EntityPickerFieldWidgetConfig } from "./types";

export function EntityPickerFieldWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: ReactFormFieldProps<
  TEndpoint,
  TUsage,
  EntityPickerFieldWidgetConfig<TKey, TSchema, TUsage>
>): JSX.Element | null {
  const form = useWidgetForm<CreateApiEndpointAny>();
  const navigation = useWidgetNavigation();
  const isMcp = useIsMcp();
  const locale = useWidgetLocale();
  const { t: widgetT } = unifiedInterfaceScopedTranslation.scopedT(locale);
  const { t: tField } = useWidgetContext();

  const currentValue = form?.watch(fieldName);
  const isFilled =
    currentValue !== undefined && currentValue !== null && currentValue !== "";

  // Track whether the field was filled on the initial render.
  // If it was, the value came from navigation context — hide the picker entirely.
  const initiallyFilledRef = useRef<boolean>(isFilled);

  // Human-readable label for the selected item (set when user picks from list).
  const [pickedLabel, setPickedLabel] = useState<string | undefined>(undefined);

  if (initiallyFilledRef.current) {
    return null;
  }

  const name: string = fieldName;
  const labelField = field.labelField ?? "name";

  const handleOpen = (): void => {
    navigation.push(field.listEndpoint, {
      renderInModal: true,
      pickerCallback: (value: WidgetData) => {
        const picked = value as Record<string, string>;
        form?.setValue(name, picked["id"] ?? String(value));
        const label =
          picked[labelField] ??
          picked["name"] ??
          picked["title"] ??
          picked["label"];
        setPickedLabel(label ?? undefined);
      },
      pickerLabelField: field.labelField,
    });
  };

  const resolvedLabel = field.label ? tField(field.label) : fieldName;
  const listToolName = getPreferredToolName(field.listEndpoint);

  // MCP / AI: compact hint
  if (isMcp) {
    if (isFilled) {
      return (
        <Span className="text-sm">
          {resolvedLabel}: {pickedLabel ?? String(currentValue)}
        </Span>
      );
    }
    return (
      <Span className="text-sm text-muted-foreground">
        {widgetT("widgets.formFields.entityPicker.required")}
        {` ${widgetT("widgets.formFields.entityPicker.useToFind", { alias: listToolName })}`}
      </Span>
    );
  }

  // Web / interactive CLI — always visible (field was empty on first render)
  if (isFilled) {
    return (
      <Div className="flex items-center gap-2 min-w-0">
        <Div className="flex items-center gap-1.5 min-w-0 flex-1">
          <Badge
            variant="secondary"
            className="bg-primary/8 text-primary border-primary/20 font-medium max-w-[260px] truncate"
          >
            {pickedLabel ?? String(currentValue)}
          </Badge>
          {pickedLabel && (
            <Span className="text-xs text-muted-foreground font-mono truncate hidden sm:inline">
              {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
              {String(currentValue).slice(0, 8)}…
            </Span>
          )}
        </Div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs h-7 px-2 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={handleOpen}
        >
          {widgetT("widgets.formFields.entityPicker.change")}
        </Button>
      </Div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="w-full justify-start text-muted-foreground hover:text-foreground gap-2"
      onClick={handleOpen}
    >
      {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
      <Span className="text-base leading-none opacity-50">+</Span>
      {widgetT("widgets.formFields.entityPicker.select")} {resolvedLabel}
    </Button>
  );
}

export default EntityPickerFieldWidget;

/**
 * Legacy standalone helper — kept for existing custom widget.tsx consumers.
 * New code should use FieldDataType.ENTITY_PICKER in definition.ts instead.
 */
export interface EntityPickerFieldProps<TValue extends WidgetData> {
  fieldName: string;
  label: string;
  displayValue?: string;
  listEndpoint: CreateApiEndpointAny;
  onSelect: (value: TValue) => void;
  labelField?: string;
  allowChange?: boolean;
}

export function EntityPickerField<TValue extends WidgetData>({
  fieldName,
  label,
  displayValue,
  listEndpoint,
  onSelect,
  labelField,
  allowChange = true,
}: EntityPickerFieldProps<TValue>): JSX.Element {
  const form = useWidgetForm<CreateApiEndpointAny>();
  const navigation = useWidgetNavigation();
  const isMcp = useIsMcp();
  const locale = useWidgetLocale();
  const { t: widgetT } = unifiedInterfaceScopedTranslation.scopedT(locale);

  const currentValue = form?.watch(fieldName);
  const isFilled =
    currentValue !== undefined && currentValue !== null && currentValue !== "";

  const initiallyFilledRef = useRef<boolean>(isFilled);
  const [pickedLabel, setPickedLabel] = useState<string | undefined>(
    displayValue,
  );

  const resolvedLabelField = labelField ?? "name";
  const listToolName = getPreferredToolName(listEndpoint);

  const handleOpen = (): void => {
    navigation.push(listEndpoint, {
      renderInModal: true,
      pickerCallback: (value: WidgetData) => {
        const picked = value as Record<string, string>;
        const extractedLabel =
          picked[resolvedLabelField] ??
          picked["name"] ??
          picked["title"] ??
          picked["label"];
        setPickedLabel(extractedLabel ?? undefined);
        onSelect(value as TValue);
      },
      pickerLabelField: labelField,
    });
  };

  // MCP / AI: compact hint
  if (isMcp) {
    if (isFilled) {
      return (
        <Span className="text-sm">
          {label}: {pickedLabel ?? displayValue ?? String(currentValue)}
        </Span>
      );
    }
    return (
      <Span className="text-sm text-muted-foreground">
        {label} {widgetT("widgets.formFields.entityPicker.required")}
        {` ${widgetT("widgets.formFields.entityPicker.useToFind", { alias: listToolName })}`}
      </Span>
    );
  }

  // If initially filled, hide (injected by navigation)
  if (initiallyFilledRef.current) {
    return <></>;
  }

  // Web / interactive CLI — always visible once shown
  if (isFilled) {
    const shownLabel = pickedLabel ?? displayValue;
    const shownId = String(currentValue);
    return (
      <Div className="flex items-center gap-2 min-w-0">
        <Span className="text-sm text-muted-foreground shrink-0">{label}:</Span>
        <Div className="flex items-center gap-1.5 min-w-0 flex-1">
          <Badge
            variant="secondary"
            className="bg-primary/8 text-primary border-primary/20 font-medium max-w-[200px] truncate"
          >
            {shownLabel ?? shownId}
          </Badge>
          {shownLabel && (
            <Span className="text-xs text-muted-foreground font-mono truncate hidden sm:inline">
              {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
              {shownId.slice(0, 8)}…
            </Span>
          )}
        </Div>
        {allowChange && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={handleOpen}
          >
            {widgetT("widgets.formFields.entityPicker.change")}
          </Button>
        )}
      </Div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="w-full justify-start text-muted-foreground hover:text-foreground gap-2"
      onClick={handleOpen}
    >
      {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
      <Span className="text-base leading-none opacity-50">+</Span>
      {widgetT("widgets.formFields.entityPicker.select")} {label}
    </Button>
  );
}
