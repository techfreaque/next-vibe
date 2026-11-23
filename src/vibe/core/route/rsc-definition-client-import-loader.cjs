/**
 * Next's Flight compiler follows dynamic imports into client entrypoints.
 * Strip only imports owned by the endpoint renderer or its client hooks;
 * the server may read other imports from the very same definition.
 */
"use strict";

const { createHash } = require("node:crypto");
const path = require("node:path");
const { parse } = require("next/dist/compiled/babel/parser");
const traverse = require("next/dist/compiled/babel/traverse").default;

const vibeRoot = path.resolve(__dirname, "../..");
const clientModules = new Map();

function parseModule(source, filename) {
  return parse(source, {
    sourceType: "module",
    createImportExpressions: true,
    plugins: /\.[cm]?ts$/.test(filename)
      ? ["typescript"]
      : ["typescript", "jsx"],
  });
}

// Check the lexical binding so aliases work and local lookalikes stay intact.
function importsFrom(identifier, name, module, context) {
  if (!identifier.isIdentifier()) {
    return false;
  }
  const binding = identifier.scope.getBinding(identifier.node.name)?.path;
  if (!binding?.parentPath.isImportDeclaration()) {
    return false;
  }
  const named =
    binding.isImportSpecifier() && binding.node.imported.name === name;
  const defaultImport =
    binding.isImportDefaultSpecifier() && name === "default";
  if (!named && !defaultImport) {
    return false;
  }
  const source = binding.parentPath.node.source.value;
  if (module === "react") {
    return source === module;
  }
  return (
    source === `next-vibe/${module}` ||
    (source.startsWith(".") &&
      path.resolve(context, source) === path.join(vibeRoot, module))
  );
}

function property(object, key) {
  if (!object?.isObjectExpression()) {
    return;
  }
  return object
    .get("properties")
    .find(
      (prop) =>
        prop.isObjectProperty() &&
        !prop.node.computed &&
        (prop.node.key.name ?? prop.node.key.value) === key,
    )
    ?.get("value");
}

function isWidgetFactory(call, context) {
  if (!call?.isCallExpression()) {
    return false;
  }
  const callee = call.get("callee");
  return (
    importsFrom(
      callee,
      "lazyWidget",
      "unified-ui/_shared/lazy-widget",
      context,
    ) ||
    (callee.isMemberExpression() &&
      !callee.node.computed &&
      callee.get("property").isIdentifier({ name: "lazy" }) &&
      importsFrom(callee.get("object"), "default", "react", context))
  );
}

// Endpoint render slots and client hook bodies have separate SSR/browser copies.
// Everything else in a definition can be read by an RSC, including React.lazy.
function clientImports(source, filename, context) {
  const renders = new Set();
  const callbacks = new Set();
  let ast;
  try {
    ast = parseModule(source, filename);
  } catch {
    // The normal compiler owns syntax diagnostics. Unsupported syntax can
    // safely keep all its imports.
    return [];
  }
  traverse(ast, {
    CallExpression(call) {
      const callee = call.get("callee");
      if (
        !importsFrom(
          callee,
          "createEndpoint",
          "core/definition/create-i18n",
          context,
        ) &&
        !importsFrom(
          callee,
          "createEndpoint",
          "core/definition/create",
          context,
        )
      ) {
        return;
      }
      const config = call.get("arguments.0");
      const fields = property(config, "fields");
      if (
        fields?.isCallExpression() &&
        importsFrom(
          fields.get("callee"),
          "customWidgetObject",
          "unified-ui/_shared/utils",
          context,
        )
      ) {
        const render = property(fields.get("arguments.0"), "render");
        if (render) {
          renders.add(render);
        }
      }
      const events = property(config, "events");
      if (events?.isObjectExpression()) {
        for (const event of events.get("properties")) {
          if (event.isObjectProperty()) {
            callbacks.add(property(event.get("value"), "onEvent"));
          }
        }
      }
      const mutation = property(property(config, "options"), "mutationOptions");
      for (const name of ["onSuccess", "onError"]) {
        callbacks.add(property(mutation, name));
      }
    },
  });

  for (const render of renders) {
    let factory = render;
    if (render.isIdentifier()) {
      const binding = render.scope.getBinding(render.node.name);
      if (
        !binding?.constant ||
        !binding.path.isVariableDeclarator() ||
        !binding.referencePaths.every((ref) => renders.has(ref))
      ) {
        continue;
      }
      factory = binding.path.get("init");
    }
    if (isWidgetFactory(factory, context)) {
      callbacks.add(factory.get("arguments.0"));
    }
  }

  const imports = new Set();
  for (const callback of callbacks) {
    if (
      !callback?.isArrowFunctionExpression() &&
      !callback?.isFunctionExpression()
    ) {
      continue;
    }
    callback.traverse({
      ImportExpression(expr) {
        if (expr.get("source").isStringLiteral() && !expr.node.options) {
          imports.add(expr.node);
        }
      },
    });
  }
  return [...imports];
}

async function isClientModule(loader, filename) {
  loader.addDependency(filename);
  const source = await new Promise((resolve, reject) => {
    loader.fs.readFile(filename, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
  const digest = createHash("sha256").update(source).digest("hex");
  const cached = clientModules.get(filename);
  if (cached?.digest === digest) {
    return cached.client;
  }
  const client =
    source.includes("use client") &&
    parseModule(source, filename).program.directives.some(
      (d) => d.value.value === "use client",
    );
  clientModules.set(filename, { digest, client });
  return client;
}

async function transform(loader, source) {
  const imports = clientImports(source, loader.resourcePath, loader.context);
  const resolve = loader.getResolve({});
  const clients = new Set();
  for (const request of new Set(imports.map((expr) => expr.source.value))) {
    try {
      const file = await resolve(loader.context, request);
      if (file && (await isClientModule(loader, file))) {
        clients.add(request);
      }
    } catch {
      // Unknown syntax, unreadable or unresolved targets retain their real import.
    }
  }
  // Edit only parser-reported ranges, from the end to keep offsets stable.
  for (const expr of imports.toSorted((a, b) => b.start - a.start)) {
    if (clients.has(expr.source.value)) {
      const before = source.slice(0, expr.start);
      const after = source.slice(expr.end);
      source = `${before}Promise.resolve({})${after}`;
    }
  }
  return source;
}

module.exports = async function rscDefinitionClientImportLoader(source) {
  const done = this.async();
  let result;
  try {
    result = await transform(this, source);
  } catch (error) {
    done(error);
    return;
  }
  done(null, result);
};
