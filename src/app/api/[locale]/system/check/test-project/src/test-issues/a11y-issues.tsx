/**
 * Test file for Accessibility (jsx-a11y) lint issues
 * This file intentionally contains code that violates accessibility rules
 */

import React from "react";

// jsx-a11y/alt-text - Missing alt text on image
export function MissingAlt(): React.ReactElement {
  return (
    <div>
      <img src="photo.jpg" />
    </div>
  );
}

// jsx-a11y/anchor-has-content - Empty anchor
export function EmptyAnchor(): React.ReactElement {
  return <a href="https://example.com"></a>;
}

// jsx-a11y/click-events-have-key-events - Click without keyboard
export function ClickWithoutKeyboard(): React.ReactElement {
  return (
    <div onClick={() => alert("clicked")}>
      Click me
    </div>
  );
}

// jsx-a11y/heading-has-content - Empty heading
export function EmptyHeading(): React.ReactElement {
  return (
    <div>
      <h1></h1>
      <h2 aria-label="Hidden heading"></h2>
    </div>
  );
}

// jsx-a11y/html-has-lang - Missing lang attribute (would need full HTML)
// This is hard to test in a component, skip

// jsx-a11y/iframe-has-title - Missing iframe title
export function IframeWithoutTitle(): React.ReactElement {
  return <iframe src="https://example.com" />;
}

// jsx-a11y/img-redundant-alt - Redundant alt text
export function RedundantAlt(): React.ReactElement {
  return <img src="photo.jpg" alt="image of a cat" />;
}

// jsx-a11y/no-access-key - Using accessKey
export function WithAccessKey(): React.ReactElement {
  return <button accessKey="s">Save</button>;
}

// jsx-a11y/no-autofocus - Using autoFocus
export function WithAutofocus(): React.ReactElement {
  return <input autoFocus type="text" />;
}

// jsx-a11y/no-distracting-elements - Using marquee/blink
export function DistractingElements(): React.ReactElement {
  return (
    <div>
      <marquee>Scrolling text</marquee>
    </div>
  );
}

// jsx-a11y/no-redundant-roles - Redundant role
export function RedundantRole(): React.ReactElement {
  return (
    <div>
      <button role="button">Click me</button>
      <nav role="navigation">Navigation</nav>
    </div>
  );
}

// jsx-a11y/role-has-required-aria-props - Missing required ARIA props
export function MissingAriaProps(): React.ReactElement {
  return (
    <div>
      <div role="checkbox">Toggle</div>
      <div role="slider">Value</div>
    </div>
  );
}

// jsx-a11y/tabindex-no-positive - Positive tabIndex
export function PositiveTabIndex(): React.ReactElement {
  return (
    <div>
      <button tabIndex={1}>First</button>
      <button tabIndex={2}>Second</button>
    </div>
  );
}

// jsx-a11y/aria-props - Invalid aria prop
export function InvalidAriaProp(): React.ReactElement {
  return <div aria-invalid-prop="true">Content</div>;
}

// jsx-a11y/aria-role - Invalid role
export function InvalidRole(): React.ReactElement {
  return <div role="invalid-role">Content</div>;
}
