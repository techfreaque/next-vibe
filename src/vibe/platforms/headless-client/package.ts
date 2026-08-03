import type { PackageManifest } from "../../tooling/builder/repository/vibe-package/types";

import { HEADLESS_CLIENT_ALIAS } from "./constants";

const manifest: PackageManifest = {
  name: "@next-vibe/headless-client",
  description:
    "Headless remote-connection client. Opens reverse-WS to the cloud, executes tool requests locally. Embeds in RDP sessions or any AI-controlled environment.",
  version: "source",

  endpoints: [HEADLESS_CLIENT_ALIAS],

  defaultEndpoint: HEADLESS_CLIENT_ALIAS,

  platforms: ["cli"],

  bin: "vibe-headless-client",
};

export default manifest;
