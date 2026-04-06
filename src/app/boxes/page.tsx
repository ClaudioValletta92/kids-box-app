import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/layout/site-header'
import { formatAgeRange } from '@/lib/boxes'

export default async function BoxesPage() {
  const supabase = await createClient()

  const { data: boxes } = await supabase
    .from('boxes')
    .select('id, slug, name, description, age_min_months, age_max_months, monthly_price')
    .eq('is_active', true)
    .order('sort_order')

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="border-b border-gray-100 bg-stone-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            All boxes
          </h1>
          <p className="mt-2 text-gray-500">
            Six development-led boxes, from birth to two years.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {(!boxes || boxes.length === 0) ? (
            <p className="text-sm text-gray-400">No boxes available yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {boxes.map((box) => (
                <div
                  key={box.id}
                  className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  {/* Placeholder image */}
                  <div className="flex h-44 items-center justify-center rounded-t-2xl bg-amber-50">
                    <span className="text-5xl">🎁</span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <span className="inline-block self-start rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      {formatAgeRange(box.age_min_months, box.age_max_months)}
                    </span>
                    <h2 className="mt-3 text-lg font-semibold text-gray-900">
                      {box.name}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
                      {box.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-sm font-semibold text-gray-900">
                        ${Number(box.monthly_price).toFixed(2)}
                        <span className="font-normal text-gray-400">/mo</span>
                      </span>
                      <Link
                        href={`/boxes/${box.slug}`}
                        className="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-600"
                      >
                        Learn more
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
