/**
 * Widget Registry for React
 * Maps WidgetType to React components
 */

"use client";

import type { FC } from "react";

import type { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { type WidgetComponentProps } from "../../../shared/widgets/types";
/**
 * Widget component type
 */
export type WidgetComponent = FC<WidgetComponentProps>;

/**
 * Widget registry entry
 */
interface WidgetRegistryEntry {
  type: WidgetType;
  component: WidgetComponent;
}

/**
 * Widget Registry
 * Manages available widget components and provides fallback rendering
 */
export class WidgetRegistry {
  private widgets: Map<WidgetType, WidgetComponent> = new Map();

  /**
   * Register a widget component
   */
  register(type: WidgetType, component: WidgetComponent): void {
    this.widgets.set(type, component);
  }

  /**
   * Register multiple widgets at once
   */
  registerMany(entries: WidgetRegistryEntry[]): void {
    for (const entry of entries) {
      this.register(entry.type, entry.component);
    }
  }

  /**
   * Get widget component for a type
   */
  get(type: WidgetType): WidgetComponent | null {
    return this.widgets.get(type) ?? null;
  }

  /**
   * Check if a widget type is registered
   */
  has(type: WidgetType): boolean {
    return this.widgets.has(type);
  }

  /**
   * Get all registered widget types
   */
  getRegisteredTypes(): WidgetType[] {
    return [...this.widgets.keys()];
  }

  /**
   * Clear all registered widgets
   */
  clear(): void {
    this.widgets.clear();
  }
}

/**
 * Global widget registry instance
 */
export const widgetRegistry = new WidgetRegistry();
