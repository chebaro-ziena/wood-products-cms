'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { contactService } from '../services';

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  phone: z.string().min(6, 'Enter your telephone number'),
  question: z.string().min(3, 'Enter your question'),
});

type FormValues = z.infer<typeof schema>;

const WOOD_SLICE_URL = 'https://ik.imagekit.io/quhhab4ed/image%20(1).png?updatedAt=1783797625397';

const inputClasses =
  'w-full rounded-full bg-black/25 border border-slate-500/40 px-6 py-3.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-500)] transition-all';

export function ContactForm({ title, subtitle }: { title: string; subtitle?: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await contactService.submit(values);
      toast.success('Your question has been sent.');
      reset();
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    /* Added overflow-hidden to cleanly clip the wood graphic at the container boundaries */
    <section id="order" className="relative w-full max-w-[1245px] mx-auto px-6 md:px-16 pt-16 pb-12 select-none overflow-hidden">
      
      {/* 1. Header Row - Aligned to the right in one line */}
      <div className="w-full flex justify-end mb-10 md:mb-12 z-10 relative">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider text-white text-right whitespace-nowrap">
          {title}
        </h2>
      </div>

      {/* 2. Main 2-Column Grid for Content Body */}
      <div className="grid md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-8 relative">
        
        {/* LEFT COLUMN: Form Elements */}
        <div className="flex flex-col w-full max-w-md z-10">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
            <div>
              <input {...register('name')} placeholder="Your name" className={inputClasses} />
              {errors.name && <p className="text-xs text-[var(--color-clay-500)] mt-1 pl-4">{errors.name.message}</p>}
            </div>

            <div>
              <input {...register('phone')} placeholder="Your telephone number" className={inputClasses} />
              {errors.phone && <p className="text-xs text-[var(--color-clay-500)] mt-1 pl-4">{errors.phone.message}</p>}
            </div>

            <div>
              <textarea
                {...register('question')}
                placeholder="Your question"
                rows={5}
                className="w-full rounded-[1.5rem] bg-black/25 border border-slate-500/40 px-6 py-4 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-500)] resize-none transition-all"
              />
              {errors.question && (
                <p className="text-xs text-[var(--color-clay-500)] mt-1 pl-4">{errors.question.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[#728BAD] text-white px-10 py-3 font-medium transition-colors hover:bg-[#5a7192] disabled:opacity-60 min-w-[120px] shadow-md cursor-pointer"
              >
                {isSubmitting ? 'Sending…' : 'Send'}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Descriptive Text + Floating Graphic */}
        <div className="flex flex-col justify-start relative pt-2 z-10">
          {subtitle && (
            <p className="text-neutral-300 normal-case font-normal text-base md:text-[17px] leading-relaxed max-w-[440px] tracking-wide">
              {subtitle}
            </p>
          )}

          {/* Floating wood slice graphic - now safely contained within parent boundaries */}
          <div className="hidden md:block absolute -bottom-40 right-0 w-100 h-100 lg:w-120 lg:h-120 pointer-events-none select-none">
            <Image 
              src={WOOD_SLICE_URL} 
              alt="" 
              fill 
              sizes="(max-width: 1024px) 320px, 384px"
              className="object-contain drop-shadow-2xl" 
            />
          </div>
        </div>

      </div>
    </section>
  );
}