import { ChildForm } from '@/components/onboarding/child-form'

export default function OnboardingChildPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-amber-600">
            Getting started
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Tell us about your child
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            We&apos;ll match them with the right box for their development stage.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <ChildForm />
        </div>
      </div>
    </div>
  )
}
