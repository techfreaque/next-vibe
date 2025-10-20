/**
 * Model configuration for pricing display
 * This is a simplified version for the pricing page
 */

/* eslint-disable i18next/no-literal-string */

import { Brain, Sparkles, Zap } from "lucide-react";

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: typeof Brain | string;
  creditCost: number;
  parameterCount?: string;
}

export const modelOptions: ModelOption[] = [
  // OpenAI Models
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    description: "Most capable GPT-4 model, optimized for chat",
    icon: Brain,
    creditCost: 3,
    parameterCount: "175B",
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    description: "High-intelligence flagship model",
    icon: Brain,
    creditCost: 3,
    parameterCount: "175B",
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    description: "Fast and efficient for most tasks",
    icon: Zap,
    creditCost: 1,
    parameterCount: "175B",
  },
  // Anthropic Models
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    description: "Most powerful Claude model",
    icon: Brain,
    creditCost: 3,
    parameterCount: "200B",
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    description: "Balanced performance and speed",
    icon: Sparkles,
    creditCost: 2,
    parameterCount: "200B",
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    description: "Fastest Claude model",
    icon: Zap,
    creditCost: 1,
    parameterCount: "200B",
  },
  // Google Models
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    description: "Google's most capable AI model",
    icon: Brain,
    creditCost: 2,
    parameterCount: "540B",
  },
  {
    id: "gemini-flash",
    name: "Gemini Flash",
    provider: "Google",
    description: "Fast and efficient Gemini model",
    icon: Zap,
    creditCost: 1,
    parameterCount: "540B",
  },
  // Meta Models
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    provider: "Meta",
    description: "Open-source powerhouse",
    icon: Brain,
    creditCost: 2,
    parameterCount: "70B",
  },
  {
    id: "llama-3-8b",
    name: "Llama 3 8B",
    provider: "Meta",
    description: "Efficient open-source model",
    icon: Zap,
    creditCost: 1,
    parameterCount: "8B",
  },
  // Mistral Models
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    description: "Flagship Mistral model",
    icon: Brain,
    creditCost: 2,
    parameterCount: "176B",
  },
  {
    id: "mistral-medium",
    name: "Mistral Medium",
    provider: "Mistral",
    description: "Balanced Mistral model",
    icon: Sparkles,
    creditCost: 1,
    parameterCount: "70B",
  },
  {
    id: "mistral-small",
    name: "Mistral Small",
    provider: "Mistral",
    description: "Fast and efficient",
    icon: Zap,
    creditCost: 1,
    parameterCount: "7B",
  },
  // Cohere Models
  {
    id: "command-r-plus",
    name: "Command R+",
    provider: "Cohere",
    description: "Advanced reasoning model",
    icon: Brain,
    creditCost: 2,
    parameterCount: "104B",
  },
  {
    id: "command-r",
    name: "Command R",
    provider: "Cohere",
    description: "Efficient command model",
    icon: Sparkles,
    creditCost: 1,
    parameterCount: "35B",
  },
  // Free Models
  {
    id: "gpt-3.5-turbo-free",
    name: "GPT-3.5 Turbo (Free)",
    provider: "OpenAI",
    description: "Free tier access",
    icon: "🆓",
    creditCost: 0,
  },
  {
    id: "llama-2-7b",
    name: "Llama 2 7B (Free)",
    provider: "Meta",
    description: "Free open-source model",
    icon: "🆓",
    creditCost: 0,
    parameterCount: "7B",
  },
];
