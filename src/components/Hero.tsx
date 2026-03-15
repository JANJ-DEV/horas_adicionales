import type { FC } from "react";

type Props = {
  children: React.ReactNode;
};

const Hero: FC<Props> = ({ children }) => {
  return (
    <section className="hero-glass relative overflow-hidden rounded-[1.75rem] px-5 py-8 text-center sm:px-8 sm:py-12 lg:px-10 lg:py-14">
      <div className="absolute inset-0 bg-[var(--hero-gradient)] opacity-80" aria-hidden="true" />
      <div
        className="absolute -left-12 top-4 h-32 w-32 rounded-full bg-[color:var(--accent)]/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-[color:var(--accent-strong)]/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col items-center gap-4">{children}</div>
    </section>
  );
};

export default Hero;
