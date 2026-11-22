-- Brand-scoped CRM: link leads to brands, checklist, phone channel.

alter table public.leads
  add column if not exists brand_id uuid null,
  add column if not exists checklist jsonb not null default
    '{"called":false,"quoted":false,"scheduled":false,"followed_up":false}'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'leads_brand_id_fkey'
  ) then
    alter table public.leads
      add constraint leads_brand_id_fkey
      foreign key (brand_id)
      references public.brands(id)
      on delete set null;
  end if;
end $$;

-- Expand channel check to include phone.
alter table public.leads drop constraint if exists leads_channel_check;
alter table public.leads
  add constraint leads_channel_check
  check (
    channel is null
    or channel in (
      'free_demo',
      'presence_report',
      'manual',
      'import',
      'phone'
    )
  );

create index if not exists leads_brand_id_idx on public.leads (brand_id);
create index if not exists leads_brand_id_created_at_idx
  on public.leads (brand_id, created_at desc);

comment on column public.leads.brand_id is
  'Owning brand for client CRM. Null for Kalvez sales leads.';
comment on column public.leads.checklist is
  'Fixed client CRM actions: called, quoted, scheduled, followed_up.';

-- Backfill brand_id from generated-site source slug.
update public.leads l
set brand_id = b.id
from public.brands b
where l.brand_id is null
  and l.source = 'site:' || b.slug;
