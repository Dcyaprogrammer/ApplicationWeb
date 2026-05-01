import { Phase } from "../../types/game";
import type { RuntimeCard, GameCardCatalog } from "./types";

export const DEMO_SPECIAL_EVENTS: RuntimeCard[] = [
  {
    id: "injury_low_energy",
    category: "health",
    phase: Phase.Year1,
    character: "gym_coach",
    title: "Pulled Muscle!",
    text: "You forced yourself to PE class and pulled a muscle.",
    stressLevel: "panic",
    triggerType: "special_event",
    triggerProbability: 0.3,
    requirements: {
      statMax: { energy: 19 },
    },
    meta: {
      cardType: "crisis",
      impactScore: 24,
      frustrationRisk: 0.5,
    },
    choices: {
      left: {
        id: "go_hospital",
        label: "Hospital",
        effect: {
          daysToAdvance: 45,
          stats: { mentality: -15, energy: 10 },
          resultText: "Expensive, but you got some rest.",
        },
      },
      right: {
        id: "ignore_it",
        label: "Walk it off",
        effect: {
          daysToAdvance: 45,
          stats: { energy: -20, gpa: -5 },
          resultText: "It got worse. You couldn't focus in class.",
        },
      },
    },
  },
  {
    id: "breakdown_low_mental",
    category: "health",
    phase: Phase.Year1,
    character: "therapist",
    title: "Burnout",
    text: "You stared at a blank screen for 4 hours crying. Burnout.",
    stressLevel: "panic",
    triggerType: "special_event",
    triggerProbability: 0.3,
    requirements: {
      statMax: { mentality: 19 },
    },
    meta: {
      cardType: "crisis",
      impactScore: 26,
      frustrationRisk: 0.55,
    },
    choices: {
      left: {
        id: "take_break",
        label: "Take a Break",
        effect: {
          daysToAdvance: 45,
          stats: { mentality: 30, gpa: -15 },
          resultText: "You missed a deadline, but you feel human again.",
        },
      },
      right: {
        id: "push_through",
        label: "Keep Working",
        effect: {
          daysToAdvance: 45,
          stats: { mentality: -20, energy: -20 },
          resultText: "You wrote 10 lines of code. It's all buggy.",
        },
      },
    },
  },
];

