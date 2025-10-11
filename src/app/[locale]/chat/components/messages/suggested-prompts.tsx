"use client";

import type { JSX } from "react";
import React, { useState } from "react";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const categories = [
  { id: "create", label: "Create", icon: "✨" },
  { id: "explore", label: "Explore", icon: "📄" },
  { id: "code", label: "Code", icon: "💻" },
  { id: "learn", label: "Learn", icon: "🎓" },
] as const;

const prompts = {
  create: [
    "Write a short story about a robot discovering emotions",
    "Help me outline a sci-fi novel set in a post-apocalyptic world",
    "Create a character profile for a complex villain with sympathetic motives",
    "Give me 5 creative writing prompts for flash fiction",
  ],
  explore: [
    "Explain quantum computing in simple terms",
    "What are the latest developments in renewable energy?",
    "Compare different philosophies of consciousness",
    "Summarize the history of the internet",
  ],
  code: [
    "Help me debug this React component",
    "Explain the difference between async/await and promises",
    "Write a Python script to analyze CSV data",
    "Review my code for best practices",
  ],
  learn: [
    "Teach me the basics of machine learning",
    "How does photosynthesis work?",
    "Explain the theory of relativity",
    "What are the key principles of economics?",
  ],
};

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<keyof typeof prompts>("create");

  return (
    <div className="max-w-3xl w-full mx-auto space-y-8 px-4">
      <h1 className="text-4xl font-semibold text-center">How can I help you?</h1>
      
      {/* Category Tabs */}
      <div className="flex gap-2 justify-center flex-wrap">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
              activeCategory === category.id
                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                : "hover:bg-accent border border-transparent"
            }`}
          >
            <span>{category.icon}</span>
            <span className="font-medium">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Suggested Prompts */}
      <div className="space-y-3">
        {prompts[activeCategory].map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(prompt)}
            className="w-full text-left p-4 rounded-lg hover:bg-accent transition-all border border-border"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

