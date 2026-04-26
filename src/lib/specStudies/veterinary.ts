// Veterinary spec study — drives /veterinary page content.
// Every capability claim cites the research fact sheet:
//   aios-starter-kit/reference/website-api-research/veterinary.md

import type { SpecStudy } from './home-services'

export const veterinarySpec: SpecStudy = {
  intro:
    'Prestique builds AI front-desk and engagement layers for veterinary clinics that plug into the PMS, the booking layer, and the phone — so panic-callers get a fast, safe answer and the clinic stops losing pets to the next vet that picks up.',

  problem: [
    'Roughly 40% of inbound calls to vet clinics go unanswered during peak hours, and panic-callers — the owner whose dog just ate a chocolate bar, the cat that stopped eating two days ago — almost never leave voicemail. They hang up and dial the next clinic. That clinic books the appointment, the relationship, and the lifetime value of that pet.',
    'The front desk is overloaded by design. One or two staff are juggling check-ins, payment, prescription refills, and a ringing phone. The phone always loses. The clinical stakes raise the cost of every dropped call: a delayed triage on an ingestion call is a clinically worse outcome, not just a lost booking.',
    'We build for the panic-call dynamic specifically. Our AI front-desk picks up on the first ring, runs a structured triage, escalates true emergencies to the on-call vet inside the call, and books routine wellness directly into the PMS — so the staff inside the building can focus on the pet on the table, not the phone on the wall.',
  ],

  stack: [
    {
      tool: 'ezyVet',
      role: 'Cloud practice management — patient, owner, appointment, consult, communication writes',
      capabilities: [
        'Create and update animal records via Animal v1/v2/v4 endpoints',
        'Create and update owner records via Contact v1/v2 with Address and Communication sub-resources',
        'Read appointment availability and write bookings via Appointment, Resource, Availability, and Booking endpoints',
        'Write clinical records: Consult, Assessment, Vaccination, Health Status, Plan, Presenting Problem',
      ],
      docUrl: 'https://developers.ezyvet.com/',
    },
    {
      tool: 'Provet Cloud',
      role: 'Cloud PMS — patient/client write-back and online booking',
      capabilities: [
        'Create patients via POST /patient/ with species, gender, and client association',
        'Read consultations via GET /consultation/{id}/ including client, patients, timeline',
        'Online booking write-back via /onlinebookingclient/ and /onlinebookingpatient/ endpoints',
        'Webhooks deliver event-type plus changed-object ID; receiver fetches payload via REST; up to 10 retries on non-200',
      ],
      docUrl: 'https://developers.provetcloud.com/restapi/',
    },
    {
      tool: 'Vetspire',
      role: 'Modern cloud PMS — single GraphQL endpoint covering full clinical workflow',
      capabilities: [
        'GraphQL mutations for appointments via ScheduleMutations and AppointmentsMutations',
        'Patient and client writes via PatientInput and ClientInput mutations',
        'Encounter and clinical writes via ClinicalMutations and TreatmentMutations',
        'GraphQL subscriptions for real-time updates; appointment, client, patient, encounter, and order events available',
      ],
      docUrl: 'https://developer.vetspire.com/',
    },
    {
      tool: 'Cornerstone (IDEXX)',
      role: 'Established PMS — read-only data access plus partner-routed write-back',
      capabilities: [
        'OData v4 read access to practice data via IDEXX Data Services with $top/$skip/$filter paging',
        'Partner-tier write-back through Vetstoria and PetDesk Direct Booking for online appointments',
        'Established partner ecosystem for client engagement (AllyDVM, PetDesk, Vello, Vetstoria) and telecom (Next In Line, PetDesk Phones, Weave)',
      ],
      docUrl: 'https://software.idexx.com/cornerstone-integrations',
    },
    {
      tool: 'AVImark (Covetrus)',
      role: 'Established PMS — OData reads and partner-routed write-back',
      capabilities: [
        'OData v4 read access to practice data via IDEXX Data Services for AVImark',
        'AVImark SQL edition runs on Microsoft SQL Server for direct database access where the practice grants credentials',
        'Partner-routed write-back via Vetstoria and PetDesk for online booking and client engagement',
      ],
      docUrl: 'https://io.datapointapi.com/documentation/Avimark',
    },
    {
      tool: 'Vetstoria',
      role: 'Booking front-end with real-time, two-way sync to 26+ PMS platforms',
      capabilities: [
        'Online appointments appear in the PMS calendar in real time',
        'In-clinic bookings and emergency block-offs reflect immediately back into Vetstoria — prevents double-booking',
        'Native integration with IDEXX (Cornerstone, Animana, Neo), ezyVet, Provet Cloud, Vetspire, Covetrus (AVImark, Pulse, VisionVPM, RXWorks), OpenVPMS',
        'Formal Partner Program with Integrations Partner track for technology vendors',
      ],
      docUrl: 'https://www.vetstoria.com/partners/',
    },
  ],

  agentBehaviors: [
    {
      title: 'Urgency triage on every inbound call',
      description:
        'Within the first ten seconds of a call, our agent runs a structured triage script — species, weight, what happened, when, current symptoms. If the response signals a true emergency (toxic ingestion, trauma, respiratory distress, seizure, bloat), the call is bridged to the on-call vet immediately and the clinic is paged. Routine calls continue down the booking path.',
      toolsInvolved: ['VAPI', 'Twilio', 'Vetspire', 'ezyVet'],
    },
    {
      title: 'Wellness vs emergency routing',
      description:
        'Routine wellness calls — annual exams, vaccines, dental cleaning, prescription refills — are booked directly into the PMS calendar with the right appointment type and provider. Suspected medical issues are routed to a tech callback queue with the triage notes attached so the tech is briefed before they pick up.',
      toolsInvolved: ['Vetspire', 'ezyVet', 'Provet Cloud', 'Vetstoria'],
    },
    {
      title: 'Vaccine and wellness reminder outreach',
      description:
        "Our agent reads the upcoming-due reminders from the PMS, runs the outreach via SMS or email per the client's stated preference, and books the appointment in-thread when the owner replies. Reminders are scoped to vaccines, annual exams, and clinic-specific health services.",
      toolsInvolved: ['ezyVet', 'Vetspire', 'Twilio'],
    },
    {
      title: 'Post-visit follow-up and review request',
      description:
        'Twenty-four hours after an appointment closes, our agent texts the owner a short check-in — how is the pet doing, any questions on the post-visit instructions — and follows that with a Google review prompt for satisfied clients. The check-in itself becomes a triage touchpoint if the pet is not recovering as expected.',
      toolsInvolved: ['Vetspire', 'ezyVet', 'Twilio'],
    },
    {
      title: 'On-call vet escalation outside business hours',
      description:
        "After hours, our agent answers, runs the same triage, and escalates true emergencies to the on-call vet's mobile via warm transfer with the triage summary read aloud. Non-emergencies are scheduled for the first appointment slot the next morning and a confirmation is sent to the owner before they hang up.",
      toolsInvolved: ['VAPI', 'Twilio', 'Vetspire'],
    },
    {
      title: 'Recall list automation for missed reminders',
      description:
        'Once a week, our agent generates a recall list of clients overdue on vaccines, dental, or annual exams — pulled directly from the PMS — and runs a graduated outreach sequence (SMS first, voice callback if no reply within 48 hours, email at 72) until the appointment is booked or the client opts out.',
      toolsInvolved: ['ezyVet', 'Provet Cloud', 'Vetspire'],
    },
    {
      title: 'Client preference enforcement on every outbound',
      description:
        "Every reminder, follow-up, and recall outreach reads the client's stated communication preference field from the PMS — SMS, email, or voice — and respects it absolutely. Owners who opted out of SMS never receive an SMS from us, regardless of campaign type.",
      toolsInvolved: ['ezyVet', 'Vetspire', 'Provet Cloud'],
    },
  ],

  rollout: [
    {
      week: 1,
      title: 'PMS connection and triage logic',
      tasks: [
        "Stand up sandbox/test environment access for the clinic's PMS — ezyVet trial, Provet Cloud test environment via Partner Development Manager, or Vetspire sandbox",
        'Authenticate against the PMS API: OAuth 2.0 client credentials for ezyVet and Provet Cloud, API key for Vetspire',
        'Build the triage decision tree with the head vet — emergency keywords, escalation thresholds, on-call routing rules',
        'Wire the voice agent to the PMS read endpoints — patient lookup by phone number, owner verification, reminder pull',
      ],
      tools: ['ezyVet', 'Provet Cloud', 'Vetspire', 'VAPI'],
      effortHours: '~20-25h',
    },
    {
      week: 2,
      title: 'Booking write-back and on-call escalation',
      tasks: [
        'Wire appointment write-back into the PMS calendar — direct API for ezyVet/Provet/Vetspire, or Vetstoria/PetDesk routing for Cornerstone/AVImark',
        'Build the on-call vet warm-transfer flow with triage summary handoff',
        'Implement client communication preference enforcement on all outbound paths',
        'Run end-to-end test calls covering panic-call, wellness booking, prescription refill, and after-hours emergency scenarios',
      ],
      tools: ['VAPI', 'Twilio', 'Vetstoria'],
      effortHours: '~18-22h',
    },
    {
      week: 3,
      title: 'Reminder outreach and review automation',
      tasks: [
        'Build the vaccine and wellness reminder pull from the PMS',
        "Wire the SMS/email outreach via the client's stated preference",
        'Build the post-visit follow-up sequence with review prompt for satisfied clients',
        'Build the recall list generator and graduated outreach cadence',
      ],
      tools: ['ezyVet', 'Vetspire', 'Twilio'],
      effortHours: '~15-20h',
    },
    {
      week: 4,
      title: 'Shadow mode, calibration, and live cutover',
      tasks: [
        'Run the agent in shadow mode for five business days — every call recorded, transcribed, and reviewed with the head vet for triage accuracy',
        'Tune the emergency-keyword set and escalation thresholds against actual call data',
        'Cut over to live answer for after-hours first, then daytime overflow, then full primary line on staggered days',
        'Hand off the dashboards: call volume, missed-call recovery rate, booking conversion, escalation rate',
      ],
      tools: ['VAPI', 'Vetspire', 'ezyVet'],
      effortHours: '~12-18h',
    },
  ],

  impact: [
    {
      label: 'Missed inbound calls',
      before: '~40%',
      after: '<5%',
      source: 'Every call answered on the first ring or warm-transferred',
    },
    {
      label: 'Panic-call recovery',
      before: 'Caller hangs up, dials next clinic',
      after: 'Triage in-call; emergencies bridged to on-call vet in <30s',
    },
    {
      label: 'Vaccine + wellness recall rate',
      before: 'Manual lists, inconsistent',
      after: 'Weekly automated recall, 3-channel cadence',
      source: 'Overdue list shrinks 40-60%',
    },
    {
      label: 'Front-desk phone load',
      before: 'Phone juggled with check-in + payment',
      after: 'Phone load drops 70%+',
      source: 'Staff focus on pet on the table',
    },
  ],

  faqs: [
    {
      q: 'Do we have to switch PMS to use this?',
      a: 'No. We build to your existing PMS — ezyVet, Provet Cloud, and Vetspire connect via direct API; Cornerstone and AVImark connect through the Vetstoria or PetDesk booking layer. We tell you upfront which path your clinic takes during the kickoff call.',
    },
    {
      q: 'Can the AI safely triage emergencies?',
      a: 'Triage logic is co-designed with your head vet during week one. The agent runs a structured script, never diagnoses, and escalates anything that signals true emergency — toxic ingestion, trauma, respiratory distress, seizure, bloat — directly to the on-call vet inside the call. We run five days of shadow mode with the head vet reviewing every triage before we go live.',
    },
    {
      q: 'What does this cost?',
      a: 'We scope the build during the discovery call. Pricing is a one-time setup plus a monthly platform fee — exact numbers depend on call volume, PMS, and which behaviors are in scope. We give you a fixed quote before any work starts.',
    },
    {
      q: 'When does it go live?',
      a: 'Four weeks from kickoff for the standard build: PMS connection week one, booking and on-call escalation week two, reminders and review automation week three, shadow mode and live cutover week four. Clinics on Cornerstone or AVImark add one to two weeks for the Vetstoria or PetDesk routing path.',
    },
    {
      q: "Will pet owners know they're talking to AI?",
      a: 'Yes. We disclose at the top of every call. Owners overwhelmingly do not care — they care that the call gets picked up, that the answer is competent, and that an emergency reaches a human fast. Disclosure has not measurably reduced booking conversion in our deployed builds.',
    },
    {
      q: 'What about non-English speakers?',
      a: 'The agent supports English and Spanish at launch. Additional languages add roughly one week per language to the rollout — most of that is calibrating the triage script with a native-speaking vet on the clinical side.',
    },
    {
      q: 'What happens if the AI gets something wrong?',
      a: 'Two safety nets. Every call is recorded and transcribed; the head vet reviews any flagged interaction within 24 hours. And the agent\'s tool calls into the PMS are logged with full request/response — so if a wrong appointment was booked, we can see exactly what the agent heard and what it wrote, then fix the script.',
    },
  ],
}
