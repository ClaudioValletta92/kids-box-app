'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AuthState = { error: string } | null

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) return { error: error.message }

  redirect('/dashboard')
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      // Passed into raw_user_meta_data — consumed by the handle_new_user trigger.
      data: { full_name: formData.get('full_name') as string },
    },
  })

  if (error) return { error: error.message }

  // session is null when Supabase requires email confirmation.
  if (!data.session) {
    redirect('/login?message=check-email')
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
