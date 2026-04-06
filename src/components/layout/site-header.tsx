import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export async function SiteHeader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          Kids Box
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/boxes"
            className="hidden text-sm text-gray-600 transition-colors hover:text-gray-900 sm:block"
          >
            Browse boxes
          </Link>

          {user ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-600"
            >
              My dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-600"
              >
                Get started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
