/**
 * Test file for jsx-capitalization plugin issues
 * This file intentionally contains lowercase HTML elements that should use components
 */

import React from "react";

// ============================================================
// Rule: Lowercase 'div' element
// Expected error: "Use platform-independent <Div> component..."
// ============================================================
export function ComponentWithDiv(): React.ReactElement {
  return <div className="container">Content in div</div>;
}

// ============================================================
// Rule: Typography element 'p'
// Expected error: "Use typography component <P> instead of <p>..."
// ============================================================
export function ComponentWithP(): React.ReactElement {
  return <p className="paragraph">Paragraph content</p>;
}

// ============================================================
// Rule: Typography element 'h1'
// Expected error: "Use typography component <H1> instead of <h1>..."
// ============================================================
export function ComponentWithH1(): React.ReactElement {
  return <h1 className="title">Heading content</h1>;
}

// ============================================================
// Rule: Anchor element should use Link
// Expected error: "Use platform-independent <Link> component instead of <a>..."
// ============================================================
export function ComponentWithAnchor(): React.ReactElement {
  return <a href="/test">Link text</a>;
}

// ============================================================
// Rule: Standalone element 'span'
// Expected error: "Use platform-independent <Span> component..."
// ============================================================
export function ComponentWithSpan(): React.ReactElement {
  return <span className="highlight">Highlighted text</span>;
}

// ============================================================
// Rule: Common UI element 'button'
// Expected error: "Use platform-independent <Button> component..."
// ============================================================
export function ComponentWithButton(): React.ReactElement {
  return <button type="button">Click me</button>;
}

// ============================================================
// Rule: Common UI element 'input'
// Expected error: "Use platform-independent <Input> component..."
// ============================================================
export function ComponentWithInput(): React.ReactElement {
  return <input type="text" placeholder="Enter text" />;
}

// ============================================================
// Rule: Image element
// Expected error: "Use platform-independent <Image> component..."
// ============================================================
export function ComponentWithImg(): React.ReactElement {
  return <img src="/test.png" alt="Test" />;
}

// ============================================================
// Rule: SVG elements
// Expected error: "SVG element <svg> detected. For icons, use components from next-vibe-ui/ui/icons..."
// ============================================================
export function ComponentWithSvg(): React.ReactElement {
  return (
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" />
    </svg>
  );
}

// ============================================================
// Rule: Common UI element 'ul/li'
// Expected errors for ul and li
// ============================================================
export function ComponentWithList(): React.ReactElement {
  return (
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  );
}

// ============================================================
// Rule: Common UI element 'form'
// Expected error: "Use platform-independent <Form> component..."
// ============================================================
export function ComponentWithForm(): React.ReactElement {
  return (
    <form>
      <label htmlFor="name">Name</label>
      <input id="name" type="text" />
    </form>
  );
}

// ============================================================
// Rule: Common UI element 'section'
// Expected error: "Use platform-independent <Section> component..."
// ============================================================
export function ComponentWithSection(): React.ReactElement {
  return <section className="hero">Hero section</section>;
}

// ============================================================
// Valid: Capitalized component (should NOT trigger error)
// ============================================================
export function ValidComponentUsage(): React.ReactElement {
  return <ValidComponent>This is valid</ValidComponent>;
}

function ValidComponent({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
