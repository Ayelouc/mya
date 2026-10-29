import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { INVITE_URL, DASHBOARD_URL } from "@/lib/mya";
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
            <img
  src="/img/mya-avatar.png"
  alt="Mya"
  className="h-9 w-9 rounded-full ring-2 ring-blush"
/>
            Mya
          </Link>
          <div className="hidden gap-5 text-sm font-semibold text-muted-foreground sm:flex">
            <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-accent-foreground" }}>Início</Link>
            <Link to="/comandos" activeProps={{ className: "text-accent-foreground" }}>Comandos</Link>
          </div>
          <div className="ml-auto flex gap-2">
            <a href={DASHBOARD_URL} className="hidden rounded-full border px-4 py-2 text-sm font-bold hover:bg-muted sm:inline-flex">Painel</a>
            <a href={INVITE_URL} className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft hover:opacity-90">Adicionar</a>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        Mya © {new Date().getFullYear()} • Feito com 💚 e 💗
      </footer>
    </div>
  );
}
