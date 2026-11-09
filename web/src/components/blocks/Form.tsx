'use client'

import {stegaClean} from 'next-sanity'
import {useId, useState, type FormEvent} from 'react'

import type {BlockOf} from '../PageBuilder'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const inputClass =
  'w-full rounded-lg border border-foreground/25 bg-background px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

// The form is described in Sanity. Answers go to HubSpot's public Forms API when a portal
// and form ID are set; otherwise the form only shows its success message (POC testing).
export function Form({
  title,
  intro,
  fields,
  submitLabel,
  successMessage,
  hubspotPortalId,
  hubspotFormId,
}: BlockOf<'form'>) {
  const [status, setStatus] = useState<Status>('idle')
  const idPrefix = useId()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const portalId = stegaClean(hubspotPortalId)
    const formId = stegaClean(hubspotFormId)
    if (!portalId || !formId) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            fields: (fields ?? []).flatMap((field) => {
              const name = stegaClean(field.name)
              return name ? [{name, value: String(data.get(name) ?? '')}] : []
            }),
            context: {pageUri: window.location.href, pageName: document.title},
          }),
        },
      )
      setStatus(response.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="mx-auto w-full max-w-xl px-6 py-16">
      {title && <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>}
      {intro && <p className="mt-3 text-muted">{intro}</p>}

      {status === 'sent' ? (
        <p role="status" className="mt-8 rounded-2xl border-l-4 border-accent bg-surface p-6">
          {successMessage || 'Thank you!'}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {fields?.map((field) => {
            const name = stegaClean(field.name)
            const type = stegaClean(field.type)
            if (!name) return null
            const id = `${idPrefix}-${name}`
            const required = Boolean(field.required)
            const label = (
              <>
                {field.label}
                {required && <span aria-hidden> *</span>}
              </>
            )

            if (type === 'checkbox') {
              return (
                <label key={field._key} htmlFor={id} className="flex items-start gap-3">
                  <input
                    id={id}
                    name={name}
                    type="checkbox"
                    value="true"
                    required={required}
                    className="mt-1 h-4 w-4 accent-brand"
                  />
                  <span>{label}</span>
                </label>
              )
            }

            return (
              <div key={field._key} className="flex flex-col gap-1.5">
                <label htmlFor={id} className="font-medium">
                  {label}
                </label>
                {type === 'textarea' ? (
                  <textarea
                    id={id}
                    name={name}
                    required={required}
                    placeholder={field.placeholder ?? undefined}
                    rows={4}
                    className={inputClass}
                  />
                ) : type === 'select' ? (
                  <select id={id} name={name} required={required} className={inputClass} defaultValue="">
                    <option value="" disabled>
                      —
                    </option>
                    {field.choices?.map((choice) => (
                      <option key={stegaClean(choice)} value={stegaClean(choice)}>
                        {choice}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={id}
                    name={name}
                    type={type ?? 'text'}
                    required={required}
                    placeholder={field.placeholder ?? undefined}
                    autoComplete={type === 'email' ? 'email' : undefined}
                    className={inputClass}
                  />
                )}
              </div>
            )
          })}

          {status === 'error' && (
            <p role="alert" className="text-danger">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-primary self-start disabled:opacity-60"
          >
            {status === 'sending' ? '…' : submitLabel || 'Send'}
          </button>
        </form>
      )}
    </section>
  )
}
