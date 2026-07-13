import type { BuildConfig } from "../definition";
import { distDir } from "./test-config";

const buildConfig: BuildConfig = {
  foldersToClean: [distDir],
};

export default buildConfig;
