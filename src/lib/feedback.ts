import { getApiUrl } from '@/lib/api-url'

export const FEEDBACK_CATEGORIES = [
  'bug_report',
  'premium_upgrade',
  'feature_request',
  'general',
] as const

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]

export function isFeedbackCategory(value: string | null | undefined): value is FeedbackCategory {
  return FEEDBACK_CATEGORIES.includes(value as FeedbackCategory)
}

export type ContactFormPayload = {
  name: string
  email: string
  category: FeedbackCategory
  subject?: string
  message: string
}

export class ContactSubmitError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ContactSubmitError'
    this.status = status
  }
}

export async function submitContactForm(payload: ContactFormPayload): Promise<string> {
  const response = await fetch(`${getApiUrl()}/api/auth/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => ({}))) as { detail?: string }

  if (!response.ok) {
    throw new ContactSubmitError(data.detail ?? 'Request failed', response.status)
  }

  return data.detail ?? ''
}
