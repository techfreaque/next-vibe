/**
 * MCP Widget Renderer
 *
 * Response-only widget renderer for MCP responses.
 * Simplified version of CLI renderer - only renders display/response widgets, no forms.
 * Uses the same fast-ink renderer for consistent output.
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { z } from "zod";

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type {
  BaseWidgetContext,
  BaseWidgetRendererProps,
  FieldUsageConfig,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { CodeOutputWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/code-output/cli";
import { ContainerWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/container/cli";
import { DataCardsWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-cards/cli";
import { DataListWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-list/cli";
import { DataTableWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-table/cli";
import { GroupedListWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/grouped-list/cli";
import { LinkCardWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/link-card/cli";
import { MetricCardWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/metric-card/cli";
import { SectionWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/section/cli";
import { AlertWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/cli";
import { BadgeWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/badge/cli";
import { ChartWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/chart/cli";
import { CodeQualityFilesWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-files/cli";
import { CodeQualityListWidgetMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-list/mcp";
import { CodeQualitySummaryWidgetMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-summary/mcp";
import { DescriptionWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/description/cli";
import { IconWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/icon/cli";
import { KeyValueWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/key-value/cli";
import { LinkWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/link/cli";
import { MarkdownWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/markdown/cli";
import { MetadataWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/metadata/cli";
import { ModelDisplayWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/model-display/cli";
import { PasswordStrengthWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/password-strength/cli";
import { SeparatorWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/separator/cli";
import { StatWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/stat/cli";
import { StatusIndicatorWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/status-indicator/cli";
import { TextWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/cli";
import { TitleWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/title/cli";

interface McpWidgetRendererProps<
  TEndpoint extends CreateApiEndpointAny,
> extends BaseWidgetRendererProps<TEndpoint> {
  fieldValue?: any; // oxlint-disable-line typescript/no-explicit-any
}

/**
 * MCP Widget Renderer - Routes to response-only widgets
 * Receives fields without values and augments them internally
 */
export function McpWidgetRenderer<TEndpoint extends CreateApiEndpointAny>({
  fieldName,
  field,
  fieldValue,
  context,
}: McpWidgetRendererProps<TEndpoint>): JSX.Element {
  // field must have type property - it's required on all UnifiedField types
  if (!("type" in field)) {
    return (
      <Box>
        <Text color="red">Field missing type property</Text>
      </Box>
    );
  }
  context.logger.debug(
    `[MCP Widget] Rendering ${fieldName} of type ${(field as any).type}`,
    { hasValue: fieldValue !== undefined },
  );
  return renderWidget(field.type, {
    fieldName,
    field,
    fieldValue,
    context,
  });
}

/**
 * Render helper for MCP - only display widgets
 * Augments field with value property before passing to widgets
 */
function renderWidget<
  TEndpoint extends CreateApiEndpointAny,
  const TKey extends string,
  TSchema extends z.ZodTypeAny | never,
