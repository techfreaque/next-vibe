#!/usr/bin/env node
import { Command } from 'commander';

import { add } from '@/src/commands/add';
import { init } from '@/src/commands/init';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

async function main() {
  const program = new Command()
    .name('@react-native-reusables/cli')
    .description('add components and dependencies to your project');

  program.addCommand(add);
  program.addCommand(init);

  program.parse();
}

main();
