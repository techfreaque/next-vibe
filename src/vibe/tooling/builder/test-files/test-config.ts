import type { BuildConfig } from "../definition";
import { ViteBuildTypeEnum } from "../enum";

export const testDir = "./test-files";
export const distDir = `${testDir}/dist`;
const copyDir = `${testDir}/dist/copy`;

const buildConfig: BuildConfig = {
  foldersToClean: [distDir],
  filesToCompile: [
    {
      input: `${testDir}/file1.ts`,
      output: `${distDir}/output1.js`,
      type: ViteBuildTypeEnum.VANILLA,
    },
    {
      input: `${testDir}/file2.tsx`,
      output: `${distDir}/output2.js`,
      type: ViteBuildTypeEnum.REACT,
    },
    {
      input: `${testDir}/file3.tsx`,
      output: `${distDir}/output3.js`,
      type: ViteBuildTypeEnum.REACT_TAILWIND,
    },
  ],
  filesOrFoldersToCopy: [
    {
      input: `${testDir}/file1.ts`,
      output: `${copyDir}/file1.ts`,
    },
    {
      input: `${testDir}/folderToCopy`,
      output: `${copyDir}/folderToCopy`,
    },
  ],
};

export default buildConfig;
