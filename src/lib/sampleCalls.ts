// Illustrative sample calls for the hero cards (homepage tabs + each industry hero).
// Every call may only show behaviour its spec study (src/lib/specStudies/*) already
// describes, phrased conservatively: no direct writes into a shop system, no clinical,
// legal or veterinary advice, no prices. Cards name a KIND of business, never a business name: invented names
// kept colliding with real companies in the same trade. Rendered with a
// "Sample call · illustrative" label.

export interface SampleCallTurn {
  who: 'caller' | 'ai'
  text: string
}

export interface SampleCall {
  business: string
  time: string
  turns: SampleCallTurn[]
  result: string
}

export const SAMPLE_CALLS: Record<string, SampleCall> = {
  'home-services': {
    business: 'Heating & air company',
    time: '9:47 PM',
    turns: [
      { who: 'caller', text: "Our upstairs AC just quit and it's 88 in here. Can anyone come tonight?" },
      { who: 'ai', text: "I'm sorry, that's miserable. Is anyone in the home elderly, very young, or unwell in the heat?" },
      { who: 'caller', text: "My mom's staying with us. She's 81." },
      { who: 'ai', text: "Thanks. I'm marking this urgent and paging our on-call tech now. They'll call you back on this number shortly." },
    ],
    result: 'Urgent job paged to the on-call tech',
  },
  dental: {
    business: 'Family dental practice',
    time: '6:12 PM',
    turns: [
      { who: 'caller', text: "Hi, I'd like to book a cleaning. It's been about a year." },
      { who: 'ai', text: "Happy to help. I have Tuesday at 8:00 AM or Thursday at 3:30 PM with a hygienist. Which works better?" },
      { who: 'caller', text: "Thursday at 3:30." },
      { who: 'ai', text: "You're set for Thursday at 3:30. You'll get a text confirmation and a reminder the day before." },
    ],
    result: 'Cleaning booked · reminder scheduled',
  },
  law: {
    business: 'Personal injury firm',
    time: '8:05 PM',
    turns: [
      { who: 'caller', text: 'I was rear-ended this afternoon and I think I need a lawyer.' },
      { who: 'ai', text: "I'm sorry to hear that. Are you safe, and have you been seen by a doctor?" },
      { who: 'caller', text: "Yes, I'm okay, just sore." },
      { who: 'ai', text: 'Good. I\'ll take a few details for the attorney and run a quick conflict check. Then I can book you a consultation with the attorney tomorrow at 10:00 or 2:00.' },
    ],
    result: 'Intake logged · conflict check before booking',
  },
  'auto-repair': {
    business: 'Auto & diesel shop',
    time: '7:18 AM',
    turns: [
      { who: 'caller', text: "My check engine light came on and the truck's idling rough." },
      { who: 'ai', text: "Sorry about that. What's the year, make and model, and is it safe to drive in?" },
      { who: 'caller', text: '2018 F-150. I can drive it. Thursday morning?' },
      { who: 'ai', text: "I'll request Thursday at 8:00 AM, and our service advisor will confirm by text shortly." },
    ],
    result: 'Booking request sent to your service advisor',
  },
  veterinary: {
    business: 'Animal hospital',
    time: '10:41 PM',
    turns: [
      { who: 'caller', text: 'My dog just ate half a bar of dark chocolate.' },
      { who: 'ai', text: 'Thank you for calling right away. How much does your dog weigh, and when did this happen?' },
      { who: 'caller', text: 'About 20 pounds. Maybe ten minutes ago.' },
      { who: 'ai', text: "I'm connecting you to our on-call veterinarian now so they can advise you. Please stay on the line." },
    ],
    result: 'Emergency routed to the on-call vet',
  },
  'beauty-salons': {
    business: 'Hair salon',
    time: '1:30 PM',
    turns: [
      { who: 'caller', text: 'Hi, I need to move my color appointment with Jess on Saturday.' },
      { who: 'ai', text: 'No problem. Jess has Friday at 4:00 PM or next Tuesday at 11:00 AM, both with time for a full color. Which would you like?' },
      { who: 'caller', text: 'Friday at 4.' },
      { who: 'ai', text: "Done. You're with Jess on Friday at 4:00. I've released Saturday and texted you the new time." },
    ],
    result: 'Appointment moved · client texted',
  },
}

export const TAB_LABELS: Record<string, string> = {
  'home-services': 'Home services',
  dental: 'Dental',
  law: 'Law',
  'auto-repair': 'Auto repair',
  veterinary: 'Vet',
  'beauty-salons': 'Salons',
}
