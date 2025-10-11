import { createEslintConfig } from 'lint';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseConfig = createEslintConfig({
  projectRoot: __dirname,
  additionalIgnores: [
    "dist/**/",
  ],
  enableReactCompiler: true,
});

export default baseConfig;
