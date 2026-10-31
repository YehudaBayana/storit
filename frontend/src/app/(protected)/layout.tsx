import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
// Import your auth verification helper (e.g., from Supabase, NextAuth, Firebase, etc.)

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Double check authentication on the server
  if (!session?.user) {
    redirect('/auth');
  }

  return <>{children}</>;
}
