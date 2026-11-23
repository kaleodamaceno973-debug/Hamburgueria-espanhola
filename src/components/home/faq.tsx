import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";

export function Faq({ items }: { items: { id: string; question: string; answer: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="faq-title" className="relative py-20 sm:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading id="faq-title" eyebrow="Dúvidas frequentes" title="Perguntas rápidas" text="Não achou o que procurava? Fale com a gente pelo WhatsApp ou na página de contato." />
        <Reveal>
          <Accordion type="single" collapsible defaultValue={items[0]?.id}>
            {items.map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger>{f.question}</AccordionTrigger>
                <AccordionContent>{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
