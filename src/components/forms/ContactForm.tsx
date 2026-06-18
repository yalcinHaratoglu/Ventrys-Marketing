'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import {
  type FeedbackCategory,
  FEEDBACK_CATEGORIES,
  isFeedbackCategory,
  submitContactForm,
  ContactSubmitError,
} from '@/lib/feedback'
import { cn } from '@/lib/utils'

type ContactFormProps = {
  className?: string
  defaultCategory?: FeedbackCategory
}

export function ContactForm({ className, defaultCategory = 'general' }: ContactFormProps) {
  const t = useTranslations('contactForm')
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState<FeedbackCategory>(defaultCategory)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isFeedbackCategory(categoryParam)) {
      setCategory(categoryParam)
    }
  }, [categoryParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSuccess('')

    if (message.trim().length < 10) {
      setFormError(t('messageMinLength'))
      return
    }

    setSubmitting(true)
    try {
      const detail = await submitContactForm({
        name: name.trim(),
        email: email.trim(),
        category,
        subject: subject.trim(),
        message: message.trim(),
      })
      setSuccess(detail || t('sent'))
      setMessage('')
      setSubject('')
      if (!isFeedbackCategory(categoryParam)) {
        setCategory(defaultCategory)
      }
    } catch (err) {
      if (err instanceof ContactSubmitError) {
        setFormError(err.message || t('sendFailed'))
      } else {
        setFormError(t('sendFailed'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium text-slate-900 dark:text-white">
            {t('name')}
          </label>
          <input
            id="contact-name"
            type="text"
            required
            minLength={2}
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="text-sm font-medium text-slate-900 dark:text-white">
            {t('email')}
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-category" className="text-sm font-medium text-slate-900 dark:text-white">
          {t('category')}
        </label>
        <select
          id="contact-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900"
        >
          {FEEDBACK_CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {t(`categories.${value}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-subject" className="text-sm font-medium text-slate-900 dark:text-white">
          {t('subject')}
        </label>
        <input
          id="contact-subject"
          type="text"
          maxLength={200}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={t('subjectPlaceholder')}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm font-medium text-slate-900 dark:text-white">
          {t('message')}
        </label>
        <textarea
          id="contact-message"
          required
          minLength={10}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('messagePlaceholder')}
          className="mt-1 min-h-32 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900"
        />
      </div>

      {formError ? <p className="text-sm text-red-600 dark:text-red-400">{formError}</p> : null}
      {success ? <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? t('sending') : t('send')}
      </button>
    </form>
  )
}
