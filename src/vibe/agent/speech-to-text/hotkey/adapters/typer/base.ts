/**
 * Base Typer Implementation
 * Abstract base class for all platform-specific typers
 */

import "server-only";

import type { TyperBackendType } from "../../enum";
import type { Typer } from "../../types";
import { TyperError } from "../../types";

/**
 * Abstract base typer class
 * Provides common functionality for all typer implementations
 */
export abstract class BaseTyper implements Typer {
  constructor(protected readonly _backend: TyperBackendType) {}

  /**
   * Backend type identifier
   */
  get backend(): TyperBackendType {
    return this._backend;
  }

  /**
   * Insert text at current cursor position
   */
  async insertText(text: string): Promise<void> {
    if (!text || text.length === 0) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Typer validation error
      throw new TyperError("Cannot insert empty text", "EMPTY_TEXT", { text });
    }

    // Check dependencies before attempting insertion
    const hasDepends = await this.checkDependencies();
    if (!hasDepends) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Typer dependency error
      throw new TyperError(
        "Required dependencies not available",
        "MISSING_DEPENDENCIES",
        {
          backend: this._backend,
        },
      );
    }

    try {
      await this.insertTextImpl(text);
    } catch (error) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Typer execution error
      throw new TyperError(
        `Failed to insert text: ${String(error)}`,
        "INSERT_FAILED",
        {
          text,
          error: error instanceof Error ? error.message : String(error),
        },
      );
    }
  }

  /**
   * Check if required dependencies are available
   */
  abstract checkDependencies(): Promise<boolean>;

  /**
   * Implementation-specific text insertion
   * Must be implemented by subclasses
   */
  protected abstract insertTextImpl(text: string): Promise<void>;
}
