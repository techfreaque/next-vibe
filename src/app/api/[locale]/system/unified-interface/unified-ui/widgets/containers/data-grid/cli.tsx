/**
 * DataGrid Widget - Ink implementation
 * Renders grid of data items in CLI (displayed as sequential list)
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { z } from "zod";

import {
  useInkWidgetLocale,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";
import { simpleT } from "@/i18n/core/shared";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { UnifiedField } from "../../../../shared/widgets/configs";
import type { WidgetData } from "../../../../shared/widgets/widget-data";
import { InkWidgetRenderer } from "../../../renderers/cli/CliWidgetRenderer";
import type { InkWidgetProps } from "../../_shared/cli-types";
import { arrayFieldPath, withValue } from "../../_shared/field-helpers";
import { hasChild, hasChildren } from "../../_shared/type-guards";
import type {
  AnyChildrenConstrain,
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";
import type { DataGridWidgetConfig } from "./types";

export function DataGridWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>(
  props:
    | InkWidgetProps<
        TEndpoint,
        DataGridWidgetConfig<TKey, TUsage, "array" | "array-optional", TChild>
      >
    | InkWidgetProps<
        TEndpoint,
        DataGridWidgetConfig<
          TKey,
          TUsage,
          "object",
          ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
        >
      >
    | InkWidgetProps<
        TEndpoint,
        DataGridWidgetConfig<
          TKey,
          TUsage,
          "object-optional",
          ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
        >
      >
    | InkWidgetProps<
        TEndpoint,
        DataGridWidgetConfig<
          TKey,
          TUsage,
          "widget-object",
          ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
        >
      >,
): JSX.Element {
  const locale = useInkWidgetLocale();
  const { t: simpleTParse } = simpleT(locale);
  const t = useInkWidgetTranslation();
  const { field, fieldName } = props;

  // Delegate to type-specific render functions
  if (hasChild(field)) {
    return renderArrayDataGrid(field, fieldName, t, simpleTParse);
  }

  if (hasChildren(field)) {
    return renderObjectDataGrid(field, fieldName, t, simpleTParse);
  }

  // No data
  return (
    <Box>
      <Text>{simpleTParse("app.common.noData")}</Text>
    </Box>
  );
}

/**
 * Render array data grid
 */
function renderArrayDataGrid<
  T extends {
    schemaType: "array" | "array-optional";
    child:
      | UnifiedField<
          string,
          z.ZodTypeAny,
          FieldUsageConfig,
          AnyChildrenConstrain<string, FieldUsageConfig>
        >
      | AnyChildrenConstrain<string, FieldUsageConfig>;
    value: WidgetData[];
  },
>(
  field: T,
  fieldName: string,
  t: (key: string, params?: Record<string, string | number>) => string,
  simpleTParse: (key: string) => string,
): JSX.Element {
  if (field.value.length === 0) {
    return (
      <Box>
        <Text>{simpleTParse("app.common.noData")}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginY={0}>
      {field.value.map((item, index: number) => {
        const childField = withValue(field.child, item, item);
        return (
          <Box
            key={index}
            flexDirection="column"
            marginBottom={1}
            paddingLeft={2}
          >
            <Text bold dimColor>
              {t("app.api.system.unifiedInterface.cli.widgets.dataGrid.item", {
                index: index + 1,
              })}
            </Text>
            <InkWidgetRenderer
              fieldName={arrayFieldPath(fieldName, index)}
              field={childField}
            />
          </Box>
        );
      })}
    </Box>
  );
}

/**
 * Render object data grid
 */
function renderObjectDataGrid<
  T extends {
    schemaType: "object" | "object-optional" | "widget-object";
    children: Record<
      string,
      | UnifiedField<
          string,
          z.ZodTypeAny,
          FieldUsageConfig,
          AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
        >
      | AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
    >;
    value: Record<string, WidgetData>;
  },
>(
  field: T,
  fieldName: string,
  t: (key: string, params?: Record<string, string | number>) => string,
  simpleTParse: (key: string) => string,
): JSX.Element {
  const childKeys = Object.keys(field.children);

  if (childKeys.length === 0) {
    return (
      <Box>
        <Text>{simpleTParse("app.common.noData")}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginY={0}>
      {childKeys.map((childName) => {
        const childField = field.children[childName];
        const itemData = field.value[childName];
        if (childField && itemData !== undefined) {
          return (
            <Box
              key={childName}
              flexDirection="column"
              marginBottom={1}
              paddingLeft={2}
            >
              <Text bold dimColor>
                {t(childName)}:
              </Text>
              <InkWidgetRenderer
                fieldName={fieldName ? `${fieldName}.${childName}` : childName}
                field={withValue(childField, itemData, field.value)}
              />
            </Box>
          );
        }
        return null;
      })}
    </Box>
  );
}
