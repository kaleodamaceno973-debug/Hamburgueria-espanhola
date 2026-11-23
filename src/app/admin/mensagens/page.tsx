import { Suspense } from "react";
import { Inbox, MailCheck } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/server/session";
import { MarkRead } from "@/components/admin/mark-read";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Mensagens & e-mails" };

async function Content() {
  await requireAdmin();
  const [messages, emails, subscribers] = await Promise.all([
    db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    db.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    db.newsletterSubscriber.count(),
  ]);
  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <section>
        <h2 className="mb-4 text-xl font-extrabold">Contato <span className="text-sm font-normal text-muted-foreground">· {subscribers} inscritos na newsletter</span></h2>
        {messages.length === 0 ? (
          <EmptyState icon={<Inbox className="size-6" />} title="Nenhuma mensagem" />
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li key={m.id} className="rounded-2xl border border-white/10 bg-[#15110d] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold">{m.name} {!m.read && <Badge className="ml-1">Nova</Badge>}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(m.createdAt)}</p>
                </div>
                <p className="text-sm text-muted-foreground">{m.email}{m.phone && ` · ${m.phone}`}</p>
                <p className="mt-2 whitespace-pre-line text-sm">{m.message}</p>
                <div className="mt-3 flex gap-2">
                  <a href={`mailto:${m.email}`} className="text-sm font-semibold text-primary hover:underline">Responder</a>
                  {!m.read && <MarkRead id={m.id} />}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="mb-1 text-xl font-extrabold">E-mails automáticos</h2>
        <p className="mb-4 text-sm text-muted-foreground">Confirmações e atualizações de pedido. Sem RESEND_API_KEY, ficam registrados aqui (modo demo).</p>
        {emails.length === 0 ? (
          <EmptyState icon={<MailCheck className="size-6" />} title="Nenhum e-mail enviado ainda" />
        ) : (
          <ul className="space-y-3">
            {emails.map((e) => (
              <li key={e.id} className="rounded-2xl border border-white/10 bg-[#15110d] p-4">
                <details>
                  <summary className="cursor-pointer list-none">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{e.subject}</p>
                      <Badge variant={e.status.startsWith("erro") ? "danger" : "success"}>{e.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Para {e.to} · {formatDateTime(e.createdAt)} · {e.provider}</p>
                  </summary>
                  <iframe title={`E-mail: ${e.subject}`} srcDoc={e.html} sandbox="" className="mt-3 h-96 w-full rounded-xl border border-white/10 bg-black" />
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default function AdminMessagesPage() {
  return (
    <>
      <h1 className="font-display mb-6 text-4xl sm:text-5xl"><span className="slant">Mensagens</span></h1>
      <Suspense fallback={<Skeleton className="h-96" />}><Content /></Suspense>
    </>
  );
}
