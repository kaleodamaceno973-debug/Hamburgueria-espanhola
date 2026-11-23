import { SplitHeading } from "@/components/motion/split-heading";

export function PageHero({ eyebrow, title, text, children }: { eyebrow: string; title: string; text?: string; children?: React.ReactNode }) {
  return (
    <section className="grain relative overflow-hidden border-b border-white/10 pb-12 pt-32 sm:pb-16 md:pt-44">
      <div aria-hidden className="absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary/15 blur-3xl" />
      <div className="container-x relative">
        <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
          <span className="h-px w-8 bg-primary" /> {eyebrow}
        </p>
        <SplitHeading as="h1" className="font-display max-w-4xl text-[clamp(2.8rem,9vw,6.5rem)]">{title}</SplitHeading>
        {text && <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">{text}</p>}
        {children}
      </div>
    </section>
  );
}
