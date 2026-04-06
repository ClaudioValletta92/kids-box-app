import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

interface Props {
  searchParams: Promise<{ message?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { message } = await searchParams

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Sign in</h2>

      {message === 'check-email' && (
        <p className="mb-4 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
          Check your email to confirm your account, then sign in.
        </p>
      )}

      <LoginForm />

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-indigo-600 hover:underline">
          Sign up
        </Link>
      </p>
    </>
  )
}
