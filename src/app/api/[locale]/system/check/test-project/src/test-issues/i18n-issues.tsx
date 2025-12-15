/**
 * Test file for i18n literal string issues
 * This file intentionally contains hardcoded strings that should be translated
 */

import React from "react";

// Literal strings in JSX text content
export function HardcodedStrings(): React.ReactElement {
  return (
    <div>
      <h1>Welcome to our application</h1>
      <p>This is a paragraph with hardcoded text that should be translated.</p>
      <button>Click here to continue</button>
      <span>Error: Something went wrong</span>
      <label>Enter your email address</label>
    </div>
  );
}

// Literal strings in JSX attributes (non-excluded)
export function HardcodedAttributes(): React.ReactElement {
  return (
    <div>
      <button aria-label="Close modal">X</button>
      <input placeholder="Enter your name" />
      <img src="/logo.png" alt="Company logo" title="Our awesome logo" />
    </div>
  );
}

// Literal strings in component props
export function HardcodedProps(): React.ReactElement {
  return (
    <div>
      <CustomButton label="Submit form" />
      <CustomInput errorMessage="This field is required" />
      <Notification message="Your changes have been saved" />
    </div>
  );
}

// Literal strings in variables used in JSX
export function HardcodedVariables(): React.ReactElement {
  const title = "Dashboard";
  const subtitle = "View your analytics";
  const errorMsg = "Failed to load data";

  return (
    <div>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <p>{errorMsg}</p>
    </div>
  );
}

// Literal strings in conditional rendering
export function ConditionalStrings({ isError }: { isError: boolean }): React.ReactElement {
  return (
    <div>
      {isError ? (
        <span>An error occurred</span>
      ) : (
        <span>Operation successful</span>
      )}
    </div>
  );
}

// Literal strings in array rendering
export function ArrayStrings(): React.ReactElement {
  const menuItems = ["Home", "About", "Contact", "Settings"];

  return (
    <nav>
      {menuItems.map((item, index) => (
        <a key={index} href="#">{item}</a>
      ))}
    </nav>
  );
}

// Literal strings in object properties used for display
export function ObjectStrings(): React.ReactElement {
  const config = {
    title: "Application Settings",
    description: "Manage your preferences here",
    saveButton: "Save Changes",
    cancelButton: "Discard",
  };

  return (
    <div>
      <h2>{config.title}</h2>
      <p>{config.description}</p>
      <button>{config.saveButton}</button>
      <button>{config.cancelButton}</button>
    </div>
  );
}

// Mock components for props testing
function CustomButton({ label }: { label: string }): React.ReactElement {
  return <button>{label}</button>;
}

function CustomInput({ errorMessage }: { errorMessage: string }): React.ReactElement {
  return (
    <div>
      <input />
      <span>{errorMessage}</span>
    </div>
  );
}

function Notification({ message }: { message: string }): React.ReactElement {
  return <div className="notification">{message}</div>;
}
