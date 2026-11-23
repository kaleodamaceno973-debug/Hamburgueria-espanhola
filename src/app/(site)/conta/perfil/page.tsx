import type { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireUser } from "@/server/session";
import { PasswordForm, ProfileForm } from "@/components/account/profile-forms";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Perfil", robots: { index: false } };

async function Forms() {
  const user = await requireUser("/conta/perfil");
  const profile = await db.user.findUnique({ where: { id: user.id }, select: { name: true, email: true, phone: true, passwordHash: true } });
  if (!profile) return null;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
        <h2 className="mb-5 text-lg font-extrabold">Dados pessoais</h2>
        <ProfileForm name={profile.name ?? ""} phone={profile.phone ?? ""} email={profile.email} />
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
        <h2 className="mb-5 text-lg font-extrabold">Segurança</h2>
        <PasswordForm hasPassword={!!profile.passwordHash} />
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-96" /><Skeleton className="h-96" /></div>}>
      <Forms />
    </Suspense>
  );
}
