/**
 * Test file for React-related lint issues
 * This file intentionally contains code that violates React rules
 */

import React, { useState, useEffect } from "react";

// react/jsx-key - Missing key in list
export function ListWithoutKeys(): React.ReactElement {
  const items = ["a", "b", "c"];
  return (
    <ul>
      {items.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  );
}

// react/jsx-no-duplicate-props - Duplicate props
export function DuplicateProps(): React.ReactElement {
  return (
    <div className="first" className="second">
      Content
    </div>
  );
}

// react/no-children-prop - Children as prop
export function ChildrenAsProp(): React.ReactElement {
  return <div children={<span>Bad pattern</span>} />;
}

// react/no-direct-mutation-state - Direct state mutation (class component)
export class StateMutation extends React.Component<object, { count: number }> {
  constructor(props: object) {
    super(props);
    this.state = { count: 0 };
  }

  handleClick = (): void => {
    this.state.count = 1; // Direct mutation
  };

  render(): React.ReactElement {
    return <button onClick={this.handleClick}>{this.state.count}</button>;
  }
}

// react/self-closing-comp - Should be self-closing
export function NotSelfClosing(): React.ReactElement {
  return (
    <div>
      <br />
      <img src="test.png" alt="test" />
    </div>
  );
}

// react/no-unknown-property - Unknown DOM property
export function UnknownProperty(): React.ReactElement {
  return <div class="wrong">Should use className</div>;
}

// Hook rules violations
export function ConditionalHook(condition: boolean): React.ReactElement | null {
  // Rules of hooks violation - conditional hook
  if (condition) {
    const [value, setValue] = useState(0);
    return <div onClick={() => setValue(1)}>{value}</div>;
  }
  return null;
}

// useEffect with missing dependencies
export function MissingDeps(): React.ReactElement {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("test");

  useEffect(() => {
    // Missing 'count' in dependency array
    console.log(count, name);
  }, [name]);

  return (
    <div
      onClick={() => {
        setCount(count + 1);
        setName("updated");
      }}
    >
      {count}
    </div>
  );
}
