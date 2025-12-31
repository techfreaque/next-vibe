/**
 * Grouped List Widget Renderer
 * Specialized renderer for grouped lists with beautiful CLI output
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

/**
 * Configuration for grouped list rendering
 */
interface GroupedListConfig {
  groupBy: string;
  sortBy: string;
  showGroupSummary: boolean;
  maxItemsPerGroup: number;
  summaryTitle?: string;
  summaryStats?: StatConfig[];
  renderMode?: "code-quality" | "simple"; // Data-driven mode selection
  hierarchical?: boolean; // Enable hierarchical/tree rendering for nested paths
}

/**
 * Individual item in a grouped list
 */
interface GroupedListItem {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | GroupedListItem
    | GroupedListItem[];
  line?: number;
  column?: number;
  severity?: string;
  message?: string;
  rule?: string;
}

/**
 * Configuration for summary statistics
 */
interface StatConfig {
  field: string;
  value: string;
  label?: string;
  icon?: string;
  color?: string;
}

/**
 * Tree node for hierarchical rendering
 */
interface TreeNode {
  name: string;
  fullPath: string;
  items: GroupedListItem[];
  children: Map<string, TreeNode>;
}

export class GroupedListWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.GROUPED_LIST
> {
  readonly widgetType = WidgetType.GROUPED_LIST;

  render(
    props: CLIWidgetProps<typeof WidgetType.GROUPED_LIST, string>,
  ): string {
    const { value: data, context } = props;
    const t = context.t;

    if (!Array.isArray(data) || data.length === 0) {
      return context.renderEmptyState(
        t(
          "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
    }

    // Type narrow the array items to GroupedListItem
    const typedData: GroupedListItem[] = data.filter(
      (item): item is GroupedListItem =>
        typeof item === "object" && item !== null && !Array.isArray(item),
    ) as GroupedListItem[];
    const config = this.getGroupedListConfig();

    let output = "";

    // Use hierarchical rendering if configured
    if (config.hierarchical) {
      output = this.renderHierarchical(typedData, config, context);
    } else {
      // Group data by the specified field
      const groups = this.groupData(typedData, config.groupBy, context);

      // Render each group
      for (const [groupKey, items] of groups) {
        output += this.renderGroup(groupKey, items, config, context);
        output += "\n";
      }

      // Add summary if requested
      if (config.showGroupSummary) {
        output += this.renderSummary(typedData, groups, config, context);
      }
    }

    return output.trim();
  }

  private getGroupedListConfig(): GroupedListConfig {
    return {
      groupBy: "file",
      sortBy: "severity",
      showGroupSummary: true,
      maxItemsPerGroup: 50,
    };
  }

  /**
   * Group data by specified field
   */
  private groupData(
    data: GroupedListItem[],
    groupBy: string,
    context: WidgetRenderContext,
  ): Map<string, GroupedListItem[]> {
    const t = context.t;
    const groups = new Map<string, GroupedListItem[]>();
    const otherLabel = t(
      "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.other",
    );

    for (const item of data) {
      const groupValue = item[groupBy];
      let groupKey = otherLabel;
      if (typeof groupValue === "string") {
        groupKey = groupValue;
      } else if (typeof groupValue === "number") {
        groupKey = String(groupValue);
      } else if (typeof groupValue === "boolean") {
        groupKey = groupValue ? "true" : "false";
      } else if (groupValue !== null && groupValue !== undefined) {
        groupKey = otherLabel;
      }
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    }

    // Sort groups by filename (alphabetically)
    return new Map(
      [...groups.entries()].toSorted((a, b) => a[0].localeCompare(b[0])),
    );
  }

  /**
   * Render a single group
   */
  private renderGroup(
    groupKey: string,
    items: GroupedListItem[],
    config: GroupedListConfig,
    context: WidgetRenderContext,
  ): string {
    let output = "";

    // Group header with file path and count
    const groupHeader = this.renderGroupHeader(groupKey, items.length, context);
    output += `${groupHeader}${String.fromCodePoint(10)}`;

    // Sort items within group
    const sortedItems = this.sortItems(items, config.sortBy);

    // Render each item
    for (const item of sortedItems.slice(0, config.maxItemsPerGroup)) {
      const itemLine = this.renderGroupItem(item, context, config);
      output += `  ${itemLine}${String.fromCodePoint(10)}`;
    }

    // Show truncation message if needed
    if (items.length > config.maxItemsPerGroup) {
      const t = context.t;
      const remaining = items.length - config.maxItemsPerGroup;
      const truncationMsg = this.styleText(
        t(
          "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.andMoreItems",
          { count: remaining.toString() },
        ),
        "dim",
        context,
      );
      output += `  ${truncationMsg}${String.fromCodePoint(10)}`;
    }

    return output;
  }

  /**
   * Render group header
   */
  private renderGroupHeader(
    groupKey: string,
    itemCount: number,
    context: WidgetRenderContext,
  ): string {
    // Clean up file path for display
    const displayPath = this.formatFilePath(groupKey);
    const countText = `${itemCount} item${itemCount !== 1 ? "s" : ""}`;

    const pathText = this.styleText(displayPath, "underline", context);
    const countTextStyled = this.styleText(
      String.fromCodePoint(40) + countText + String.fromCodePoint(41),
      "dim",
      context,
    );

    const fileIcon = context.options.useEmojis
      ? `${String.fromCodePoint(128196)} `
      : "";
    return `${fileIcon}${pathText} ${countTextStyled}`;
  }

  /**
   * Render individual group item (lint issue or command)
   */
  private renderGroupItem(
    item: GroupedListItem,
    context: WidgetRenderContext,
    config: GroupedListConfig,
  ): string {
    const parts: string[] = [];

    // Use renderMode from config to determine rendering style
    const isCodeQualityMode = config.renderMode === "code-quality";

    if (isCodeQualityMode) {
      // Render as lint issue with line/column/severity
      // Location (line:column)
      if (item.line || item.column) {
        const location = this.formatLocation(item.line, item.column);
        parts.push(this.styleText(location.padEnd(8), "blue", context));
      }

      // Severity with icon and color
      if (item.severity) {
        const severity = this.formatSeverity(item.severity, context);
        parts.push(severity.padEnd(12));
      }

      // Message
      if (item.message) {
        parts.push(item.message);
      }

      // Rule (if available)
      if (
        item.rule &&
        typeof item.rule === "string" &&
        item.rule !== "unknown"
      ) {
        const ruleText = this.styleText(`[${item.rule}]`, "dim", context);
        parts.push(ruleText);
      }
    } else {
      // Render as command or general item (simple mode)
      // Rule (command name) first - styled and padded
      if (
        item.rule &&
        typeof item.rule === "string" &&
        item.rule !== "unknown"
      ) {
        const commandName = this.styleText(item.rule.padEnd(20), "bold", context);
        parts.push(commandName);
      }

      // Message (description) second
      if (item.message) {
        parts.push(item.message);
      }
    }

    return parts.join(" ");
  }

  /**
   * Sort items within a group
   */
  private sortItems(
    items: GroupedListItem[],
    sortBy: string,
  ): GroupedListItem[] {
    return items.toSorted((a, b) => {
      if (sortBy === "severity") {
        const severityOrder = { error: 0, warning: 1, info: 2 };
        const aOrder =
          severityOrder[a.severity as keyof typeof severityOrder] ?? 3;
        const bOrder =
          severityOrder[b.severity as keyof typeof severityOrder] ?? 3;
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
      }

      // Secondary sort by line number
      if (typeof a.line === "number" && typeof b.line === "number") {
        return a.line - b.line;
      }

      return 0;
    });
  }

  /**
   * Format file path for display
   */
  private formatFilePath(filePath: string): string {
    // Return file path as-is - CWD stripping not available without process
    return filePath;
  }

  /**
   * Format location (line:column)
   */
  private formatLocation(line?: number, column?: number): string {
    if (typeof line === "number" && typeof column === "number") {
      return `${line}:${column}`;
    } else if (typeof line === "number") {
      return `${line}:${0}`;
    }
    return `${0}:${0}`;
  }

  /**
   * Format severity with icon and color
   */
  private formatSeverity(
    severity: string,
    context: WidgetRenderContext,
  ): string {
    const icons = context.options.useEmojis;

    switch (severity) {
      case "error": {
        const errorIcon = icons
          ? `${String.fromCodePoint(10060)} `
          : `${String.fromCodePoint(10007)} `;
        const errorText = this.styleText("error", "red", context);
        return `${errorIcon}${errorText}`;
      }
      case "warning": {
        const warnIcon = icons
          ? `${String.fromCodePoint(9888)}${String.fromCodePoint(65039)} `
          : `${String.fromCodePoint(33)}  `;
        const warnText = this.styleText("warn", "yellow", context);
        return `${warnIcon}${warnText}`;
      }
      case "info": {
        const infoIcon = icons
          ? `${String.fromCodePoint(8505)}${String.fromCodePoint(65039)} `
          : `${String.fromCodePoint(105)} `;
        const infoText = this.styleText("info", "blue", context);
        return `${infoIcon}${infoText}`;
      }
      default:
        return severity;
    }
  }

  /**
   * Render summary statistics with beautiful formatting
   */

  private renderSummary(
    data: GroupedListItem[],
    groups: Map<string, GroupedListItem[]>,
    config: GroupedListConfig,
    context: WidgetRenderContext,
  ): string {
    const t = context.t;
    // Skip summary if not configured
    if (!config.showGroupSummary) {
      return "";
    }

    // Only show affected files list and detailed summary for code quality mode
    if (config.renderMode !== "code-quality") {
      return "";
    }

    let output = "";

    // Add affected files list first
    output += this.renderAffectedFilesList(groups, context);

    // Then add summary section
    output += String.fromCodePoint(10) + String.fromCodePoint(10);

    // Beautiful header with separator
    const headerIcon = context.options.useEmojis
      ? `${String.fromCodePoint(128202)} `
      : "";
    const summaryTitle =
      config.summaryTitle ||
      t(
        "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.summary",
      );
    const headerText = this.styleText(
      `${headerIcon}${summaryTitle}`,
      "bold",
      context,
    );
    output += `${headerText}${String.fromCodePoint(10)}`;

    // Add subtle separator line
    const separatorLength = 50;
    const separator = String.fromCodePoint(9472).repeat(separatorLength);
    output += `${this.styleText(separator, "dim", context)}${String.fromCodePoint(10)}`;

    // Meaningful summary stats for code quality tools
    const totalIssues = data.length;
    const totalFiles = groups.size;
    const errors = data.filter((item) => item.severity === "error").length;
    const warnings = data.filter((item) => item.severity === "warning").length;

    // Show meaningful metrics
    const filesLabel = t(
      "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.files",
    );
    const issuesLabel = t(
      "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.issues",
    );
    output += `   ${this.styleText(`${filesLabel}:`, "dim", context).padEnd(12)} ${totalFiles}${String.fromCodePoint(10)}`;
    output += `   ${this.styleText(`${issuesLabel}:`, "dim", context).padEnd(12)} ${totalIssues}${String.fromCodePoint(10)}`;

    if (errors > 0) {
      const errorIcon = context.options.useEmojis
        ? `${String.fromCodePoint(10060)} `
        : "";
      const errorText = this.styleText(
        `${errors} error${errors !== 1 ? "s" : ""}`,
        "red",
        context,
      );
      output += `   ${errorIcon}${errorText}${String.fromCodePoint(10)}`;
    }

    if (warnings > 0) {
      const warnIcon = context.options.useEmojis
        ? `${String.fromCodePoint(9888)}${String.fromCodePoint(65039)} `
        : "";
      const warnText = this.styleText(
        `${warnings} warning${warnings !== 1 ? "s" : ""}`,
        "yellow",
        context,
      );
      output += `   ${warnIcon}${warnText}${String.fromCodePoint(10)}`;
    }

    // Custom summary stats if configured
    if (config.summaryStats && Array.isArray(config.summaryStats)) {
      for (const stat of config.summaryStats) {
        const count = this.calculateStatCount(data, stat);
        if (count > 0) {
          const icon =
            context.options.useEmojis && stat.icon ? `${stat.icon} ` : "";
          const label = stat.label || stat.field;
          const color = stat.color || "dim";
          const validColor =
            color === "red" ||
            color === "yellow" ||
            color === "blue" ||
            color === "green" ||
            color === "dim" ||
            color === "bold" ||
            color === "underline"
              ? color
              : "dim";
          const statText = this.styleText(
            `${count} ${label}`,
            validColor,
            context,
          );
          output += `   ${icon}${statText}${String.fromCodePoint(10)}`;
        }
      }
    }

    return output;
  }

  /**
   * Render a clean list of affected files with error counts
   */
  private renderAffectedFilesList(
    groups: Map<string, GroupedListItem[]>,
    context: WidgetRenderContext,
  ): string {
    const t = context.t;
    if (groups.size === 0) {
      return "";
    }

    let output = `${String.fromCodePoint(10)}${String.fromCodePoint(10)}`;

    // Header
    const headerIcon = context.options.useEmojis
      ? `${String.fromCodePoint(128203)} `
      : "";
    const headerText = this.styleText(
      `${headerIcon}${t("app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.affectedFiles")}`,
      "bold",
      context,
    );
    output += `${headerText}${String.fromCodePoint(10)}`;

    // Separator
    const separator = String.fromCodePoint(9472).repeat(50);
    output += `${this.styleText(separator, "dim", context)}${String.fromCodePoint(10)}`;

    // Sort files by filename (alphabetically)
    const sortedFiles = [...groups.entries()].toSorted(([aKey], [bKey]) =>
      aKey.localeCompare(bKey),
    );

    // List each file with its error count
    for (const [fileName, issues] of sortedFiles) {
      const errorCount = issues.filter(
        (item) => item.severity === "error",
      ).length;
      const warningCount = issues.filter(
        (item) => item.severity === "warning",
      ).length;

      let countText = "";
      if (errorCount > 0 && warningCount > 0) {
        const errorText = `${errorCount} ${t(`app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.${errorCount === 1 ? "error" : "errors"}`)}`;
        const warningText = `${warningCount} ${t(`app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.${warningCount === 1 ? "warning" : "warnings"}`)}`;
        countText = this.styleText(
          `${errorText}, ${warningText}`,
          "red",
          context,
        );
      } else if (errorCount > 0) {
        countText = this.styleText(
          `${errorCount} error${errorCount !== 1 ? "s" : ""}`,
          "red",
          context,
        );
      } else if (warningCount > 0) {
        countText = this.styleText(
          `${warningCount} warning${warningCount !== 1 ? "s" : ""}`,
          "yellow",
          context,
        );
      } else {
        countText = this.styleText(
          `${issues.length} item${issues.length !== 1 ? "s" : ""}`,
          "dim",
          context,
        );
      }

      const fileIcon = context.options.useEmojis
        ? `${String.fromCodePoint(128196)} `
        : "";
      const fileText = fileName; // No styling for file names

      const fileEntry = `   ${fileIcon}${fileText} ${String.fromCodePoint(40)}${countText}${String.fromCodePoint(41)}`;
      output += `${fileEntry}${String.fromCodePoint(10)}`;
    }

    return output;
  }

  /**
   * Calculate count for a specific stat configuration
   */
  private calculateStatCount(
    data: GroupedListItem[],
    stat: StatConfig,
  ): number {
    if (!stat.field || !stat.value) {
      return 0;
    }

    return data.filter((item) => {
      const fieldValue = item[stat.field];
      return fieldValue === stat.value;
    }).length;
  }

  /**
   * Render hierarchical tree structure for nested paths
   */
  private renderHierarchical(
    data: GroupedListItem[],
    config: GroupedListConfig,
    context: WidgetRenderContext,
  ): string {
    // Build tree structure from flat data
    const root: TreeNode = {
      name: "",
      fullPath: "",
      items: [],
      children: new Map(),
    };

    // Group items by category path
    for (const item of data) {
      const categoryPath = item[config.groupBy];
      if (typeof categoryPath !== "string") {
        continue;
      }

      const parts = categoryPath.split("/").filter((p) => p.length);
      let currentNode = root;

      // Build/traverse tree
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const fullPath = parts.slice(0, i + 1).join("/");

        if (!currentNode.children.has(part)) {
          currentNode.children.set(part, {
            name: part,
            fullPath,
            items: [],
            children: new Map(),
          });
        }
        currentNode = currentNode.children.get(part)!;
      }

      // Add item to leaf node
      currentNode.items.push(item);
    }

    // Render tree recursively
    return this.renderTreeNode(root, 0, config, context);
  }

  /**
   * Render a single tree node and its children
   */
  private renderTreeNode(
    node: TreeNode,
    depth: number,
    config: GroupedListConfig,
    context: WidgetRenderContext,
  ): string {
    const result: string[] = [];
    const indent = "  ".repeat(depth);

    // Sort children alphabetically
    const sortedChildren = [...node.children.entries()].toSorted((a, b) =>
      a[0].localeCompare(b[0]),
    );

    // Render this node's items first if any
    if (node.items.length > 0 && depth > 0) {
      // Calculate total count including children
      const totalCount = this.countItemsRecursive(node);
      const itemText = `${totalCount} item${totalCount !== 1 ? "s" : ""}`;

      const pathText = node.fullPath;
      const styledPath = this.styleText(pathText, "underline", context);
      const countStyled = this.styleText(`(${itemText})`, "dim", context);

      result.push(`${indent}${styledPath} ${countStyled}`);

      // Render items
      const sortedItems = this.sortItems(node.items, config.sortBy);
      for (const item of sortedItems.slice(0, config.maxItemsPerGroup)) {
        const itemLine = this.renderGroupItem(item, context, config);
        result.push(`${indent}  ${itemLine}`);
      }

      if (node.items.length > config.maxItemsPerGroup) {
        const remaining = node.items.length - config.maxItemsPerGroup;
        const t = context.t;
        const truncationMsg = this.styleText(
          t(
            "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.andMoreItems",
            { count: remaining.toString() },
          ),
          "dim",
          context,
        );
        result.push(`${indent}  ${truncationMsg}`);
      }

      result.push("");
    }

    // Render children
    for (const childEntry of sortedChildren) {
      const childNode = childEntry[1];
      const childOutput = this.renderTreeNode(
        childNode,
        depth + (node.items.length > 0 ? 1 : 0),
        config,
        context,
      );
      if (childOutput) {
        result.push(childOutput);
      }
    }

    return result.join("\n");
  }

  /**
   * Count items recursively including all children
   */
  private countItemsRecursive(node: TreeNode): number {
    let count = node.items.length;
    for (const childEntry of node.children) {
      const child = childEntry[1];
      count += this.countItemsRecursive(child);
    }
    return count;
  }
}
