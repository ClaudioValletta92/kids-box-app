import Link from 'next/link'
import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Create account</h2>

      <SignupForm />

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}
