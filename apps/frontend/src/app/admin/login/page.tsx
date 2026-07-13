'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authService } from '../../../services';
import { useAuthStore } from '../../../store/auth-store';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const { data } = await authService.login(values.email, values.password);
      setAccessToken(data.accessToken);
      setUser(data.user);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-ink-900)] px-4">
      <div className="card-surface w-full max-w-sm p-8">
        <h1 className="text-2xl mb-6 text-center">Admin Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-[var(--color-text-muted)]">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full rounded-md bg-[var(--color-ink-700)] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-500)]"
            />
            {errors.email && <p className="text-xs text-[var(--color-clay-500)] mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1 text-[var(--color-text-muted)]">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full rounded-md bg-[var(--color-ink-700)] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-500)]"
            />
            {errors.password && (
              <p className="text-xs text-[var(--color-clay-500)] mt-1">{errors.password.message}</p>
            )}
          </div>

          {serverError && <p className="text-sm text-[var(--color-clay-500)]">{serverError}</p>}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
