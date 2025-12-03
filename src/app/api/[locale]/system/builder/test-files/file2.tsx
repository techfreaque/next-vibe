import React, { type JSX } from "react";
import { createRoot } from "react-dom/client";

// eslint-disable-next-line i18next/no-literal-string
const App = (): JSX.Element => <div>Hello from input2.ts</div>;

const container = document.querySelector("#root");
const root = createRoot(container!);

root.render(<App />);
