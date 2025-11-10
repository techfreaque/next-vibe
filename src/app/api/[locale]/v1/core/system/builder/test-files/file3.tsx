import "./test3.css";

import type { JSX } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import { Div } from "next-vibe-ui/ui/div";

const App = (): JSX.Element => (
  // eslint-disable-next-line i18next/no-literal-string
  <Div className="p-5 m-5 w-100">Hello from input3.ts</Div>
);

const container = document.querySelector("#root");
const root = createRoot(container!);

root.render(<App />);
