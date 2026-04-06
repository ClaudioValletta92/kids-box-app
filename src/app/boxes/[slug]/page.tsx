import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/layout/site-header'
import { formatAgeRange } from '@/lib/boxes'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BoxDetailPage({ params }: Props) {
  const { slug } = await params

  const supabase = await createClient()

  const { data: box } = await supabase
    .from('boxes')
    .select('id, slug, name, description, age_min_months, age_max_months, monthly_price, cover_image_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!box) notFound()

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/boxes"
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          ← All boxes
        </Link>

        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Placeholder / cover image */}
          <div className="flex h-64 items-center justify-center bg-amber-50">
            <span className="text-7xl">🎁</span>
          </div>

          <div className="p-8">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              {formatAgeRange(box.age_min_months, box.age_max_months)}
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
              {box.name}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-gray-600">
              {box.description}
            </p>

            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  ${Number(box.monthly_price).toFixed(2)}
                </span>
                <span className="text-sm text-gray-500"> / month</span>
              </div>
              <Link
                href="/signup"
                className="rounded-full bg-amber-500 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-600"
              >
                Get started →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
