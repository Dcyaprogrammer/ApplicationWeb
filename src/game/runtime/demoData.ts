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
    title: "March: The Waiting Game",
    text: "Applications submitted. Now you wait. The anxiety is palpable.",
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
        nextCardId: "decision_day",
      },
      right: {
        id: "relax",
        label: "Find a Hobby",
        effect: {
          stats: { mentality: 25, energy: 15 },
          resultText: "You start painting. It actually helps.",
          daysToAdvance: 180,
        },
        nextCardId: "decision_day",
      },
    },
  },
  {
    id: "decision_day",
    category: "RESULTS",
    phase: Phase.Year1,
    character: "email",
    title: "April: Decision Day",
    text: "An email notification pops up: 'Status Update on Your Application.'",
    stressLevel: "panic",
    meta: {
      cardType: "ending",
      educationalTags: ["results"],
      priority: 100,
    },
    choices: {
      left: {
        id: "open_it",
        label: "Open It Now",
        effect: {
          stats: { mentality: -10 },
          resultText: "The moment of truth...",
          daysToAdvance: 45,
          triggerGameOver:
            "DEMO COMPLETED! You survived the brutal application season. You got the offer!",
          isWin: true,
          currencyAward: 100,
        },
      },
      right: {
        id: "wait",
        label: "Wait for Parents",
        effect: {
          stats: { mentality: -20 },
          resultText: "The suspense is killing you.",
          daysToAdvance: 45,
          triggerGameOver:
            "DEMO COMPLETED! You survived the brutal application season. You got the offer!",
          isWin: true,
          currencyAward: 100,
        },
      },
    },
  },
];

export const demoGameCatalog: GameCardCatalog = {
  startCardId: "timeline_start",
  cards: [...DEMO_MAIN_DECK, ...DEMO_DYNAMIC_CARDS, ...DEMO_SPECIAL_EVENTS],
};
