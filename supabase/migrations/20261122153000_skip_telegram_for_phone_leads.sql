-- Client CRM phone leads must not notify Kalvez Telegram.

create or replace function public.notify_lead_telegram()
returns trigger
language plpgsql
security definer
set search_path to 'public', 'vault', 'net'
as $function$
declare
  bot_token text;
  chat_id text;
  message text;
  request_id bigint;
  headline text;
  tag_label text;
begin
  -- Brand-client CRM entries (phone / dashboard) stay out of staff Telegram.
  if new.channel = 'phone'
     or new.source = 'phone'
     or (new.tags is not null and 'phone' = any(new.tags)) then
    return new;
  end if;

  select decrypted_secret into bot_token
  from vault.decrypted_secrets
  where name = 'telegram_bot_token'
  limit 1;

  select decrypted_secret into chat_id
  from vault.decrypted_secrets
  where name = 'telegram_chat_id'
  limit 1;

  if bot_token is null or chat_id is null then
    raise warning 'Telegram vault secrets missing; skipping notify';
    return new;
  end if;

  if new.tags is not null and 'report' = any(new.tags) then
    headline := '📊 Presence report lead - call them';
  elsif new.tags is not null and 'free demo' = any(new.tags) then
    headline := '📞 Free demo lead - call them';
  else
    headline := '📞 Inbound lead - call them';
  end if;

  message := format(
    E'%s\n\n%s %s\n%s\n%s · %s\n\n📱 %s\n✉️ %s\n🕐 Best time: %s',
    headline,
    coalesce(new.first_name, ''),
    coalesce(new.last_name, ''),
    coalesce(new.business, ''),
    coalesce(new.trade, ''),
    coalesce(new.town, ''),
    coalesce(new.phone, ''),
    coalesce(new.email, ''),
    coalesce(new.best_time, '')
  );

  if new.tags is not null and cardinality(new.tags) > 0 then
    tag_label := array_to_string(new.tags, ', ');
    message := message || E'\n🏷️ Tag: ' || tag_label;
  end if;

  if new.source is not null and new.source <> '' then
    message := message || E'\n🔎 Heard via: ' || new.source;
  end if;

  if new.comments is not null and new.comments <> '' then
    message := message || E'\n\nNotes: ' || new.comments;
  end if;

  select net.http_post(
    url := 'https://api.telegram.org/bot' || bot_token || '/sendMessage',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object(
      'chat_id', chat_id,
      'text', message,
      'disable_web_page_preview', true
    )
  )
  into request_id;

  return new;
end;
$function$;
