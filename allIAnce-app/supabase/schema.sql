-- ============================================================================
-- All(IA)nce — schéma Supabase  (À CRÉER EN RÉGION EU / Francfort)
-- À exécuter dans Supabase > SQL Editor.
-- Principe : le facilitateur (authentifié) ne voit QUE ses propres clients.
-- Les répondants sont anonymes et ne peuvent RIEN lire ; les insertions
-- passent uniquement par le serveur (service role) après scoring.
-- ============================================================================
create extension if not exists "pgcrypto";

create table clients (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid(),      -- facilitateur propriétaire
  name text not null,
  created_at timestamptz not null default now()
);

create table teams (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  name text not null,
  code_hash text not null unique,              -- hash du code normalisé (jamais le code brut)
  created_at timestamptz not null default now()
);

-- Vagues : permettent de re-diagnostiquer une équipe dans le temps (suivi longitudinal)
create table waves (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  label text not null default 'V1',
  opened_at timestamptz not null default now(),
  closed_at timestamptz
);

create table responses (
  id uuid primary key default gen_random_uuid(),
  wave_id uuid not null references waves(id) on delete cascade,
  participant text not null,                   -- identifiant pseudonyme choisi par le répondant
  lang text not null default 'fr',
  answers jsonb not null,                      -- réponses brutes {code: valeur}
  open_answers jsonb not null default '{}'::jsonb,
  scores jsonb not null,                       -- calculé CÔTÉ SERVEUR
  submitted_at timestamptz not null default now()
);

create index on teams(client_id);
create index on waves(team_id);
create index on responses(wave_id);

-- ---------------------- Row Level Security ----------------------------------
alter table clients   enable row level security;
alter table teams     enable row level security;
alter table waves     enable row level security;
alter table responses enable row level security;

create policy "own clients" on clients
  for all using (owner = auth.uid()) with check (owner = auth.uid());

create policy "own teams" on teams
  for all using (exists (select 1 from clients c where c.id = teams.client_id and c.owner = auth.uid()))
  with check (exists (select 1 from clients c where c.id = teams.client_id and c.owner = auth.uid()));

create policy "own waves" on waves
  for all using (exists (select 1 from teams t join clients c on c.id=t.client_id
                         where t.id = waves.team_id and c.owner = auth.uid()));

create policy "own responses (read)" on responses
  for select using (exists (select 1 from waves w join teams t on t.id=w.team_id join clients c on c.id=t.client_id
                            where w.id = responses.wave_id and c.owner = auth.uid()));

-- ⚠ Aucune policy INSERT pour anon : la clé anon NE PEUT PAS insérer.
--   Les réponses sont insérées uniquement par le serveur avec la SERVICE ROLE key
--   (voir app/api/submit/route.ts), après validation du code + scoring.
--   RÉTENTION / RGPD : la suppression d'un client cascade sur teams > waves > responses.
