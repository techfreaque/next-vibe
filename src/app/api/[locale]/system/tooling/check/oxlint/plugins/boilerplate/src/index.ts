/**
 * Oxlint JS Plugin: Boilerplate Pattern Enforcement
 *
 * Enforces strict boilerplate patterns for auto-stageable files:
 * - route-pattern: route.ts must be pure wiring (allowed imports only, single
 *   endpointsHandler export, one-liner handlers with no logic)
 * - i18n-pattern: i18n/en/index.ts must export a single `translations` object
 *   with no imports; de/pl files must only import `typeof enTranslations` and
 *   export a typed `translations` object - nothing else
 *
 * Configuration is loaded from check.config.ts via the shared config loader.
 *
 * Supports:
 * - Bun runtime (direct TypeScript)
 * - Node.js runtime (compiled JavaScript)
 * - NPM package installation
 * - Local development
 */

import type { BoilerplatePluginConfig } from "next-vibe/tooling/check/config/types";
import type {
  createPluginMessages,
  loadPluginConfig,
} from "next-vibe/tooling/check/oxlint/plugins/shared/config-loader";
import type {
  OxlintASTNode,
  OxlintComment,
  OxlintRuleContext,
} from "next-vibe/tooling/check/oxlint/types";

// ============================================================
// Types
// ============================================================

/** Extended rule context with boilerplate options */
interface BoilerplateRuleContext extends OxlintRuleContext {
  options?: BoilerplatePluginConfig[];
  getCommentsBefore?: (node: OxlintASTNode) => OxlintComment[];
  getFilename?: () => string;
  filename?: string;
  sourceCode?: {
    getCommentsBefore?: (node: OxlintASTNode) => OxlintComment[];
    body?: OxlintASTNode[];
  };
  // Program body - available in some oxlint contexts
  body?: OxlintASTNode[];
}

/** AST node for ImportDeclaration */
interface ImportDeclaration extends OxlintASTNode {
  type: "ImportDeclaration";
  source: { value: string };
  importKind?: "type" | "value";
  specifiers?: OxlintASTNode[];
}

/** AST node for ExportNamedDeclaration */
interface ExportNamedDeclaration extends OxlintASTNode {
  type: "ExportNamedDeclaration";
  declaration?: OxlintASTNode;
  exportKind?: "value" | "type";
}

/** AST node for VariableDeclaration */
interface VariableDeclaration extends OxlintASTNode {
  type: "VariableDeclaration";
  declarations: VariableDeclarator[];
  kind: "const" | "let" | "var";
}

/** AST node for VariableDeclarator */
interface VariableDeclarator extends OxlintASTNode {
  type: "VariableDeclarator";
  id: OxlintASTNode;
  init?: OxlintASTNode;
}

/** AST node for CallExpression */
interface CallExpression extends OxlintASTNode {
  type: "CallExpression";
  callee: OxlintASTNode;
  arguments: OxlintASTNode[];
}

/** AST node for ObjectExpression */
interface ObjectExpression extends OxlintASTNode {
  type: "ObjectExpression";
  properties: OxlintASTNode[];
}

/** AST node for Property */
interface Property extends OxlintASTNode {
  type: "Property";
  key: OxlintASTNode;
  value: OxlintASTNode;
  computed?: boolean;
}

/** AST node for Identifier */
interface Identifier extends OxlintASTNode {
  type: "Identifier";
  name: string;
}

/** AST node for ArrowFunctionExpression */
interface ArrowFunctionExpression extends OxlintASTNode {
  type: "ArrowFunctionExpression";
  body: OxlintASTNode;
  params: OxlintASTNode[];
}

/** AST node for ExpressionStatement */
interface ExpressionStatement extends OxlintASTNode {
  type: "ExpressionStatement";
}

