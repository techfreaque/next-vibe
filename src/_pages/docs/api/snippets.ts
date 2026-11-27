/**
 * Copy-paste examples for the API reference. Language-independent: every
 * snippet is built from the live base URL so it works as printed.
 * Coding-tool setups live in src/api-keys/coding-tools.ts, not here.
 */

import {
  chatModelDefinitions,
  ChatModelId,
  chatModelOptionsIndex,
} from "next-vibe/agent/ai-stream/models";
import { ImageGenModelId } from "next-vibe/agent/image-generation/models";
import { MusicGenModelId } from "next-vibe/agent/music-generation/models";
import { TtsModelId } from "next-vibe/agent/text-to-speech/models";
import { VideoGenModelId } from "next-vibe/agent/video-generation/models";

import {
  API_KEY_PLACEHOLDER,
  toAnthropicBaseUrl,
} from "@/api-keys/coding-tools";
import { chatTokenPricing } from "@/v1/shared/chat-pricing";

/** Must be callable via GET /v1/models, or every example 404s. */
export const DOCS_EXAMPLE_MODEL = ChatModelId.KIMI_K3_1_PRO;
/** Media examples: ids as GET /v1/models lists them. */
/** Takes text and image input, so it serves both generations and edits. */
const DOCS_IMAGE_MODEL = ImageGenModelId.FLUX_3_KLEIN;
const DOCS_VIDEO_MODEL = VideoGenModelId.WAN_2_7_T2V;
const DOCS_MUSIC_MODEL = MusicGenModelId.MUSICGEN_STEREO;
const DOCS_VOICE = TtsModelId.OPENAI_NOVA;
const DOCS_VIDEO_ID = "video_8f2c0e5a7b1d4c3e9a6f0b2d4e6a8c1f";
const DOCS_MUSIC_ID = "music_3b7d1f9a2c4e6a8b0d2f4a6c8e0b1d3f";
/** Anthropic id as Claude Code sends it by default; maps to our matching Claude model. */
const ANTHROPIC_DEFAULT_ID = "claude-sonnet-4-5-20250929";

export interface DocsSnippets {
  models: string;
  modelsResponse: string;
  chat: string;
  chatResponse: string;
  stream: string;
  streamResponse: string;
  python: string;
  pythonStream: string;
  node: string;
  nodeStream: string;
  toolsCurl: string;
  toolsResponse: string;
  toolsFollowUp: string;
  toolsPython: string;
  errorShape: string;
  errorShapeAnthropic: string;
  errorCredits: string;
  rateHeaders: string;
  responses: string;
  responsesResponse: string;
  responsesStream: string;
  responsesPython: string;
  messages: string;
  messagesResponse: string;
  messagesStream: string;
  countTokens: string;
  countTokensResponse: string;
  messagesPython: string;
  mediaModelsResponse: string;
  images: string;
  imagesResponse: string;
  imagesEdit: string;
  imagesPython: string;
  speech: string;
  speechPython: string;
  transcription: string;
  transcriptionResponse: string;
  translation: string;
  videoCreate: string;
  videoObject: string;
  videoPoll: string;
  musicCreate: string;
  musicPoll: string;
  mediaFile: string;
  responsesNode: string;
  messagesNode: string;
  imagesNode: string;
  speechNode: string;
  transcriptionPython: string;
  transcriptionNode: string;
  envSetup: string;
}

