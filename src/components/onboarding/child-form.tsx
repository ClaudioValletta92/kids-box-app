'use client'

import { useActionState } from 'react'
import { addChild, type ChildState } from '@/actions/children'

export function ChildForm() {
  const [state, formAction, isPending] = useActionState<ChildState, FormData>(
    addChild,
    null,
  )

  const today = new Date().toISOString().split('T')[0]
  const minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - 4)

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Child&apos;s name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="e.g. Emma"
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <div>
        <label
          htmlFor="birth_date"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Date of birth
        </label>
        <input
          id="birth_date"
          name="birth_date"
          type="date"
          required
          max={today}
          min={minDate.toISOString().split('T')[0]}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          Used only to find the right box. We never share this.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? 'Finding your box…' : 'Find the right box →'}
      </button>
    </form>
  )
}
