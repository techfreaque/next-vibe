/**
 * Widget Registry for React
 * Maps WidgetType to React components
 */

"use client";

import type { FC, JSX } from "react";
import type { FieldValues } from "react-hook-form";

import type { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import {
  type ReactWidgetProps,
  type ValueOnlyReactWidgetProps,
  type WidgetComponentProps,
} from "../../../shared/widgets/types";

/**
 * Widget component type for registry storage - uses WidgetComponentProps for retrieval
 */
export type WidgetComponent = FC<WidgetComponentProps<string>>;

/**
 * Accepted component types for registration - supports all widget prop variants
 */
type RegisterableComponent<T extends WidgetType> =
  | FC<WidgetComponentProps<string>>
  | (<const TKey extends string>(props: ReactWidgetProps<T, TKey, FieldValues>) => JSX.Element)
  | FC<ValueOnlyReactWidgetProps<T>>;

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
   * Accepts various widget prop types and stores as WidgetComponent
   */
  register<T extends WidgetType>(type: T, component: RegisterableComponent<T>): void {
    // Safe cast: widgets are stored generically but called with correct props at runtime
    this.widgets.set(type, component as WidgetComponent);
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
