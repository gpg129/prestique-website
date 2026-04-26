// Law firm spec study — drives /law page content.
// Every capability claim cites the research fact sheet:
//   aios-starter-kit/reference/website-api-research/law.md

import type { SpecStudy } from './home-services'

export const lawSpec: SpecStudy = {
  intro:
    'Prestique builds AI intake and case-coordination systems for law firms — programmable voice agents wired into Clio, MyCase, PracticePanther, and Lawmatics so a missed call never costs a case.',

  problem: [
    'Law firms lose 35% or more of inbound calls to voicemail, missed rings, and after-hours gaps. In legal, every missed call is a case worth $5,000 to $50,000 walking out the door — personal injury, family, estate, criminal defense, immigration. The next firm on the Google results page picks up, and 75% of callers never call back.',
    'Front desks and paralegals are not the bottleneck — the bottleneck is that intake demands an instant, qualified, conflict-aware response at 2 PM Tuesday and 11 PM Saturday alike. Phone trees lose people. Forms convert at single digits. Voicemail is the worst possible first impression for someone who just had a car accident or got served papers.',
    'The fix is not "another receptionist service." The fix is a voice agent that picks up on the first ring, runs your intake script, triggers the conflict check, books the consultation on the right calendar, and lands a structured matter in the case management system before the caller hangs up — every time, day or night.',
  ],

  stack: [
    {
      tool: 'VAPI',
      role: 'Voice agent runtime',
      capabilities: [
        'Inbound calls answered by an assistant assigned to a phone number; routes by caller for repeat-caller detection',
        'Custom Tools call our backend mid-conversation for conflict checks and calendar lookups',
        'End-of-call report POSTs full transcript, recording URL, and summary the moment the call ends',
        'Anthropic Claude is a first-class provider — Sonnet and Opus 4.5/4.6 supported natively',
      ],
      docUrl: 'https://docs.vapi.ai/quickstart/phone',
    },
    {
      tool: 'Twilio',
      role: 'Phone number provisioning, SMS follow-up, A2P 10DLC compliance',
      capabilities: [
        'Programmable Voice statusCallback fires on initiated/ringing/answered/completed for missed-call derivation',
        'Inbound SMS webhook with From/To/Body for two-way text intake and consultation reminders',
        'A2P 10DLC registration via UsAppToPerson REST resource — required for US long-code SMS',
        'Imported numbers can be ported into VAPI for unified voice + SMS on the same line',
      ],
      docUrl: 'https://www.twilio.com/docs/voice/api/call-resource',
    },
    {
      tool: 'Clio (Manage + Grow)',
      role: 'Case management system of record — Grow handles intake leads; Manage holds matters, contacts, calendar, communications',
      capabilities: [
        'Clio Grow Lead Inbox accepts POST with first name, last name, email, phone, custom message, source — returns 201 Created',
        'Clio Manage exposes Contacts, Matters, Calendar Entries, Communications, Tasks, Activities, Documents',
        'Webhooks on created/updated/deleted across Contacts, Matters, Calendar, Communications, Tasks (HMAC-SHA256 signed)',
        'Matter-specific events: matter_opened, matter_pended, matter_closed for lifecycle automation',
      ],
      docUrl: 'https://docs.developers.clio.com/clio-manage/api-reference/',
    },
    {
      tool: 'MyCase',
      role: 'Alternative case management for firms on MyCase Advanced tier',
      capabilities: [
        'Open API (Advanced tier) exposes Cases, Persons, Companies, Leads, Events, Tasks, Documents, Notes',
        'Webhooks fire on Case/Event/Person/Lead/Company added or updated',
        'Documents can be created against a Case directly from intake artifacts (e.g., signed engagement letter)',
        'Client relationships on Cases support multi-party matter structures',
      ],
      docUrl: 'https://mycaseapi.stoplight.io/docs/mycase-api-documentation/k5xpc4jyhkom7-getting-started',
    },
    {
      tool: 'PracticePanther',
      role: 'Case management — REST + OData with rich custom-field coverage',
      capabilities: [
        'REST API covers Accounts, Contacts, Matters, Time Entries, Tasks, Events, Notes, Custom Fields',
        'Custom Fields surface as typed objects (boolean, date, number, string) for matter-specific intake data',
        'OData filtering ($filter, $orderby, created_since, updated_since) for incremental sync',
        'Official SDKs in Python, JavaScript, TypeScript, C#, PHP, Ruby',
      ],
      docUrl: 'https://support.practicepanther.com/en/articles/479897-practicepanther-api',
    },
    {
      tool: 'Lawmatics',
      role: 'Legal CRM and intake automation — drip campaigns, status pipelines, matter conversion',
      capabilities: [
        'OAuth REST API at api.lawmatics.com/v1 — matters, contacts, custom fields, custom forms, tasks',
        'Forms API lets an existing website form POST into Lawmatics so submissions auto-create a matter',
        'Matter creation triggers configured automations: drip emails, task assignment, status changes',
        'Matter Created and Matter Converted webhook events for downstream sync',
      ],
      docUrl: 'https://help.lawmatics.com/en/articles/10699983-lawmatics-open-api',
    },
  ],

  agentBehaviors: [
    {
      title: 'First-ring pickup with state-aware recording disclosure',
      description:
        "We answer every inbound call on the first ring with the firm's named greeting. Before any substantive conversation, the agent discloses that the call is being recorded for case-evaluation purposes — defaulted to all-party-consent language so it is compliant in California, Florida, Illinois, and the other 10 all-party states without per-state branching.",
      toolsInvolved: ['VAPI', 'Twilio'],
    },
    {
      title: 'Intake qualification by practice area',
      description:
        "We run a tailored intake script per practice area — PI, family, criminal, estate, immigration. The agent captures the facts the firm needs (incident date, opposing party, jurisdiction, statute-of-limitations red flags) and scores fit before booking time on an attorney's calendar.",
      toolsInvolved: ['VAPI', 'Clio', 'MyCase', 'PracticePanther', 'Lawmatics'],
    },
    {
      title: 'Conflict check trigger before booking',
      description:
        "Mid-call, the agent calls a custom tool that searches the firm's existing Contacts and Matters for the caller's name and the opposing party. If a potential conflict surfaces, the agent does not book the consultation — it captures the lead and routes it to a designated attorney for manual clearance.",
      toolsInvolved: ['VAPI', 'Clio', 'MyCase', 'PracticePanther'],
    },
    {
      title: "Consultation booking on the right attorney's calendar",
      description:
        "Once intake passes qualification and conflict check, we book directly into the assigned attorney's calendar — Clio Calendar Entries, MyCase Events, or PracticePanther Events depending on the firm's system. The booking lands as a confirmed event with the matter context attached, not a placeholder.",
      toolsInvolved: ['Clio', 'MyCase', 'PracticePanther', 'VAPI'],
    },
    {
      title: 'Structured matter creation in case management',
      description:
        'The end-of-call report fires the matter creation: Clio Grow Lead Inbox for Clio firms, Lawmatics matter API for Lawmatics-led intake, PracticePanther custom-field-rich matter for firms running custom intake schemas. Recording, transcript, and call summary all attach to the matter as Communications records.',
      toolsInvolved: ['Clio', 'Lawmatics', 'MyCase', 'PracticePanther', 'VAPI'],
    },
    {
      title: 'Retainer and document follow-up via SMS',
      description:
        'We send the engagement letter and retainer link via Twilio SMS within minutes of the call ending. Reminders fire at 24 hours and 72 hours if the document is not signed. When the signature comes back, we update the matter status — Lawmatics automation fires the next-step task for the attorney.',
      toolsInvolved: ['Twilio', 'Lawmatics', 'Clio'],
    },
    {
      title: 'Case-status proactive update for existing clients',
      description:
        'When an existing client calls in, we identify them from the contact database and route differently — recording is suppressed by default to protect privilege, and the agent answers status questions from matter notes and recent communications before offering to schedule time with the attorney.',
      toolsInvolved: ['VAPI', 'Clio', 'MyCase', 'PracticePanther'],
    },
  ],

  rollout: [
    {
      week: 1,
      title: 'Discovery, access, and number provisioning',
      tasks: [
        "Map the firm's practice areas, intake scripts, and conflict-check rules",
        'Kick off case-management API access — Clio OAuth app, MyCase Advanced tier confirmation, PracticePanther API request, or Lawmatics Developer Settings',
        'Start Twilio A2P 10DLC registration (10–15 day approval window — must start day one)',
        "Provision VAPI phone number or import the firm's existing main line via Twilio",
      ],
      tools: ['Twilio', 'VAPI', 'Clio', 'MyCase', 'PracticePanther', 'Lawmatics'],
      effortHours: '~12-16h',
    },
    {
      week: 2,
      title: 'Voice agent build with state-aware disclosure and conflict check',
      tasks: [
        'Author the intake script per practice area with explicit recording disclosure at call open',
        "Wire the conflict-check custom tool against the firm's Contacts/Matters API",
        'Build the calendar-availability custom tool against Clio / MyCase / PracticePanther events',
        'Configure Claude as the model provider in VAPI and tune the assistant prompt',
      ],
      tools: ['VAPI', 'Clio', 'MyCase', 'PracticePanther'],
      effortHours: '~16-20h',
    },
    {
      week: 3,
      title: 'Matter creation, automation, and retainer flow',
      tasks: [
        'Wire end-of-call webhook to create matters in Clio Grow / MyCase / PracticePanther / Lawmatics',
        'Attach call recording and transcript as a Communication on the matter',
        'Build the Twilio SMS retainer follow-up sequence with 24h and 72h reminders',
        'Configure Lawmatics or Clio automations for next-step attorney tasks',
      ],
      tools: ['Clio', 'MyCase', 'PracticePanther', 'Lawmatics', 'Twilio', 'VAPI'],
      effortHours: '~14-18h',
    },
    {
      week: 4,
      title: 'Live testing, attorney handoff, and launch',
      tasks: [
        "Run paired test calls across each practice area with the firm's intake lead",
        'Validate conflict-check edge cases (existing-client callback, opposing-party match)',
        'Train the firm on the matter inbox, daily intake digest, and override workflow',
        'Cut over the main line, monitor first 48 hours, tune the prompt based on real calls',
      ],
      tools: ['VAPI', 'Clio', 'MyCase', 'PracticePanther', 'Lawmatics', 'Twilio'],
      effortHours: '~10-14h',
    },
  ],

  impact: [
    {
      label: 'After-hours intake capture',
      before: '0% — voicemail',
      after: '24/7 first-ring pickup',
      source: '75% of callers go to the next firm on Google',
    },
    {
      label: 'Time from inbound call to booked consultation',
      before: '24-72 hours',
      after: 'Under 5 minutes',
      source: 'Booked on the call itself',
    },
    {
      label: 'Cost per missed-call recovery',
      before: '$5K-$50K case value walking out',
      after: 'Captured intakes routed to the right attorney',
      source: 'PI / family / estate average case value',
    },
    {
      label: 'Intake data quality landing in case management',
      before: 'Hand-typed notes, partial fields',
      after: 'Structured matter with custom fields + recording',
      source: 'End-of-call report → matter creation pipeline',
    },
  ],

  faqs: [
    {
      q: 'Does an AI voice agent count as the unauthorized practice of law?',
      a: "No — the agent gathers facts, runs intake, books consultations, and triggers conflict checks. It does not give legal advice, predict case outcomes, or quote on representation. The script is bounded to data collection and scheduling, with explicit hand-off language for any question that strays into legal advice. Every state's UPL rules permit non-lawyer intake under attorney supervision; we build to that line.",
    },
    {
      q: 'How does this work in California, Florida, Illinois, and other all-party-consent states?',
      a: 'The agent opens every call with explicit recording disclosure: "this call is being recorded for case-evaluation purposes — by continuing, you consent to recording." This satisfies all-party-consent requirements in California, Connecticut, Delaware, Florida, Illinois, Maryland, Massachusetts, Michigan, Montana, New Hampshire, Oregon, Pennsylvania, and Washington. Disclosure runs first; substantive intake only after. Continued conversation constitutes implied consent under federal precedent.',
    },
    {
      q: 'What about attorney-client privilege when an existing client calls?',
      a: 'When the agent identifies an inbound caller as an existing client of the firm, recording is suppressed by default and the call is routed differently — the agent answers status questions from the matter file and offers to schedule time with the attorney, with no transcript stored in third-party systems. The firm can opt in to record existing-client calls per matter if both sides consent.',
    },
    {
      q: 'Will this work with our case management system?',
      a: "Yes if you're on Clio (Manage + Grow), MyCase Advanced tier, PracticePanther, or Lawmatics — all four expose the REST APIs we need for matter creation, contacts, custom fields, and calendar booking. If you're on something else, we'll scope an integration in week one — we've done custom builds before.",
    },
    {
      q: 'How long until it is live?',
      a: 'Four weeks end to end if access is in hand. The blocker is almost always Twilio A2P 10DLC registration (10-15 day approval) and case-management API provisioning (manual at PracticePanther, Advanced-tier-only at MyCase). We start both day one of week one.',
    },
    {
      q: 'What does this cost the firm month over month?',
      a: 'Three line items — VAPI usage (per-minute on calls handled), Twilio usage (numbers + SMS), and our managed-service fee for prompt tuning, monitoring, and ongoing improvements. Versus the loaded cost of a 24/7 receptionist or the case value of even one missed PI call, it pays back inside the first month.',
    },
    {
      q: 'What happens if the agent misroutes a call or misses a conflict?',
      a: 'Every call lands a full transcript and recording on the matter — your team has the complete record. We build override paths into the script (caller can ask for a human at any point), surface every booked consultation to the assigned attorney for confirmation before the calendar invite goes out, and review the first 48 hours of live calls together to tune the prompt before stepping back.',
    },
  ],
}
