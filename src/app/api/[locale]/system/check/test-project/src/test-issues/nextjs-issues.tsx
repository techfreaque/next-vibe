/**
 * Test file for Next.js-specific lint issues
 * This file intentionally contains code that violates Next.js best practices
 */

import React from "react";

// nextjs/no-img-element - Using <img> instead of next/image
export function ImgElement(): React.ReactElement {
  return (
    <div>
      <img src="/photo.jpg" alt="Photo" width={300} height={200} />
    </div>
  );
}

// nextjs/no-html-link-for-pages - Using <a> for internal navigation
export function HtmlLink(): React.ReactElement {
  return (
    <nav>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <a href="/dashboard/settings">Settings</a>
    </nav>
  );
}

// nextjs/no-head-element - Using <head> instead of next/head
export function HeadElement(): React.ReactElement {
  return (
    <html>
      <head>
        <title>My Page</title>
        <meta name="description" content="My page description" />
      </head>
      <body>
        <div>Content</div>
      </body>
    </html>
  );
}

// nextjs/no-sync-scripts - Synchronous script loading
export function SyncScript(): React.ReactElement {
  return (
    <div>
      <script src="https://example.com/script.js" />
    </div>
  );
}

// nextjs/no-css-tags - Using <link> for CSS
export function CssLink(): React.ReactElement {
  return (
    <>
      <link rel="stylesheet" href="/styles.css" />
      <div>Styled content</div>
    </>
  );
}

// Google Fonts issues
export function GoogleFonts(): React.ReactElement {
  return (
    <>
      {/* nextjs/google-font-display - Missing font-display */}
      <link href="https://fonts.googleapis.com/css2?family=Roboto" rel="stylesheet" />
      {/* nextjs/google-font-preconnect - Missing preconnect */}
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
        rel="stylesheet"
      />
      <div>Text with Google Font</div>
    </>
  );
}

// Document-specific issues (these would normally be in _document)
export function DocumentIssues(): React.ReactElement {
  return (
    <html>
      {/* Missing lang attribute - jsx-a11y/html-has-lang */}
      <head>
        {/* nextjs/no-title-in-document-head - Title in document */}
        <title>Document Title</title>
      </head>
      <body>
        <div>Page content</div>
      </body>
    </html>
  );
}
