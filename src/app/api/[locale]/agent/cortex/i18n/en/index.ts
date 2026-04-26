/* eslint-disable i18next/no-literal-string */
export const translations = {
  tags: {
    cortex: "Cortex",
  },
  category: "Cortex",
  scaffold: {
    roots: {
      memories: "memories",
      documents: "documents",
    },
    memories: {
      identity: {
        path: "identity",
        purpose: "Who you are: name, role, goals, communication style",
      },
      expertise: {
        path: "expertise",
        purpose: "What you know: skills, tools, background",
      },
      context: {
        path: "context",
        purpose: "Current situation: active projects, preferences, constraints",
      },
      life: {
        path: "life",
        purpose:
          "Life goals and current state: career, health, relationships, finances, growth, purpose",
      },
    },
    documents: {
      inbox: {
        path: "inbox",
        purpose:
          "Raw captures — drop here fast, process and file when context is clear",
        icon: "inbox",
      },
      projects: {
        path: "projects",
        purpose: "Active work — one subfolder per project",
        icon: "folder-open",
      },
      knowledge: {
        path: "knowledge",
        purpose: "Permanent reference — things worth keeping forever",
        icon: "book-open",
      },
      journal: {
        path: "journal",
        purpose: "Dated entries — ideas, reflections, observations",
        icon: "pen-line",
      },
      templates: {
        path: "templates",
        purpose: "Reusable structures for recurring tasks",
        icon: "layout-template",
      },
    },
  },
  templates: {
    memories: {
      identity: {
        name: {
          path: "name.md",
          content: `---\npriority: 100\ntags: [identity]\n---\n\n<!-- Your name and how you prefer to be addressed. The AI will fill this in during your first conversation. -->\n`,
        },
        role: {
          path: "role.md",
          content: `---\npriority: 100\ntags: [identity, work]\n---\n\n<!-- Your professional role, what you do, and the context you operate in. -->\n`,
        },
        goals: {
          path: "goals.md",
          content: `---\npriority: 90\ntags: [identity, goals]\n---\n\n<!-- Your primary goals — what you're trying to build, achieve, or improve. Short-term and long-term. -->\n`,
        },
        communication: {
          path: "communication.md",
          content: `---\npriority: 85\ntags: [identity, style]\n---\n\n<!-- How you prefer to communicate: tone, depth, format, what annoys you, what you value. -->\n`,
        },
      },
      expertise: {
        skills: {
          path: "skills.md",
          content: `---\npriority: 80\ntags: [expertise]\n---\n\n<!-- Your technical and professional skills. What you're expert in, what you're learning. -->\n`,
        },
        tools: {
          path: "tools.md",
          content: `---\npriority: 75\ntags: [expertise, tech]\n---\n\n<!-- Tools, languages, frameworks, and platforms you use regularly. Preferred stack. -->\n`,
        },
        background: {
          path: "background.md",
          content: `---\npriority: 70\ntags: [expertise]\n---\n\n<!-- Your background, experience, and how you got here. Shapes context for every interaction. -->\n`,
        },
      },
      context: {
        projects: {
          path: "projects.md",
          content: `---\npriority: 80\ntags: [context, projects]\n---\n\n<!-- Active projects: what you're working on, what matters most right now. -->\n`,
        },
        preferences: {
          path: "preferences.md",
          content: `---\npriority: 70\ntags: [context]\n---\n\n<!-- Working preferences: how you like to work, what slows you down, what helps you focus. -->\n`,
        },
        constraints: {
          path: "constraints.md",
          content: `---\npriority: 65\ntags: [context]\n---\n\n<!-- Constraints, hard rules, and non-negotiables for how the AI should behave with you. -->\n`,
        },
      },
      life: {
        career: {
          path: "career.md",
          content: `---\npriority: 90\ntags: [life, career, goals]\n---\n\n## Current State\n\n<!-- What are you actually doing for work right now? Role, company/project, income level, satisfaction 1-10. -->\n\n## Goals\n\n<!-- Short-term (this month): -->\n<!-- Medium-term (this year): -->\n<!-- Long-term (3-5 years): -->\n\n## Active Projects\n\n<!-- Which projects in /documents/projects/ serve your career right now? What's the connection? -->\n\n## Blockers\n\n<!-- What would change everything if resolved? What's the single biggest obstacle? -->\n\n## Patterns\n\n<!-- Recurring career themes: what you keep gravitating toward, what drains you, what energizes you. -->\n`,
        },
        health: {
          path: "health.md",
          content: `---\npriority: 90\ntags: [life, health, goals]\n---\n\n## Current State\n\n<!-- Honest snapshot: physical fitness, mental state, sleep quality, any conditions or concerns. -->\n\n## Routines\n\n<!-- What you actually do (not what you plan to do). Exercise, sleep schedule, nutrition habits. -->\n\n## Energy\n\n<!-- What charges you? What drains you? When in the day/week are you sharpest? -->\n\n## Goals\n\n<!-- Short-term (this month): -->\n<!-- Long-term (this year): -->\n\n## Blockers\n\n<!-- What's preventing better health? Time, motivation, knowledge, environment? -->\n`,
        },
        relationships: {
          path: "relationships.md",
          content: `---\npriority: 85\ntags: [life, relationships, goals]\n---\n\n## Inner Circle\n\n<!-- The 3-5 people who matter most. Partner, family, closest friends. How are things with each? -->\n\n## Current State\n\n<!-- Overall relationship health. Who are you close to? Who have you drifted from? -->\n\n## Investment\n\n<!-- Who needs more from you right now? Where are you over-investing vs under-investing? -->\n\n## Goals\n\n<!-- What do you want to build or repair in your relationships this year? -->\n\n## Blockers\n\n<!-- What's getting in the way? Time, distance, unresolved conflict, avoidance? -->\n`,
        },
        finances: {
          path: "finances.md",
          content: `---\npriority: 85\ntags: [life, finances, goals]\n---\n\n## Current State\n\n<!-- Monthly income vs spending. Savings. Debt. Stability rating 1-10. -->\n\n## Safety Net\n\n<!-- How many months could you survive without income? What's your runway? -->\n\n## Goals\n\n<!-- Short-term (this month): -->\n<!-- Long-term (this year): -->\n\n## Growth\n\n<!-- How are you building wealth or financial security? Investments, side income, skills that pay. -->\n\n## Blockers\n\n<!-- What's the biggest financial risk or obstacle right now? -->\n`,
        },
        growth: {
          path: "growth.md",
          content: `---\npriority: 85\ntags: [life, growth, learning, goals]\n---\n\n## Current Focus\n\n<!-- What are you actively learning or developing right now? What's clicking? -->\n\n## Skills Gap\n\n<!-- What skill or knowledge, if acquired, would unlock the next level for you? -->\n\n## Goals\n\n<!-- What do you want to learn or master this year? Be specific. -->\n\n## Resources\n\n<!-- Books, courses, mentors, communities that are helping. What's working? -->\n\n## Blockers\n\n<!-- What's slowing your growth? Time, focus, access, fear? -->\n`,
        },
        purpose: {
          path: "purpose.md",
          content: `---\npriority: 95\ntags: [life, purpose, values, goals]\n---\n\n## North Star\n\n<!-- One or two sentences: what is your life fundamentally about? What are you here to do or build? -->\n\n## Core Values\n\n<!-- 3-5 values that guide your decisions. Not aspirations — things you actually live by. -->\n\n## What Success Looks Like\n\n<!-- In 5 years, what does a life well-lived look like for you specifically? -->\n`,
        },
      },
    },
    documents: {
      meetingNotes: {
        path: "meeting-notes.md",
        content: `---\ntype: template\ntags: [meetings, template]\n---\n\n# Meeting Notes — [Date]\n\n**Attendees:**\n**Purpose:**\n\n## Context\n\nBrief background on why this meeting happened.\n\n## Agenda\n\n1.\n2.\n3.\n\n## Key Decisions\n\n-\n\n## Action Items\n\n- [ ] @person — task — due [date]\n\n## Notes\n\n---\n*Filed from: /documents/inbox*\n`,
      },
      projectBrief: {
        path: "project-brief.md",
        content: `---\ntype: template\ntags: [projects, template]\nstatus: draft\n---\n\n# Project Brief: [Name]\n\n**Owner:**\n**Start:**\n**Target:**\n\n## Problem\n\nWhat breaks or hurts without this? One paragraph, no fluff.\n\n## Goal\n\nOne sentence. Specific outcome. Measurable if possible.\n\n## Scope\n\n**In:**\n-\n\n**Out:**\n-\n\n## Success Criteria\n\n- [ ]\n- [ ]\n\n## Risks\n\n| Risk | Likelihood | Impact | Mitigation |\n|------|-----------|--------|------------|\n|      |           |        |            |\n\n## Resources\n\nLinks, references, prior art.\n`,
      },
      weeklyReview: {
        path: "weekly-review.md",
        content: `---\ntype: template\ntags: [review, weekly, template]\n---\n\n# Week of [Date]\n\n## What Shipped\n\n-\n\n## What Didn't\n\n-\n\n## Blockers Encountered\n\n-\n\n## What I Learned\n\n-\n\n## Next Week Focus\n\n1.\n2.\n3.\n\n## Energy Level (1–10)\n\nWork:\nPersonal:\n\n---\n*Keep this under 200 words. Speed matters more than completeness.*\n`,
      },
      decisionLog: {
        path: "decision-log.md",
        content: `---\ntype: template\ntags: [decisions, architecture, template]\n---\n\n# Decision: [Title]\n\n**Date:**\n**Status:** proposed | accepted | superseded | deprecated\n**Deciders:**\n\n## Context\n\nWhat situation forced this decision? What constraints exist?\n\n## Options Considered\n\n### Option A — [Name]\n\n**Pros:**\n**Cons:**\n\n### Option B — [Name]\n\n**Pros:**\n**Cons:**\n\n## Decision\n\nWe chose **Option [X]** because:\n\n## Consequences\n\n**Good:**\n**Bad:**\n**Neutral:**\n\n---\n*Link to this file from the relevant project brief or code comment.*\n`,
      },
      knowledgeArticle: {
        path: "knowledge-article.md",
        content: `---\ntype: template\ntags: [knowledge, reference, template]\n---\n\n# [Topic]\n\n**Last verified:**\n**Source:**\n\n## Summary\n\nOne paragraph. What is this, why does it matter, when does it apply?\n\n## How It Works\n\nCore mechanics. No padding — just what you need to understand or apply it.\n\n## When to Use\n\n-\n-\n\n## When NOT to Use\n\n-\n\n## Examples\n\n\`\`\`\npaste example here\n\`\`\`\n\n## References\n\n-\n`,
      },
    },
  },
  enums: {
    nodeType: {
      file: "File",
      dir: "Folder",
    },
    viewType: {
      list: "List",
      kanban: "Kanban",
      calendar: "Calendar",
      grid: "Grid",
      wiki: "Wiki",
    },
    syncPolicy: {
      sync: "Sync",
      local: "Local Only",
    },
    creditFeature: {
      write: "Write",
      edit: "Edit",
      search: "Search",
      embedding: "Embedding",
    },
  },
  mounts: {
    memory: "Memory",
    document: "Document",
    thread: "Thread",
    skill: "Skill",
    task: "Task",
    upload: "Upload",
    search: "Search",
  },
  button: {
    label: "Cortex",
    title: "Cortex — AI memory",
    unavailableTitle: "Cortex unavailable",
    unavailableDescription:
      "Cortex is only available in private and shared threads. Start a private thread to use your AI memory.",
  },
  nav: {
    back: "Back",
    actions: {
      list: "Browse",
      read: "View",
      write: "Write",
      edit: "Edit",
      delete: "Delete",
      move: "Move",
      search: "Search",
      tree: "Tree",
    },
  },
};