export function buildDocsSnippets(baseUrl: string): DocsSnippets {
  const auth = `-H "Authorization: Bearer ${API_KEY_PLACEHOLDER}"`;
  const anthropicBaseUrl = toAnthropicBaseUrl(baseUrl);
  return {
    models: `curl ${baseUrl}/models \\
  ${auth}`,
    modelsResponse: `{
  "object": "list",
  "data": [
    {
      "id": "${DOCS_EXAMPLE_MODEL}",
      "object": "model",
      "created": 1735689600,
      "owned_by": "moonshot",
      "name": "${chatModelDefinitions[DOCS_EXAMPLE_MODEL].name}",
      "context_length": 131072,
      "supports_tools": true,
      "input_modalities": ["text"],
      "output_modalities": ["text"],
      "pricing": ${JSON.stringify(chatTokenPricing(chatModelOptionsIndex[DOCS_EXAMPLE_MODEL]), null, 2).replaceAll("\n", "\n      ")}
    }
  ]
}`,
    chat: `curl ${baseUrl}/chat/completions \\
  ${auth} \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${DOCS_EXAMPLE_MODEL}",
    "messages": [
      { "role": "system", "content": "You answer in one sentence." },
      { "role": "user", "content": "Why is the sky blue?" }
    ]
  }'`,
    chatResponse: `{
  "id": "chatcmpl-3f9c1a...",
  "object": "chat.completion",
  "created": 1767225600,
  "model": "${DOCS_EXAMPLE_MODEL}",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "Air scatters blue light more than red." },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 31,
    "prompt_tokens_details": {"cached_tokens": 16, "cache_write_tokens": 0},
    "completion_tokens": 9,
    "total_tokens": 40,
    "credits_charged": 0.1
  }
}`,
    stream: `curl -N ${baseUrl}/chat/completions \\
  ${auth} \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${DOCS_EXAMPLE_MODEL}",
    "stream": true,
    "stream_options": { "include_usage": true },
    "messages": [{ "role": "user", "content": "Count to three." }]
  }'`,
    streamResponse: `data: {"id":"chatcmpl-3f9c...","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

data: {"id":"chatcmpl-3f9c...","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"One, "},"finish_reason":null}]}

data: {"id":"chatcmpl-3f9c...","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: {"id":"chatcmpl-3f9c...","object":"chat.completion.chunk","choices":[],"usage":{"prompt_tokens":12,"completion_tokens":7,"total_tokens":19,"credits_charged":0.1}}

data: [DONE]`,
    python: `from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}",
    api_key="${API_KEY_PLACEHOLDER}",
)

reply = client.chat.completions.create(
    model="${DOCS_EXAMPLE_MODEL}",
    messages=[{"role": "user", "content": "Why is the sky blue?"}],
)
print(reply.choices[0].message.content)`,
    pythonStream: `stream = client.chat.completions.create(
    model="${DOCS_EXAMPLE_MODEL}",
    messages=[{"role": "user", "content": "Count to three."}],
    stream=True,
)
for chunk in stream:
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")`,
    node: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "${baseUrl}",
  apiKey: process.env.UNBOTTLED_API_KEY, // ${API_KEY_PLACEHOLDER}
});

