import type { Metadata } from "next";
import { Logo } from "@/components/site/logo";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin Smash House" }, robots: { index: false, follow: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="sticky top-0 z-30 border-b border-white/10 bg-[#0d0a08]/95 backdrop-blur lg:h-dvh lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-4 pt-4 lg:px-5 lg:pt-6">
          <Logo />
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">Admin</span>
        </div>
        <div className="px-3 py-3 lg:px-4 lg:py-8">
          <AdminNav />
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
