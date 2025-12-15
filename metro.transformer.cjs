/**
 * Custom Metro transformer to handle server-only imports
 *
 * This transformer detects files that import 'server-only' and replaces
 * them with a stub that throws an error at runtime, preventing Metro
 * from crashing during bundling.
 */

const upstreamTransformer = require("@expo/metro-config/babel-transformer");

module.exports.transform = (props) => {
  const { filename, src } = props;

  // Check if this file imports 'server-only'
  if (
    src.includes('import "server-only"') ||
    src.includes("import 'server-only'")
  ) {
    // eslint-disable-next-line no-console -- Intentional logging for Metro build debugging
    console.error(
      `[Metro] Skipping server-only file: ${filename.replace(process.cwd(), "")}`,
    );

    // Replace the entire file with a stub that throws at runtime
    const stubCode = `
      // This file imports 'server-only' and cannot run in React Native
      throw new Error(
        'This module uses server-only features and cannot run in React Native. ' +
        'File: ${filename.replace(process.cwd(), "")}. ' +
        'A .native override is needed for this route.'
      );
    `;

    return upstreamTransformer.transform({
      ...props,
      src: stubCode,
    });
  }

  // For all other files, use the default transformer
  return upstreamTransformer.transform(props);
};
