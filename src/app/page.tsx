import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/layout/site-header'
import { formatAgeRange } from '@/lib/boxes'

export default async function LandingPage() {
  const supabase = await createClient()

  const { data: boxes } = await supabase
    .from('boxes')
    .select('id, slug, name, description, age_min_months, age_max_months')
    .eq('is_active', true)
    .order('sort_order')

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-amber-50 px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium uppercase tracking-widest text-amber-700">
            Play-based learning
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            The right toy
            <br />
            at the right time
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600">
            Monthly boxes of age-matched educational toys, curated for your
            child&apos;s exact developmental stage. Delivered to your door.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="w-full rounded-full bg-amber-500 px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 sm:w-auto"
            >
              Create your profile →
            </Link>
            <Link
              href="/boxes"
              className="w-full rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
            >
              Browse all boxes
            </Link>
          </div>
        </div>
      </section>

      {/* ── Boxes grid ───────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Every box matches your child&apos;s stage
            </h2>
            <p className="mt-3 text-gray-500">
              Six development-led boxes, from birth to two years.
            </p>
          </div>

          {(!boxes || boxes.length === 0) ? (
            <p className="text-center text-sm text-gray-400">Boxes coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {boxes.map((box) => (
                <Link
                  key={box.id}
                  href={`/boxes/${box.slug}`}
                  className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                    {formatAgeRange(box.age_min_months, box.age_max_months)}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-gray-900 transition-colors group-hover:text-amber-600">
                    {box.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">
                    {box.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-amber-600">
                    Discover →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="bg-stone-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900">
            How it works
          </h2>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Create your profile',
                body: 'Sign up in under a minute with just your name and email.',
              },
              {
                step: '02',
                title: "Tell us about your child",
                body: "Add their name and birthday. We'll compute their age and find the perfect match.",
              },
              {
                step: '03',
                title: 'Receive your first box',
                body: 'Your first box ships within days. Reorder as your child grows.',
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                  {step}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="bg-amber-500 px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ready to find the right box?
          </h2>
          <p className="mt-3 text-amber-100">
            Create your profile and find the perfect box for your child&apos;s
            stage.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-50"
          >
            Create your profile →
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white px-6 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Kids Box. All rights reserved.
      </footer>
    </div>
  )
}
