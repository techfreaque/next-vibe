/**
 * Oxlint JS Plugin: Vibe Internal Boundary
 *
 * Enforces that nothing inside src/vibe/ imports from outside src/vibe/.
 * Applies to all import forms:
 * - Static import declarations:  import ... from '...'
 * - Dynamic import expressions:  await import('...')
 * - require() calls:             require('...')
 *
 * External packages (bare specifiers, e.g. "react", "zod") are always
 * allowed — only relative paths that escape the vibe subtree are flagged.
 * Absolute paths starting with "next-vibe/" or "@next-vibe/" are also
 * allowed (they re-enter through the package alias, not a cross-boundary
 * relative path).
 *
 * Opt out per-line with:
 *   // oxlint-disable-next-line oxlint-plugin-vibe-boundary/vibe-internal-boundary
 */

import type {
  OxlintASTNode,
  OxlintComment,
  OxlintRuleContext,
} from "../../../types";

// ============================================================
// Types
// ============================================================

interface RuleContext extends OxlintRuleContext {
  getFilename?: () => string;
  filename?: string;
  getCommentsBefore?: (node: OxlintASTNode) => OxlintComment[];
  sourceCode?: {
    getCommentsBefore?: (node: OxlintASTNode) => OxlintComment[];
  };
}

interface ImportDeclarationNode extends OxlintASTNode {
  type: "ImportDeclaration";
  source?: { value?: string | number | boolean | null };
  importKind?: "type" | "value";
}

interface ImportExpressionNode extends OxlintASTNode {
  type: "ImportExpression";
  source?: OxlintASTNode;
}

interface CallExpressionNode extends OxlintASTNode {
  type: "CallExpression";
  callee?: OxlintASTNode;
  arguments?: OxlintASTNode[];
}

interface IdentifierNode extends OxlintASTNode {
  type: "Identifier";
  name: string;
}

interface LiteralNode extends OxlintASTNode {
  type: "Literal";
  value?: string | number | boolean | null;
}

// ============================================================
// Helpers
// ============================================================

const VIBE_PATH_FRAGMENT = "/src/vibe/";
const RULE_NAME = "vibe-internal-boundary";

function getFilename(context: RuleContext): string {
  if (typeof context.getFilename === "function") {
    return context.getFilename();
  }
  if (typeof context.filename === "string") {
    return context.filename;
  }
  return "";
}

/**
 * Resolve a relative import specifier from the importing file's path and
 * determine whether the resolved path escapes src/vibe/.
 *
 * Only relative paths (starting with ".") can cross the boundary — bare
 * package specifiers and alias paths (next-vibe/…, @next-vibe/…) are fine.
 */
function isOutsideVibe(specifier: string, importingFile: string): boolean {
  if (!specifier.startsWith(".")) {
    return false;
  }

  const normalized = importingFile.replaceAll("\\", "/");
  const lastSlash = normalized.lastIndexOf("/");
  const dir = lastSlash >= 0 ? normalized.slice(0, lastSlash) : normalized;

  // Walk each segment of dir/specifier, resolving ".." against the stack
  const combined = `${dir}/${specifier}`;
  const stack: string[] = [];
  for (const part of combined.split("/")) {
    if (part === "" || part === ".") {
      continue;
    }
    if (part === "..") {
      stack.pop();
    } else {
      stack.push(part);
    }
  }

  const resolvedPath = `/${stack.join("/")}`;
  return !resolvedPath.includes(VIBE_PATH_FRAGMENT);
}

function getLiteralString(node: OxlintASTNode): string | null {
  if (node.type === "Literal") {
    const v = (node as LiteralNode).value;
    if (typeof v === "string") {
      return v;
    }
  }
  return null;
}

function hasDisableComment(context: RuleContext, node: OxlintASTNode): boolean {
  const getComments =
    context.getCommentsBefore ?? context.sourceCode?.getCommentsBefore;
  if (typeof getComments !== "function") {
    return false;
  }
  try {
    const comments = getComments(node);
    if (!comments || !Array.isArray(comments)) {
      return false;
    }
    for (const comment of comments) {
      if (typeof comment?.value !== "string") {
        continue;
      }
      const text = comment.value.trim();
      if (
        (text.includes("eslint-disable-next-line") ||
          text.includes("oxlint-disable-next-line")) &&
        text.includes(RULE_NAME)
      ) {
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}

const MESSAGE =
  "Files inside src/vibe/ must not import from outside src/vibe/. " +
  "Move shared code into src/vibe/, or extract it to a proper package.";

// ============================================================
// Rule
// ============================================================

const vibeBoundaryRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallows imports that cross out of src/vibe/ into the wider codebase",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
  },

  create(context: RuleContext): Record<string, (node: OxlintASTNode) => void> {
    const filename = getFilename(context);
    if (!filename.replaceAll("\\", "/").includes(VIBE_PATH_FRAGMENT)) {
      return {};
    }

    function check(node: OxlintASTNode, specifier: string): void {
      if (!isOutsideVibe(specifier, filename)) {
        return;
      }
      if (hasDisableComment(context, node)) {
        return;
      }
      context.report({ node, message: MESSAGE });
    }

    return {
      // Static imports: import ... from './outside'
      ImportDeclaration(node: OxlintASTNode): void {
        const imp = node as ImportDeclarationNode;
        const src = imp.source?.value;
        if (typeof src === "string") {
          check(node, src);
        }
      },

      // Dynamic imports: import('./outside')
      ImportExpression(node: OxlintASTNode): void {
        const imp = node as ImportExpressionNode;
        if (!imp.source) {
          return;
        }
        const specifier = getLiteralString(imp.source);
        if (specifier !== null) {
          check(node, specifier);
        }
      },

      // require('./outside')
      CallExpression(node: OxlintASTNode): void {
        const call = node as CallExpressionNode;
        if (
          !call.callee ||
          call.callee.type !== "Identifier" ||
          (call.callee as IdentifierNode).name !== "require"
        ) {
          return;
        }
        const args = call.arguments;
        if (!args || args.length === 0) {
          return;
        }
        const specifier = getLiteralString(args[0]);
        if (specifier !== null) {
          check(node, specifier);
        }
      },
    };
  },
};

// ============================================================
// Plugin Export
// ============================================================

export default {
  meta: {
    name: "oxlint-plugin-vibe-boundary",
    version: "1.0.0",
  },
  rules: {
    [RULE_NAME]: vibeBoundaryRule,
  },
};
