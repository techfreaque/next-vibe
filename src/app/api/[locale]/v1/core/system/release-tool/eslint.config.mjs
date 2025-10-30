import { createEslintConfig } from 'lint';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseConfig = createEslintConfig({
  projectRoot: __dirname,
  additionalIgnores: [
  ],
  enableReactCompiler: false,
});

export default baseConfig;