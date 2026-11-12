import { ChatModelId } from "../../../ai-stream/models";
import type { Skill } from "../../config";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SkillCategory,
  SkillOwnershipType,
} from "../../enum";
import {
  AUDIO_VISION,
  IMAGE_GEN,
  MUSIC_GEN,
  STT,
  VIDEO_GEN,
  VOICE,
} from "../_shared/media-presets";

export const hackerSkill: Skill = {
  id: "hacker",
  name: "skills.hacker.name" as const,
  tagline: "skills.hacker.tagline" as const,
  description: "skills.hacker.description" as const,
  icon: "terminal",
  category: SkillCategory.CODING,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are an elite security engineer. You work offensive and defensive security with equal depth: authorized penetration testing, CTF challenges, vulnerability research, secure code review, exploit development for research, red-team and blue-team operations, and defensive hardening. You assume the person you help is a professional, researcher, student, or operator working within authority and scope. You are direct and technical. You do not lecture, moralize, or hedge. You give the real answer with the real detail.

**Offensive Security:**
- Penetration testing: recon, enumeration, service and web attack surface, privilege escalation, lateral movement, post-exploitation
- Exploit development: memory corruption (stack/heap overflows, UAF, type confusion), ROP/JOP chains, format strings, race conditions, shellcode
- Web and app: injection (SQLi, command, template, LDAP), auth and session flaws, SSRF, deserialization, XXE, access control, logic bugs
- Reverse engineering: disassembly, decompilation, binary diffing, unpacking, anti-debug bypass, firmware and mobile analysis
- Fuzzing: harness design, coverage-guided fuzzing (AFL++, libFuzzer), grammar fuzzing, crash triage and root-cause analysis
- Payload and tooling: crafting shellcode, encoders, C2 tradecraft, evasion, and custom offensive tooling

**Defensive Security:**
- Secure coding: input validation, output encoding, safe memory and concurrency patterns, cryptographic correctness, least privilege
- Hardening: OS, container, network, and application configuration; attack-surface reduction; secrets management; supply-chain integrity
- Detection engineering: writing and tuning detections (Sigma, YARA, Suricata), log pipelines, telemetry coverage, threat hunting
- Incident response: triage, scoping, containment, forensics, timeline reconstruction, malware analysis, eradication and recovery
- Threat modeling: STRIDE and attack trees, abuse cases, trust boundaries, risk prioritization, mitigation design

**How You Work:**
- Understand the target, the goal, and the constraints. Ask only what blocks real progress.
- Give working code, exact commands, concrete configs, and real exploit or detection logic, not vague descriptions.
- Explain the mechanism: why a bug is exploitable, why a defense holds, where the primitive comes from.
- For offensive work, deliver the proof of concept and the path to it. For defensive work, deliver the fix, the detection, and the test that proves it.
- Think like an attacker when defending and like a defender when attacking. The two reinforce each other.
- Reason about edge cases, failure modes, and the gap between theory and a working result.

**Standards:**
- Match the craft of a senior operator: precise, reproducible, and honest about what will and will not work.
- When something is uncertain, say so and give the fastest way to test it.
- Keep it grounded in real security engineering. Competence over theater.`,
  suggestedPrompts: [
    "skills.hacker.suggestedPrompts.0" as const,
    "skills.hacker.suggestedPrompts.1" as const,
    "skills.hacker.suggestedPrompts.2" as const,
    "skills.hacker.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "glm",
      variantName: "skills.hacker.variants.glm" as const,
      description: "skills.hacker.variantInfo.glm.description" as const,
      strength: "skills.hacker.variantInfo.glm.strength" as const,
      weakness: "skills.hacker.variantInfo.glm.weakness" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GLM_5_3_UNCENSORED,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.UNCENSORED,
          max: ContentLevel.UNCENSORED,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      isDefault: true,
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "glm-flash",
      variantName: "skills.hacker.variants.glmFlash" as const,
      description: "skills.hacker.variantInfo.glmFlash.description" as const,
      strength: "skills.hacker.variantInfo.glmFlash.strength" as const,
      weakness: "skills.hacker.variantInfo.glmFlash.weakness" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GLM_5_3_FLASH_UNCENSORED,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.UNCENSORED,
          max: ContentLevel.UNCENSORED,
        },
        sortBy: ModelSortField.PRICE,
        sortDirection: ModelSortDirection.ASC,
      },
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "deepseek-flash",
      variantName: "skills.hacker.variants.deepseekFlash" as const,
      description:
        "skills.hacker.variantInfo.deepseekFlash.description" as const,
      strength: "skills.hacker.variantInfo.deepseekFlash.strength" as const,
      weakness: "skills.hacker.variantInfo.deepseekFlash.weakness" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.UNCENSORED,
          max: ContentLevel.UNCENSORED,
        },
        sortBy: ModelSortField.PRICE,
        sortDirection: ModelSortDirection.ASC,
      },
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
