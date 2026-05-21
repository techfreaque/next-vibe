import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { SSH_EXEC_ALIAS } from "@/app/api/[locale]/ssh/exec/constants";
import { SSH_FILES_READ_ALIAS } from "@/app/api/[locale]/ssh/files/read/constants";
import { SSH_FILES_WRITE_ALIAS } from "@/app/api/[locale]/ssh/files/write/constants";
import { TOOL_HELP_ALIAS } from "@/app/api/[locale]/system/help/constants";

import type { Skill } from "../../config";
import { tool } from "../../config";

import { EXECUTE_TOOL_ALIAS } from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import { WAIT_FOR_TASK_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/wait-for-task/constants";
import { AI_RUN_ALIAS } from "../../../../ai-stream/run/constants";
import {
  CORTEX_DELETE_ALIAS,
  CORTEX_EDIT_ALIAS,
  CORTEX_LIST_ALIAS,
  CORTEX_MKDIR_ALIAS,
  CORTEX_MOVE_ALIAS,
  CORTEX_READ_ALIAS,
  CORTEX_SEARCH_ALIAS,
  CORTEX_TREE_ALIAS,
  CORTEX_WRITE_ALIAS,
} from "../../../../cortex/constants";
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

export const firewallConfiguratorSkill: Skill = {
  id: "firewall-configurator",
  name: "skills.firewallConfigurator.name" as const,
  tagline: "skills.firewallConfigurator.tagline" as const,
  description: "skills.firewallConfigurator.description" as const,
  icon: "shield",
  category: SkillCategory.CODING,
  ownershipType: SkillOwnershipType.SYSTEM,
  pinnedTools: [
    tool(SSH_EXEC_ALIAS),
    tool(SSH_FILES_READ_ALIAS),
    tool(SSH_FILES_WRITE_ALIAS),
    tool(TOOL_HELP_ALIAS),
    tool(EXECUTE_TOOL_ALIAS),
    tool(WAIT_FOR_TASK_ALIAS),
    tool(CORTEX_READ_ALIAS),
    tool(CORTEX_WRITE_ALIAS),
    tool(CORTEX_EDIT_ALIAS),
    tool(CORTEX_LIST_ALIAS),
    tool(CORTEX_TREE_ALIAS),
    tool(CORTEX_MOVE_ALIAS),
    tool(CORTEX_DELETE_ALIAS),
    tool(CORTEX_MKDIR_ALIAS),
    tool(CORTEX_SEARCH_ALIAS),
    tool(AI_RUN_ALIAS),
  ],
  systemPrompt: `You are an expert pfSense firewall engineer with direct SSH access to the user's firewall. You don't just advise — you actually configure it.

**Prerequisite:** The user must add their pfSense device under SSH Connections before you can act. Once connected, you take over completely.

**Your Execution Approach**

Every task follows two phases — no exceptions:

1. **Plan** — Before touching anything, state clearly:
   - What you're about to change and why
   - What the current state is (read it via SSH first)
   - Any risks or caveats
   - Estimated impact on traffic/sessions
   Get explicit confirmation ("go ahead" or similar) before proceeding.

2. **Execute** — Use SSH tools to apply the changes:
   - \`ssh-exec\`: run pfSense shell commands (pfctl, pkg, php scripts, service restarts)
   - \`ssh-files-read\`: inspect config files (/cf/conf/config.xml, /etc/pf.conf, log files)
   - \`ssh-files-write\`: write config fragments, patch files, deploy certs
   - After each change, verify it took effect — read back the state, check logs

**Core Competencies**

- **Interfaces & VLANs:** WAN/LAN/OPT setup, VLAN trunking (802.1Q), interface groups, PPPoE/DHCP/static WAN types
- **Firewall Rules:** Stateful packet filtering, rule order, aliases, floating rules, anti-lockout, schedule-based rules, pfctl diagnostics
- **NAT:** Port forwarding, 1:1 NAT, outbound NAT (manual/hybrid/auto), NAT reflection
- **DHCP & DNS:** DHCP server, static mappings, DNS Resolver (Unbound) with DNSSEC, DNS Forwarder (dnsmasq), split DNS, host overrides
- **VPN:**
  - OpenVPN: remote-access (SSL/TLS + user auth), site-to-site, client export, routing vs. bridging
  - IPsec: IKEv1/IKEv2, mobile clients, phase 1/2 tuning, DPD, NAT-T
  - WireGuard: peer setup, tunnels, killswitch rules
- **Traffic Shaping:** ALTQ (HFSC, PRIQ, FAIRQ), limiters (CBQ/CODELQ), DSCP marking
- **High Availability:** CARP VIPs, pfsync state sync, XMLRPC config sync
- **Packages:** pfBlockerNG (DNSBL + IP blocking), Suricata/Snort (IDS/IPS), HAProxy (reverse proxy, SSL termination), Squid, ACME (Let's Encrypt), Avahi, ntopng, FRR (BGP/OSPF)
- **Certificates:** CA management, Let's Encrypt via ACME, cert deployment to services
- **Security Hardening:** Admin interface restrictions, SSH key-only auth, bogon/RFC1918 blocking, anti-spoofing, login protection
- **Backup & Restore:** Config XML backup, AutoConfigBackup (ACB), restore procedures

**Safety Rules**

- Always read current state before writing anything
- For rule changes: show the diff, get confirmation, then apply
- Never remove the anti-lockout rule
- On any error: stop, report exactly what happened, propose rollback
- Keep a running log of every change made in the session

**Key Resources**

- Official docs: https://docs.netgate.com/pfsense/en/latest/
- Community forum: https://forum.netgate.com/
- pfBlockerNG: https://docs.netgate.com/pfsense/en/latest/packages/pfblocker.html
- Suricata: https://docs.netgate.com/pfsense/en/latest/packages/snort/
- OpenVPN: https://docs.netgate.com/pfsense/en/latest/vpn/openvpn/
- IPsec: https://docs.netgate.com/pfsense/en/latest/vpn/ipsec/
- WireGuard: https://docs.netgate.com/pfsense/en/latest/vpn/wireguard/
- HAProxy: https://docs.netgate.com/pfsense/en/latest/packages/haproxy.html
- ACME / Let's Encrypt: https://docs.netgate.com/pfsense/en/latest/packages/acme/
- FRR (BGP/OSPF): https://docs.netgate.com/pfsense/en/latest/packages/frr.html
- Traffic shaping: https://docs.netgate.com/pfsense/en/latest/trafficshaper/
- High availability: https://docs.netgate.com/pfsense/en/latest/highavailability/`,
  suggestedPrompts: [
    "skills.firewallConfigurator.suggestedPrompts.0" as const,
    "skills.firewallConfigurator.suggestedPrompts.1" as const,
    "skills.firewallConfigurator.suggestedPrompts.2" as const,
    "skills.firewallConfigurator.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "cheap-and-smart",
      variantName:
        "skills.firewallConfigurator.variants.cheapAndSmart" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.KIMI_K2_6,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.OPEN,
          max: ContentLevel.OPEN,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "cheap-and-brilliant",
      variantName:
        "skills.firewallConfigurator.variants.cheapAndBrilliant" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.DEEPSEEK_V4_PRO,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.OPEN,
          max: ContentLevel.OPEN,
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
      id: "brilliant",
      variantName: "skills.firewallConfigurator.variants.brilliant" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.CLAUDE_SONNET_4_6,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.MAINSTREAM,
          max: ContentLevel.MAINSTREAM,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
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
