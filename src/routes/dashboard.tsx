import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import mya3 from "@/assets/mya-3.webp.asset.json";
import mya6 from "@/assets/favicon.png.asset.json";
import { BOT_API_URL } from "@/lib/mya";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel — Mya" },
      { name: "description", content: "Configure a Mya no seu servidor: boas-vindas, logs, verificação e moderação." },
      { property: "og:title", content: "Painel da Mya" },
      { property: "og:description", content: "Configure a Mya no seu servidor do Discord." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

/* ---------- tipos e API ---------- */
type Chan = { id: string; name: string };
type Role = { id: string; name: string; assignable: boolean };
type LogType = { key: string; label: string; emoji: string; enabled: boolean; channel_id: string | null };
type Config = { auto_role?: string | null; log_channel?: string | null; verify_enabled?: boolean; verify_role?: string | null; verify_method?: string; verify_text?: string; verify_message?: string; [k: string]: any };
type Guild = {
  id: string; name: string; memberCount: number; channels: Chan[]; roles: Role[];
  config: Config; logs: LogType[]; bot: { auditLog: boolean };
};
type Me = {
  user: { id: string; name: string; username: string; avatar: string | null };
  guilds: { id: string; name: string; icon: string | null; botIn: boolean }[];
};
type Case = { case_number: number; type: string; user_tag: string; user_id: string; mod_id: string; reason: string; created_at: string };

class AuthError extends Error {}

async function api<T>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(`${BOT_API_URL}/api${path}`, {
    method: opts.method ?? "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-Mya": "1" },
    body: opts.body ? JSON.stringify(opts.body) : null,
  });
  if (res.status === 401) throw new AuthError("Não autenticado");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Algo deu errado.");
  return data as T;
}

const loginUrl = () => `${BOT_API_URL}/auth/login?redirect=${encodeURIComponent(window.location.href)}`;

/* ---------- página ---------- */
function Dashboard() {
  const [me, setMe] = useState<Me | null>(null);
  const [state, setState] = useState<"loading" | "login" | "error" | "ok">("loading");
  const [err, setErr] = useState("");
  const [guildId, setGuildId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    api<Me>("/me")
      .then((m) => { setMe(m); setState("ok"); })
      .catch((e) => {
        if (e instanceof AuthError) setState("login");
        else { setErr("Não consegui falar com a Mya agora. Tente de novo em instantes."); setState("error"); }
      });
  }, []);

  if (state === "loading") return <Center><p className="text-lg text-muted-foreground">Carregando…</p></Center>;
  if (state === "login") return <LoginScreen />;
  if (state === "error") return <Center><Mascot img={mya6.url} text={err} /></Center>;

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-64 shrink-0 flex-col gap-1 border-r bg-card p-5 md:flex">
        <Link to="/" className="mb-6 flex items-center gap-2 font-display text-xl font-semibold">
          <img
  src="/img/mya-avatar.png"
  alt="Mya"
  className="h-11 w-11 rounded-full"