export const DEMO_DYNAMIC_CARDS: RuntimeCard[] = [
  {
    id: "dynamic_deadline_tracker",
    category: "PLANNING",
    phase: Phase.Year1,
    character: "calendar",
    title: "Deadline Spreadsheet",
    text: "A senior tells you to put every school deadline, material rule, and portal link into one spreadsheet before things get messy.",
    stressLevel: "chill",
    weight: 90,
    once: true,
    meta: {
      cardType: "knowledge",
      educationalTags: ["deadline-tracking", "application-organization"],
      recoveryScore: 12,
      cooldownTurns: 2,
      maxPressure: 85,
    },
    choices: {
      left: {
        id: "build_tracker",
        label: "Build it tonight",
        effect: {
          daysToAdvance: 54,
          stats: { experience: 10, mentality: 8, energy: -5 },
          resultText: "Boring, but future-you is much less likely to explode.",
          addFlags: ["has_deadline_tracker"],
        },
      },
      right: {
        id: "wing_schedule",
        label: "I'll remember it",
        effect: {
          daysToAdvance: 48,
          stats: { mentality: -8, experience: -5 },
          resultText: "You save time now, but your future tabs are going to become a crime scene.",
        },
      },
    },
  },
  {
    id: "dynamic_forum_doomscroll",
    category: "WAITING",
    phase: Phase.Year1,
    character: "phone",
    title: "Forum Rabbit Hole",
    text: "One Reddit post turns into fifty. Everyone else sounds richer, stronger, and somehow already admitted.",
    stressLevel: "grind",
    weight: 80,
    meta: {
      cardType: "dynamic",
      impactScore: 14,
      frustrationRisk: 0.2,
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "close_tabs",
        label: "Close the tabs",
        effect: {
          daysToAdvance: 54,
          stats: { mentality: 8, experience: -2 },
          resultText: "You lose some gossip, but you keep your sanity.",
        },
      },
      right: {
        id: "keep_scrolling",
        label: "Keep scrolling",
        effect: {
          daysToAdvance: 60,
          stats: { mentality: -12, energy: -6, experience: 4 },
          resultText: "You learn a little, panic a lot.",
        },
      },
    },
  },
  {
    id: "dynamic_energy_crash",
    category: "HEALTH",
    phase: Phase.Year1,
    character: "roommate",
    title: "You Look Awful",
    text: "Your roommate stares at your face and says you have two choices: sleep now or keep pretending caffeine is a personality.",
    stressLevel: "chill",
    weight: 110,
    requirements: {
      statMax: { energy: 40 },
    },
    meta: {
      cardType: "recovery",
      recoveryScore: 30,
      educationalTags: ["rest-management"],
      cooldownTurns: 3,
      maxPressure: 100,
    },
    choices: {
      left: {
        id: "sleep_early",
        label: "Sleep properly",
        effect: {
          daysToAdvance: 60,
          stats: { energy: 20, mentality: 10, gpa: -5 },
          resultText: "You lose a night of progress, but gain back a functioning brain.",
        },
      },
      right: {
        id: "power_through",
        label: "Push through",
        effect: {
          daysToAdvance: 45,
          stats: { energy: -15, experience: 5, mentality: -10 },
          resultText: "You stay productive for three hours and useless for the next twelve.",
        },
      },
    },
  },
  {
    id: "dynamic_agency_contract_clause",
    category: "AGENCY",
    phase: Phase.Year1,
    character: "consultant",
    title: "Fine Print",
    text: "You finally read the contract carefully and realize the refund clause is written like it actively hates you.",
    stressLevel: "grind",
    weight: 95,
    once: true,
    requirements: {
      requiredFlags: ["route_agency"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["agency"],
      educationalTags: ["agency-contract", "refund-clauses"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "negotiate_clause",
        label: "Negotiate it",
        effect: {
          daysToAdvance: 60,
          stats: { experience: 10, mentality: 5, energy: -5 },
          resultText: "Awkward, but you stop the contract from being a one-way trap.",
          addFlags: ["contract_checked"],
        },
      },
      right: {
        id: "ignore_clause",
        label: "Ignore it",
        effect: {
          daysToAdvance: 60,
          stats: { mentality: -8, experience: -6 },
          resultText: "The problem remains future-you's problem. That is not a real solution.",
        },
      },
    },
  },
  {
    id: "dynamic_diy_peer_review",
    category: "SOCIAL",
    phase: Phase.Year1,
    character: "friend",
    title: "Peer Review Swap",
    text: "A friend offers to swap SOP drafts with brutally honest comments instead of empty compliments.",
    stressLevel: "chill",
    weight: 95,
    requirements: {
      requiredFlags: ["route_diy"],
    },
    meta: {
      cardType: "dynamic",
      routeTags: ["diy"],
      educationalTags: ["peer-review", "essay-feedback"],
      recoveryScore: 10,
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "accept_review",
        label: "Trade feedback",
        effect: {
          daysToAdvance: 48,
          stats: { experience: 12, mentality: 5, energy: -4 },
          resultText: "Painful comments, better essay.",
        },
      },
      right: {
        id: "protect_ego",
        label: "Protect your ego",
        effect: {
          daysToAdvance: 45,
          stats: { mentality: -5, experience: -8 },
          resultText: "Your feelings survive. Your draft does not improve.",
        },
      },
    },
  },
  {
    id: "dynamic_missing_document_scare",
    category: "CRISIS",
    phase: Phase.Year1,
    character: "email",
    title: "Portal Warning",
    text: "An application portal suddenly labels one uploaded document as unreadable. You are one click away from a panic spiral.",
    stressLevel: "panic",
    weight: 70,
    meta: {
      cardType: "crisis",
      impactScore: 18,
      frustrationRisk: 0.25,
      educationalTags: ["document-verification"],
      cooldownTurns: 3,
      minPressure: 25,
    },
    choices: {
      left: {
        id: "reupload_now",
        label: "Fix it now",
        effect: {
          daysToAdvance: 45,
          stats: { energy: -8, experience: 8, mentality: 4 },
          resultText: "Annoying, but you catch the issue before it becomes a catastrophe.",
        },
      },
      right: {
        id: "hope_it_works",
        label: "Hope it's fine",
        effect: {
          daysToAdvance: 45,
          stats: { mentality: -12, experience: -6 },
          resultText: "You save ten minutes and buy twelve hours of paranoia.",
        },
      },
    },
  },
  {
    id: "dynamic_budget_sheet",
    category: "finance",
    phase: Phase.Year1,
    character: "parent",
    title: "Reality Check Budget",
    text: "Your family asks the least romantic question in the whole process: what exactly will this cost, and what happens if scholarships don't arrive?",
    stressLevel: "grind",
    weight: 90,
    once: true,
    meta: {
      cardType: "knowledge",
      educationalTags: ["application-budget", "financial-planning"],
      recoveryScore: 8,
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "make_budget",
        label: "Build a budget sheet",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 8, mentality: 6, energy: -4 },
          resultText: "Not glamorous, but uncertainty becomes something you can actually reason about.",
          addFlags: ["budget_planned"],
        },
      },
      right: {
        id: "avoid_numbers",
        label: "Avoid the topic",
        effect: {
          daysToAdvance: 45,
          stats: { mentality: -10, experience: -5 },
          resultText: "The money problem does not disappear. It just becomes louder later.",
        },
      },
    },
  },
  {
    id: "dynamic_recommender_packet",
    category: "SOCIAL",
    phase: Phase.Year1,
    character: "professor_x",
    title: "Recommendation Packet",
    text: "A professor agrees to write for you, but only if you send a clean packet: CV, transcript, project summary, and deadlines in one place.",
    stressLevel: "chill",
    weight: 100,
    requirements: {
      excludeFlags: ["route_agency", "route_diy"],
    },
    meta: {
      cardType: "knowledge",
      educationalTags: ["recommendation-packet", "faculty-communication"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "send_packet",
        label: "Send a real packet",
        effect: {
          daysToAdvance: 54,
          stats: { experience: 10, mentality: 4, energy: -4 },
          resultText: "You make it easy to help you. Professors notice that.",
          addFlags: ["recommender_packet_ready"],
        },
      },
      right: {
        id: "send_short_email",
        label: "Just send a short email",
        effect: {
          daysToAdvance: 48,
          stats: { experience: -8, mentality: -4 },
          resultText: "You technically asked. You did not make the job easy.",
        },
      },
    },
  },
  {
    id: "dynamic_recommender_packet_agency",
    category: "SOCIAL",
    phase: Phase.Year1,
    character: "consultant",
    title: "Agency Letter Handling",
    text: "The agency asks for your recommender details, but won't let you see what they send to professors.",
    stressLevel: "grind",
    weight: 95,
    requirements: {
      requiredFlags: ["route_agency"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["agency"],
      educationalTags: ["recommendation-packet", "agency-control"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "demand_copy_access",
        label: "Demand to see emails",
        effect: {
          daysToAdvance: 54,
          stats: { experience: 12, mentality: 8, energy: -5 },
          resultText: "They're annoyed, but at least you know what's being sent.",
          addFlags: ["recommender_packet_ready"],
        },
      },
      right: {
        id: "trust_agency_blindly",
        label: "Let them handle it",
        effect: {
          daysToAdvance: 48,
          stats: { experience: -10, mentality: -8 },
          resultText: "You hope for the best. Later, you find a major error they made.",
        },
      },
    },
  },
  {
    id: "dynamic_recommender_packet_diy",
    category: "SOCIAL",
    phase: Phase.Year1,
    character: "professor_x",
    title: "DIY Recommender Packet",
    text: "A professor agrees to write for you. You need to send a complete packet: CV, transcript, project summaries, and deadlines.",
    stressLevel: "chill",
    weight: 100,
    requirements: {
      requiredFlags: ["route_diy"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["diy"],
      educationalTags: ["recommendation-packet", "faculty-communication"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "send_packet",
        label: "Send comprehensive packet",
        effect: {
          daysToAdvance: 54,
          stats: { experience: 12, mentality: 5, energy: -4 },
          resultText: "You make it easy to help you. Professors appreciate the organization.",
          addFlags: ["recommender_packet_ready"],
        },
      },
      right: {
        id: "send_minimal_email",
        label: "Send a quick email",
        effect: {
          daysToAdvance: 48,
          stats: { experience: -10, mentality: -5 },
          resultText: "Your recommender asks for materials you should have included.",
        },
      },
    },
  },
  {
    id: "dynamic_cv_quantify",
    category: "ACADEMIC",
    phase: Phase.Year1,
    character: "laptop",
    title: "CV Bullet Rewrite",
    text: "Your CV says 'participated in project work' six times. Even you have no idea what that means anymore.",
    stressLevel: "chill",
    weight: 95,
    meta: {
      cardType: "knowledge",
      educationalTags: ["cv-quantification", "resume-writing"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "rewrite_with_metrics",
        label: "Rewrite with metrics",
        effect: {
          daysToAdvance: 60,
          stats: { experience: 12, energy: -5 },
          resultText: "Specific achievements make you look like a real person who did real work.",
        },
      },
      right: {
        id: "keep_vague_cv",
        label: "Leave it vague",
        effect: {
          daysToAdvance: 54,
          stats: { experience: -10, mentality: -3 },
          resultText: "The CV remains technically fine and strategically weak.",
        },
      },
    },
  },
  {
    id: "dynamic_score_send_policy",
    category: "LANGUAGE",
    phase: Phase.Year1,
    character: "email",
    title: "Official Score Sending",
    text: "You discover that some programs want self-report first, while others still require official score reporting before review.",
    stressLevel: "grind",
    weight: 85,
    requirements: {
      excludeFlags: ["route_agency", "route_diy"],
    },
    meta: {
      cardType: "knowledge",
      educationalTags: ["score-reporting", "official-vs-self-report"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "check_each_policy",
        label: "Check each policy",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 9, mentality: 4, energy: -3 },
          resultText: "Tedious, but you avoid paying or missing things blindly.",
        },
      },
      right: {
        id: "assume_same_policy",
        label: "Assume they're all the same",
        effect: {
          daysToAdvance: 48,
          stats: { experience: -8, mentality: -5 },
          resultText: "This is how avoidable admin mistakes become lore.",
        },
      },
    },
  },
  {
    id: "dynamic_score_send_policy_agency",
    category: "LANGUAGE",
    phase: Phase.Year1,
    character: "consultant",
    title: "Agency Score Reporting",
    text: "The agency asks for your TOEFL/IELTS account password. They'll handle everything, they say.",
    stressLevel: "panic",
    weight: 80,
    requirements: {
      requiredFlags: ["route_agency"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["agency"],
      educationalTags: ["score-reporting", "agency-account-access"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "give_score_password",
        label: "Give them access",
        effect: {
          daysToAdvance: 45,
          stats: { experience: -10, mentality: -5 },
          resultText: "You later find they sent scores to wrong programs. Too late.",
        },
      },
      right: {
        id: "handle_scores_yourself",
        label: "Handle it yourself",
        effect: {
          daysToAdvance: 48,
          stats: { experience: 10, mentality: 5, energy: -5 },
          resultText: "They're annoyed, but at least your scores go to the right places.",
        },
      },
    },
  },
  {
    id: "dynamic_score_send_policy_diy",
    category: "LANGUAGE",
    phase: Phase.Year1,
    character: "email",
    title: "DIY Score Reporting",
    text: "You discover some programs want self-report, others need official scores sent before review. It's a mess.",
    stressLevel: "grind",
    weight: 85,
    requirements: {
      requiredFlags: ["route_diy"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["diy"],
      educationalTags: ["score-reporting", "official-vs-self-report"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "create_score_tracker",
        label: "Build a score tracker",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 12, mentality: 5, energy: -3 },
          resultText: "Tedious spreadsheet, but you avoid expensive mistakes.",
        },
      },
      right: {
        id: "guess_policies",
        label: "Guess the policies",
        effect: {
          daysToAdvance: 48,
          stats: { experience: -10, mentality: -8 },
          resultText: "You pay for duplicate score sends. $200 wasted.",
        },
      },
    },
  },
  {
    id: "dynamic_parent_pressure_call",
    category: "family",
    phase: Phase.Year1,
    character: "parent",
    title: "The Phone Call Home",
    text: "Your parents mean well, but every conversation turns into rankings, cost, visas, and whether this whole plan is 'worth it.'",
    stressLevel: "grind",
    weight: 90,
    meta: {
      cardType: "dynamic",
      impactScore: 12,
      educationalTags: ["family-expectations"],
      cooldownTurns: 3,
    },
    choices: {
      left: {
        id: "set_expectations",
        label: "Explain the process",
        effect: {
          daysToAdvance: 45,
          stats: { mentality: 6, experience: 4, energy: -4 },
          resultText: "It does not solve everything, but at least the panic becomes more informed.",
        },
      },
      right: {
        id: "absorb_pressure",
        label: "Just absorb it",
        effect: {
          daysToAdvance: 45,
          stats: { mentality: -12, energy: -5 },
          resultText: "You keep the peace for ten minutes and inherit the stress for ten days.",
        },
      },
    },
  },
  {
    id: "dynamic_backup_school_list",
    category: "PLANNING",
    phase: Phase.Year1,
    character: "calendar",
    title: "Backup List",
    text: "A senior asks a brutal but useful question: if your top choices all fail, do you actually have a second-layer plan?",
    stressLevel: "chill",
    weight: 90,
    requirements: {
      excludeFlags: ["route_agency", "route_diy"],
    },
    meta: {
      cardType: "recovery",
      recoveryScore: 16,
      educationalTags: ["backup-schools", "list-balancing"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "build_backup_list",
        label: "Build a backup list",
        effect: {
          daysToAdvance: 54,
          stats: { mentality: 12, experience: 8, energy: -4 },
          resultText: "The dream stays alive, but the floor gets sturdier.",
        },
      },
      right: {
        id: "only_reach_schools",
        label: "Stay all-in on reaches",
        effect: {
          daysToAdvance: 54,
          stats: { mentality: -8, experience: -4 },
          resultText: "The fantasy remains clean. The risk profile becomes hilarious.",
        },
      },
    },
  },
  {
    id: "dynamic_backup_school_list_agency",
    category: "PLANNING",
    phase: Phase.Year1,
    character: "consultant",
    title: "Agency School List Strategy",
    text: "The agency's list is 90% reach schools. You ask about safety options. They laugh.",
    stressLevel: "grind",
    weight: 85,
    requirements: {
      requiredFlags: ["route_agency"],
    },
    meta: {
      cardType: "recovery",
      routeTags: ["agency"],
      recoveryScore: 12,
      educationalTags: ["backup-schools", "agency-school-list"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "demand_balanced_list",
        label: "Demand balance",
        effect: {
          daysToAdvance: 54,
          stats: { mentality: 10, experience: 8, energy: -5 },
          resultText: "They reluctantly add 2-3 realistic options.",
        },
      },
      right: {
        id: "accept_gambling_strategy",
        label: "Trust their 'strategy'",
        effect: {
          daysToAdvance: 54,
          stats: { mentality: -12, experience: -8 },
          resultText: "You apply to 15 Ivies. Get into 0. The agency blames your profile.",
        },
      },
    },
  },
  {
    id: "dynamic_backup_school_list_diy",
    category: "PLANNING",
    phase: Phase.Year1,
    character: "calendar",
    title: "DIY School List Balance",
    text: "You've selected 12 schools. A senior points out they're all 'reach' schools. No safeties.",
    stressLevel: "grind",
    weight: 90,
    requirements: {
      requiredFlags: ["route_diy"],
    },
    meta: {
      cardType: "recovery",
      routeTags: ["diy"],
      recoveryScore: 18,
      educationalTags: ["backup-schools", "list-balancing"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "research_safety_schools",
        label: "Find solid backups",
        effect: {
          daysToAdvance: 54,
          stats: { experience: 12, mentality: 10, energy: -4 },
          resultText: "You add 3 safety schools. Peace of mind follows.",
        },
      },
      right: {
        id: "stay_ambitious",
        label: "Shoot for the stars",
        effect: {
          daysToAdvance: 54,
          stats: { mentality: -8, experience: -4 },
          resultText: "You either win big or crash hard. Extreme variance.",
        },
      },
    },
  },
  {
    id: "dynamic_fee_waiver_hunt",
    category: "finance",
    phase: Phase.Year1,
    character: "email",
    title: "Fee Waiver Hunt",
    text: "You hear that some programs waive application fees through webinars, need-based forms, or event codes, but only if you actually read things carefully.",
    stressLevel: "chill",
    weight: 80,
    meta: {
      cardType: "knowledge",
      educationalTags: ["fee-waivers", "application-costs"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "hunt_waivers",
        label: "Hunt for waivers",
        effect: {
          daysToAdvance: 48,
          stats: { experience: 8, mentality: 5, energy: -4 },
          resultText: "Administrative scavenger hunt, but your wallet survives a little better.",
        },
      },
      right: {
        id: "pay_without_checking",
        label: "Just pay everything",
        effect: {
          daysToAdvance: 48,
          stats: { mentality: -6, experience: -4 },
          resultText: "Fast, expensive, and slightly insulting to your future self.",
        },
      },
    },
  },
  {
    id: "dynamic_professor_office_hours",
    category: "ACADEMIC",
    phase: Phase.Year1,
    character: "professor_x",
    title: "Office Hours Courage",
    text: "You could ask a professor for targeted feedback on your research story, but that requires showing up with actual questions instead of vague fear.",
    stressLevel: "chill",
    weight: 88,
    meta: {
      cardType: "dynamic",
      educationalTags: ["office-hours", "research-framing"],
      recoveryScore: 8,
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "prepare_questions",
        label: "Prepare questions",
        effect: {
          daysToAdvance: 48,
          stats: { experience: 10, mentality: 5, energy: -3 },
          resultText: "The conversation becomes useful because you did not arrive empty-handed.",
        },
      },
      right: {
        id: "avoid_professor",
        label: "Avoid the meeting",
        effect: {
          daysToAdvance: 48,
          stats: { experience: -7, mentality: -4 },
          resultText: "Avoidance feels safe until you still need the answer later.",
        },
      },
    },
  },
  {
    id: "dynamic_interview_mock_friend",
    category: "SOCIAL",
    phase: Phase.Year1,
    character: "friend",
    title: "Mock Interview Trade",
    text: "A friend offers to run a mock interview and deliberately ask the awkward follow-up questions most people avoid.",
    stressLevel: "grind",
    weight: 92,
    requirements: {
      excludeFlags: ["route_agency", "route_diy"],
    },
    meta: {
      cardType: "dynamic",
      educationalTags: ["mock-interview", "behavioral-questions"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "do_mock",
        label: "Do the mock",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 12, mentality: -3, energy: -4 },
          resultText: "Embarrassing now is cheaper than embarrassing live.",
        },
      },
      right: {
        id: "skip_mock",
        label: "Skip it",
        effect: {
          daysToAdvance: 60,
          stats: { mentality: 3, experience: -8 },
          resultText: "Your comfort remains intact. Your preparedness does not.",
        },
      },
    },
  },
  {
    id: "dynamic_interview_mock_friend_agency",
    category: "SOCIAL",
    phase: Phase.Year1,
    character: "consultant",
    title: "Agency Mock Interview",
    text: "The agency assigns a 'senior interviewer' to prep you. They read from a generic script and look bored.",
    stressLevel: "grind",
    weight: 88,
    requirements: {
      requiredFlags: ["route_agency"],
    },
    meta: {
      cardType: "dynamic",
      routeTags: ["agency"],
      educationalTags: ["mock-interview", "agency-prep-quality"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "demand_better_prep",
        label: "Demand real practice",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 12, mentality: -5, energy: -4 },
          resultText: "They find a better interviewer. Still not great, but improved.",
        },
      },
      right: {
        id: "accept_generic_prep",
        label: "Settle for script reading",
        effect: {
          daysToAdvance: 60,
          stats: { mentality: 5, experience: -12 },
          resultText: "You memorize their script. Sound robotic in real interview.",
        },
      },
    },
  },
  {
    id: "dynamic_interview_mock_friend_diy",
    category: "SOCIAL",
    phase: Phase.Year1,
    character: "friend",
    title: "Peer Mock Interview",
    text: "A friend offers brutal mock interview practice. They'll ask exactly what admissions committees will ask.",
    stressLevel: "grind",
    weight: 95,
    requirements: {
      requiredFlags: ["route_diy"],
    },
    meta: {
      cardType: "dynamic",
      routeTags: ["diy"],
      educationalTags: ["mock-interview", "peer-learning"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "do_brutal_mock",
        label: "Do the brutal mock",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 15, mentality: -5, energy: -5 },
          resultText: "Painful practice, but you crush the real interview.",
        },
      },
      right: {
        id: "skip_to_avoid_stress",
        label: "Skip to avoid stress",
        effect: {
          daysToAdvance: 60,
          stats: { mentality: 5, experience: -10 },
          resultText: "You feel better today. You'll feel worse on interview day.",
        },
      },
    },
  },
  {
    id: "dynamic_agency_extra_fees",
    category: "finance",
    phase: Phase.Year1,
    character: "consultant",
    title: "The Surprise Add-On",
    text: "The agency suddenly says translation, document mailing, and 'priority handling' were never included in the original price.",
    stressLevel: "panic",
    weight: 75,
    requirements: {
      requiredFlags: ["route_agency"],
    },
    meta: {
      cardType: "crisis",
      routeTags: ["agency"],
      impactScore: 16,
      educationalTags: ["hidden-fees", "agency-costs"],
      cooldownTurns: 3,
      minPressure: 20,
    },
    choices: {
      left: {
        id: "push_back_on_fees",
        label: "Push back hard",
        effect: {
          daysToAdvance: 45,
          stats: { mentality: -4, experience: 8, energy: -5 },
          resultText: "It costs conflict, but at least you stop treating vague invoices like weather.",
        },
      },
      right: {
        id: "pay_silently",
        label: "Pay it quietly",
        effect: {
          daysToAdvance: 45,
          stats: { mentality: -10, experience: -6 },
          resultText: "The bill gets settled. The feeling of being handled does not.",
        },
      },
    },
  },
  {
    id: "dynamic_waiver_email",
    category: "LANGUAGE",
    phase: Phase.Year1,
    character: "email",
    title: "Language Waiver Question",
    text: "A program's website is ambiguous. It might waive the language test if your degree meets certain conditions, but it definitely will not clarify itself magically.",
    stressLevel: "chill",
    weight: 82,
    meta: {
      cardType: "knowledge",
      educationalTags: ["language-waiver", "admissions-email"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "send_precise_email",
        label: "Send a precise email",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 7, mentality: 4, energy: -2 },
          resultText: "Short, specific questions tend to produce actual answers.",
        },
      },
      right: {
        id: "guess_the_policy",
        label: "Guess the policy",
        effect: {
          daysToAdvance: 45,
          stats: { experience: -7, mentality: -4 },
          resultText: "Confidence is not the same thing as verification.",
        },
      },
    },
  },

  // ==================== YEAR 2 CARDS ====================

  {
    id: "y2_cold_email_professor_agency",
    category: "ACADEMIC",
    phase: Phase.Year2,
    character: "consultant",
    title: "Agency Research Match",
    text: "The agency offers to 'handle' professor outreach for you. They'll send generic emails to 100 professors.",
    stressLevel: "grind",
    weight: 90,
    requirements: {
      requiredFlags: ["route_agency"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["agency"],
      educationalTags: ["cold-emailing", "agency-research-match"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "let_agency_handle",
        label: "Let them handle it",
        effect: {
          daysToAdvance: 48,
          stats: { experience: -10, mentality: 5 },
          resultText: "Zero replies. Generic spam gets deleted.",
        },
      },
      right: {
        id: "do_outreach_yourself",
        label: "Do it yourself",
        effect: {
          daysToAdvance: 54,
          stats: { experience: 15, mentality: -5, energy: -10 },
          resultText: "Exhausting, but you get 3 positive responses.",
          addFlags: ["professor_contacts"],
        },
      },
    },
  },
  {
    id: "y2_cold_email_professor_diy",
    category: "ACADEMIC",
    phase: Phase.Year2,
    character: "professor_x",
    title: "Cold Email Season",
    text: "Time to reach out to potential advisors. A template could save time, but personalization gets replies.",
    stressLevel: "grind",
    weight: 95,
    requirements: {
      requiredFlags: ["route_diy"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["diy"],
      educationalTags: ["cold-emailing", "professor-outreach"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "personalize_emails",
        label: "Customize each email",
        effect: {
          daysToAdvance: 48,
          stats: { experience: 15, mentality: 5, energy: -10 },
          resultText: "Exhausting, but your reply rate triples.",
          addFlags: ["professor_contacts"],
        },
      },
      right: {
        id: "mass_template",
        label: "Send mass template",
        effect: {
          daysToAdvance: 54,
          stats: { experience: -5, mentality: -8 },
          resultText: "You sent 50 emails. Zero replies.",
        },
      },
    },
  },
  {
    id: "y2_research_group_join_agency",
    category: "ACADEMIC",
    phase: Phase.Year2,
    character: "consultant",
    title: "Agency Research Placement",
    text: "The agency offers a 'paid research opportunity' they promise will boost your profile. It costs extra.",
    stressLevel: "panic",
    weight: 75,
    requirements: {
      requiredFlags: ["route_agency"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["agency"],
      educationalTags: ["research-groups", "fake-opportunities"],
      cooldownTurns: 3,
    },
    choices: {
      left: {
        id: "pay_for_research",
        label: "Pay for placement",
        effect: {
          daysToAdvance: 45,
          stats: { experience: -15, mentality: -10 },
          resultText: "It's a remote 'research' that's just data entry. Worthless.",
        },
      },
      right: {
        id: "find_real_research",
        label: "Find real opportunities",
        effect: {
          daysToAdvance: 60,
          stats: { experience: 15, energy: -10, mentality: 5 },
          resultText: "You join a real lab. More work, but actual learning.",
          addFlags: ["research_group_member"],
        },
      },
    },
  },
  {
    id: "y2_research_group_join_diy",
    category: "ACADEMIC",
    phase: Phase.Year2,
    character: "professor_x",
    title: "Research Group Invitation",
    text: "A professor invites you to join their weekly research group meetings. No credit, just learning.",
    stressLevel: "chill",
    weight: 88,
    requirements: {
      requiredFlags: ["route_diy"],
    },
    meta: {
      cardType: "dynamic",
      routeTags: ["diy"],
      educationalTags: ["research-groups", "academic-communities"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "join_research_group",
        label: "Join the group",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 12, energy: -8, mentality: 5 },
          resultText: "You learn more than any lecture taught you.",
          addFlags: ["research_group_member"],
        },
      },
      right: {
        id: "focus_on_courses",
        label: "Focus on coursework",
        effect: {
          daysToAdvance: 45,
          stats: { gpa: 8, experience: -8 },
          resultText: "Your GPA is safe, but you missed academic networking.",
        },
      },
    },
  },
  {
    id: "y2_academic_conference",
    category: "ACADEMIC",
    phase: Phase.Year2,
    character: "professor_x",
    title: "Conference Opportunity",
    text: "A lab mate invites you to co-submit a poster to a regional conference. Submission deadline is in 3 days.",
    stressLevel: "panic",
    weight: 75,
    meta: {
      cardType: "knowledge",
      educationalTags: ["academic-conferences", "poster-presentations"],
      cooldownTurns: 3,
    },
    choices: {
      left: {
        id: "rush_poster",
        label: "Pull all-nighters",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 18, energy: -25, gpa: -8 },
          resultText: "Exhausting, but your CV now has a publication line.",
        },
      },
      right: {
        id: "skip_conference",
        label: "Pass on it",
        effect: {
          daysToAdvance: 45,
          stats: { energy: 5, experience: -10 },
          resultText: "You saved your sleep, but lost a chance to stand out.",
        },
      },
    },
  },
  {
    id: "y2_research_direction_talk",
    category: "ACADEMIC",
    phase: Phase.Year2,
    character: "professor_x",
    title: "Research Direction Chat",
    text: "Your thesis advisor asks what direction you want to pursue. You haven't read enough papers to know.",
    stressLevel: "grind",
    weight: 90,
    meta: {
      cardType: "knowledge",
      educationalTags: ["research-direction", "advisor-communication"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "read_papers_first",
        label: "Ask for time to read",
        effect: {
          daysToAdvance: 54,
          stats: { experience: 10, mentality: 8, energy: -5 },
          resultText: "You come back prepared. The conversation is actually useful.",
        },
      },
      right: {
        id: "guess_randomly",
        label: "Pick something random",
        effect: {
          daysToAdvance: 48,
          stats: { experience: -12, mentality: -8 },
          resultText: "Six months later, you're stuck in a field you hate.",
        },
      },
    },
  },
  {
    id: "y2_gpa_damage_control",
    category: "ACADEMIC",
    phase: Phase.Year2,
    character: "laptop",
    title: "GPA Slump",
    text: "Your mid-semester grades came in. They're... not great. Grad school applications will notice.",
    stressLevel: "panic",
    weight: 80,
    requirements: {
      statMax: { gpa: 65 },
    },
    meta: {
      cardType: "crisis",
      educationalTags: ["gpa-recovery", "academic-performance"],
      cooldownTurns: 3,
    },
    choices: {
      left: {
        id: "drop_hard_course",
        label: "Drop a hard course",
        effect: {
          daysToAdvance: 45,
          stats: { gpa: 12, energy: 10, experience: -8 },
          resultText: "Strategic withdrawal. Your GPA survives.",
        },
      },
      right: {
        id: "tough_it_out",
        label: "Grind through it",
        effect: {
          daysToAdvance: 45,
          stats: { gpa: -8, energy: -20, experience: 10 },
          resultText: "You barely pass, but your transcript shows the struggle.",
        },
      },
    },
  },
  {
    id: "y2_recommendation_check_in",
    category: "SOCIAL",
    phase: Phase.Year2,
    character: "professor_x",
    title: "Recommender Check-In",
    text: "Haven't spoken to your letter writers in months. They might forget who you are.",
    stressLevel: "chill",
    weight: 92,
    meta: {
      cardType: "knowledge",
      educationalTags: ["recommender-maintenance", "faculty-relationships"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "send_update_email",
        label: "Share recent work",
        effect: {
          daysToAdvance: 48,
          stats: { experience: 10, mentality: 5, energy: -3 },
          resultText: "You stay on their radar as a thoughtful student.",
        },
      },
      right: {
        id: "wait_until_deadline",
        label: "Wait until deadlines",
        effect: {
          daysToAdvance: 54,
          stats: { experience: -10, mentality: -5 },
          resultText: "Last-minute panic emails are not charming.",
        },
      },
    },
  },
  {
    id: "y2_academic_writing_workshop",
    category: "ACADEMIC",
    phase: Phase.Year2,
    character: "laptop",
    title: "Writing Workshop",
    text: "The writing center offers a 4-session workshop on academic papers. Your thesis will need one.",
    stressLevel: "chill",
    weight: 85,
    meta: {
      cardType: "knowledge",
      educationalTags: ["academic-writing", "thesis-prep"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "attend_workshop",
        label: "Attend all sessions",
        effect: {
          daysToAdvance: 60,
          stats: { experience: 15, energy: -8, gpa: 5 },
          resultText: "Your writing improves by leaps and bounds.",
        },
      },
      right: {
        id: "skip_workshop",
        label: "Learn by doing",
        effect: {
          daysToAdvance: 54,
          stats: { experience: -8 },
          resultText: "You reinvent the wheel, poorly.",
        },
      },
    },
  },
  {
    id: "y2_summer_planning",
    category: "PLANNING",
    phase: Phase.Year2,
    character: "calendar",
    title: "Summer Plans",
    text: "Summer break is coming. You could use it for research, internships, or... burnout prevention.",
    stressLevel: "chill",
    weight: 88,
    meta: {
      cardType: "knowledge",
      educationalTags: ["summer-planning", "time-management"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "research_internship",
        label: "Apply for REU programs",
        effect: {
          daysToAdvance: 90,
          stats: { experience: 20, mentality: -5, energy: -10 },
          resultText: "Competitive, but transformative for your profile.",
        },
      },
      right: {
        id: "rest_and_recover",
        label: "Take a real break",
        effect: {
          daysToAdvance: 90,
          stats: { mentality: 20, energy: 25, experience: -10 },
          resultText: "Sometimes preventing burnout is the most strategic choice.",
        },
      },
    },
  },
  {
    id: "y2_citation_management",
    category: "ACADEMIC",
    phase: Phase.Year2,
    character: "laptop",
    title: "Citation Chaos",
    text: "You have 47 PDFs in your downloads folder with names like 'paper1_final_v2.pdf'. Organization is not happening.",
    stressLevel: "grind",
    weight: 80,
    meta: {
      cardType: "knowledge",
      educationalTags: ["citation-management", "literature-review"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "setup_zotero",
        label: "Setup citation software",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 10, mentality: 8, energy: -5 },
          resultText: "Future-you will thank present-you profusely.",
        },
      },
      right: {
        id: "keep_chaos",
        label: "Figure it out later",
        effect: {
          daysToAdvance: 48,
          stats: { experience: -8, mentality: -5 },
          resultText: "Your thesis literature review will be a nightmare.",
        },
      },
    },
  },
  {
    id: "y2_collaboration_opportunity",
    category: "ACADEMIC",
    phase: Phase.Year2,
    character: "professor_x",
    title: "Cross-Lab Collaboration",
    text: "A peer from another lab proposes a joint project. More work, but double the publication potential.",
    stressLevel: "grind",
    weight: 78,
    meta: {
      cardType: "dynamic",
      educationalTags: ["collaboration", "research-networking"],
      cooldownTurns: 3,
    },
    choices: {
      left: {
        id: "accept_collaboration",
        label: "Take the opportunity",
        effect: {
          daysToAdvance: 60,
          stats: { experience: 18, energy: -20, mentality: -5 },
          resultText: "Exhausting juggling act, but you gain two co-authors.",
        },
      },
      right: {
        id: "decline_collaboration",
        label: "Focus on current work",
        effect: {
          daysToAdvance: 54,
          stats: { energy: 8, experience: -5 },
          resultText: "Safe choice, but you missed a growth moment.",
        },
      },
    },
  },

  // ==================== YEAR 3 CARDS ====================

  {
    id: "y3_sop_deep_dive_agency",
    category: "ACADEMIC",
    phase: Phase.Year3,
    character: "consultant",
    title: "Agency SOP Update",
    text: "The agency sends you their SOP draft. It's the same template they used in Year 1. No growth shown.",
    stressLevel: "grind",
    weight: 90,
    requirements: {
      requiredFlags: ["route_agency"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["agency"],
      educationalTags: ["sop-writing", "agency-essay-quality"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "rewrite_agency_sop",
        label: "Rewrite it yourself",
        effect: {
          daysToAdvance: 54,
          stats: { experience: 15, mentality: -8, energy: -10 },
          resultText: "You fight the agency. Your SOP actually sounds like you.",
        },
      },
      right: {
        id: "accept_template_sop",
        label: "Use their template",
        effect: {
          daysToAdvance: 48,
          stats: { experience: -12, mentality: 5 },
          resultText: "Safe, bland, and identical to 500 other applicants.",
        },
      },
    },
  },
  {
    id: "y3_sop_deep_dive_diy",
    category: "ACADEMIC",
    phase: Phase.Year3,
    character: "pencil",
    title: "SOP Redraft Season",
    text: "Year 1's draft feels childish now. You need to show growth, specific research interests, and maturity.",
    stressLevel: "grind",
    weight: 95,
    requirements: {
      requiredFlags: ["route_diy"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["diy"],
      educationalTags: ["sop-writing", "personal-statement", "essay-craft"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "complete_sop_rewrite",
        label: "Rewrite from scratch",
        effect: {
          daysToAdvance: 54,
          stats: { experience: 15, mentality: -8, energy: -10 },
          resultText: "Hard work, but your story now sounds like a future grad student.",
        },
      },
      right: {
        id: "patch_old_sop",
        label: "Patch the old draft",
        effect: {
          daysToAdvance: 48,
          stats: { experience: -10, mentality: 5 },
          resultText: "Admissions committees will smell the lack of evolution.",
        },
      },
    },
  },
  {
    id: "y3_interview_prep_intensive_agency",
    category: "SOCIAL",
    phase: Phase.Year3,
    character: "consultant",
    title: "Agency Interview Prep",
    text: "Five interview invites. The agency offers 'premium interview coaching' for an extra $2k.",
    stressLevel: "panic",
    weight: 80,
    requirements: {
      requiredFlags: ["route_agency"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["agency"],
      educationalTags: ["interview-prep", "agency-upsells"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "pay_for_coaching",
        label: "Pay for coaching",
        effect: {
          daysToAdvance: 45,
          stats: { experience: -10, mentality: -10, energy: 5 },
          resultText: "The 'coaching' is just a generic PDF. You wasted money.",
        },
      },
      right: {
        id: "prep_independently",
        label: "Prep on your own",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 20, mentality: -5, energy: -15 },
          resultText: "Exhausting but effective. You actually prepare.",
        },
      },
    },
  },
  {
    id: "y3_interview_prep_intensive_diy",
    category: "SOCIAL",
    phase: Phase.Year3,
    character: "interviewer",
    title: "Interview Marathon",
    text: "Five programs invited you for interviews. They're all in the same week. Panic time.",
    stressLevel: "panic",
    weight: 85,
    requirements: {
      requiredFlags: ["route_diy"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["diy"],
      educationalTags: ["interview-prep", "technical-interview", "behavioral-interview"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "structured_interview_prep",
        label: "Create prep schedule",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 20, mentality: 5, energy: -15 },
          resultText: "You prepare for each program specifically. It shows.",
        },
      },
      right: {
        id: "wing_interviews",
        label: "Wing all five",
        effect: {
          daysToAdvance: 45,
          stats: { experience: -25, mentality: -15 },
          resultText: "You blend into the 'fine but forgettable' pile.",
        },
      },
    },
  },
  {
    id: "y3_waiting_game_strategy",
    category: "WAITING",
    phase: Phase.Year3,
    character: "email",
    title: "Strategic Waiting",
    text: "You're on three waitlists. Do you hustle for more attention or play it cool?",
    stressLevel: "grind",
    weight: 88,
    meta: {
      cardType: "knowledge",
      educationalTags: ["waitlist-strategy", "admissions-tactics"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "active_waitlist_advocacy",
        label: "Send update letters",
        effect: {
          daysToAdvance: 48,
          stats: { experience: 12, mentality: -5, energy: -5 },
          resultText: "Polite persistence moves you up the list.",
        },
      },
      right: {
        id: "passive_waiting",
        label: "Wait silently",
        effect: {
          daysToAdvance: 54,
          stats: { mentality: -10 },
          resultText: "Hope is not a strategy, but you tried nothing.",
        },
      },
    },
  },
  {
    id: "y3_offer_comparison_matrix",
    category: "RESULTS",
    phase: Phase.Year3,
    character: "calendar",
    title: "Offer Decision Matrix",
    text: "Two great offers. One has better funding, the other has a better advisor. How do you choose?",
    stressLevel: "grind",
    weight: 92,
    meta: {
      cardType: "knowledge",
      educationalTags: ["offer-comparison", "decision-making", "program-selection"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "create_decision_matrix",
        label: "Build comparison spreadsheet",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 12, mentality: 10, energy: -5 },
          resultText: "Numbers and priorities clarify the messy decision.",
        },
      },
      right: {
        id: "trust_gut_feeling",
        label: "Follow your gut",
        effect: {
          daysToAdvance: 48,
          stats: { mentality: -5, experience: -8 },
          resultText: "Feelings change. Regret lasts longer.",
        },
      },
    },
  },
  {
    id: "y3_scholarship_applications",
    category: "finance",
    phase: Phase.Year3,
    character: "email",
    title: "External Scholarships",
    text: "You find 15 external fellowships you qualify for. Applications are due next week. All of them.",
    stressLevel: "panic",
    weight: 80,
    meta: {
      cardType: "knowledge",
      educationalTags: ["scholarships", "funding-applications", "external-funding"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "apply_strategically",
        label: "Pick top 5 and grind",
        effect: {
          daysToAdvance: 60,
          stats: { experience: 15, mentality: -8, energy: -15 },
          resultText: "Focused effort wins two. The shotgun approach would have won zero.",
        },
      },
      right: {
        id: "apply_to_all",
        label: "Apply to everything",
        effect: {
          daysToAdvance: 54,
          stats: { energy: -25, mentality: -20, experience: -5 },
          resultText: "You burn out and submit weak applications to all.",
        },
      },
    },
  },
  {
    id: "y3_dissertation_topic_refinement",
    category: "ACADEMIC",
    phase: Phase.Year3,
    character: "professor_x",
    title: "Thesis Topic Pivot",
    text: "Your original thesis topic isn't working. The data isn't there. Do you pivot or persist?",
    stressLevel: "panic",
    weight: 75,
    meta: {
      cardType: "crisis",
      educationalTags: ["thesis-adaptation", "research-pivots"],
      cooldownTurns: 3,
    },
    choices: {
      left: {
        id: "strategic_pivot",
        label: "Pivot to related topic",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 10, mentality: -10, gpa: -5 },
          resultText: "Painful now, but your thesis is actually viable.",
        },
      },
      right: {
        id: "stubborn_persistence",
        label: "Force the original topic",
        effect: {
          daysToAdvance: 45,
          stats: { gpa: -15, mentality: -15 },
          resultText: "You graduate with a weak thesis and a lot of regret.",
        },
      },
    },
  },
  {
    id: "y3_campus_visit_planning",
    category: "PLANNING",
    phase: Phase.Year3,
    character: "calendar",
    title: "Admitted Students Day",
    text: "Three programs invite you to campus visit weekends. They overlap. Of course they overlap.",
    stressLevel: "grind",
    weight: 85,
    meta: {
      cardType: "knowledge",
      educationalTags: ["campus-visits", "program-evaluation"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "strategic_visits",
        label: "Visit top 2 choices",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 12, mentality: 8, energy: -10 },
          resultText: "You see the labs, meet the students, and make informed choices.",
        },
      },
      right: {
        id: "skip_all_visits",
        label: "Save money, stay home",
        effect: {
          daysToAdvance: 48,
          stats: { mentality: -8, experience: -10 },
          resultText: "You choose based on websites. Surprise! They lied.",
        },
      },
    },
  },
  {
    id: "y3_negotiating_funding",
    category: "finance",
    phase: Phase.Year3,
    character: "email",
    title: "Funding Negotiation",
    text: "You got into your dream program with partial funding. A competitor offers full funding. Can you negotiate?",
    stressLevel: "grind",
    weight: 80,
    meta: {
      cardType: "knowledge",
      educationalTags: ["funding-negotiation", "advocacy"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "professional_negotiation",
        label: "Negotiate respectfully",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 15, mentality: 5, energy: -5 },
          resultText: "They match the offer. You just paid for a year of grad school.",
        },
      },
      right: {
        id: "accept_initial_offer",
        label: "Accept as-is",
        effect: {
          daysToAdvance: 48,
          stats: { mentality: -5, experience: -8 },
          resultText: "You leave $40,000 on the table. Ouch.",
        },
      },
    },
  },
  {
    id: "y3_research_statement",
    category: "ACADEMIC",
    phase: Phase.Year3,
    character: "pencil",
    title: "Research Statement",
    text: "Some programs want a separate research statement. Others want it merged into the SOP. Confusion reigns.",
    stressLevel: "grind",
    weight: 82,
    meta: {
      cardType: "knowledge",
      educationalTags: ["research-statement", "application-materials"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "create_both_versions",
        label: "Prepare both formats",
        effect: {
          daysToAdvance: 54,
          stats: { experience: 10, mentality: 5, energy: -8 },
          resultText: "Extra work now, zero last-minute panic later.",
        },
      },
      right: {
        id: "reuse_sop",
        label: "Just reuse the SOP",
        effect: {
          daysToAdvance: 48,
          stats: { experience: -10, mentality: -5 },
          resultText: "You look unprepared to programs that wanted separate documents.",
        },
      },
    },
  },
  {
    id: "y3_defense_preparation",
    category: "ACADEMIC",
    phase: Phase.Year3,
    character: "professor_x",
    title: "Thesis Defense Prep",
    text: "Your thesis defense is in 3 weeks. You haven't looked at your slides since you made them 6 months ago.",
    stressLevel: "panic",
    weight: 90,
    meta: {
      cardType: "milestone",
      educationalTags: ["thesis-defense", "presentation-skills"],
      priority: 90,
    },
    choices: {
      left: {
        id: "mock_defense_marathon",
        label: "Run 5 mock defenses",
        effect: {
          daysToAdvance: 60,
          stats: { experience: 20, mentality: -10, energy: -20 },
          resultText: "You can present in your sleep. Real defense is smooth.",
        },
      },
      right: {
        id: "light_review",
        label: "Light review only",
        effect: {
          daysToAdvance: 54,
          stats: { mentality: -15, experience: -10 },
          resultText: "Committee members ask questions you can't answer. Painful.",
        },
      },
    },
  },

  // ==================== ROUTE-SPECIFIC VARIANTS (REDUCE OVERLAP) ====================

  {
    id: "dynamic_deadline_tracker_agency",
    category: "PLANNING",
    phase: Phase.Year1,
    character: "consultant",
    title: "Agency Deadline Tracker",
    text: "The consultant shows you their portal. Your deadlines are 'managed' but nothing is explained.",
    stressLevel: "chill",
    weight: 85,
    once: true,
    requirements: {
      requiredFlags: ["route_agency"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["agency"],
      educationalTags: ["deadline-tracking", "agency-monitoring"],
      recoveryScore: 8,
      cooldownTurns: 2,
      maxPressure: 85,
    },
    choices: {
      left: {
        id: "demand_transparency",
        label: "Demand full access",
        effect: {
          daysToAdvance: 54,
          stats: { experience: 10, mentality: 12, energy: -5 },
          resultText: "You catch three mistakes they would have missed.",
          addFlags: ["agency_transparent"],
        },
      },
      right: {
        id: "trust_agency_blindly",
        label: "Trust them completely",
        effect: {
          daysToAdvance: 48,
          stats: { mentality: -12, experience: -15 },
          resultText: "Your application journey is now a mystery to you.",
        },
      },
    },
  },
  {
    id: "dynamic_deadline_tracker_diy",
    category: "PLANNING",
    phase: Phase.Year1,
    character: "calendar",
    title: "DIY Deadline Spreadsheet",
    text: "A senior shares their template. You realize manual tracking is your only safety net.",
    stressLevel: "chill",
    weight: 90,
    once: true,
    requirements: {
      requiredFlags: ["route_diy"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["diy"],
      educationalTags: ["deadline-tracking", "spreadsheet-organization"],
      recoveryScore: 15,
      cooldownTurns: 2,
      maxPressure: 85,
    },
    choices: {
      left: {
        id: "build_tracker",
        label: "Build it tonight",
        effect: {
          daysToAdvance: 54,
          stats: { experience: 12, mentality: 8, energy: -5 },
          resultText: "Boring, but future-you saves future-you's life.",
          addFlags: ["has_deadline_tracker"],
        },
      },
      right: {
        id: "wing_schedule",
        label: "I'll remember it",
        effect: {
          daysToAdvance: 48,
          stats: { mentality: -8, experience: -5 },
          resultText: "Your memory is not a project management system.",
        },
      },
    },
  },
  {
    id: "dynamic_budget_sheet_agency",
    category: "finance",
    phase: Phase.Year1,
    character: "consultant",
    title: "Agency Hidden Costs",
    text: "Beyond the base fee, there are 'optional' services piling up. Translation, priority handling, express mail...",
    stressLevel: "grind",
    weight: 90,
    once: true,
    requirements: {
      requiredFlags: ["route_agency"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["agency"],
      educationalTags: ["agency-costs", "hidden-fees", "application-budget"],
      recoveryScore: 6,
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "demand_full_breakdown",
        label: "Demand full cost breakdown",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 10, mentality: 8, energy: -4 },
          resultText: "You discover $3k of 'fees' that never materialize into value.",
          addFlags: ["budget_planned"],
        },
      },
      right: {
        id: "accept_unknown_costs",
        label: "Just pay as we go",
        effect: {
          daysToAdvance: 45,
          stats: { mentality: -15, experience: -10 },
          resultText: "Your final bill is double what you expected.",
        },
      },
    },
  },
  {
    id: "dynamic_budget_sheet_diy",
    category: "finance",
    phase: Phase.Year1,
    character: "parent",
    title: "DIY Budget Reality",
    text: "Your family asks the least romantic question in the whole process: what exactly will this cost, and what if scholarships don't arrive?",
    stressLevel: "grind",
    weight: 90,
    once: true,
    requirements: {
      requiredFlags: ["route_diy"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["diy"],
      educationalTags: ["application-budget", "financial-planning"],
      recoveryScore: 10,
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "make_budget",
        label: "Build a budget sheet",
        effect: {
          daysToAdvance: 45,
          stats: { experience: 10, mentality: 8, energy: -4 },
          resultText: "Not glamorous, but uncertainty becomes something you can reason about.",
          addFlags: ["budget_planned"],
        },
      },
      right: {
        id: "avoid_numbers",
        label: "Avoid the topic",
        effect: {
          daysToAdvance: 45,
          stats: { mentality: -10, experience: -5 },
          resultText: "The money problem does not disappear. It just becomes louder later.",
        },
      },
    },
  },
  {
    id: "dynamic_cv_quantify_agency",
    category: "ACADEMIC",
    phase: Phase.Year1,
    character: "consultant",
    title: "CV Review Disappointment",
    text: "The agency 'enhanced' your CV. Now it sounds like everyone else's. All personality removed.",
    stressLevel: "grind",
    weight: 88,
    requirements: {
      requiredFlags: ["route_agency"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["agency"],
      educationalTags: ["cv-writing", "agency-essay-quality"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "restore_cv_voice",
        label: "Restore your version",
        effect: {
          daysToAdvance: 60,
          stats: { experience: 12, mentality: 5, energy: -5 },
          resultText: "You fight for your CV. It stands out again.",
        },
      },
      right: {
        id: "accept_generic_cv",
        label: "Accept their template",
        effect: {
          daysToAdvance: 54,
          stats: { experience: -10, mentality: -8 },
          resultText: "Your CV looks professional. Like 5,000 others.",
        },
      },
    },
  },
  {
    id: "dynamic_cv_quantify_diy",
    category: "ACADEMIC",
    phase: Phase.Year1,
    character: "laptop",
    title: "CV Bullet Rewrite",
    text: "Your CV says 'participated in project work' six times. Even you have no idea what that means anymore.",
    stressLevel: "chill",
    weight: 95,
    requirements: {
      requiredFlags: ["route_diy"],
    },
    meta: {
      cardType: "knowledge",
      routeTags: ["diy"],
      educationalTags: ["cv-quantification", "resume-writing"],
      cooldownTurns: 2,
    },
    choices: {
      left: {
        id: "rewrite_with_metrics",
        label: "Rewrite with metrics",
        effect: {
          daysToAdvance: 60,
          stats: { experience: 12, energy: -5 },
          resultText: "Specific achievements make you look like a real person who did real work.",
        },
      },
      right: {
        id: "keep_vague_cv",
        label: "Leave it vague",
        effect: {
          daysToAdvance: 54,
          stats: { experience: -10, mentality: -3 },
          resultText: "The CV remains technically fine and strategically weak.",
        },
      },
    },
  },
];