const reply = await client.chat.completions.create({
  model: "${DOCS_EXAMPLE_MODEL}",
  messages: [{ role: "user", content: "Why is the sky blue?" }],
});
console.log(reply.choices[0].message.content);`,
    nodeStream: `const stream = await client.chat.completions.create({
  model: "${DOCS_EXAMPLE_MODEL}",
  messages: [{ role: "user", content: "Count to three." }],
  stream: true,
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}`,
    toolsCurl: `curl ${baseUrl}/chat/completions \\
  ${auth} \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${DOCS_EXAMPLE_MODEL}",
    "messages": [{ "role": "user", "content": "Weather in Berlin?" }],
    "tools": [{
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Current weather for a city",
        "parameters": {
          "type": "object",
          "properties": { "city": { "type": "string" } },
          "required": ["city"]
        }
      }
    }],
    "tool_choice": "auto"
  }'`,
    toolsResponse: `{
  "object": "chat.completion",
  "model": "${DOCS_EXAMPLE_MODEL}",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": null,
        "tool_calls": [
          {
            "id": "call_8x2k",
            "type": "function",
            "function": { "name": "get_weather", "arguments": "{\\"city\\":\\"Berlin\\"}" }
          }
        ]
      },
      "finish_reason": "tool_calls"
    }
  ]
}`,
    toolsFollowUp: `# Run get_weather yourself, then send the result back:
curl ${baseUrl}/chat/completions \\
  ${auth} \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${DOCS_EXAMPLE_MODEL}",
    "messages": [
      { "role": "user", "content": "Weather in Berlin?" },
      { "role": "assistant", "content": null, "tool_calls": [
        { "id": "call_8x2k", "type": "function",
          "function": { "name": "get_weather", "arguments": "{\\"city\\":\\"Berlin\\"}" } }
      ]},
      { "role": "tool", "tool_call_id": "call_8x2k", "content": "18C, cloudy" }
    ],
    "tools": [ ...same tools as before... ]
  }'`,
    toolsPython: `import json

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Current weather for a city",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"],
        },
    },
}]
messages = [{"role": "user", "content": "Weather in Berlin?"}]

first = client.chat.completions.create(
    model="${DOCS_EXAMPLE_MODEL}", messages=messages, tools=tools
)
call = first.choices[0].message.tool_calls[0]
result = get_weather(**json.loads(call.function.arguments))  # your code

messages += [
    first.choices[0].message,
    {"role": "tool", "tool_call_id": call.id, "content": result},
]
final = client.chat.completions.create(
    model="${DOCS_EXAMPLE_MODEL}", messages=messages, tools=tools
)
print(final.choices[0].message.content)`,
    errorShape: `{
  "error": {
    "message": "Invalid or revoked API key. ...",
    "type": "authentication_error",
    "param": null,
    "code": "invalid_api_key"
  }
}`,
    errorShapeAnthropic: `{
  "type": "error",
  "error": {
    "type": "authentication_error",
    "message": "Invalid or revoked API key. ..."
  }
}`,
    errorCredits: `HTTP/1.1 402 Payment Required
{
  "error": {
    "message": "Insufficient credits. This call needs about 1.2, you have 0.4. Top up to continue.",
    "type": "insufficient_quota",
    "param": null,
    "code": "insufficient_credits"
  }
}`,
    rateHeaders: `HTTP/1.1 429 Too Many Requests
Retry-After: 12
{ "error": { "type": "rate_limit_error", "code": "rate_limit_exceeded", ... } }`,
    responses: `curl ${baseUrl}/responses \\
  ${auth} \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${DOCS_EXAMPLE_MODEL}",
    "instructions": "You answer in one sentence.",
    "input": "Why is the sky blue?"
  }'`,
    responsesResponse: `{
  "id": "resp_7d2e...",
  "object": "response",
  "status": "completed",
  "model": "${DOCS_EXAMPLE_MODEL}",
  "output": [
    {
      "type": "message",
      "role": "assistant",
      "content": [
        { "type": "output_text", "text": "Air scatters blue light more than red." }
      ]
    }
  ],
  "usage": { "input_tokens": 24, "output_tokens": 9, "total_tokens": 33 }
}`,
    responsesStream: `event: response.created
data: {"type":"response.created","response":{"id":"resp_7d2e...","status":"in_progress"}}

event: response.output_text.delta
data: {"type":"response.output_text.delta","delta":"Air scatters "}

event: response.completed
data: {"type":"response.completed","response":{"id":"resp_7d2e...","status":"completed"}}`,
    responsesPython: `reply = client.responses.create(
    model="${DOCS_EXAMPLE_MODEL}",
    input="Why is the sky blue?",
)
print(reply.output_text)`,
    messages: `curl ${anthropicBaseUrl}/v1/messages \\
  -H "x-api-key: ${API_KEY_PLACEHOLDER}" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${DOCS_EXAMPLE_MODEL}",
    "max_tokens": 1024,
    "system": "You answer in one sentence.",
    "messages": [{ "role": "user", "content": "Why is the sky blue?" }]
  }'`,
    messagesResponse: `{
  "id": "msg_01Hk...",
  "type": "message",
  "role": "assistant",
  "model": "${DOCS_EXAMPLE_MODEL}",
  "content": [{ "type": "text", "text": "Air scatters blue light more than red." }],
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 24, "output_tokens": 9 }
}`,
    messagesStream: `event: message_start
data: {"type":"message_start","message":{"id":"msg_01Hk...","role":"assistant","content":[]}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Air scatters "}}

event: message_stop
data: {"type":"message_stop"}`,
    countTokens: `curl ${anthropicBaseUrl}/v1/messages/count_tokens \\
  -H "x-api-key: ${API_KEY_PLACEHOLDER}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${ANTHROPIC_DEFAULT_ID}",
    "messages": [{ "role": "user", "content": "Why is the sky blue?" }]
  }'`,
    countTokensResponse: `{ "input_tokens": 14 }`,
    messagesPython: `import anthropic

client = anthropic.Anthropic(
    base_url="${anthropicBaseUrl}",
    api_key="${API_KEY_PLACEHOLDER}",
)

reply = client.messages.create(
    model="${DOCS_EXAMPLE_MODEL}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Why is the sky blue?"}],
)
# Reasoning models put a thinking block first: print the text block.
print(next(block.text for block in reply.content if block.type == "text"))`,
    mediaModelsResponse: `{
  "id": "${DOCS_IMAGE_MODEL}",
  "object": "model",
  "owned_by": "blackForestLabs",
  "modality": "image",
  "endpoints": ["/v1/images/generations", "/v1/images/edits"],
  "input_modalities": ["text", "image"],
  "output_modalities": ["image"],
  "pricing": { "credits_per_image": 1.17 }
}`,
    images: `curl ${baseUrl}/images/generations \\
  ${auth} \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${DOCS_IMAGE_MODEL}",
    "prompt": "A lighthouse on a cliff at dawn, oil painting",
    "size": "1024x1024",
    "n": 1
  }'`,
    imagesResponse: `{
  "created": 1767225600,
  "model": "${DOCS_IMAGE_MODEL}",
  "data": [
    { "url": "${baseUrl}/media/3f9c.../image-1.png?expires=1767830400&sig=..." }
  ],
  "credits_charged": 1.17
}`,
    imagesEdit: `curl ${baseUrl}/images/edits \\
  ${auth} \\
  -F model=${DOCS_IMAGE_MODEL} \\
  -F prompt="Make it night, add a full moon" \\
  -F image=@lighthouse.png`,
    imagesPython: `import base64

img = client.images.generate(
    model="${DOCS_IMAGE_MODEL}",
    prompt="A lighthouse on a cliff at dawn, oil painting",
    response_format="b64_json",
)
open("lighthouse.png", "wb").write(base64.b64decode(img.data[0].b64_json))`,
    speech: `curl ${baseUrl}/audio/speech \\
  ${auth} \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${DOCS_VOICE}",
    "input": "Your build finished. All tests are green.",
    "response_format": "mp3"
  }' \\
  -o speech.mp3`,
    speechPython: `# OpenAI names work too: model tts-1 plus voice nova is ${DOCS_VOICE}.
audio = client.audio.speech.create(
    model="tts-1", voice="nova", input="Your build finished."
)
audio.write_to_file("speech.mp3")`,
    transcription: `curl ${baseUrl}/audio/transcriptions \\
  ${auth} \\
  -F model=whisper-1 \\
  -F file=@meeting.mp3 \\
  -F response_format=json`,
    transcriptionResponse: `{ "text": "Let's ship the release on Friday." }`,
    translation: `curl ${baseUrl}/audio/translations \\
  ${auth} \\
  -F model=whisper-1 \\
  -F file=@interview-de.mp3`,
    videoCreate: `curl ${baseUrl}/videos \\
  ${auth} \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${DOCS_VIDEO_MODEL}",
    "prompt": "A paper boat drifting down a rainy street, cinematic",
    "seconds": 5,
    "size": "1280x720"
  }'`,
    videoObject: `{
  "id": "${DOCS_VIDEO_ID}",
  "object": "video",
  "model": "${DOCS_VIDEO_MODEL}",
  "status": "completed",
  "progress": 100,
  "seconds": "5",
  "size": "1280x720",
  "url": "${baseUrl}/media/<threadId>/video.mp4?expires=1767830400&sig=<signature>",
  "credits_charged": 42,
  "error": null
}`,
    videoPoll: `# Poll until status is completed or failed (free, skipped by abuse guard)
curl ${baseUrl}/videos/${DOCS_VIDEO_ID} \\
  ${auth}

# Download the MP4
curl ${baseUrl}/videos/${DOCS_VIDEO_ID}/content \\
  ${auth} \\
  -o boat.mp4`,
    musicCreate: `curl ${baseUrl}/music \\
  ${auth} \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${DOCS_MUSIC_MODEL}",
    "prompt": "Lo-fi hip hop, warm piano, slow vinyl crackle",
    "seconds": 20
  }'`,
    musicPoll: `curl ${baseUrl}/music/${DOCS_MUSIC_ID} \\
  ${auth}

curl ${baseUrl}/music/${DOCS_MUSIC_ID}/content \\
  ${auth} \\
  -o track.mp3`,
    mediaFile: `# Signed link from a response: works without a key for 7 days
curl -o image.png "${baseUrl}/media/3f9c.../image-1.png?expires=1767830400&sig=..."

# Same file with your key, any time
curl -o image.png ${baseUrl}/media/3f9c.../image-1.png \\
  ${auth}`,
    responsesNode: `const reply = await client.responses.create({
  model: "${DOCS_EXAMPLE_MODEL}",
  input: "Why is the sky blue?",
});
console.log(reply.output_text);`,
    messagesNode: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  baseURL: "${anthropicBaseUrl}",
  apiKey: process.env.UNBOTTLED_API_KEY, // ${API_KEY_PLACEHOLDER}
});