/** Default error messages */
interface BoilerplateMessages {
  // route-pattern
  routeDisallowedImport: string;
  routeExtraStatement: string;
  routeNotEndpointsHandler: string;
  routeHandlerNotArrow: string;
  routeHandlerHasBlock: string;
  routeHandlerExtraProperty: string;
  routeOnRemoteEventNotObject: string;
  routeOnRemoteEventHandlerNotArrow: string;
  routeOnRemoteEventHandlerHasBlock: string;
  // i18n-pattern
  i18nEnHasImport: string;
  i18nEnNotSingleExport: string;
  i18nEnExtraDeclaration: string;
  i18nLangWrongImport: string;
  i18nLangNotSingleExport: string;
  i18nLangExtraDeclaration: string;
  i18nLangMissingType: string;
  // i18n/index.ts (root scoped translation factory)
  i18nIndexWrongImport: string;
  i18nIndexMissingScopedTranslation: string;
  i18nIndexExtraDeclaration: string;
}

// ============================================================
// Default Configuration
// ============================================================

const DEFAULT_CONFIG: BoilerplatePluginConfig = {
  // Allowed import sources in route.ts files
  routeAllowedImports: [
    "server-only",
    // endpointsHandler and Methods are matched by substring
  ],
};

const DEFAULT_MESSAGES: BoilerplateMessages = {
  // route-pattern
  routeDisallowedImport:
    "route.ts only allows imports from: endpointsHandler, Methods, './definition', './repository', '../repository', '../../repository', and 'server-only'.",
  routeExtraStatement:
    "route.ts must contain only imports and a single `export const { ... } = endpointsHandler({...})` statement.",
  routeNotEndpointsHandler:
    "route.ts export must call endpointsHandler() directly.",
  routeHandlerNotArrow:
    "Handler in route.ts must be an arrow function expression.",
  routeHandlerHasBlock:
    "Handler body must be a single expression (no block body `=> { ... }`), no logic allowed.",
  routeHandlerExtraProperty:
    "Handler object may only contain 'handler', 'email', 'sms', 'fieldDefaults', 'resolveChannel', and 'onRemoteEvent' properties.",
  routeOnRemoteEventNotObject:
    'onRemoteEvent must be an object literal `{ "event-name": (payload, ctx) => Repo.method(payload, ctx) }`.',
  routeOnRemoteEventHandlerNotArrow:
    "Each onRemoteEvent handler must be an arrow function.",
  routeOnRemoteEventHandlerHasBlock:
    "onRemoteEvent handler body must be a single expression — no block body `=> { ... }`, no inline logic allowed.",
  // i18n-pattern
  i18nEnHasImport:
    "i18n/en/index.ts must not have any imports. Split sub-modules into separate scoped i18n files instead.",
  i18nEnNotSingleExport:
    "i18n/en/index.ts must export exactly one `export const translations = { ... }` and nothing else.",
  i18nEnExtraDeclaration:
    "i18n/en/index.ts must contain only the `export const translations` declaration.",
  i18nLangWrongImport:
    "i18n/de or i18n/pl index.ts may only import `type { translations as enTranslations } from 'next-vibe/ui/cli/ui/src/app/api/[locale]/system/generated/endpoints-meta/en'`.",
  i18nLangNotSingleExport:
    "i18n/de or i18n/pl index.ts must export exactly one `export const translations: typeof enTranslations = { ... }`.",
  i18nLangExtraDeclaration:
    "i18n/de or i18n/pl index.ts must contain only imports and the `export const translations` declaration.",
  i18nLangMissingType:
    "i18n/de or i18n/pl `translations` must be typed as `typeof enTranslations`.",
  // i18n/index.ts (root scoped translation factory)
  i18nIndexWrongImport:
    "i18n/index.ts may only import `createScopedTranslation` from 'next-vibe/core/i18n/core/scoped-translation' and `translations as enTranslations` from 'next-vibe/ui/cli/ui/icons/src/app/api/[locale]/system/generated/endpoints-meta/en'.",
  i18nIndexMissingScopedTranslation:
    "i18n/index.ts must export `const scopedTranslation = createScopedTranslation({...})` and type exports for TranslationKey and T.",
  i18nIndexExtraDeclaration:
    "i18n/index.ts must contain only the two allowed imports, `export const scopedTranslation`, and two `export type` declarations.",
};

// ============================================================
// Dynamic Import for Shared Loader
// ============================================================

