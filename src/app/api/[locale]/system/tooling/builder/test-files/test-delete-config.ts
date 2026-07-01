import type { BuildConfig } from "../repository/types";
import { distDir } from "./test-config";

const buildConfig: BuildConfig = {
  foldersToClean: [distDir],
};

export default buildConfig;
