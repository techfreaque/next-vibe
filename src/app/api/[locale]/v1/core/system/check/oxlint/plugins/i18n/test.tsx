/* eslint-disable @typescript-eslint/explicit-function-return-type, eslint-plugin-next/no-html-link-for-pages, eslint-plugin-next/no-img-element, @typescript-eslint/no-namespace */
/**
 * Test file for oxlint-plugin-i18n/no-literal-string rule
 *
 * This file verifies that the i18n plugin:
 * 1. Catches untranslated literal strings in JSX
 * 2. Properly excludes configured patterns (className, numbers, camelCase, etc.)
 *
 * Each violation is marked with eslint-disable-next-line to assert that an
 * error SHOULD occur. If the rule stops working, these assertions will become
 * errors themselves.
 */

// Minimal JSX types to avoid type errors in test file
declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Element {}
    interface IntrinsicElements {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
      [elemName: string]: unknown;
    }
  }
}

// Mock translation function for tests
const t = (key: string): string => key;

// ============================================================================
// TESTS THAT SHOULD ERROR (Literal strings needing translation)
// ============================================================================

function TestLiteralInJSXText() {
  return (
    <div>
      {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
      This should be translated
    </div>
  );
}

function TestLiteralInJSXExpression() {
  return (
    <div>
      {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
      {"Another literal string"}
    </div>
  );
}

function TestLiteralInAttribute() {
  return (
    <div
      // eslint-disable-next-line oxlint-plugin-i18n/no-literal-string
      title="This should be translated"
      aria-label="Also needs translation" // eslint-disable-line oxlint-plugin-i18n/no-literal-string
    >
      OK
    </div>
  );
}

function TestMultiWordString() {
  return (
    <div>
      {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
      Hello World
    </div>
  );
}

// ============================================================================
// TESTS THAT SHOULD PASS (Excluded patterns)
// ============================================================================

function TestClassName() {
  return <div className="flex items-center gap-4">OK</div>;
}

function TestMultipleClassNameVariants() {
  return (
    <div
      className="base"
      data-container-class-name="container"
      data-wrapper-class-name="wrapper"
    >
      OK
    </div>
  );
}

function TestExcludedAttributes() {
  return (
    <a
      id="test-id"
      data-testid="test"
      href="/path"
      target="_blank"
      rel="noopener"
    >
      OK
    </a>
  );
}

function TestSingleCharacterPunctuation() {
  return (
    <div>
      {"/"}
      {"-"}
      {"•"}
      {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
      {"·"}
    </div>
  );
}

function TestNumbers() {
  return (
    <div>
      {"123"}
      {"42"}
      {"0"}
    </div>
  );
}

function TestDottedKeys() {
  return <div>{t("app.home.title")}</div>;
}

function TestImageExtensions() {
  return (
    <img
      src="image.jpg"
      alt="test.png"
    />
  );
}

function TestURLs() {
  return (
    <div>
      {"https://example.com"}
      {"http://test.org"}
      {"/path/to/resource"}
    </div>
  );
}

function TestMentionsAndTags() {
  return (
    <div>
      {"@username"}
      {"#hashtag"}
    </div>
  );
}

function TestLowercaseWords() {
  return (
    <div>
      {"api"}
      {"json"}
      {"test"}
    </div>
  );
}

function TestCamelCase() {
  return (
    <div>
      {"someIdentifier"}
      {"myVariableName"}
      {"userId"}
    </div>
  );
}

function TestHyphenSeparated() {
  return (
    <div>
      {"my-component"}
      {"test-id"}
      {"kebab-case"}
    </div>
  );
}

function TestSlashPaths() {
  return (
    <div>
      {"api/v1/users"}
      {"path/to/file"}
    </div>
  );
}

function TestAllCaps() {
  return (
    <div>
      {"API_KEY"}
      {"CONSTANT_VALUE"}
      {"ENV_VAR"}
    </div>
  );
}

function TestDirectives() {
  // These would be at file level normally, but showing pattern
  const directives = ["use client", "use server", "use custom"];
  return <div>{directives.join(", ")}</div>;
}

// ============================================================================
// Export all test components
// ============================================================================

export {
  TestLiteralInJSXText,
  TestLiteralInJSXExpression,
  TestLiteralInAttribute,
  TestMultiWordString,
  TestClassName,
  TestMultipleClassNameVariants,
  TestExcludedAttributes,
  TestSingleCharacterPunctuation,
  TestNumbers,
  TestDottedKeys,
  TestImageExtensions,
  TestURLs,
  TestMentionsAndTags,
  TestLowercaseWords,
  TestCamelCase,
  TestHyphenSeparated,
  TestSlashPaths,
  TestAllCaps,
  TestDirectives,
};