let configLoader: {
  loadPluginConfig: typeof loadPluginConfig;
  createPluginMessages: typeof createPluginMessages;
} | null = null;

let cachedConfig: BoilerplatePluginConfig | null = null;
let cachedMessages: BoilerplateMessages | null = null;

function getConfigLoader(): typeof configLoader {
  if (configLoader) {
    return configLoader;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Plugin context requires sync loading
    configLoader =
      require("next-vibe/tooling/check/oxlint/plugins/shared/config-loader") as typeof configLoader;
    return configLoader;
  } catch {
    return null;
  }
}

function loadBoilerplateConfig(): BoilerplatePluginConfig {
  if (cachedConfig !== null) {
    return cachedConfig;
  }
  const loader = getConfigLoader();
  if (loader) {
    const result = loader.loadPluginConfig(
      "oxlint-plugin-boilerplate/route-pattern",
      DEFAULT_CONFIG,
    );
    cachedConfig = result.config ?? DEFAULT_CONFIG;
  } else {
    cachedConfig = loadConfigFallback();
  }
  return cachedConfig;
}

function loadConfigFallback(): BoilerplatePluginConfig {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment -- Plugin fallback requires dynamic loading
    const config = require(`${process.cwd()}/check.config.ts`);
    const checkConfig = config.default ?? config;
    const exported =
      typeof checkConfig === "function" ? checkConfig() : checkConfig;
    const ruleConfig =
      exported?.oxlint?.rules?.["oxlint-plugin-boilerplate/route-pattern"];
    if (Array.isArray(ruleConfig) && ruleConfig[1]) {
      return ruleConfig[1] as BoilerplatePluginConfig;
    }
  } catch {
    // Config not available
  }
  return DEFAULT_CONFIG;
}

function getMessages(): BoilerplateMessages {
  if (cachedMessages !== null) {
    return cachedMessages;
  }
  cachedMessages = DEFAULT_MESSAGES;
  return cachedMessages;
}

// ============================================================
// Helper Functions
// ============================================================

function getFilename(context: BoilerplateRuleContext): string {
  if (typeof context.getFilename === "function") {
    return context.getFilename();
  }
  if (typeof context.filename === "string") {
    return context.filename;
  }
  return "";
}

function isRouteFile(context: BoilerplateRuleContext): boolean {
  const filename = getFilename(context);
  // Must end with /route.ts and be inside the app directory
  return (
    filename.endsWith("/route.ts") &&
    filename.includes("/app/") &&
    filename.includes("/[locale]/")
  );
}

function isI18nEnFile(context: BoilerplateRuleContext): boolean {
  const filename = getFilename(context);
  return filename.includes("/i18n/en/index.ts");
}

function isI18nLangFile(context: BoilerplateRuleContext): boolean {
  const filename = getFilename(context);
  return (
    (filename.includes("/i18n/de/index.ts") ||
      filename.includes("/i18n/pl/index.ts")) &&
    !filename.includes("/i18n/en/")
  );
}

function isI18nIndexFile(context: BoilerplateRuleContext): boolean {
  const filename = getFilename(context);
  // Must end with /i18n/index.ts and NOT be a locale subdir (en/de/pl)
  return (
    filename.endsWith("/i18n/index.ts") &&
    !filename.includes("/i18n/en/") &&
    !filename.includes("/i18n/de/") &&
    !filename.includes("/i18n/pl/")
  );
}

/**
 * Checks if an import source is allowed in route.ts
 * Allowed:
 *   - "server-only"
 *   - anything containing "engine/endpoints/route/multi" (endpointsHandler)
 *   - anything containing "engine/types/enums" (Methods)
 *   - "./definition"
 *   - "./repository"
 */