export const DEMO_MAIN_DECK: RuntimeCard[] = [
  {
    id: "timeline_start",
    category: "PLANNING",
    phase: Phase.Year1,
    character: "calendar",
    title: "September: The Crossroads",
    text: "Senior year begins. Grad school applications are looming. How will you tackle this journey?",
    stressLevel: "grind",
    meta: {
      cardType: "milestone",
      educationalTags: ["route-selection"],
      priority: 100,
    },
    choices: {
      left: {
        id: "hire_agency",
        label: "Hire Agency ($10k)",
        effect: {
          stats: { mentality: 20, energy: 10, experience: -10 },
          resultText: "You signed a contract. Time to relax... right?",
          daysToAdvance: 180,
          addFlags: ["route_agency"],
          removeFlags: ["route_diy"],
        },
        nextCardId: "agency_1_handover",
      },
      right: {
        id: "diy",
        label: "DIY (Do It Yourself)",
        effect: {
          stats: { mentality: -10, energy: -15, experience: 15 },
          resultText: "You opened 20 tabs of university requirements. It's on.",
          daysToAdvance: 180,
          addFlags: ["route_diy"],
          removeFlags: ["route_agency"],
        },
        nextCardId: "diy_1_ielts",
      },
    },
  },
  {
    id: "agency_1_handover",
    category: "AGENCY",
    phase: Phase.Year1,
    character: "consultant",
    title: "October: The Handover",
    text: "Your consultant asks for your application email password for 'unified management.'",
    stressLevel: "panic",
    meta: {
      cardType: "milestone",
      routeTags: ["agency"],
      educationalTags: ["agency-account-access"],
    },
    choices: {
      left: {
        id: "give_password",
        label: "Sure, take it",
        effect: {
          stats: { gpa: -10, mentality: 10, experience: -20 },
          resultText: "Out of sight, out of mind.",
          daysToAdvance: 180,
        },
        nextCardId: "agency_2_ghosting_a",
      },
      right: {
        id: "refuse",
        label: "Absolutely Not",
        effect: {
          stats: { energy: -20, mentality: -10, experience: 20 },
          resultText: "They are annoyed, but you retain control.",
          daysToAdvance: 180,
        },
        nextCardId: "agency_2_ghosting_b",
      },
    },
  },
  {
    id: "agency_2_ghosting_a",
    category: "CRISIS",
    phase: Phase.Year1,
    character: "phone",
    title: "November: Radio Silence",
    text: "You haven't heard from the agency in 3 weeks. The deadline is approaching.",
    stressLevel: "panic",
    meta: {
      cardType: "crisis",
      routeTags: ["agency"],
      educationalTags: ["agency-reliability"],
    },
    choices: {
      left: {
        id: "spam_call",
        label: "Spam Call Them",
        effect: {
          stats: { energy: -25, mentality: -20 },
          resultText: "They finally picked up, but gave a vague excuse.",
          daysToAdvance: 180,
        },
        nextCardId: "agency_3a_spamfolder",
      },
      right: {
        id: "wait",
        label: "Trust the Process",
        effect: {
          stats: { mentality: 10, experience: -15 },
          resultText: "Ignorance is bliss... for now.",
          daysToAdvance: 180,
        },
        nextCardId: "agency_3a_spamfolder",
      },
    },
  },
  {
    id: "agency_2_ghosting_b",
    category: "AGENCY",
    phase: Phase.Year1,
    character: "consultant",
    title: "November: The First Draft",
    text: "You finally forced them to send the essay draft. It's garbage.",
    stressLevel: "grind",
    meta: {
      cardType: "milestone",
      routeTags: ["agency"],
      educationalTags: ["essay-quality"],
    },
    choices: {
      left: {
        id: "rewrite",
        label: "Rewrite It",
        effect: {
          stats: { energy: -30, gpa: 10, experience: 20 },
          resultText: "You are doing their job for them.",
          daysToAdvance: 90,
        },
        nextCardId: "agency_2.5_materials",
      },
      right: {
        id: "complain",
        label: "Complain to Manager",
        effect: {
          stats: { mentality: -25, energy: -10 },
          resultText: "They assigned a 'senior' consultant. Same garbage.",
          daysToAdvance: 90,
        },
        nextCardId: "agency_2.5_materials",
      },
    },
  },
  {
    id: "agency_2.5_materials",
    category: "PLANNING",
    phase: Phase.Year1,
    character: "folder",
    title: "Late November: Material Gathering",
    text: "The agency needs your transcripts and certificates. You lost the physical copies.",
    stressLevel: "panic",
    meta: {
      cardType: "milestone",
      routeTags: ["agency"],
      educationalTags: ["materials-management"],
    },
    choices: {
      left: {
        id: "bribe_admin",
        label: "Beg School Admin",
        effect: {
          stats: { mentality: -20, energy: -15 },
          resultText: "You stood in line for 4 hours, but got them.",
          daysToAdvance: 90,
        },
        nextCardId: "agency_3b_template",
      },
      right: {
        id: "fake_it",
        label: "Forge Them",
        effect: {
          stats: { gpa: -100 },
          resultText: "You got caught. Instant expulsion.",
          triggerGameOver:
            "Academic Fraud. You were caught forging documents and expelled.",
        },
      },
    },
  },
  {
    id: "agency_3a_spamfolder",
    category: "CRISIS",
    phase: Phase.Year1,
    character: "email",
    title: "December: The Missed Interview",
    text: "You finally log in. The agency missed a Yale interview invite from 2 weeks ago.",
    stressLevel: "panic",
    meta: {
      cardType: "crisis",
      routeTags: ["agency"],
      educationalTags: ["email-monitoring", "interview-invites"],
    },
    choices: {
      left: {
        id: "rage",
        label: "Rage & Sue",
        effect: {
          stats: { mentality: -30, energy: -30, experience: 15 },
          resultText: "You fired them. Time to apply alone.",
          daysToAdvance: 180,
        },
        nextCardId: "agency_4_upsell",
      },
      right: {
        id: "cry",
        label: "Cry in Bed",
        effect: {
          stats: { mentality: -40, energy: -15 },
          resultText: "Dreams crushed. You settle for safe schools.",
          daysToAdvance: 180,
        },
        nextCardId: "agency_4_upsell",
      },
    },
  },
  {
    id: "agency_3b_template",
    category: "AGENCY",
    phase: Phase.Year1,
    character: "consultant",
    title: "December: The Template",
    text: "They refuse to use your rewritten essay. They insist their 'template' is proven.",
    stressLevel: "grind",
    meta: {
      cardType: "milestone",
      routeTags: ["agency"],
      educationalTags: ["essay-authenticity"],
    },
    choices: {
      left: {
        id: "accept",
        label: "Yield to 'Experts'",
        effect: {
          stats: { gpa: -20, experience: -20 },
          resultText: "Your essay looks like 10,000 others.",
          daysToAdvance: 180,
        },
        nextCardId: "agency_4_upsell",
      },
      right: {
        id: "rebel",
        label: "Submit Yours",
        effect: {
          stats: { energy: -20, mentality: 10, experience: 20 },
          resultText: "You went rogue and submitted it yourself.",
          daysToAdvance: 180,
        },
        nextCardId: "agency_4_upsell",
      },
    },
  },
  {
    id: "agency_4_upsell",
    category: "AGENCY",
    phase: Phase.Year1,
    character: "consultant",
    title: "January: The Upsell",
    text: "The agency claims your background is 'too weak' and demands $3k for a 'guaranteed internship' padding.",
    stressLevel: "panic",
    meta: {
      cardType: "milestone",
      routeTags: ["agency"],
      educationalTags: ["fake-internships"],
    },
    choices: {
      left: {
        id: "pay",
        label: "Pay the Ransom",
        effect: {
          stats: { mentality: -20, experience: -15 },
          resultText: "It was a fake remote internship. Worthless.",
          daysToAdvance: 90,
        },
        nextCardId: "agency_4.5_mock_interview",
      },
      right: {
        id: "refuse",
        label: "Refuse Firmly",
        effect: {
          stats: { mentality: 15, energy: -10, experience: 10 },
          resultText: "You stood your ground.",
          daysToAdvance: 90,
        },
        nextCardId: "agency_4.5_mock_interview",
      },
    },
  },
  {
    id: "agency_4.5_mock_interview",
    category: "PLANNING",
    phase: Phase.Year1,
    character: "consultant",
    title: "Late January: Mock Interview",
    text: "The agency's 'mock interviewer' just reads off a script and yawns.",
    stressLevel: "grind",
    meta: {
      cardType: "milestone",
      routeTags: ["agency"],
      educationalTags: ["interview-prep"],
    },
    choices: {
      left: {
        id: "follow_script",
        label: "Memorize Their Script",
        effect: {
          stats: { mentality: -10, experience: -20 },
          resultText: "You sound robotic and unnatural.",
          daysToAdvance: 90,
        },
        nextCardId: "final_push",
      },
      right: {
        id: "ignore_them",
        label: "Prepare Independently",
        effect: {
          stats: { energy: -20, experience: 20 },
          resultText: "You stayed up watching YouTube guides.",
          daysToAdvance: 90,
        },
        nextCardId: "final_push",
      },
    },
  },
  {
    id: "diy_1_ielts",
    category: "LANGUAGE",
    phase: Phase.Year1,
    character: "language_test",
    title: "October: The IELTS Grind",
    text: "You need a 7.5. Your practice tests are stuck at 6.5.",
    stressLevel: "grind",
    meta: {
      cardType: "milestone",
      routeTags: ["diy"],
      educationalTags: ["ielts-preparation"],
    },
    choices: {
      left: {
        id: "grind_tpo",
        label: "Grind Official Prep",
        effect: {
          stats: { gpa: 15, energy: -30, experience: 15 },
          resultText: "Exhausting, but you secured the 7.5!",
          daysToAdvance: 180,
        },
        nextCardId: "diy_2_gre",
      },
      right: {
        id: "pray",
        label: "Rely on Luck",
        effect: {
          stats: { gpa: -20, mentality: 10, energy: 10 },
          resultText: "You got a 6.5. Say goodbye to top programs.",
          daysToAdvance: 180,
        },
        nextCardId: "diy_2_gre",
      },
    },
  },
  {
    id: "diy_2_gre",
    category: "LANGUAGE",
    phase: Phase.Year1,
    character: "math_book",
    title: "November: The GRE",
    text: "Quant is easy, but Verbal is destroying your soul.",
    stressLevel: "panic",
    meta: {
      cardType: "milestone",
      routeTags: ["diy"],
      educationalTags: ["gre-optional"],
    },
    choices: {
      left: {
        id: "memorize",
        label: "Memorize 3000 Words",
        effect: {
          stats: { energy: -35, mentality: -15, experience: 10 },
          resultText: "Your brain is fried, but you passed.",
          daysToAdvance: 90,
        },
        nextCardId: "diy_2.5_research",
      },
      right: {
        id: "skip_gre",
        label: "Apply GRE-Optional",
        effect: {
          stats: { gpa: -15, energy: 20 },
          resultText: "You saved energy, but your options are limited.",
          daysToAdvance: 90,
        },
        nextCardId: "diy_2.5_research",
      },
    },
  },
  {
    id: "diy_2.5_research",
    category: "ACADEMIC",
    phase: Phase.Year1,
    character: "professor_x",
    title: "Late November: Research Lab",
    text: "You joined a lab to boost your resume, but the PhD mentor wants you to work 40 hours a week.",
    stressLevel: "grind",
    meta: {
      cardType: "milestone",
      routeTags: ["diy"],
      educationalTags: ["research-experience"],
    },
    choices: {
      left: {
        id: "quit_lab",
        label: "Quit the Lab",
        effect: {
          stats: { energy: 20, experience: -30 },
          resultText: "You have more time, but a weaker profile.",
          daysToAdvance: 90,
        },
        nextCardId: "diy_3_selection",
      },
      right: {
        id: "overwork",
        label: "Do It All",
        effect: {
          stats: { gpa: -10, mentality: -30, energy: -30, experience: 35 },
          resultText: "You barely sleep, but you get a co-authorship.",
          daysToAdvance: 90,
        },
        nextCardId: "diy_3_selection",
      },
    },
  },
  {
    id: "diy_3_selection",
    category: "ACADEMIC",
    phase: Phase.Year1,
    character: "professor_x",
    title: "December: School Selection",
    text: "Time to build your application list.",
    stressLevel: "chill",
    meta: {
      cardType: "milestone",
      routeTags: ["diy"],
      educationalTags: ["school-selection"],
    },
    choices: {
      left: {
        id: "all_reach",
        label: "All Ivy League",
        effect: {
          stats: { mentality: 15, experience: -10 },
          resultText: "High risk, high reward... or total failure.",
          daysToAdvance: 180,
        },
        nextCardId: "diy_4_recs",
      },
      right: {
        id: "balanced",
        label: "Balanced List",
        effect: {
          stats: { mentality: -5, experience: 20 },
          resultText: "Safe, Target, Reach. A mature strategy.",
          daysToAdvance: 180,
        },
        nextCardId: "diy_4_recs",
      },
    },
  },
  {
    id: "diy_4_recs",
    category: "SOCIAL",
    phase: Phase.Year1,
    character: "professor_x",
    title: "January: Recommendations",
    text: "Your favorite professor isn't replying to your reference letter request.",
    stressLevel: "panic",
    meta: {
      cardType: "milestone",
      routeTags: ["diy"],
      educationalTags: ["recommendation-letters"],
    },
    choices: {
      left: {
        id: "ambush",
        label: "Ambush Their Office",
        effect: {
          stats: { energy: -15, mentality: -10, experience: 25 },
          resultText: "Awkward, but you got the signature.",
          daysToAdvance: 180,
        },
        nextCardId: "diy_5_writer",
      },
      right: {
        id: "ask_ta",
        label: "Ask a TA Instead",
        effect: {
          stats: { gpa: -15, experience: -15 },
          resultText: "A weak letter that carries no weight.",
          daysToAdvance: 180,
        },
        nextCardId: "diy_5_writer",
      },
    },
  },
  {
    id: "diy_5_writer",
    category: "ACADEMIC",
    phase: Phase.Year1,
    character: "pencil",
    title: "February: Writer's Block",
    text: "Staring at a blank page for your Personal Statement.",
    stressLevel: "grind",
    meta: {
      cardType: "milestone",
      routeTags: ["diy"],
      educationalTags: ["personal-statement"],
    },
    choices: {
      left: {
        id: "use_ai",
        label: "Use ChatGPT",
        effect: {
          stats: { gpa: -20, energy: 20, experience: -15 },
          resultText: "It sounds like a robot wrote it.",
          daysToAdvance: 90,
        },
        nextCardId: "diy_5.5_interview",
      },
      right: {
        id: "struggle",
        label: "Write & Revise",
        effect: {
          stats: { energy: -30, mentality: -15, experience: 25 },
          resultText: "Draft #10 is finally authentic.",
          daysToAdvance: 90,
        },
        nextCardId: "diy_5.5_interview",
      },
    },
  },
  {
    id: "diy_5.5_interview",
    category: "SOCIAL",
    phase: Phase.Year1,
    character: "interviewer",
    title: "Late February: The Real Interview",
    text: "A top program invites you for a technical interview over Zoom.",
    stressLevel: "panic",
    meta: {
      cardType: "milestone",
      routeTags: ["diy"],
      educationalTags: ["technical-interview"],
    },
    choices: {
      left: {
        id: "cram",
        label: "Cram Technicals",
        effect: {
          stats: { energy: -20, mentality: -15, experience: 30 },
          resultText: "You answered the coding question perfectly.",
          daysToAdvance: 90,
        },
        nextCardId: "final_push",
      },
      right: {
        id: "wing_it",
        label: "Wing It",
        effect: {
          stats: { experience: -40, mentality: -10 },
          resultText: "You blanked on a basic algorithm.",
          daysToAdvance: 90,
        },
        nextCardId: "final_push",
      },
    },
  },
  {
    id: "final_push",
    category: "WAITING",
    phase: Phase.Year1,
    character: "calendar",
    title: "March: Year 1 Waiting Game",
    text: "First round of applications submitted. Now you wait. The anxiety is palpable.",
    stressLevel: "chill",
    meta: {
      cardType: "milestone",
      educationalTags: ["waiting-period"],
    },
    choices: {
      left: {
        id: "doomscroll",
        label: "Doomscroll Forums",
        effect: {
          stats: { mentality: -25, energy: -10 },
          resultText: "Seeing others get offers destroys your peace.",
          daysToAdvance: 180,
        },
        nextCardId: "year1_transition",
      },
      right: {
        id: "relax",
        label: "Find a Hobby",
        effect: {
          stats: { mentality: 25, energy: 15 },
          resultText: "You start painting. It actually helps.",
          daysToAdvance: 180,
        },
        nextCardId: "year1_transition",
      },
    },
  },
  {
    id: "year1_transition",
    category: "PLANNING",
    phase: Phase.Year1,
    character: "calendar",
    title: "April: Year 1 Reflection",
    text: "Year 1 complete. You've survived the first wave. Time to plan for Year 2's challenges.",
    stressLevel: "chill",
    meta: {
      cardType: "milestone",
      educationalTags: ["year-planning", "reflection"],
      priority: 95,
    },
    choices: {
      left: {
        id: "plan_year2_strong",
        label: "Double Down",
        effect: {
          stats: { experience: 10, mentality: 5 },
          resultText: "You're ready for Year 2's academic challenges.",
          daysToAdvance: 180,
        },
      },
      right: {
        id: "plan_year2_balanced",
        label: "Stay Balanced",
        effect: {
          stats: { mentality: 10, energy: 10 },
          resultText: "Sustainable pacing wins long races.",
          daysToAdvance: 180,
        },
      },
    },
  },

  // ==================== YEAR 2 MILESTONES ====================

  {
    id: "year2_midpoint_review",
    category: "PLANNING",
    phase: Phase.Year2,
    character: "professor_x",
    title: "November: Year 2 Check-In",
    text: "Halfway through Year 2. Your research is progressing, but grad school application prep looms closer.",
    stressLevel: "grind",
    meta: {
      cardType: "milestone",
      educationalTags: ["progress-review", "academic-planning"],
      priority: 90,
    },
    choices: {
      left: {
        id: "focus_on_publication",
        label: "Push for publication",
        effect: {
          stats: { experience: 15, mentality: -10, energy: -15 },
          resultText: "High risk, but publication potential is real.",
          daysToAdvance: 180,
        },
      },
      right: {
        id: "maintain_gpa_priority",
        label: "Protect the GPA",
        effect: {
          stats: { gpa: 12, experience: -5 },
          resultText: "Conservative, but your transcript stays strong.",
          daysToAdvance: 180,
        },
      },
    },
  },
  {
    id: "year2_transition",
    category: "PLANNING",
    phase: Phase.Year2,
    character: "calendar",
    title: "April: Year 2 Complete",
    text: "Year 2 down. You've built research connections and academic depth. Year 3 is the final sprint.",
    stressLevel: "chill",
    meta: {
      cardType: "milestone",
      educationalTags: ["year-planning", "progress-milestone"],
      priority: 95,
    },
    choices: {
      left: {
        id: "enter_year3_confident",
        label: "Full Speed Ahead",
        effect: {
          stats: { experience: 15, mentality: 10 },
          resultText: "You're ready for the final push.",
          daysToAdvance: 180,
        },
      },
      right: {
        id: "enter_year3_cautious",
        label: "Steady Pace",
        effect: {
          stats: { energy: 15, mentality: 5 },
          resultText: "You'll avoid burnout in the final stretch.",
          daysToAdvance: 180,
        },
      },
    },
  },

  // ==================== YEAR 3 MILESTONES ====================

  {
    id: "year3_applications_intensive",
    category: "PLANNING",
    phase: Phase.Year3,
    character: "pencil",
    title: "October: Final Application Push",
    text: "Year 3 is here. All materials must be polished. SOPs, statements, funding apps. The real work begins.",
    stressLevel: "panic",
    meta: {
      cardType: "milestone",
      educationalTags: ["final-prep", "applications-intensive"],
      priority: 100,
    },
    choices: {
      left: {
        id: "structured_app_plan",
        label: "Create detailed timeline",
        effect: {
          stats: { experience: 12, mentality: 8, energy: -8 },
          resultText: "You avoid last-minute panic with spreadsheet zen.",
          daysToAdvance: 180,
        },
      },
      right: {
        id: "chaotic_app_sprint",
        label: "Wing it day by day",
        effect: {
          stats: { mentality: -15, energy: -10 },
          resultText: "You survive on adrenaline and coffee. Not sustainable.",
          daysToAdvance: 180,
        },
      },
    },
  },
  {
    id: "final_waiting_game",
    category: "WAITING",
    phase: Phase.Year3,
    character: "calendar",
    title: "February: The Final Wait",
    text: "All applications submitted. Years of work are now out of your hands. The hardest part.",
    stressLevel: "chill",
    meta: {
      cardType: "milestone",
      educationalTags: ["final-waiting", "closure"],
    },
    choices: {
      left: {
        id: "doomscroll_final",
        label: "Obsessive Forum Checking",
        effect: {
          stats: { mentality: -25, energy: -10 },
          resultText: "Every notification gives you a mini heart attack.",
          daysToAdvance: 180,
        },
        nextCardId: "decision_day",
      },
      right: {
        id: "mindful_waiting",
        label: "Focus on the present",
        effect: {
          stats: { mentality: 25, energy: 15 },
          resultText: "You apply to PhDs, but you live now. Healthy perspective.",
          daysToAdvance: 180,
        },
        nextCardId: "decision_day",
      },
    },
  },
  {
    id: "decision_day",
    category: "RESULTS",
    phase: Phase.Year3,
    character: "email",
    title: "April: Final Decision Day",
    text: "An email notification pops up: 'Status Update on Your Application.' Three years lead to this moment.",
    stressLevel: "panic",
    meta: {
      cardType: "ending",
      educationalTags: ["results", "completion"],
      priority: 100,
    },
    choices: {
      left: {
        id: "open_it",
        label: "Open It Now",
        effect: {
          stats: { mentality: -10 },
          resultText: "The moment of truth after three years of preparation...",
          daysToAdvance: 45,
          triggerGameOver:
            "🎓 JOURNEY COMPLETE! You survived all three years of preparation. Research, applications, interviews, waiting. You got the offer! The next chapter begins.",
          isWin: true,
          currencyAward: 200,
        },
      },
      right: {
        id: "wait",
        label: "Share with Family",
        effect: {
          stats: { mentality: 20, experience: 10 },
          resultText: "Some moments deserve to be shared with the people who supported you.",
          daysToAdvance: 45,
          triggerGameOver:
            "🎓 JOURNEY COMPLETE! You survived all three years of preparation. Research, applications, interviews, waiting. You got the offer! The next chapter begins.",
          isWin: true,
          currencyAward: 200,
        },
      },
    },
  },
];

export const demoGameCatalog: GameCardCatalog = {
  startCardId: "timeline_start",
  cards: [...DEMO_MAIN_DECK, ...DEMO_DYNAMIC_CARDS, ...DEMO_SPECIAL_EVENTS],
};
