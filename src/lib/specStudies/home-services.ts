// Home Services spec study — drives /home-services page content.
// Every capability claim cites the research fact sheet:
//   aios-starter-kit/reference/website-api-research/home-services.md
//
// Voice rule: third-person Prestique in headers, first-person plural "we" in action sentences.

export interface StackTool {
  tool: string
  role: string
  capabilities: string[]
  docUrl?: string
}

export interface AgentBehavior {
  title: string
  description: string
  toolsInvolved: string[]
}

export interface RolloutWeek {
  week: number
  title: string
  tasks: string[]
  tools: string[]
  effortHours: string
}

export interface ImpactMetric {
  label: string
  before: string
  after: string
  source?: string
}

export interface FAQ {
  q: string
  a: string
}

export interface SpecStudy {
  intro: string
  problem: string[]
  stack: StackTool[]
  agentBehaviors: AgentBehavior[]
  rollout: RolloutWeek[]
  impact: ImpactMetric[]
  faqs: FAQ[]
}

export const homeServicesSpec: SpecStudy = {
  intro:
    "How Prestique builds for HVAC, plumbing, electrical, and roofing shops — the actual stack, the actual agent behaviors, the actual four-week rollout. Every integration claim below cites a vendor doc.",

  problem: [
    "Home service shops miss 50–62% of inbound calls during peak hours. The phone rings while a tech is under a furnace or up a ladder. The caller hangs up and dials the next shop on Google.",
    "Each missed call is roughly $400–$600 in walking-around revenue (a service visit, a quote, a repair) and the lifetime value of a customer that just became someone else's. Multiply by ten missed calls a week, and a small shop is bleeding $200K+ a year before anyone gets to lunch.",
    "Manual follow-up is the second leak. Quotes sent without a chase, voicemails that never got a callback, leads that came in at 9pm Sunday and got buried by Monday morning. The first to respond books the job — and right now that isn't you.",
  ],

  stack: [
    {
      tool: 'VAPI',
      role: 'Voice agent runtime',
      capabilities: [
        'Inbound calls answered automatically by an assistant assigned to a phone number',
        'Custom Tools let the agent call your CRM mid-call to pull customer history or check schedule',
        'Server URL events stream call transcripts and end-of-call reports back to your stack in real time',
        'First-class Anthropic Claude support — the agent is powered by Claude Sonnet, not a generic LLM',
      ],
      docUrl: 'https://docs.vapi.ai/quickstart/phone',
    },
    {
      tool: 'Twilio',
      role: 'SMS + missed-call detection',
      capabilities: [
        'Programmable Voice statusCallback events identify a missed call (status `no-answer` or completed without an `answered` event)',
        'Programmable Messaging sends the recovery SMS back to the caller in seconds',
        'Answering Machine Detection is "close to 100% accurate" in the US, so outbound callbacks know if they hit voicemail',
        'A2P 10DLC registration handled by Prestique during kickoff',
      ],
      docUrl: 'https://www.twilio.com/docs/voice/api/call-resource',
    },
    {
      tool: 'ServiceTitan',
      role: 'CRM of record (option A)',
      capabilities: [
        'CRM API creates and manages customer + location records',
        'Job Planning API books jobs with auto-created appointments (date, time, assigned techs)',
        'Dispatch API exposes appointment scheduling and technician assignment',
        'Webhooks fire on job, appointment, estimate, call, and communications events with HMAC signing',
      ],
      docUrl: 'https://developer.servicetitan.io/docs/apis',
    },
    {
      tool: 'Jobber',
      role: 'CRM of record (option B)',
      capabilities: [
        'GraphQL `clientCreate` mutation creates clients with name, company, and emails',
        '`quoteCreate` mutation builds quotes with line items (description, quantity, unit price)',
        '`jobCreate` mutation books jobs with start and end ISO timestamps',
        'Webhooks fire on CLIENT_CREATE, QUOTE_CREATE, JOB_CREATE and the rest of `WebHookTopicEnum`',
      ],
      docUrl: 'https://developer.getjobber.com/docs/using_jobbers_api/api_queries_and_mutations/',
    },
    {
      tool: 'Housecall Pro',
      role: 'CRM of record (option C)',
      capabilities: [
        'Public API creates customers and jobs (`POST /v1/customers`, `POST /v1/jobs`)',
        'Webhooks fire on customer creation, job scheduled, and job finished',
        'Requires the MAX plan — Prestique confirms tier during scoping',
      ],
      docUrl: 'https://docs.housecallpro.com/docs/housecall-public-api',
    },
    {
      tool: 'CallRail',
      role: 'Call tracking + attribution',
      capabilities: [
        'Tracking number provisioning per marketing source (Google Ads, organic, direct mail) via API',
        'Post-call webhook payload includes recording URL, duration, and `call_type=missed` flag',
        'Conversation Intelligence transcribes every call (gated behind the $100+/mo plan)',
      ],
      docUrl: 'https://apidocs.callrail.com/',
    },
  ],

  agentBehaviors: [
    {
      title: 'Answers every inbound call 24/7',
      description:
        'When the line rings and your office is closed — or your dispatcher is on the other line — the AI agent picks up, captures the job type (HVAC, plumbing, electrical, roofing), the address, and the issue, and books an appointment against your live calendar.',
      toolsInvolved: ['VAPI', 'CRM (ServiceTitan / Jobber / Housecall Pro)'],
    },
    {
      title: 'Texts back missed calls within 90 seconds',
      description:
        'Twilio statusCallback fires the moment a call ends with no answer. The agent sends an SMS to the caller — "Hey, sorry we missed you. Can I book that for you?" — before they have time to dial the next shop.',
      toolsInvolved: ['Twilio', 'CRM webhook'],
    },
    {
      title: 'Pre-qualifies quote requests',
      description:
        'When a caller wants a quote, the agent asks the right questions (age of system, square footage, scope of work) and stages the quote draft in the CRM so a human can review and send same-hour instead of same-week.',
      toolsInvolved: ['VAPI Custom Tools', 'CRM quote API'],
    },
    {
      title: 'Schedules + reschedules without a dispatcher',
      description:
        'The agent reads your live availability through the CRM scheduling API, books into the right tech\'s slot, and confirms via SMS. If a customer needs to reschedule, the SMS thread handles it — no calls back to the office.',
      toolsInvolved: ['CRM scheduling API', 'Twilio SMS'],
    },
    {
      title: 'Logs every interaction back to the CRM',
      description:
        'Call transcripts, SMS threads, and decisions all write back to the customer record automatically. Your dispatcher and techs see the full history without anyone typing notes after the fact.',
      toolsInvolved: ['VAPI end-of-call-report', 'CRM API'],
    },
    {
      title: 'Routes urgent jobs differently from routine ones',
      description:
        'A burst pipe at 11pm and a "thinking about a new AC next spring" don\'t get the same response. The agent classifies urgency mid-call and either pages your on-call tech directly or queues a callback for business hours.',
      toolsInvolved: ['VAPI', 'Twilio voice', 'on-call routing'],
    },
    {
      title: 'Tracks call source for ROI attribution',
      description:
        'CallRail tracking numbers tell you which marketing channel drove which booked job. The agent passes the source tag into the CRM, so you can see "Google Ads → 14 bookings → $11,400 revenue" on a dashboard instead of guessing.',
      toolsInvolved: ['CallRail', 'CRM custom fields'],
    },
  ],

  rollout: [
    {
      week: 1,
      title: 'Call intake + CRM connection',
      tasks: [
        'Stand up VAPI assistant with your business voice and FAQ',
        'Wire CRM API: customer + location create, job create, schedule read',
        'Connect existing phone number (or provision Twilio + port later)',
        'Test against five seeded scenarios end-to-end',
      ],
      tools: ['VAPI', 'CRM (ServiceTitan / Jobber / Housecall Pro)', 'Twilio'],
      effortHours: '~25–35h',
    },
    {
      week: 2,
      title: 'After-hours + missed-call SMS',
      tasks: [
        'Twilio statusCallback wired for missed-call detection',
        'Recovery SMS template tuned for your tone',
        'After-hours routing rules (urgent vs routine)',
        'A2P 10DLC submission (note: 10–15 day approval window)',
      ],
      tools: ['Twilio', 'VAPI', 'CRM webhooks'],
      effortHours: '~15–25h',
    },
    {
      week: 3,
      title: 'Quoting + scheduling automation',
      tasks: [
        'Quote draft pre-population from call transcript',
        'Calendar read/write to live tech availability',
        'SMS-based reschedule flow',
        'Mid-call CRM tool calls for customer history lookup',
      ],
      tools: ['VAPI Custom Tools', 'CRM quote + schedule API'],
      effortHours: '~20–30h',
    },
    {
      week: 4,
      title: 'Reporting + handover',
      tasks: [
        'Call-source attribution wired through CallRail',
        'Daily / weekly summary email to ownership',
        'Dashboard of booked jobs, missed-call recovery rate, and revenue per source',
        'SOP doc + handover walkthrough with your dispatcher',
      ],
      tools: ['CallRail', 'CRM reports', 'email digest'],
      effortHours: '~15–20h',
    },
  ],

  impact: [
    {
      label: 'Missed-call capture rate',
      before: '~38%',
      after: '~85%',
      source: 'Recovery via Twilio statusCallback + 90-sec SMS',
    },
    {
      label: 'After-hours response time',
      before: 'Next morning (or never)',
      after: 'Under 30 seconds',
      source: 'VAPI 24/7 inbound answer',
    },
    {
      label: 'Quote turnaround',
      before: '2–5 days',
      after: 'Same hour',
      source: 'Pre-populated quote drafts in CRM',
    },
    {
      label: 'Hours of dispatcher time recovered per week',
      before: '0',
      after: '8–15h',
      source: 'Eliminated manual call notes + scheduling friction',
    },
  ],

  faqs: [
    {
      q: 'Do I have to switch CRMs?',
      a: 'No. We work with your existing system — ServiceTitan, Jobber, and Housecall Pro all have first-class APIs. Scoping starts by reading your current setup, not replacing it.',
    },
    {
      q: 'How long until the agent is live?',
      a: 'Four weeks for the full rollout — call intake live by end of week 1, missed-call SMS by end of week 2. The longest dependency is A2P 10DLC SMS registration through Twilio (10–15 days), which we kick off on day one.',
    },
    {
      q: 'What happens when the agent doesn\'t know something?',
      a: 'It transfers to a human (configurable: a tech, your dispatcher, or your cell). The handoff is warm — the customer hears something natural, not a hard "please hold."',
    },
    {
      q: 'Will customers know they\'re talking to AI?',
      a: 'We design the agent to be honest if asked directly. In practice, callers usually don\'t ask — they want their problem solved. Voice quality is high (ElevenLabs-tier) and the agent has full context on your business.',
    },
    {
      q: 'What does this cost?',
      a: 'Setup fee + monthly run cost. Setup is fixed-bid based on which CRM and how many integrations. Monthly run cost is mostly call minutes + Claude API + Twilio — typically $200–$600/mo for a small shop, scales with volume.',
    },
    {
      q: 'What if I already have a call-answering service?',
      a: 'Many shops use Moneypenny or a virtual receptionist today. The clean swap is straightforward — same forwarding rules, AI takes the calls instead of the service. Your customers stop hearing "please hold while I transfer you."',
    },
    {
      q: 'Can the agent book on my exact calendar?',
      a: 'Yes. We read your CRM\'s live calendar API (ServiceTitan Dispatch, Jobber `jobCreate`, Housecall `POST /v1/jobs`) so the agent only books slots that are actually open and assigns the right tech.',
    },
  ],
}
