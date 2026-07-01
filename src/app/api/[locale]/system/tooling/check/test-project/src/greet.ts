/**
 * Greeting module
 */

export interface GreetOptions {
  name: string;
  formal?: boolean;
}

export function greet(options: GreetOptions): string {
  const { name, formal = false } = options;

  if (formal) {
    return `Good day, ${name}. How may I assist you?`;
  }

  return `Hello, ${name}!`;
}
