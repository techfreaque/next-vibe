/**
 * Test file for ESLint-specific rules
 * These rules are handled by ESLint, not oxlint
 */

// simple-import-sort/imports - Unsorted imports
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import React from "react";

// simple-import-sort/exports - Unsorted exports
export { BadImportOrder };
export { HookIssues };

// react-hooks/rules-of-hooks - Hook called conditionally
function BadImportOrder(): ReactElement {
  return <div>Testing import order</div>;
}

// react-hooks/exhaustive-deps - Missing dependency
function HookIssues({ id }: { id: string }): ReactElement {
  const [data, setData] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  // react-hooks/rules-of-hooks - Hook in condition (would be caught)
  // Commenting out as it causes runtime errors
  // if (id) {
  //   const [conditionalState] = useState(0);
  // }

  // react-hooks/exhaustive-deps - Missing 'id' and 'count' in deps
  useEffect(() => {
    setData(`Data for ${id}, count: ${count}`);
  }, []); // Missing dependencies

  return <div onClick={() => setCount(count + 1)}>{data}</div>;
}
