import "./test3.css";

import type { JSX } from "react";
import React from "react";
import { createRoot } from "react-dom/client";

const App = (): JSX.Element => (
  // eslint-disable-next-line i18next/no-literal-string
  <div className="p-5 m-5 w-100">Hello from input3.ts</div>
);

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(<App />);
