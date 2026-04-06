import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/actions/auth'
import { ageInMonths, formatAge, formatBirthDate } from '@/lib/age'
import { getRecommendedBox, formatAgeRange } from '@/lib/boxes'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Guaranteed by the (app) layout — this satisfies TypeScript.
  if (!user) return null

  // Fetch profile and children in parallel.
  const [{ data: profile }, { data: children }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase
      .from('children')
      .select('id, name, birth_date')
      .eq('parent_id', user.id)
      .order('created_at'),
  ])

  if (!children || children.length === 0) {
    redirect('/onboarding/child')
  }

  // Use first child for now; multi-child support can be added later.
  const child = children[0]
  const childAge = ageInMonths(child.birth_date)

  const { data: boxes } = await supabase
    .from('boxes')
    .select(
      'id, slug, name, description, age_min_months, age_max_months, monthly_price',
    )
    .eq('is_active', true)
    .order('sort_order')

  const recommended = getRecommendedBox(childAge, boxes ?? [])

  const firstName = profile?.full_name?.split(' ')[0] ?? null

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            Kids Box
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-gray-500 transition-colors hover:text-gray-800"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {firstName ? `Hi, ${firstName}` : 'Welcome back'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{user.email}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ── Child card ──────────────────────────────────────────── */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-400">
              Your child
            </p>
            <p className="text-2xl font-bold text-gray-900">{child.name}</p>
            <p className="mt-1 text-sm text-gray-500">
              {formatAge(childAge)} old
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Born {formatBirthDate(child.birth_date)}
            </p>
          </div>

          {/* ── Recommendation card ─────────────────────────────────── */}
          {recommended ? (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 shadow-sm">
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-amber-600">
                Recommended box
              </p>
              <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                {formatAgeRange(
                  recommended.age_min_months,
                  recommended.age_max_months,
                )}
              </span>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {recommended.name}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {recommended.description}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-amber-100 pt-4">
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    ${Number(recommended.monthly_price).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500"> /mo</span>
                </div>
                <Link
                  href={`/boxes/${recommended.slug}`}
                  className="rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
                >
                  See details →
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-400">
                No box matched for this age. Check back soon.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
