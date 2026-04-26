// Auto repair spec study — drives /auto-repair page content.
// Every capability claim cites the research fact sheet:
//   aios-starter-kit/reference/website-api-research/auto-repair.md

import type { SpecStudy } from './home-services'

export const autoRepairSpec: SpecStudy = {
  intro:
    'Prestique builds AI voice and messaging agents for auto repair shops on top of the shop management system already running the bays.',

  problem: [
    'A busy independent shop misses around half its calls at peak — bays full, advisors elbow-deep in a writeup, the phone ringing four times before voicemail picks up. Each missed call is $300 to $1,500 in service revenue walking to the shop down the street. The math compounds fast across a six-day week.',
    'Service advisors are the bottleneck by design. They are the only people in the building who can authorize work, quote labor, and check parts availability — and they are also the only people answering the phone. Techs are under cars, not on phones. Owners are quoting the next job, not picking up the line.',
    'Most shops paper over this with a missed-call texting tool or an after-hours service. Those buy back the easy calls. They do not handle a returning customer asking when the Tahoe will be ready, a new prospect asking whether the shop touches diesels, or an approval coming back on a $1,400 timing chain estimate. Those calls need shop context — RO status, vehicle history, parts ETA — pulled live.',
  ],

  stack: [
    {
      tool: 'Tekmetric',
      role: 'Cloud shop management — customers, vehicles, ROs, jobs, appointments',
      capabilities: [
        'OAuth 2.0 client credentials against shop.tekmetric.com (sandbox at sandbox.tekmetric.com)',
        'Read access to customers (search by name, email, phone), vehicles (VIN, plate, make/model), and full service history',
        'Repair orders filterable by status, date, customer, vehicle — with jobs, labor, parts, and technician assignment exposed',
        'Custom Webhooks deliver real-time appointment and RO events; without them, integrations fall back to hourly sync',
      ],
      docUrl: 'https://www.tekmetric.com/integrations/custom-webhooks',
    },
    {
      tool: 'AutoLeap',
      role: 'Cloud shop management — modern REST Partner API',
      capabilities: [
        'Token-based auth at partnerapi.myautoleap.com/v2 with refresh-token rotation',
        'Bulk CRUD on customers, vehicles, parts/tires, and inventory levels',
        'Repair Order creation with partial-success model, cascading tax resolution, and store-fee overrides',
        'Appointment Request endpoints for company- and location-scoped scheduling with date-range filtering',
      ],
      docUrl: 'https://developers.myautoleap.com/openapi',
    },
    {
      tool: 'Shop-Ware',
      role: 'Cloud shop management — partner integration via approved API program',
      capabilities: [
        'API Partner Integration program with established integrations across DVI, CRM, parts, and analytics partners',
        'Active partner roster includes Autoflow, AutoVitals, Broadly, Podium, PartsTech, Mitchell1, and MOTOR',
        'Two-way data flow confirmed through existing partner integrations',
      ],
      docUrl: 'https://shop-ware.com/partners/',
    },
    {
      tool: 'Mitchell 1 Manager SE / ShopKey SE',
      role: 'Established shop management — partner data API via Mitchell developer portal',
      capabilities: [
        'AppID + App Key authentication issued through the Mitchell 1 Developer Portal post-approval',
        'ProDemand Estimator integration for labor times, parts, fluids, and maintenance lookups',
        'Sandbox environment available for partner testing before production credentials are issued',
        'Approval window approximately two weeks from submission per the Mitchell 1 API request page',
      ],
      docUrl: 'https://developer.mitchell.com/apis/development-life-cycle',
    },
    {
      tool: 'R.O. Writer',
      role: 'Established shop management — partner integrations via R.O. Writer partner program',
      capabilities: [
        'Active partner ecosystem of 50+ integrations spanning accounting, CRM, parts, labor catalogs, and tires',
        'Two-way integration confirmed with at least one major DVI partner (AutoVitals)',
        'First-party Connect module exposes the customer/vehicle/RO data layer used by Prestique-style automation',
      ],
      docUrl: 'https://info.rowriter.com/software/integrations/',
    },
    {
      tool: 'VAPI + Twilio',
      role: 'Voice agent and SMS — customer-facing call handling',
      capabilities: [
        'VAPI inbound assistant on a Twilio-imported number, with Anthropic Claude as a first-class model provider',
        'VAPI Custom Tools call our backend mid-conversation for live RO status, vehicle history, and parts checks',
        'Twilio statusCallback events drive missed-call detection across multiple bays and advisors',
        'Twilio Programmable Messaging handles two-way SMS for status updates, estimate approvals, and pickup-ready alerts',
      ],
      docUrl: 'https://docs.vapi.ai/tools/custom-tools',
    },
  ],

  agentBehaviors: [
    {
      title: 'Vehicle intake by VIN and symptom',
      description:
        "When a new caller describes a problem, we capture year/make/model or pull it from VIN, log the symptoms in the caller's own words, and create the customer + vehicle records in the shop management system before the call ends.",
      toolsInvolved: ['VAPI', 'Tekmetric', 'AutoLeap'],
    },
    {
      title: 'Returning customer recognition',
      description:
        'For a known phone number, we look up the customer, list their vehicles, and surface the most recent RO so the agent can ask "calling about the 2018 Tahoe we saw last month?" instead of starting cold.',
      toolsInvolved: ['VAPI', 'Tekmetric', 'AutoLeap'],
    },
    {
      title: 'Service writeup handoff',
      description:
        'After a diagnostic intake, we draft the writeup — vehicle, complaint, requested service, customer contact preference — and either create the RO directly (AutoLeap) or stage it for the service advisor to confirm (Tekmetric, Shop-Ware, R.O. Writer, Mitchell 1).',
      toolsInvolved: ['AutoLeap', 'Tekmetric', 'Shop-Ware', 'R.O. Writer', 'Mitchell 1'],
    },
    {
      title: 'Estimate approval flow over SMS',
      description:
        'When the advisor finalizes an estimate, we text the customer a summary, accept "yes/no/call me" replies, and update the RO when they approve — so the advisor is not on the phone chasing approvals between bays.',
      toolsInvolved: ['Twilio', 'AutoLeap', 'Tekmetric'],
    },
    {
      title: 'Pre-pickup status updates',
      description:
        'The agent watches RO state changes through webhooks (Tekmetric custom webhooks, AutoLeap polling fallback) and texts the customer when their vehicle moves to "ready for pickup" — without an advisor making the call.',
      toolsInvolved: ['Tekmetric', 'AutoLeap', 'Twilio'],
    },
    {
      title: 'Post-service follow-up and review request',
      description:
        'Three days after pickup, we send a one-question follow-up SMS and, on a positive reply, drop the customer into a Google Business review prompt — automatically and only for satisfied customers.',
      toolsInvolved: ['Twilio', 'Tekmetric', 'AutoLeap'],
    },
    {
      title: 'After-hours overflow capture',
      description:
        'When the shop is closed or every advisor is on another line, the VAPI agent answers, captures intent (quote, status, new appointment, parts question), books the appointment slot directly when possible, and otherwise drops a structured handoff note into the queue.',
      toolsInvolved: ['VAPI', 'Twilio', 'Tekmetric', 'AutoLeap'],
    },
  ],

  rollout: [
    {
      week: 1,
      title: 'Discovery and shop-management hookup',
      tasks: [
        'Map call volume, peak hours, average revenue per call, and the current missed-call number from the phone provider',
        'Start the shop-management API access path: AutoLeap or Tekmetric credentials in days, Shop-Ware / Mitchell 1 / R.O. Writer partner approval starts in parallel',
        'Start A2P 10DLC brand and campaign registration in Twilio — 10–15 day approval window',
      ],
      tools: ['Tekmetric', 'AutoLeap', 'Twilio'],
      effortHours: '~8-12h',
    },
    {
      week: 2,
      title: 'Voice agent build',
      tasks: [
        "Provision the VAPI assistant with the shop's services, hours, advisor names, and tone",
        'Wire VAPI Custom Tools to the shop management API for RO status lookup, customer search, and vehicle history',
        "Import the shop's number into VAPI via Twilio import or run a parallel test number first",
      ],
      tools: ['VAPI', 'Twilio', 'Tekmetric', 'AutoLeap'],
      effortHours: '~10-14h',
    },
    {
      week: 3,
      title: 'SMS, status updates, and shadow mode',
      tasks: [
        'Light up two-way SMS once A2P approval lands, with ready-for-pickup and estimate-approval flows',
        'Run the agent in shadow mode — answering second after the advisors, logging what it would have said — so the team can audit before live cutover',
        'Set up the Telegram or Slack ping for handoff cases the agent escalates to a human',
      ],
      tools: ['Twilio', 'VAPI', 'Tekmetric', 'AutoLeap'],
      effortHours: '~8-10h',
    },
    {
      week: 4,
      title: 'Cutover, training, and tuning',
      tasks: [
        'Flip the agent to primary on inbound calls during peak hours and after hours, with advisor escalation paths tested',
        'Walk the service advisors through the daily review queue: missed-by-agent calls, low-confidence handoffs, and estimate-approval edge cases',
        'Tune prompts and tool call shape over the first week of production traffic',
      ],
      tools: ['VAPI', 'Twilio', 'Tekmetric', 'AutoLeap'],
      effortHours: '~6-10h',
    },
  ],

  impact: [
    {
      label: 'Missed call rate at peak',
      before: '~50%',
      after: '<5%',
      source: 'Twilio statusCallback reporting',
    },
    {
      label: 'Service revenue captured per missed call',
      before: '$0',
      after: '$300-1,500 service ticket retained',
      source: 'Per-call revenue benchmark from shop interviews',
    },
    {
      label: 'Advisor minutes/day on routine status calls',
      before: '60-90 min/advisor',
      after: '10-15 min',
      source: 'Tekmetric webhooks + Twilio outbound SMS',
    },
    {
      label: 'Time to estimate approval',
      before: '2-6 hours',
      after: 'Under 30 min median',
      source: 'Twilio Programmable Messaging webhooks',
    },
  ],

  faqs: [
    {
      q: 'Do we have to switch shop management systems?',
      a: 'No. We build to the system you already run. Tekmetric and AutoLeap have modern REST APIs we hook into directly. Shop-Ware, R.O. Writer, and Mitchell 1 Manager SE / ShopKey SE require partner approval — we start that on day one and route around it during the approval window.',
    },
    {
      q: 'Does the agent integrate with our parts catalog?',
      a: 'For real-time stock, we read inventory levels through your shop management API where it is exposed (AutoLeap inventoryLevels endpoint, Tekmetric inventory beta). For supplier catalogs (PartsTech, Worldpac, NAPA) we route those questions to the advisor — the API surface for live supplier pricing belongs to the catalog, not the shop.',
    },
    {
      q: 'How much does this cost to run?',
      a: 'A single shop typically lands in the $400-$800 per month range for VAPI minutes, Twilio voice and SMS, and the Anthropic model spend, before any Prestique build or retainer fee. The exact number depends on call volume.',
    },
    {
      q: 'When does it actually go live?',
      a: 'Four weeks from kickoff in most cases. The two gating items are A2P 10DLC SMS approval (10-15 days) and partner program approval if you are on Shop-Ware, R.O. Writer, or Mitchell 1 (typically two weeks). We start both on day one.',
    },
    {
      q: 'Will customers know they are talking to AI?',
      a: 'We disclose at the start of the call that the customer is talking to an automated assistant and that a human advisor is one transfer away. It performs better that way — callers stop testing it and start using it.',
    },
    {
      q: 'What about complex diagnostics over the phone?',
      a: "The agent does not diagnose. For anything past basic intake (year/make/model, symptoms, when it started, drivability), it books the customer in or hands off to an advisor. Diagnosis is a human job — the agent's job is to make sure the diagnostic appointment actually gets on the calendar.",
    },
    {
      q: 'What about customer data privacy in SMS?',
      a: 'VINs, plates, and detailed vehicle status are PII. We keep status messages sanitized in SMS and link out to a shop-side detail view when the customer wants more. Twilio message logs are configured for short retention and message redaction.',
    },
  ],
}
