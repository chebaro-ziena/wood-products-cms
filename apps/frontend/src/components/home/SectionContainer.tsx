import { ElementType, ReactNode } from 'react';

interface SectionContainerProps {
  children: ReactNode;
  variant?: 'plain' | 'card';
  background?: string;
  className?: string;
  as?: ElementType;
}


export function SectionContainer({
  children,
  variant = 'plain',
  background = '#1E0C06',
  className = '',
  as: Component = 'section',
}: SectionContainerProps) {
  if (variant === 'card') {
    return (
      <Component
        className={`relative overflow-hidden ml-auto max-w-[1245px] rounded-[2.5rem] md:rounded-[3.5rem] shadow-[var(--shadow-card)] ${className}`}
        style={{ backgroundColor: background }}
      >
        {children}
      </Component>
    );
  }

  return <Component className={`relative ${className}`}>{children}</Component>;
}
