import { SplitHeading } from "@/components/motion/split-heading";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  className,
  id,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary", align === "center" && "justify-center")}>
        <span className="h-px w-8 bg-primary" />
        {eyebrow}
        {align === "center" && <span className="h-px w-8 bg-primary" />}
      </p>
      <SplitHeading id={id} className="font-display text-[clamp(2.4rem,6.5vw,4.5rem)]">
        {title}
      </SplitHeading>
      {text && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{text}</p>}
    </div>
  );
}
