-- Mente Inquebrantable — tabla de sincronización.
-- Pegar completo en Supabase → SQL Editor → Run.
-- Guarda UNA fila por usuario con su progreso (sin finanzas).

create table if not exists public.tracker_state (
    user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
    data       jsonb not null,
    updated_at timestamptz not null default now()
);

-- Seguridad: cada usuario solo puede ver y modificar SU fila.
-- Sin sesión (clave pública sola) no se puede leer ni escribir nada.
alter table public.tracker_state enable row level security;

drop policy if exists "leer lo propio" on public.tracker_state;
create policy "leer lo propio" on public.tracker_state
    for select to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists "crear lo propio" on public.tracker_state;
create policy "crear lo propio" on public.tracker_state
    for insert to authenticated
    with check ((select auth.uid()) = user_id);

drop policy if exists "editar lo propio" on public.tracker_state;
create policy "editar lo propio" on public.tracker_state
    for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

-- No hay regla de borrado: nadie puede borrar la fila desde la app.
revoke all on public.tracker_state from anon;
