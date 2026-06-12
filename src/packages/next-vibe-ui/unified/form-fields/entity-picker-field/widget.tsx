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
import { useRef, type JSX } from "react";

import { scopedTranslation as unifiedInterfaceScopedTranslation } from "@/app/api/[locale]/system/unified-interface/i18n";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { getPreferredToolName } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { ReactFormFieldProps } from "next-vibe-ui/unified/_shared/react-types";
import type { FieldUsageConfig } from "next-vibe-ui/unified/_shared/types";
import {
  useIsMcp,
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
} from "next-vibe-ui/unified/_shared/use-widget-context";
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

  if (initiallyFilledRef.current) {
    return null;
  }

  const name: string = fieldName;

  const handleOpen = (): void => {
    navigation.push(field.listEndpoint, {
      renderInModal: true,
      pickerCallback: (value: WidgetData) => {
        const picked = value as Record<string, string>;
        form?.setValue(name, picked["id"] ?? String(value));
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
          {resolvedLabel}: {String(currentValue)}
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
      <Div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="bg-info/10 text-info border-info/20"
        >
          {String(currentValue)}
        </Badge>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs h-auto py-0.5 px-2"
          onClick={handleOpen}
        >
          {widgetT("widgets.formFields.entityPicker.change")}
        </Button>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full justify-start"
        onClick={handleOpen}
      >
        {widgetT("widgets.formFields.entityPicker.select")} {resolvedLabel}
      </Button>
    </Div>
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

  const listToolName = getPreferredToolName(listEndpoint);

  const handleOpen = (): void => {
    navigation.push(listEndpoint, {
      renderInModal: true,
      pickerCallback: (value: WidgetData) => {
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
          {label}: {displayValue ?? String(currentValue)}
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
    return (
      <Div className="flex items-center gap-2">
        <Span className="text-sm text-muted-foreground">{label}:</Span>
        <Badge
          variant="secondary"
          className="bg-info/10 text-info border-info/20"
        >
          {displayValue ?? String(currentValue)}
        </Badge>
        {allowChange && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs h-auto py-0.5 px-2"
            onClick={handleOpen}
          >
            {widgetT("widgets.formFields.entityPicker.change")}
          </Button>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-1">
      <Span className="text-sm text-muted-foreground">{label}</Span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full justify-start"
        onClick={handleOpen}
      >
        {widgetT("widgets.formFields.entityPicker.select")} {label}
      </Button>
    </Div>
  );
}
