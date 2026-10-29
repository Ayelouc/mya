import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { INVITE_URL, DASHBOARD_URL } from "@/lib/mya";
import { Settings } from "lucide-react";
import {
  ShieldCheck,
  ScrollText,
  UserCheck,
  Handshake,
} from "lucide-react";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mya — o bot de comunidade para o seu Discord" },
      { name: "description", content: "Moderação, logs completos, verificação e boas-vindas. Tudo configurável por um painel online." },
      { property: "og:title", content: "Mya — bot de comunidade para Discord" },
      { property: "og:description", content: "Moderação, logs, verificação e boas-vindas num painel simples." },
    ],
  }),
  component: Index,
});

const steps = [
  { n: "01", t: "Adicione", d: "Convide a Mya para o seu servidor em um clique." },
  { n: "02", t: "Configure", d: "Entre no painel com o Discord e escolha canais e cargos." },
  { n: "03", t: "Relaxe", d: "Ela cuida de logs, moderação e recepção por você." },
];

function Index() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-10 pt-16 md:grid-cols-[1.1fr_1fr] md:pt-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-foreground">Bot para Discord</p>
            <h1 className="mt-4 text-5xl font-semibold leading-[1.05] md:text-7xl">
              Sua comunidade,<br /><span className="text-primary">bem cuidada.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Moderação, logs, verificação e boas-vindas. Configurado num painel, sem decorar comandos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={INVITE_URL} className="rounded-full bg-foreground px-7 py-3.5 font-bold text-background hover:opacity-90">Adicionar ao Discord</a>
              <a href={DASHBOARD_URL} className="rounded-full px-7 py-3.5 font-bold hover:bg-muted">Abrir painel →</a>
            </div>
          </div>

          {/* Discord-like preview, em camadas: brilho (fundo) → card (meio) → Mya (frente, sentada na borda do card) */}
          <div className="relative">
            <div aria-hidden className="pointer-events-none absolute -right-8 top-0 h-64 w-64 rounded-full bg-leaf/40 blur-3xl" />
            <div className="relative z-20 -mb-12 flex justify-end pr-3 sm:pr-8">
              <img
                src="/img/mya-sentada.webp"
                alt="Mya sentada, fazendo sinal de paz"
                width={720}
                height={1023}
                className="float-slow pointer-events-none w-36 select-none drop-shadow-xl sm:w-44 lg:w-52"
              />
            </div>
            <div className="relative z-10 rounded-3xl border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2 border-b pb-3 text-sm font-bold text-muted-foreground"># boas-vindas</div>
              <div className="mt-4 flex gap-3">
                <img
  src="/img/mya-avatar.png"
  alt="Mya"
  className="h-11 w-11 rounded-full"
/>
                <div className="min-w-0">
                  <p className="text-sm"><b>Mya</b> <span className="ml-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">BOT</span> <span className="ml-1 text-xs text-muted-foreground">hoje às 13:24</span></p>
                  <div className="mt-2 rounded-xl border-l-4 border-leaf bg-muted p-4 text-sm">
                    <p className="font-bold">Seja bem-vindo(a), @Luna! 💚</p>
                    <p className="mt-1 text-muted-foreground">Agora somos 1.248 membros. Use <code className="rounded bg-secondary px-1">/verificar</code> para liberar os canais.</p>
                  </div>
                  <div className="mt-3 rounded-xl border-l-4 border-blush bg-muted p-4 text-sm">
                    <p className="font-bold">🛡️ Caso #42 · Timeout</p>
                    <p className="mt-1 text-muted-foreground">Usuário silenciado por 10 min · motivo: spam</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <h2 className="max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">Tudo o que um servidor precisa, nada que ele não use.</h2>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground md:text-xl">A Mya assume o trabalho chato de moderar — e você fica no controle de tudo, sem decorar um comando sequer.</p>
        <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <div className="relative overflow-hidden rounded-3xl bg-leaf-soft p-10 md:col-span-2">
            <p className="text-4xl"><ScrollText size={24} /></p>
            <h3 className="mt-4 text-3xl font-semibold">Logs completos</h3>
            <p className="mt-3 max-w-md text-lg text-muted-foreground lg:max-w-[22rem] xl:max-w-md">Mensagens, membros, cargos, canais, voz e convites — com IDs, canal e quem executou. Cada tipo em um canal seu. Quando alguém aprontar, o histórico está todo ali.</p>
            <img src="/img/mya-logs.webp" alt="" aria-hidden className="pointer-events-none absolute bottom-0 right-4 hidden h-48 select-none lg:block xl:h-64" />
          </div>
          <div className="rounded-3xl bg-blush-soft p-10">
            <p className="text-4xl"><ShieldCheck size={24} /></p>
            <h3 className="mt-4 text-2xl font-semibold">Moderação com casos</h3>
            <p className="mt-3 text-lg text-muted-foreground">Ban, kick, timeout e avisos numerados, com histórico por usuário. Chega de spam e vandalismo passando batido.</p>
          </div>
          <div className="rounded-3xl border bg-card p-10">
            <p className="text-4xl"><UserCheck size={24} /></p>
            <h3 className="mt-4 text-2xl font-semibold">Verificação</h3>
            <p className="mt-3 text-lg text-muted-foreground">/verificar entrega o cargo certo, checando status ou Tag do servidor. Fakes e contas jogadoras ficam de fora.</p>
          </div>
          <div className="rounded-3xl border bg-card p-10">
            <p className="text-4xl"><Handshake size={24} /></p>
            <h3 className="mt-4 text-2xl font-semibold">Boas-vindas</h3>
            <p className="mt-3 text-lg text-muted-foreground">Mensagem de chegada com o nome, o cargo e o jeitinho do seu servidor. Ninguém entra e fica perdido.</p>
          </div>
          <div className="rounded-3xl bg-foreground p-10 text-background">
            <p className="text-4xl"><Settings size={24} strokeWidth={1.8} /></p>
            <h3 className="mt-4 text-2xl font-semibold">Painel online</h3>
            <p className="mt-3 text-lg opacity-70">Tudo configurado pelo navegador, em minutos. E só quem gerencia o servidor acessa.</p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-y bg-muted/50">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl font-semibold md:text-4xl">Do zero ao servidor protegido em 3 passos.</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <p className="font-display text-7xl font-semibold text-blush">{s.n}</p>
                <h3 className="mt-3 text-2xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-lg text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 text-center text-primary-foreground md:px-16 md:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.25em] opacity-80 md:text-base">Grátis, para sempre</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">Sua comunidade cresceu. Ela merece ser bem cuidada.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg opacity-90 md:text-xl">Adicione a Mya hoje e durma tranquilo: moderação firme, boas-vindas carinhosas e todo o histórico do servidor na palma da mão. Em 5 minutos está tudo funcionando.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href={INVITE_URL} className="rounded-full bg-background px-10 py-4 text-lg font-bold text-foreground transition hover:scale-105">Adicionar ao Discord</a>
            <Link to="/comandos" className="rounded-full border-2 border-primary-foreground/40 px-10 py-4 text-lg font-bold transition hover:bg-primary-foreground/10">Ver comandos</Link>
          </div>
          <p className="mt-6 text-base opacity-75">Sem cartão de crédito · Sem mensalidade · Configuração em minutos</p>
          <img src="/img/mya-cta.webp" alt="Mya sorrindo, segurando um coração" className="pointer-events-none absolute bottom-0 right-4 hidden h-56 select-none xl:block" />
        </div>
      </section>
    </SiteShell>
  );
}
