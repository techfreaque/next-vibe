/**
 * Calculation utilities
 */

export interface CalculateOptions {
  a: number;
  b: number;
  operation: "add" | "subtract" | "multiply" | "divide";
}

export function calculate(options: CalculateOptions): number {
  const { a, b, operation } = options;

  switch (operation) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      if (b === 0) {
        throw new Error("Cannot divide by zero");
      }
      return a / b;
  }
}
