-- Sales platform: link leads to presence reports and mark inbound/outbound.

alter table public.leads
  add column if not exists direction text not null default 'inbound',
  add column if not exists channel text null,
  add column if not exists place_id text null,
  add column if not exists report_id uuid null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'leads_direction_check'
  ) then
    alter table public.leads
      add constraint leads_direction_check
      check (direction in ('inbound', 'outbound'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'leads_channel_check'
  ) then
    alter table public.leads
      add constraint leads_channel_check
      check (
        channel is null
        or channel in ('free_demo', 'presence_report', 'manual', 'import')
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'leads_report_id_fkey'
  ) then
    alter table public.leads
      add constraint leads_report_id_fkey
      foreign key (report_id)
      references public.presence_reports(id)
      on delete set null;
  end if;
end $$;

create index if not exists leads_direction_idx on public.leads (direction);
create index if not exists leads_channel_idx on public.leads (channel);
create index if not exists leads_place_id_idx on public.leads (place_id);
create index if not exists leads_report_id_idx on public.leads (report_id);

comment on column public.leads.direction is 'inbound = came to us; outbound = we prospected.';
comment on column public.leads.channel is 'Acquisition or creation channel for the lead.';
comment on column public.leads.place_id is 'Google Place ID when known, for dedupe and report joins.';
comment on column public.leads.report_id is 'Primary presence report linked for sales reference.';

alter table public.presence_reports
  add column if not exists overall_score integer null,
  add column if not exists grade text null,
  add column if not exists completed_at timestamptz null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'presence_reports_grade_check'
  ) then
    alter table public.presence_reports
      add constraint presence_reports_grade_check
      check (grade is null or grade in ('A', 'B', 'C', 'D', 'F'));
  end if;
end $$;

create index if not exists presence_reports_overall_score_idx
  on public.presence_reports (overall_score);
create index if not exists presence_reports_completed_at_idx
  on public.presence_reports (completed_at);

update public.presence_reports
set
  overall_score = coalesce(
    overall_score,
    nullif(score_payload #>> '{score,overall}', '')::integer
  ),
  grade = coalesce(
    grade,
    nullif(score_payload #>> '{score,grade}', '')
  ),
  completed_at = coalesce(
    completed_at,
    case
      when status in ('ready', 'unlocked') then coalesce(unlocked_at, updated_at)
      else null
    end
  )
where score_payload is not null;

update public.leads l
set
  channel = coalesce(
    l.channel,
    case
      when 'report' = any (l.tags) then 'presence_report'
      when 'free demo' = any (l.tags) then 'free_demo'
      else l.channel
    end
  ),
  direction = coalesce(l.direction, 'inbound');

update public.leads l
set
  report_id = pr.id,
  place_id = coalesce(l.place_id, pr.place_id)
from public.presence_reports pr
where pr.lead_id = l.id
  and (l.report_id is null or l.place_id is null);
