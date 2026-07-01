import type { BuildConfig } from "../repository/types";

export const testDir = "./test-files";
export const distDir = `${testDir}/dist`;
export const copyDir = `${testDir}/dist/copy`;

const buildConfig: BuildConfig = {
  foldersToClean: [distDir],
  filesToCompile: [
    {
      input: `${testDir}/file1.ts`,
      output: `${distDir}/output1.js`,
      type: "vanilla",
    },
    {
      input: `${testDir}/file2.tsx`,
      output: `${distDir}/output2.js`,
      type: "react",
    },
    {
      input: `${testDir}/file3.tsx`,
      output: `${distDir}/output3.js`,
      type: "react-tailwind",
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
