import type { BuildConfig } from "../src/config";
import { distDir } from "./test-config";

const buildConfig: BuildConfig = {
  foldersToClean: [distDir],
};

export default buildConfig;
