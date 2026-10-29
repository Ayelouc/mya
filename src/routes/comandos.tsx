import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/comandos")({
  head: () => ({
    meta: [
      { title: "Comandos da Mya — bot para Discord" },
      { name: "description", content: "Lista de comandos da Mya: moderação, verificação e utilidades." },
      { property: "og:title", content: "Comandos da Mya" },
      { property: "og:description", content: "Todos os comandos da Mya organizados por categoria." },
    ],
  }),
  component: Comandos,
});

const cmds = [
  { c: "Moderação", n: "/ban", d: "Bane um membro e registra um caso." },
  { c: "Moderação", n: "/kick", d: "Expulsa um membro do servidor." },
  { c: "Moderação", n: "/timeout", d: "Silencia um membro por um tempo." },
  { c: "Moderação", n: "/avisar", d: "Dá um aviso e avisa o membro na DM." },
  { c: "Moderação", n: "/casos", d: "Mostra o histórico de casos de um usuário." },
  { c: "Verificação", n: "/verificar", d: "Verifica você e entrega o cargo configurado." },
  { c: "Utilidades", n: "/painel", d: "Abre o link do painel de configuração." },
  { c: "Utilidades", n: "/ajuda", d: "Mostra a ajuda da Mya." },
];
const cats = ["Todos", ...Array.from(new Set(cmds.map((c) => c.c)))];

function Comandos() {
  const [cat, setCat] = useState("Todos");
  const [q, setQ] = useState("");
  const list = cmds.filter((c) => (cat === "Todos" || c.c === cat) && (c.n + c.d).toLowerCase().includes(q.toLowerCase()));
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 py-14">
        <h1 className="text-4xl font-semibold">Comandos</h1>
        <p className="mt-2 text-muted-foreground">Tudo o que você pode pedir para a Mya.</p>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar comando…"
          className="mt-6 w-full rounded-full border bg-card px-5 py-3 outline-none focus:ring-2 focus:ring-ring" />
        <div className="mt-4 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold ${cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>{c}</button>
          ))}
        </div>
        <ul className="mt-8 space-y-3">
          {list.map((c) => (
            <li key={c.n} className="flex items-center gap-4 rounded-2xl border bg-card p-4">
              <code className="rounded-xl bg-secondary px-3 py-1 font-bold text-secondary-foreground">{c.n}</code>
              <span className="text-sm text-muted-foreground">{c.d}</span>
              <span className="ml-auto hidden text-xs font-bold text-accent-foreground sm:block">{c.c}</span>
            </li>
          ))}
          {list.length === 0 && <li className="text-center text-muted-foreground">Nenhum comando encontrado.</li>}
        </ul>
      </section>
    </SiteShell>
  );
}
