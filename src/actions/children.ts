'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type ChildState = { error: string } | null

export async function addChild(
  _prev: ChildState,
  formData: FormData,
): Promise<ChildState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const name = (formData.get('name') as string | null)?.trim()
  const birth_date = formData.get('birth_date') as string | null

  if (!name || !birth_date) return { error: 'All fields are required.' }

  const { error } = await supabase.from('children').insert({
    parent_id: user.id,
    name,
    birth_date,
  })

  if (error) return { error: error.message }

  redirect('/dashboard')
}
