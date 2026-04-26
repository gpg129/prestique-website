// Dental spec study — drives /dental page content.
// Every capability claim cites the research fact sheet:
//   aios-starter-kit/reference/website-api-research/dental.md

import type { SpecStudy } from './home-services'

export const dentalSpec: SpecStudy = {
  intro:
    "Prestique builds AI front-office systems for dental practices that answer every call, book appointments straight into the PMS, and run on a HIPAA-covered stack from voice agent to SMS to EHR write-back.",

  problem: [
    "Dental practices miss roughly 38% of inbound calls, and each empty operatory chair costs $200 to $500 in margin. The phone rings during cleanings, during checkout, during lunch, and after hours — and most of those callers never call back. They book with the practice across town who picked up.",
    "The standard answer is a part-time receptionist or a generic answering service. Neither knows your appointment book, neither verifies insurance, and neither can write a confirmed appointment back into Dentrix or Open Dental in real time. So the front desk inherits a stack of pink slips at 9 a.m. and the no-show rate stays parked at 12-15%.",
    "We replace that with a voice agent that answers every call within two rings, checks live availability through the PMS, books the appointment, sends a HIPAA-compliant SMS confirmation, and follows up the day before. Every component is covered by a Business Associate Agreement before a single real patient calls in.",
  ],

  stack: [
    {
      tool: 'VAPI',
      role: 'Voice agent runtime',
      capabilities: [
        'Answers inbound calls automatically with a Claude-powered assistant',
        'Streams call-started, transcript, function-call, and end-of-call-report events to our backend',
        'Calls our scheduling backend mid-call via Custom Tools to check live PMS availability',
        'Runs in HIPAA mode (compliancePlan.hipaaEnabled) — calls, recordings, and transcripts are not stored by Vapi',
      ],
      docUrl: 'https://docs.vapi.ai/security-and-privacy/hipaa',
    },
    {
      tool: 'Twilio',
      role: 'Phone numbers and SMS transport',
      capabilities: [
        "Programmable Voice, SMS, and MMS are HIPAA-eligible products under Twilio's BAA",
        'Provides the phone number layer that VAPI imports for inbound routing',
        'Sends appointment confirmations and reminders via Programmable Messaging',
        'Status callbacks fire on initiated, ringing, answered, completed — used to detect missed calls',
      ],
      docUrl: 'https://www.twilio.com/en-us/hipaa',
    },
    {
      tool: 'NexHealth Synchronizer',
      role: 'PMS write-back layer',
      capabilities: [
        'Single bearer-token API connecting to Dentrix, Dentrix Ascend, Eaglesoft, Open Dental, and 12+ other PMS systems',
        'POST /appointments writes confirmed bookings back into the underlying EHR asynchronously',
        'Webhook events including appointment_insertion, appointment_created, patient_created, patient_updated for two-way sync',
        'HMAC-SHA256 signed webhook payloads with 48-hour automatic retry on failed delivery',
      ],
      docUrl: 'https://docs.nexhealth.com/reference/introduction',
    },
    {
      tool: 'Open Dental API',
      role: 'Direct PMS integration (when practice runs Open Dental)',
      capabilities: [
        'REST API at api.opendental.com/api/v1/ exposes Patients, Appointments, Recalls, Commlogs, Procedures, Claims, Providers, Insurance plans',
        'Two-key authentication (DeveloperKey + per-office CustomerKey) keeps each practice data scoped',
        'Standard CRUD on every resource — write appointments, update patient records, create commlog entries',
        'BAA between integrator and practice is explicitly required by Open Dental before handling PHI',
      ],
      docUrl: 'https://www.opendental.com/site/apispecification.html',
    },
    {
      tool: 'Sikka ONE API',
      role: 'Multi-PMS gateway (Dentrix, Eaglesoft, and 400+ others)',
      capabilities: [
        '140+ endpoints over patients, appointments, claims, payments, procedures across Dentrix, Eaglesoft, Planet DDS/Denticon, MoGo, PracticeWorks',
        'Payment Writeback API posts payments back into the underlying PMS',
        'Per-office request_key tied to office_id keeps tenant data isolated',
        'Two-factor authentication enforced via the Sikka Utility installer at each practice',
      ],
      docUrl: 'https://help.sikka.ai/what-is-sikka-api',
    },
    {
      tool: 'Weave',
      role: 'Coexistence layer when practice already runs Weave',
      capabilities: [
        'Multi-channel patient communications: VoIP phone, two-way SMS, bulk text/email, voicemail transcription',
        'Online scheduling requests, automated reminders, text-to-confirm appointments',
        'Authorized Henry Schein One API Exchange integration vendor — direct Dentrix integration available through Weave',
        'Call Intelligence with patient-sentiment analysis on recorded calls',
      ],
      docUrl: 'https://www.getweave.com/integrations/',
    },
  ],

  agentBehaviors: [
    {
      title: 'Live availability lookup mid-call',
      description:
        'When a patient asks for an appointment, the agent calls our backend through a VAPI Custom Tool, which queries the PMS for real availability and reads back open slots while the caller is still on the line.',
      toolsInvolved: ['VAPI', 'NexHealth Synchronizer', 'Open Dental API', 'Sikka ONE API'],
    },
    {
      title: 'Direct PMS write-back',
      description:
        "Once the patient picks a slot, we write the confirmed appointment into the practice management system and wait for the appointment_insertion webhook before telling the caller it's confirmed.",
      toolsInvolved: ['NexHealth Synchronizer', 'Open Dental API'],
    },
    {
      title: 'Insurance capture and verification handoff',
      description:
        'We capture insurance carrier, member ID, and group number on the call, write them to the patient record, and queue a verification task for the front desk before the appointment.',
      toolsInvolved: ['VAPI', 'NexHealth Synchronizer', 'Open Dental API'],
    },
    {
      title: 'Recall list outreach',
      description:
        'Each morning we pull the recall list from the PMS and send HIPAA-compliant SMS reminders to patients overdue for hygiene or perio maintenance, with a one-tap reply to book.',
      toolsInvolved: ['Open Dental API', 'NexHealth Synchronizer', 'Twilio'],
    },
    {
      title: 'No-show recovery loop',
      description:
        'When the schedule has gaps within 48 hours, we text the recall and waitlist pools with the open slot, take the first confirmation, and write it back into the PMS automatically.',
      toolsInvolved: ['Twilio', 'NexHealth Synchronizer', 'VAPI'],
    },
    {
      title: 'After-hours triage',
      description:
        'Calls outside office hours are answered, triaged for emergency vs routine, and either escalated to the on-call dentist via SMS or scheduled for the next available appointment.',
      toolsInvolved: ['VAPI', 'Twilio'],
    },
    {
      title: 'Hygiene reminder cadence',
      description:
        'Patients with confirmed appointments get an SMS three days out, a confirmation request 24 hours out, and a same-day reminder — all status-tracked via Twilio delivery callbacks.',
      toolsInvolved: ['Twilio', 'NexHealth Synchronizer'],
    },
  ],

  rollout: [
    {
      week: 1,
      title: 'Discovery and BAA execution',
      tasks: [
        'Sign BAAs with VAPI (security@vapi.ai), Twilio (Security or Enterprise Edition required), and the practice itself',
        'Confirm PMS, version, and integration path (NexHealth, Sikka, or direct Open Dental)',
        'Provision Twilio account on Security/Enterprise Edition, kick off A2P 10DLC brand and campaign registration (10-15 day approval window)',
        'Map current call patterns: peak times, average missed-call rate, top reasons for inbound',
      ],
      tools: ['VAPI', 'Twilio'],
      effortHours: '~12-16h',
    },
    {
      week: 2,
      title: 'PMS integration and scheduling logic',
      tasks: [
        'Stand up NexHealth subdomain or Open Dental developer/customer key pair, run end-to-end test bookings against a sandbox',
        'Implement availability lookup, appointment write, and webhook handler for appointment_insertion',
        'Define operatory and provider mapping rules so the agent only books slots the practice actually wants exposed',
        'Wire VAPI Custom Tools to the scheduling backend with toolCallId-keyed responses',
      ],
      tools: ['NexHealth Synchronizer', 'Open Dental API', 'VAPI'],
      effortHours: '~20-28h',
    },
    {
      week: 3,
      title: 'Agent training and SMS layer',
      tasks: [
        'Build the Claude-powered assistant prompt covering booking, insurance capture, after-hours triage, and emergency escalation',
        'Configure Twilio Programmable Messaging for confirmations, day-before reminders, and recall reach-outs once 10DLC is approved',
        "Run shadow-mode calls — agent listens but doesn't act — to validate transcript quality and tool-call correctness",
        'Tighten edge cases: noisy lines, accents, multi-patient households, transfer-to-human triggers',
      ],
      tools: ['VAPI', 'Twilio', 'NexHealth Synchronizer'],
      effortHours: '~16-24h',
    },
    {
      week: 4,
      title: 'Go-live and tuning',
      tasks: [
        "Cut over the practice's main number to VAPI; keep a fallback path to a human for the first week",
        'Monitor end-of-call-report events daily, review every call where the agent transferred or failed to book',
        'Stand up the daily recall list job and the no-show recovery loop',
        'Hand off the dashboard so the front desk can see calls, bookings, and confirmations in real time',
      ],
      tools: ['VAPI', 'Twilio', 'NexHealth Synchronizer'],
      effortHours: '~10-14h',
    },
  ],

  impact: [
    {
      label: 'Missed-call rate',
      before: '~38%',
      after: '<2%',
      source: 'Agent answers every call within two rings',
    },
    {
      label: 'After-hours bookings',
      before: 'Voicemail only',
      after: 'Booked into PMS overnight',
      source: '24/7 VAPI inbound + NexHealth write-back',
    },
    {
      label: 'No-show rate',
      before: '12-15%',
      after: '5-8%',
      source: 'Multi-touch SMS reminder cadence + same-day confirmations',
    },
    {
      label: 'Empty-chair recovery',
      before: '$200-500 lost per slot',
      after: '60%+ filled within 48h',
      source: 'Open slots auto-texted to recall + waitlist pools',
    },
  ],

  faqs: [
    {
      q: 'Is this HIPAA-compliant?',
      a: "Yes, when configured correctly. We sign BAAs with VAPI, Twilio (Security or Enterprise Edition), and your practice before any real patient calls in. VAPI runs in HIPAA mode so calls and transcripts are not stored on their side. Every component in the stack is BAA-covered before go-live — that's a hard kickoff requirement, not a post-launch cleanup.",
    },
    {
      q: 'Do I have to switch my PMS?',
      a: "No. We integrate with what you already run. Dentrix, Dentrix Ascend, Eaglesoft, and Open Dental are all directly supported through NexHealth's Synchronizer, and Sikka covers another 400+ systems. If you run something we haven't seen before, we'll confirm the integration path before kickoff.",
    },
    {
      q: 'What does it cost?',
      a: "There's a one-time build fee and a monthly run fee. The big variables are VAPI (with the HIPAA add-on at around $1,000/month on standard plans, or bundled into Enterprise contracts), Twilio voice and SMS usage, and the PMS gateway subscription. We size the actual numbers in the proposal once we know your call volume.",
    },
    {
      q: 'How long until it is live?',
      a: "Four weeks end-to-end. Week one is BAAs and discovery, week two is PMS integration, week three is agent training and SMS, week four is cutover and tuning. The one external dependency that can stretch this is A2P 10DLC SMS registration, which Twilio's carrier process currently runs 10-15 days through TCR.",
    },
    {
      q: "Will patients know they're talking to AI?",
      a: "We're upfront about it in the greeting. Patients hear a natural-sounding voice that handles the call cleanly, books their appointment, and transfers to a human anytime they ask or when the situation calls for it (clinical questions, complex insurance issues, emergencies).",
    },
    {
      q: "What happens if the agent can't handle a call?",
      a: 'It transfers. We configure clear escalation rules — emergencies, clinical questions, anything outside the booking and reschedule flow — and the call routes to your team or your on-call dentist via SMS. Every transferred call is logged in the daily report so you can see what is escalating and why.',
    },
    {
      q: 'Does this replace my front desk?',
      a: 'No. It removes the phone load so your front desk can do the work that actually needs a human — patients in the chair, insurance follow-up, treatment planning conversations. Most practices we build for keep their team and just stop missing calls.',
    },
  ],
}
