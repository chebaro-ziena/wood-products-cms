import { ReactNode } from 'react';
import { BackgroundDecorations } from './BackgroundDecorations';


export function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BackgroundDecorations />
      {children}
    </>
  );
}