>(
  widgetType: WidgetType,
  props: {
    fieldName: string;
    field: UnifiedField<TKey, TSchema, FieldUsageConfig, any>; // oxlint-disable-line typescript/no-explicit-any;
    fieldValue?: any; // oxlint-disable-line typescript/no-explicit-any
    context: BaseWidgetContext<TEndpoint>;
  },
): JSX.Element {
  // Augment field with value property for widget rendering
  const propsWithValue = {
    fieldName: props.fieldName,
    field: {
      ...props.field,
      value: props.fieldValue,
    },
    context: props.context,
  };

  props.context.logger.debug(
    `[MCP renderWidget] Rendering ${widgetType} for field ${props.fieldName}`,
    { hasValue: props.fieldValue !== undefined },
  );

  switch (widgetType) {
    // === CONTAINER WIDGETS ===
    case WidgetType.CONTAINER:
      return <ContainerWidgetInk {...propsWithValue} />;
    case WidgetType.SECTION:
      return <SectionWidgetInk {...propsWithValue} />;
    case WidgetType.SEPARATOR:
      return <SeparatorWidgetInk {...propsWithValue} />;
    case WidgetType.CODE_OUTPUT:
      return <CodeOutputWidgetInk {...propsWithValue} />;

    // === DATA DISPLAY WIDGETS ===
    case WidgetType.DATA_TABLE:
      return <DataTableWidgetInk {...propsWithValue} />;
    case WidgetType.DATA_CARDS:
      return <DataCardsWidgetInk {...propsWithValue} />;
    case WidgetType.DATA_LIST:
      return <DataListWidgetInk {...propsWithValue} />;
    case WidgetType.GROUPED_LIST:
      return <GroupedListWidgetInk {...propsWithValue} />;
    case WidgetType.CODE_QUALITY_LIST:
      return <CodeQualityListWidgetMcp {...propsWithValue} />;
    case WidgetType.CODE_QUALITY_SUMMARY:
      return <CodeQualitySummaryWidgetMcp {...propsWithValue} />;
    case WidgetType.CODE_QUALITY_FILES:
      return <CodeQualityFilesWidgetInk {...propsWithValue} />;
    case WidgetType.KEY_VALUE:
      return <KeyValueWidgetInk {...propsWithValue} />;

    // === DISPLAY-ONLY WIDGETS ===
    case WidgetType.TEXT:
      return <TextWidgetInk {...propsWithValue} />;
    case WidgetType.TITLE:
      return <TitleWidgetInk {...propsWithValue} />;
    case WidgetType.DESCRIPTION:
      return <DescriptionWidgetInk {...propsWithValue} />;
    case WidgetType.METADATA:
      return <MetadataWidgetInk {...propsWithValue} />;
    case WidgetType.BADGE:
      return <BadgeWidgetInk {...propsWithValue} />;
    case WidgetType.ICON:
      return <IconWidgetInk {...propsWithValue} />;
    case WidgetType.MARKDOWN:
      return <MarkdownWidgetInk {...propsWithValue} />;
    case WidgetType.LINK:
      return <LinkWidgetInk {...propsWithValue} />;
    case WidgetType.LINK_CARD:
      return <LinkCardWidgetInk {...propsWithValue} />;
    case WidgetType.MODEL_DISPLAY:
      return <ModelDisplayWidgetInk {...propsWithValue} />;
    case WidgetType.STAT:
      return <StatWidgetInk {...propsWithValue} />;

    case WidgetType.CHART:
      return <ChartWidgetInk {...propsWithValue} />;
    case WidgetType.STATUS_INDICATOR:
      return <StatusIndicatorWidgetInk {...propsWithValue} />;
    case WidgetType.ALERT:
      return <AlertWidgetInk {...propsWithValue} />;
    case WidgetType.PASSWORD_STRENGTH:
      return <PasswordStrengthWidgetInk {...propsWithValue} />;

    // === METADATA WIDGETS ===
    case WidgetType.METRIC_CARD:
      return <MetricCardWidgetInk {...propsWithValue} />;

    // === NOT SUPPORTED IN MCP (forms, interactive, containers with children) ===
    case WidgetType.FORM_FIELD:
    case WidgetType.FORM_GROUP:
    case WidgetType.FORM_SECTION:
    case WidgetType.BUTTON:
    case WidgetType.NAVIGATE_BUTTON:
    case WidgetType.SUBMIT_BUTTON:
    case WidgetType.FORM_ALERT:
    case WidgetType.MARKDOWN_EDITOR:
    case WidgetType.DATA_CARD:
    case WidgetType.DATA_GRID:
    case WidgetType.METADATA_CARD:
    case WidgetType.ACCORDION:
    case WidgetType.TABS:
    case WidgetType.AVATAR:
    case WidgetType.FILE_PATH:
    case WidgetType.LINE_NUMBER:
    case WidgetType.COLUMN_NUMBER:
    case WidgetType.CODE_RULE:
    case WidgetType.SEVERITY_BADGE:
    case WidgetType.MESSAGE_TEXT:
    case WidgetType.ISSUE_CARD:
    case WidgetType.BUTTON_GROUP:
    case WidgetType.PROGRESS:
    case WidgetType.LOADING:
    case WidgetType.ERROR:
    case WidgetType.EMPTY_STATE:
    case WidgetType.CUSTOM:
    case WidgetType.CREDIT_TRANSACTION_CARD:
    case WidgetType.CREDIT_TRANSACTION_LIST:
    case WidgetType.PAGINATION:
      props.context.logger.warn(
        `[MCP] Unsupported widget type: ${widgetType} for field ${props.fieldName}`,
      );
      return (
        <Box>
          <Text dimColor>
            Widget type &quot;{widgetType}&quot; not supported in MCP responses
          </Text>
        </Box>
      );

    default: {
      const _exhaustiveCheck: never = widgetType;
      return (
        <Box>
          <Text color="red">
            Unknown widget type: {String(_exhaustiveCheck)}
          </Text>
        </Box>
      );
    }
  }
}