function isAllowedRouteImport(source: string): boolean {
  if (source === "server-only") {
    return true;
  }
  if (source === "./definition") {
    return true;
  }
  if (
    source === "./repository" ||
    source === "../repository" ||
    source === "../../../repository" ||
    source === "../../repository"
  ) {
    return true;
  }
  // Shared identity lead repository: several lead endpoints delegate to the one
  // canonical LeadsRepository (identity/lead/repository).
  if (/(^|\/)identity\/lead\/repository$/.test(source)) {
    return true;
  }
  // Shared dataflow (vibe-sense) repository: graph endpoints delegate to the one
  // canonical VibeSenseRepository (core/utils/dataflow/repository).
  if (/(^|\/)dataflow\/repository$/.test(source)) {
    return true;
  }
  if (source.includes("next-vibe/core/definition/enums")) {
    return true;
  }
  if (source.includes("/email")) {
    return true;
  }
  if (source.includes("next-vibe/core/route/multi")) {
    return true;
  }
  return false;
}

function isEndpointsHandlerCall(node: OxlintASTNode): boolean {
  if (node.type !== "CallExpression") {
    return false;
  }
  const call = node as CallExpression;
  const callee = call.callee;
  if (callee.type === "Identifier") {
    return (callee as Identifier).name === "endpointsHandler";
  }
  return false;
}

/**
 * Checks if a VariableDeclarator has a `typeof enTranslations` type annotation.
 * oxlint AST shape for `const x: typeof enTranslations = ...`:
 *   declarator.typeAnnotation.typeAnnotation = TSTypeQuery node
 *   TSTypeQuery has either .exprName or .argument pointing to an Identifier "enTranslations"
 * We also check declarator.id.typeAnnotation as a fallback.
 */
function hasTypeofEnTranslations(declarator: VariableDeclarator): boolean {
  // Walk any node looking for TSTypeQuery { exprName/argument: Identifier "enTranslations" }
  function isTSTypeQueryForEnTranslations(node: OxlintASTNode): boolean {
    if (node.type !== "TSTypeQuery") {
      return false;
    }
    const n = node as OxlintASTNode & {
      exprName?: OxlintASTNode & { name?: string };
      argument?: OxlintASTNode & { name?: string };
      typeName?: OxlintASTNode & { name?: string };
    };
    return (
      n.exprName?.name === "enTranslations" ||
      n.argument?.name === "enTranslations" ||
      n.typeName?.name === "enTranslations"
    );
  }

  // Try declarator.typeAnnotation.typeAnnotation (standard ESTree-TS shape)
  const d = declarator as OxlintASTNode & {
    typeAnnotation?: OxlintASTNode & { typeAnnotation?: OxlintASTNode };
  };
  if (d.typeAnnotation?.typeAnnotation) {
    if (isTSTypeQueryForEnTranslations(d.typeAnnotation.typeAnnotation)) {
      return true;
    }
  }

  // Try declarator.id.typeAnnotation.typeAnnotation (some parsers put it on id)
  const id = declarator.id as OxlintASTNode & {
    typeAnnotation?: OxlintASTNode & { typeAnnotation?: OxlintASTNode };
  };
  if (id.typeAnnotation?.typeAnnotation) {
    if (isTSTypeQueryForEnTranslations(id.typeAnnotation.typeAnnotation)) {
      return true;
    }
  }

  return false;
}

function isIdentifier(node: OxlintASTNode, name?: string): node is Identifier {
  if (node.type !== "Identifier") {
    return false;
  }
  if (name !== undefined) {
    return (node as Identifier).name === name;
  }
  return true;
}

// ============================================================
// Rule: route-pattern
// ============================================================

const routePatternRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforces that route.ts files are pure wiring: allowed imports only, single endpointsHandler export, one-liner handlers with no logic.",
      category: "Best Practices",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          routeAllowedImports: { type: "array", items: { type: "string" } },
        },
      },
    ],
  },
  create(
    context: BoilerplateRuleContext,
  ): Record<string, (node: OxlintASTNode) => void> {
    if (!isRouteFile(context)) {
      return {};
    }

    const messages = getMessages();
    const config = loadBoilerplateConfig();
    const extraAllowed = new Set(config.routeAllowedImports ?? []);
    // Track top-level non-import statements seen
    let exportCount = 0;

    return {
      // ── Validate imports ────────────────────────────────────
      ImportDeclaration(node: OxlintASTNode): void {
        const imp = node as ImportDeclaration;
        const source = imp.source.value;
        if (!isAllowedRouteImport(source) && !extraAllowed.has(source)) {
          context.report({ node, message: messages.routeDisallowedImport });
        }
      },

      // ── Validate top-level statements (non-import) ─────────
      // We check ExportNamedDeclaration at the program level
      ExportNamedDeclaration(node: OxlintASTNode): void {
        const exp = node as ExportNamedDeclaration;
        exportCount++;

        if (exportCount > 1) {
          context.report({ node, message: messages.routeExtraStatement });
          return;
        }

        // Must be: export const { ... } = endpointsHandler({...})
        const decl = exp.declaration;
        if (!decl || decl.type !== "VariableDeclaration") {
          context.report({ node, message: messages.routeNotEndpointsHandler });
          return;
        }

        const varDecl = decl as VariableDeclaration;
        if (varDecl.kind !== "const" || varDecl.declarations.length !== 1) {
          context.report({ node, message: messages.routeNotEndpointsHandler });
          return;
        }

        const declarator = varDecl.declarations[0];
        if (!declarator.init || !isEndpointsHandlerCall(declarator.init)) {
          context.report({ node, message: messages.routeNotEndpointsHandler });
          return;
        }

        // Validate the endpointsHandler call argument
        const callArgs = (declarator.init as CallExpression).arguments;
        if (callArgs.length !== 1 || callArgs[0].type !== "ObjectExpression") {
          context.report({ node, message: messages.routeNotEndpointsHandler });
          return;
        }

        const handlerObj = callArgs[0] as ObjectExpression;
        for (const prop of handlerObj.properties) {
          if (prop.type !== "Property") {
            continue;
          }
          const property = prop as Property;

          // Skip the `endpoint:` property
          if (
            isIdentifier(property.key) &&
            (property.key as Identifier).name === "endpoint"
          ) {
            continue;
          }

          // Each method property (computed: [Methods.POST]) or identifier (GET, POST, etc.)
          // must be an object with only `handler` (and optionally `email`) keys
          if (property.value.type !== "ObjectExpression") {
            continue;
          }
          const methodObj = property.value as ObjectExpression;

          for (const methodProp of methodObj.properties) {
            if (methodProp.type !== "Property") {
              continue;
            }
            const mp = methodProp as Property;
            if (!isIdentifier(mp.key)) {
              continue;
            }

            const keyName = (mp.key as Identifier).name;

            // Only allow valid MethodHandlerConfig properties
            const ALLOWED_HANDLER_PROPS = new Set([
              "handler",
              "email",
              "sms",
              "fieldDefaults",
              "resolveChannel",
              "onRemoteEvent",
            ]);
            if (!ALLOWED_HANDLER_PROPS.has(keyName)) {
              context.report({
                node: methodProp,
                message: messages.routeHandlerExtraProperty,
              });
              continue;
            }

            if (keyName === "onRemoteEvent") {
              // onRemoteEvent must be an object literal
              if (mp.value.type !== "ObjectExpression") {
                context.report({
                  node: mp.value,
                  message: messages.routeOnRemoteEventNotObject,
                });
                continue;
              }
              const eventsObj = mp.value as ObjectExpression;
              for (const evtProp of eventsObj.properties) {
                if (evtProp.type !== "Property") {
                  continue;
                }
                const ep = evtProp as Property;
                // Each handler must be an arrow function
                if (ep.value.type !== "ArrowFunctionExpression") {
                  context.report({
                    node: ep.value,
                    message: messages.routeOnRemoteEventHandlerNotArrow,
                  });
                  continue;
                }
                const evtArrow = ep.value as ArrowFunctionExpression;
                // Arrow body must NOT be a block statement
                if (evtArrow.body.type === "BlockStatement") {
                  context.report({
                    node: evtArrow.body,
                    message: messages.routeOnRemoteEventHandlerHasBlock,
                  });
                }
              }
              continue;
            }

            if (keyName !== "handler") {
              continue; // only validate arrow body for 'handler'
            }

            // handler must be an arrow function
            if (mp.value.type !== "ArrowFunctionExpression") {
              context.report({
                node: mp.value,
                message: messages.routeHandlerNotArrow,
              });
              continue;
            }

            const arrow = mp.value as ArrowFunctionExpression;
            // Arrow body must NOT be a block statement - must be a single expression
            if (arrow.body.type === "BlockStatement") {
              context.report({
                node: arrow.body,
                message: messages.routeHandlerHasBlock,
              });
            }
          }
        }
      },

      // ── Catch any other top-level statements ───────────────
      ExpressionStatement(node: OxlintASTNode): void {
        // Only flag top-level expression statements (parent is Program)
        // This catches stray expressions that aren't imports or export const
        const exp = node as ExpressionStatement;
        // We can't easily check parent in oxlint plugins, but ExpressionStatement
        // at top level in a route.ts is always wrong
        if (isRouteFile(context)) {
          context.report({ node: exp, message: messages.routeExtraStatement });
        }
      },
    };
  },
};

