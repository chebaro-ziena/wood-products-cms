import Image from 'next/image';

export function BackgroundWood() {
  return (
    <div
      aria-hidden="true"
      
      className="absolute top-0 left-0 w-full sm:w-4/5 md:w-3/5 h-[600px] sm:h-[750px] md:h-[900px] lg:h-[1080px] overflow-hidden pointer-events-none select-none -z-10"
    >
      <Image 
        src="/imag.png" 
        alt="" 
        fill 
        priority 
        quality={100}
        className="object-cover object-left-top" 
      />
      
     
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#161617]/20 to-[#161617]" />
    </div>
  );
}