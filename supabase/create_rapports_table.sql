-- Exécute ce script dans Supabase SQL Editor
-- pour créer la table des rapports

create table if not exists rapports (
  id text primary key,
  "clientId" text references users(id) on delete cascade,
  sujet text not null check (sujet in ('commande', 'livraison', 'qualite', 'service', 'autre')),
  message text not null,
  statut text not null check (statut in ('nouveau', 'en_cours', 'resolu')),
  date date not null default current_date,
  "reponseAdmin" text
);

alter table rapports enable row level security;

drop policy if exists "public full access rapports" on rapports;
create policy "public full access rapports" on rapports for all using (true) with check (true);

create index if not exists idx_rapports_client on rapports("clientId");