// ============================================================
// Rule: i18n-pattern
// ============================================================

const i18nPatternRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforces that i18n/en/index.ts has no imports and exports only a single translations object; de/pl files may only import typeof enTranslations and export a typed translations object; i18n/index.ts must be the scoped translation factory.",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
  },
  create(
    context: BoilerplateRuleContext,
  ): Record<string, (node: OxlintASTNode) => void> {
    const isEn = isI18nEnFile(context);
    const isLang = isI18nLangFile(context);
    const isIndex = isI18nIndexFile(context);

    if (!isEn && !isLang && !isIndex) {
      return {};
    }

    const messages = getMessages();

    if (isIndex) {
      // i18n/index.ts: scoped translation factory
      // Allowed imports:
      //   import { createScopedTranslation } from 'next-vibe/core/i18n/core/scoped-translation'
      //   import { translations as enTranslations } from 'next-vibe/ui/cli/ui/icons/src/app/api/[locale]/system/generated/endpoints-meta/en'
      // Allowed exports:
      //   export const scopedTranslation = createScopedTranslation({...})
      //   export type [Name]TranslationKey = ...
      //   export type [Name]T = ...
      let valueExportCount = 0;

      return {
        ImportDeclaration(node: OxlintASTNode): void {
          const imp = node as ImportDeclaration;
          const source = imp.source.value;
          const isTypeImport = imp.importKind === "type";

          if (isTypeImport) {
            context.report({ node, message: messages.i18nIndexWrongImport });
            return;
          }

          const isAllowed =
            source === "next-vibe/core/i18n/core/scoped-translation" ||
            source === "./en";

          if (!isAllowed) {
            context.report({ node, message: messages.i18nIndexWrongImport });
          }
        },

        ExportNamedDeclaration(node: OxlintASTNode): void {
          const exp = node as ExportNamedDeclaration;

          // export type ... declarations are allowed (up to 2)
          if (
            exp.exportKind === "type" ||
            (exp.declaration &&
              exp.declaration.type === "TSTypeAliasDeclaration")
          ) {
            return;
          }

          valueExportCount++;
          if (valueExportCount > 1) {
            context.report({
              node,
              message: messages.i18nIndexExtraDeclaration,
            });
            return;
          }

          // Must be: export const scopedTranslation = createScopedTranslation({...})
          const decl = exp.declaration;
          if (!decl || decl.type !== "VariableDeclaration") {
            context.report({
              node,
              message: messages.i18nIndexMissingScopedTranslation,
            });
            return;
          }

          const varDecl = decl as VariableDeclaration;
          if (varDecl.kind !== "const" || varDecl.declarations.length !== 1) {
            context.report({
              node,
              message: messages.i18nIndexMissingScopedTranslation,
            });
            return;
          }

          const declarator = varDecl.declarations[0];
          if (
            !isIdentifier(declarator.id) ||
            (declarator.id as Identifier).name !== "scopedTranslation"
          ) {
            context.report({
              node,
              message: messages.i18nIndexMissingScopedTranslation,
            });
            return;
          }

          // Init must be a call to createScopedTranslation(...)
          if (!declarator.init || declarator.init.type !== "CallExpression") {
            context.report({
              node,
              message: messages.i18nIndexMissingScopedTranslation,
            });
            return;
          }

          const call = declarator.init as CallExpression;
          if (
            !isIdentifier(call.callee) ||
            (call.callee as Identifier).name !== "createScopedTranslation"
          ) {
            context.report({
              node,
              message: messages.i18nIndexMissingScopedTranslation,
            });
          }
        },

        ExpressionStatement(node: OxlintASTNode): void {
          context.report({
            node,
            message: messages.i18nIndexExtraDeclaration,
          });
        },
      };
    }

    let nonImportStatements = 0;

    return {
      // ── en: no imports allowed ─────────────────────────────
      ImportDeclaration(node: OxlintASTNode): void {
        if (isEn) {
          context.report({ node, message: messages.i18nEnHasImport });
          return;
        }

        // de/pl: only allowed import is `import type { translations as enTranslations } from 'next-vibe/ui/cli/ui/src/app/api/[locale]/system/generated/endpoints-meta/en'`
        if (isLang) {
          const imp = node as ImportDeclaration;
          const source = imp.source.value;
          const isTypeImport = imp.importKind === "type";
          const isFromEn = source === "../en";

          if (!isTypeImport || !isFromEn) {
            context.report({ node, message: messages.i18nLangWrongImport });
          }
        }
      },

      // ── Validate export const translations ─────────────────
      ExportNamedDeclaration(node: OxlintASTNode): void {
        nonImportStatements++;
        const exp = node as ExportNamedDeclaration;

        if (nonImportStatements > 1) {
          context.report({
            node,
            message: isEn
              ? messages.i18nEnNotSingleExport
              : messages.i18nLangNotSingleExport,
          });
          return;
        }

        // Must be: export const translations = { ... }  (en)
        // or:      export const translations: typeof enTranslations = { ... }  (de/pl)
        const decl = exp.declaration;
        if (!decl || decl.type !== "VariableDeclaration") {
          context.report({
            node,
            message: isEn
              ? messages.i18nEnNotSingleExport
              : messages.i18nLangNotSingleExport,
          });
          return;
        }

        const varDecl = decl as VariableDeclaration;
        if (varDecl.kind !== "const" || varDecl.declarations.length !== 1) {
          context.report({
            node,
            message: isEn
              ? messages.i18nEnNotSingleExport
              : messages.i18nLangNotSingleExport,
          });
          return;
        }

        const declarator = varDecl.declarations[0];

        // Must be named `translations`
        if (
          !isIdentifier(declarator.id) ||
          (declarator.id as Identifier).name !== "translations"
        ) {
          context.report({
            node,
            message: isEn
              ? messages.i18nEnNotSingleExport
              : messages.i18nLangNotSingleExport,
          });
          return;
        }

        // Init must be an object literal
        if (!declarator.init || declarator.init.type !== "ObjectExpression") {
          context.report({
            node,
            message: isEn
              ? messages.i18nEnNotSingleExport
              : messages.i18nLangNotSingleExport,
          });
          return;
        }

        // de/pl: must have type annotation `typeof enTranslations`
        // oxlint AST: typeAnnotation lives on the declarator node (not id).
        // TSTypeQuery may use `exprName` or `argument` for the identifier.
        if (isLang) {
          const hasValidType = hasTypeofEnTranslations(declarator);
          if (!hasValidType) {
            context.report({
              node,
              message: messages.i18nLangMissingType,
            });
          }
        }
      },

      // ── Catch extra top-level declarations ─────────────────
      // Any top-level non-import, non-export-named-declaration is wrong
      ExpressionStatement(node: OxlintASTNode): void {
        nonImportStatements++;
        context.report({
          node,
          message: isEn
            ? messages.i18nEnExtraDeclaration
            : messages.i18nLangExtraDeclaration,
        });
      },
    };
  },
};

// ============================================================
// Plugin Export
// ============================================================

export default {
  meta: {
    name: "oxlint-plugin-boilerplate",
    version: "1.0.0",
  },
  rules: {
    "route-pattern": routePatternRule,
    "i18n-pattern": i18nPatternRule,
  },
};

// Named exports for direct access
export { DEFAULT_CONFIG as defaultConfig, DEFAULT_MESSAGES as defaultMessages };
export type { BoilerplateMessages, BoilerplatePluginConfig };