const reply = await client.messages.create({
  model: "${DOCS_EXAMPLE_MODEL}",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Why is the sky blue?" }],
});
const text = reply.content.find((block) => block.type === "text");
console.log(text?.type === "text" ? text.text : "");`,
    imagesNode: `const img = await client.images.generate({
  model: "${DOCS_IMAGE_MODEL}",
  prompt: "A lighthouse on a cliff at dawn, oil painting",
});
console.log(img.data?.[0]?.url);`,
    speechNode: `import { writeFile } from "node:fs/promises";

const audio = await client.audio.speech.create({
  model: "${DOCS_VOICE}",
  input: "Your build finished.",
});
await writeFile("speech.mp3", Buffer.from(await audio.arrayBuffer()));`,
    transcriptionPython: `with open("meeting.mp3", "rb") as f:
    result = client.audio.transcriptions.create(model="whisper-1", file=f)
print(result.text)`,
    transcriptionNode: `import { createReadStream } from "node:fs";

const result = await client.audio.transcriptions.create({
  model: "whisper-1",
  file: createReadStream("meeting.mp3"),
});
console.log(result.text);`,
    envSetup: `export OPENAI_BASE_URL="${baseUrl}"
export OPENAI_API_KEY="${API_KEY_PLACEHOLDER}"`,
  };
}
