import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AuthView from '@/features/auth/views/AuthView';

export default async function AuthPage() {
  const session = await getSession();
  if (session?.user) {
    redirect('/');
  }

  return <AuthView />;
}
