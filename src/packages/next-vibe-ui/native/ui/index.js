// Re-export UI components for Metro bundler compatibility
// Metro doesn't support package.json wildcard exports like "./ui/*"
// so we need explicit barrel exports
//
// NOTE: Only export View component - it's the only one without external dependencies
// All other components require @rn-primitives packages

export { View } from './view';
export { Text } from './text';

