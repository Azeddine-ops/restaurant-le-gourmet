-- Le Gourmet / Supabase PostgreSQL schema
-- Execute this file in Supabase SQL Editor

create extension if not exists pgcrypto;

create table if not exists users (
  id text primary key,
  nom text not null,
  prenom text not null,
  email text unique not null,
  password text not null,
  telephone text not null,
  adresse text not null default '',
  role text not null check (role in ('client', 'admin', 'livreur', 'chef')),
  avatar text
);

create table if not exists plats (
  id text primary key,
  nom text not null,
  description text not null default '',
  prix integer not null,
  image text not null,
  "categorieId" text not null,
  disponible boolean not null default true,
  rating numeric(3,1) not null default 4.0,
  "totalRatings" integer not null default 0,
  popular boolean not null default false,
  promotion integer,
  "tempsPreparation" integer not null default 15
);

create table if not exists restaurant_tables (
  id text primary key,
  numero integer not null unique,
  capacite integer not null,
  statut text not null check (statut in ('disponible', 'indisponible')),
  emplacement text not null default 'Intérieur'
);

create table if not exists commandes (
  id text primary key,
  "clientId" text references users(id) on delete cascade,
  "livreurId" text references users(id) on delete set null,
  "adresseLivraison" text not null,
  telephone text not null,
  total integer not null,
  statut text not null check (statut in ('en_attente', 'confirmee', 'en_preparation', 'en_livraison', 'livree', 'annulee')),
  "modePaiement" text not null check ("modePaiement" in ('cash', 'carte')),
  "dateCommande" timestamptz not null default now(),
  note text not null default '',
  items jsonb not null default '[]'::jsonb,
  "fraisLivraison" integer not null default 0,
  "estimationLivraison" text
);

create table if not exists reservations (
  id text primary key,
  "clientId" text references users(id) on delete cascade,
  "tableId" text references restaurant_tables(id) on delete set null,
  "dateReservation" date not null,
  heure text not null,
  "nombrePersonnes" integer not null,
  statut text not null check (statut in ('en_attente', 'confirmee', 'refusee', 'terminee', 'annulee')),
  note text not null default '',
  "platsPrecommandes" jsonb default '[]'::jsonb
);

create table if not exists avis (
  id text primary key,
  "clientId" text references users(id) on delete cascade,
  "platId" text references plats(id) on delete cascade,
  note integer not null check (note between 1 and 5),
  commentaire text not null default '',
  date date not null default current_date
);

alter table users enable row level security;
alter table plats enable row level security;
alter table restaurant_tables enable row level security;
alter table commandes enable row level security;
alter table reservations enable row level security;
alter table avis enable row level security;

drop policy if exists "public full access users" on users;
drop policy if exists "public full access plats" on plats;
drop policy if exists "public full access restaurant_tables" on restaurant_tables;
drop policy if exists "public full access commandes" on commandes;
drop policy if exists "public full access reservations" on reservations;
drop policy if exists "public full access avis" on avis;

create policy "public full access users" on users for all using (true) with check (true);
create policy "public full access plats" on plats for all using (true) with check (true);
create policy "public full access restaurant_tables" on restaurant_tables for all using (true) with check (true);
create policy "public full access commandes" on commandes for all using (true) with check (true);
create policy "public full access reservations" on reservations for all using (true) with check (true);
create policy "public full access avis" on avis for all using (true) with check (true);

create index if not exists idx_commandes_client on commandes("clientId");
create index if not exists idx_commandes_livreur on commandes("livreurId");
create index if not exists idx_reservations_client on reservations("clientId");
create index if not exists idx_avis_client on avis("clientId");
create index if not exists idx_avis_plat on avis("platId");