/>
        </Link>
        <button onClick={() => setGuildId(null)} className="rounded-xl px-3 py-2 text-left font-semibold hover:bg-muted">🏠 Meus servidores</button>
        <a href={`${BOT_API_URL}/invite`} target="_blank" rel="noopener" className="rounded-xl px-3 py-2 font-semibold hover:bg-muted">➕ Adicionar a um servidor</a>
        <div className="flex-1" />
        {me && (
          <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
            {me.user.avatar
              ? <img src={`https://cdn.discordapp.com/avatars/${me.user.id}/${me.user.avatar}.png?size=64`} alt="" className="h-10 w-10 rounded-full" />
              : <div className="h-10 w-10 rounded-full bg-blush" />}
            <div className="min-w-0 text-sm"><p className="truncate font-bold">{me.user.name}</p><p className="truncate text-muted-foreground">@{me.user.username}</p></div>
          </div>
        )}
        <a href={`${BOT_API_URL}/auth/logout`} className="rounded-xl px-3 py-2 font-semibold text-muted-foreground hover:bg-muted">🚪 Sair</a>
      </aside>

      <main className="flex-1 p-5 md:p-10">
        <div className="mx-auto max-w-4xl">
          {guildId ? <GuildView id={guildId} onBack={() => setGuildId(null)} notify={notify} /> : <ServerList me={me!} onPick={setGuildId} />}
        </div>
      </main>

      {toast && (
        <div className={`fixed bottom-6 right-6 rounded-2xl px-5 py-3 font-bold shadow-soft ${toast.ok ? "bg-foreground text-background" : "bg-destructive text-destructive-foreground"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function LoginScreen() {
  return (
    <Center>
      <div className="max-w-md rounded-[2rem] border bg-card p-10 text-center shadow-soft">
        <img src={mya3.url} alt="Mya sorrindo" className="mx-auto h-40" />
        <h1 className="mt-4 text-4xl font-semibold">Painel da Mya</h1>
        <p className="mt-3 text-lg text-muted-foreground">Entre com o Discord para configurar a Mya nos servidores que você gerencia.</p>
        <a href={loginUrl()} className="mt-8 inline-flex rounded-full bg-primary px-8 py-3.5 text-lg font-bold text-primary-foreground hover:opacity-90">Entrar com Discord</a>
        <p className="mt-4"><Link to="/" className="text-sm font-semibold text-muted-foreground hover:underline">← Voltar ao site</Link></p>
      </div>
    </Center>
  );
}

function ServerList({ me, onPick }: { me: Me; onPick: (id: string) => void }) {
  return (
    <>
      <div className="flex items-center justify-between gap-6 rounded-3xl bg-blush-soft p-8">
        <div>
          <h1 className="text-4xl font-semibold">Olá, {me.user.name}! 💗</h1>
          <p className="mt-2 text-lg text-muted-foreground">Escolha um servidor. Aparecem os que você pode <b>Gerenciar</b>.</p>
        </div>
        <img src={mya3.url} alt="" className="hidden h-28 sm:block" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {me.guilds.length === 0 && <p className="text-muted-foreground">Nenhum servidor encontrado.</p>}
        {me.guilds.map((g) => (
          <div key={g.id} className="flex items-center gap-4 rounded-2xl border bg-card p-4">
            {g.icon
              ? <img src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=64`} alt="" className="h-12 w-12 rounded-full" />
              : <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary font-bold">{g.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()}</div>}
            <p className="min-w-0 flex-1 truncate font-bold">{g.name}</p>
            {g.botIn
              ? <button onClick={() => onPick(g.id)} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90">Configurar</button>
              : <a href={`${BOT_API_URL}/invite?guild=${g.id}`} target="_blank" rel="noopener" className="rounded-full border px-4 py-2 text-sm font-bold hover:bg-muted">Adicionar</a>}
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- servidor ---------- */
const TABS = [["geral", "⚙️ Geral"], ["boasvindas", "👋 Boas-vindas"], ["logs", "📋 Logs"], ["verificacao", "✅ Verificação"], ["moderacao", "🛡️ Moderação"]] as const;
type Tab = (typeof TABS)[number][0];

function GuildView({ id, onBack, notify }: { id: string; onBack: () => void; notify: (m: string, ok?: boolean) => void }) {
  const [g, setG] = useState<Guild | null>(null);
  const [tab, setTab] = useState<Tab>("geral");
  const [err, setErr] = useState("");

  useEffect(() => { api<Guild>(`/guilds/${id}`).then(setG).catch((e) => setErr(e.message)); }, [id]);

  if (err) return <><Mascot img={mya6.url} text={err} /><button onClick={onBack} className="mt-4 rounded-full border px-5 py-2 font-bold">Voltar</button></>;
  if (!g) return <p className="text-lg text-muted-foreground">Carregando…</p>;

  const save = async (fn: () => Promise<Guild | void>) => {
    try { const r = await fn(); if (r) setG(r); notify("Alterações salvas! ✅"); } catch (e: any) { notify(e.message, false); }
  };
  const saveConfig = (patch: Config) => api<Guild>(`/guilds/${g.id}/config`, { method: "PUT", body: patch });

  return (
    <>
      <h1 className="text-4xl font-semibold">{g.name}</h1>
      <p className="mt-1 text-muted-foreground">{g.memberCount.toLocaleString("pt-BR")} membros • <button onClick={onBack} className="font-semibold text-accent-foreground hover:underline">trocar de servidor</button></p>
      <nav className="mt-6 flex flex-wrap gap-2">
        {TABS.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === k ? "bg-foreground text-background" : "bg-card border hover:bg-muted"}`}>{label}</button>
        ))}
      </nav>
      <div className="mt-6">
        {tab === "geral" && <GeralTab g={g} save={save} saveConfig={saveConfig} />}
        {tab === "boasvindas" && <WelcomeTab g={g} save={save} saveConfig={saveConfig} />}
        {tab === "logs" && <LogsTab g={g} save={save} saveConfig={saveConfig} />}
        {tab === "verificacao" && <VerifyTab g={g} save={save} saveConfig={saveConfig} notify={notify} />}
        {tab === "moderacao" && <ModTab g={g} />}
      </div>
    </>
  );
}

type TabProps = { g: Guild; save: (fn: () => Promise<Guild | void>) => Promise<void>; saveConfig: (p: Config) => Promise<Guild> };

function GeralTab({ g, save, saveConfig }: TabProps) {
  const [autoRole, setAutoRole] = useState(g.config.auto_role ?? "");
  const [logCh, setLogCh] = useState(g.config.log_channel ?? "");
  return (
    <Card>
      {!g.bot.auditLog && <Note>⚠️ A Mya está sem a permissão <b>Ver registro de auditoria</b>. Os logs funcionam, mas sem mostrar quem executou cada ação.</Note>}
      <Field label="Cargo automático" hint="Entregue a todo membro novo ao entrar."><RoleSelect roles={g.roles} value={autoRole} onChange={setAutoRole} /></Field>
      <Field label="Canal de logs padrão" hint="Usado pelos tipos de log sem canal próprio."><ChanSelect chans={g.channels} value={logCh} onChange={setLogCh} /></Field>
      <SaveBtn onClick={() => save(() => saveConfig({ auto_role: autoRole || null, log_channel: logCh || null }))} />
    </Card>
  );
}

function WelcomeTab({ g, save, saveConfig }: TabProps) {
  const init = (p: string) => ({ enabled: !!g.config[`${p}_enabled`], channel: g.config[`${p}_channel`] ?? "", message: g.config[`${p}_message`] ?? "" });
  const [w, setW] = useState(init("welcome"));
  const [l, setL] = useState(init("leave"));
  const preview = (t: string) => t.split("{user}").join("@Usuário").split("{username}").join("Usuário").split("{server}").join(g.name).split("{memberCount}").join(String(g.memberCount));
  const block = (title: string, s: typeof w, set: (v: typeof w) => void) => (
    <Card>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <Toggle checked={s.enabled} onChange={(v) => set({ ...s, enabled: v })} label="Ativada" />
      <Field label="Canal"><ChanSelect chans={g.channels} value={s.channel} onChange={(v) => set({ ...s, channel: v })} /></Field>
      <Field label="Mensagem" hint="Variáveis: {user} menção • {username} nome • {server} servidor • {memberCount} nº de membros">
        <textarea value={s.message} onChange={(e) => set({ ...s, message: e.target.value })} rows={4} className="w-full rounded-xl border bg-background p-3" />
      </Field>
      <div className="rounded-xl border-l-4 border-leaf bg-muted p-4 text-sm whitespace-pre-wrap">{preview(s.message) || "Prévia da mensagem"}</div>
    </Card>
  );
  return (
    <div className="space-y-4">
      {block("👋 Boas-vindas", w, setW)}
      {block("📤 Saída", l, setL)}
      <SaveBtn onClick={() => save(() => saveConfig({
        welcome_enabled: w.enabled, welcome_channel: w.channel || null, welcome_message: w.message,
        leave_enabled: l.enabled, leave_channel: l.channel || null, leave_message: l.message,
      }))} />
    </div>
  );
}

function LogsTab({ g, save, saveConfig }: TabProps) {
  const [logCh, setLogCh] = useState(g.config.log_channel ?? "");
  const [rows, setRows] = useState(g.logs.map((x) => ({ ...x, channel_id: x.channel_id ?? "" })));
  return (
    <Card>
      <Field label="Canal de logs padrão" hint="Tipos sem canal próprio são enviados aqui."><ChanSelect chans={g.channels} value={logCh} onChange={setLogCh} /></Field>
      <div className="divide-y">
        {rows.map((r, i) => (
          <div key={r.key} className="grid items-center gap-3 py-3 sm:grid-cols-[1fr_auto_1fr]">
            <p className="font-bold">{r.emoji} {r.label}</p>
            <Toggle checked={r.enabled} onChange={(v) => setRows(rows.map((x, j) => (j === i ? { ...x, enabled: v } : x)))} label="" />
            <ChanSelect chans={g.channels} value={r.channel_id} none="↳ Usar canal padrão" onChange={(v) => setRows(rows.map((x, j) => (j === i ? { ...x, channel_id: v } : x)))} />
          </div>
        ))}
      </div>
      <SaveBtn onClick={() => save(async () => {
        await saveConfig({ log_channel: logCh || null });
        const events = Object.fromEntries(rows.map((r) => [r.key, { enabled: r.enabled, channel_id: r.channel_id || null }]));
        return api<Guild>(`/guilds/${g.id}/logs`, { method: "PUT", body: { events } });
      })} />
    </Card>
  );
}

function VerifyTab({ g, save, saveConfig, notify }: TabProps & { notify: (m: string, ok?: boolean) => void }) {
  const c = g.config;
  const [s, setS] = useState({ enabled: !!c.verify_enabled, role: c.verify_role ?? "", method: c.verify_method ?? "status", text: c.verify_text ?? "", message: c.verify_message ?? "" });
  const [panelCh, setPanelCh] = useState("");
  const [sending, setSending] = useState(false);
  return (
    <div className="space-y-4">
      <Card>
        <p className="text-muted-foreground">O membro usa <code>/verificar</code> (ou o botão do painel) e a Mya confere a regra abaixo. Se cumprir, recebe o cargo.</p>
        <Toggle checked={s.enabled} onChange={(v) => setS({ ...s, enabled: v })} label="Verificação ativada" />
        <Field label="Cargo entregue"><RoleSelect roles={g.roles} value={s.role} onChange={(v) => setS({ ...s, role: v })} /></Field>
        <Field label="Método" hint="O Discord não deixa bots lerem bio nem pronomes, por isso usamos o status e a Tag.">
          <select value={s.method} onChange={(e) => setS({ ...s, method: e.target.value })} className={inputCls}>
            <option value="status">Status personalizado</option><option value="tag">Tag do servidor</option><option value="any">Status ou Tag</option>
          </select>
        </Field>
        {s.method !== "tag" && (
          <Field label="Texto procurado no status" hint="Ex.: /mya. Não diferencia maiúsculas de minúsculas.">
            <input value={s.text} maxLength={50} onChange={(e) => setS({ ...s, text: e.target.value })} className={inputCls} />
          </Field>
        )}
        <Field label="Mensagem de sucesso" hint="Variáveis: {user} • {role} • {server}">
          <textarea value={s.message} onChange={(e) => setS({ ...s, message: e.target.value })} rows={3} className="w-full rounded-xl border bg-background p-3" />
        </Field>
        <SaveBtn onClick={() => save(() => saveConfig({ verify_enabled: s.enabled, verify_role: s.role || null, verify_method: s.method, verify_text: s.text, verify_message: s.message }))} />
      </Card>
      <Card>
        <h3 className="text-2xl font-semibold">Painel com botão</h3>
        <Field label="Enviar em"><ChanSelect chans={g.channels} value={panelCh} none="Escolha um canal" onChange={setPanelCh} /></Field>
        <button disabled={sending} onClick={async () => {
          setSending(true);
          try { await api(`/guilds/${g.id}/verification/panel`, { method: "POST", body: { channel_id: panelCh || null } }); notify("Painel enviado! ✅"); }
          catch (e: any) { notify(e.message, false); } finally { setSending(false); }
        }} className="rounded-full border px-6 py-2.5 font-bold hover:bg-muted disabled:opacity-50">Enviar painel</button>
      </Card>
    </div>
  );
}

const CASE_TYPES: Record<string, string> = { ban: "🔨 Banimento", unban: "🔓 Desbanimento", kick: "👢 Expulsão", timeout: "🔇 Timeout", untimeout: "🔊 Timeout removido", warn: "⚠️ Aviso" };

function ModTab({ g }: { g: Guild }) {
  const [cases, setCases] = useState<Case[] | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => { api<Case[]>(`/guilds/${g.id}/cases`).then(setCases).catch((e) => setErr(e.message)); }, [g.id]);
  if (err) return <Mascot img={mya6.url} text={err} />;
  if (!cases) return <p className="text-muted-foreground">Carregando…</p>;
  if (!cases.length) return <Mascot img={mya6.url} text="Nenhum caso de moderação ainda. Tudo tranquilo por aqui! 💗" />;
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-muted-foreground"><tr>{["Caso", "Tipo", "Usuário", "Moderador (ID)", "Motivo", "Data"].map((h) => <th key={h} className="p-2">{h}</th>)}</tr></thead>
          <tbody className="divide-y">
            {cases.map((c) => (
              <tr key={c.case_number}>
                <td className="p-2 font-bold">#{c.case_number}</td>
                <td className="p-2">{CASE_TYPES[c.type] ?? c.type}</td>
                <td className="p-2">{c.user_tag}<br /><small className="text-muted-foreground">{c.user_id}</small></td>
                <td className="p-2"><small>{c.mod_id}</small></td>
                <td className="p-2">{c.reason}</td>
                <td className="p-2">{new Date(c.created_at).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ---------- peças ---------- */
const inputCls = "w-full rounded-xl border bg-background px-3 py-2.5";
const Center = ({ children }: { children: ReactNode }) => <div className="grid min-h-screen place-items-center bg-hero p-5">{children}</div>;
const Card = ({ children }: { children: ReactNode }) => <div className="space-y-5 rounded-3xl border bg-card p-6 md:p-8">{children}</div>;
const Note = ({ children }: { children: ReactNode }) => <div className="rounded-xl bg-accent p-4 text-sm text-accent-foreground">{children}</div>;
const Field = ({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) => (
  <label className="block"><span className="mb-1.5 block font-bold">{label}</span>{children}{hint && <small className="mt-1 block text-muted-foreground">{hint}</small>}</label>
);
const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="inline-flex cursor-pointer items-center gap-3 font-semibold">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-primary" />{label}
  </label>
);
const SaveBtn = ({ onClick }: { onClick: () => Promise<void> }) => {
  const [busy, setBusy] = useState(false);
  return <button disabled={busy} onClick={async () => { setBusy(true); await onClick(); setBusy(false); }} className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50">Salvar</button>;
};
const ChanSelect = ({ chans, value, onChange, none = "— Nenhum —" }: { chans: Chan[]; value: string; onChange: (v: string) => void; none?: string }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
    <option value="">{none}</option>{chans.map((c) => <option key={c.id} value={c.id}>#{c.name}</option>)}
  </select>
);
const RoleSelect = ({ roles, value, onChange }: { roles: Role[]; value: string; onChange: (v: string) => void }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
    <option value="">— Nenhum —</option>
    {roles.map((r) => <option key={r.id} value={r.id} disabled={!r.assignable}>@{r.name}{r.assignable ? "" : " (acima do cargo da Mya)"}</option>)}
  </select>
);
const Mascot = ({ img, text }: { img: string; text: string }) => (
  <div className="rounded-3xl border bg-card p-10 text-center"><img src={img} alt="" className="mx-auto h-36" /><p className="mt-4 text-lg text-muted-foreground">{text}</p></div>
);
