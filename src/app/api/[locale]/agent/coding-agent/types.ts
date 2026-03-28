export interface CodingAgentRequest {
  prompt: string;
  model?: string;
  interactiveMode?: boolean;
  taskTitle?: string;
}

export interface CodingAgentResponse {
  output: string;
  durationMs: number;
}
