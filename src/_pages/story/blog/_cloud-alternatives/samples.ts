/**
 * Before/after code for moving a cloud SDK client to the OpenAI and
 * Anthropic compatible /v1 API. Placeholders only, no real keys.
 */

import {
  API_KEY_PLACEHOLDER,
  toAnthropicBaseUrl,
} from "@/api-keys/coding-tools";

/** An Azure OpenAI client as most apps have it today. */
export function azureClientSample(): string {
  return `from openai import AzureOpenAI

client = AzureOpenAI(
    azure_endpoint="https://YOUR-RESOURCE.openai.azure.com",
    api_key="YOUR_AZURE_KEY",
    api_version="YOUR_API_VERSION",
)

reply = client.chat.completions.create(
    model="your-deployment-name",
    messages=[{"role": "user", "content": "Hello"}],
)
print(reply.choices[0].message.content)`;
}

/** The same request through the OpenAI SDK against our base URL. */
export function openAiClientSample(baseUrl: string, model: string): string {
  return `from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}",
    api_key="${API_KEY_PLACEHOLDER}",
)

reply = client.chat.completions.create(
    model="${model}",
    messages=[{"role": "user", "content": "Hello"}],
)
print(reply.choices[0].message.content)`;
}

/** Claude through the Anthropic SDK's Bedrock client. */
export function bedrockClaudeSample(): string {
  return `from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-east-1")

message = client.messages.create(
    model="YOUR_BEDROCK_CLAUDE_MODEL_ID",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
)
print(message.content[0].text)`;
}

/** The same Messages call through the Anthropic SDK against our base URL. */
export function anthropicClientSample(baseUrl: string, model: string): string {
  return `from anthropic import Anthropic

client = Anthropic(
    base_url="${toAnthropicBaseUrl(baseUrl)}",
    api_key="${API_KEY_PLACEHOLDER}",
)

message = client.messages.create(
    model="${model}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
)
print(message.content[0].text)`;
}
