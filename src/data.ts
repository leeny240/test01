export type Subscription = {
  id: string
  letter: string
  name: string
  usd: number
  krw: number
  cycle: string
  nextPayment: string
  paidVia: string
}

export type ScheduledDecision = {
  name: string
  alertDate: string
  chargeDate: string
  amount: string
}

export const TODAY = '2026-10-11'

// Subscriptions recognized from the uploaded screenshots.
export const detectedSubscriptions: Subscription[] = [
  { id: 'chatgpt', letter: 'C', name: 'ChatGPT Plus', usd: 20, krw: 28240, cycle: 'Monthly', nextPayment: '2026-10-24', paidVia: 'App Store' },
  { id: 'notion', letter: 'N', name: 'Notion', usd: 10, krw: 14120, cycle: 'Monthly', nextPayment: '2026-11-01', paidVia: 'Card' },
  { id: 'medium', letter: 'M', name: 'Medium', usd: 5, krw: 7060, cycle: 'Monthly', nextPayment: '2026-10-20', paidVia: 'Card' },
]

// Decisions already scheduled from earlier registrations.
export const scheduledDecisions: ScheduledDecision[] = [
  { name: 'Netflix', alertDate: '2026-10-11', chargeDate: '2026-10-14', amount: '₩17,000' },
  { name: 'Spotify', alertDate: '2026-10-13', chargeDate: '2026-10-16', amount: '₩10,900' },
  { name: 'Medium', alertDate: '2026-10-17', chargeDate: '2026-10-20', amount: '≈ ₩7,060' },
]
