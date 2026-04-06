-- =============================================================================
-- Initial schema for Kids Box App
-- =============================================================================

-- ─── Utility: updated_at auto-refresh ────────────────────────────────────────

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Profiles ─────────────────────────────────────────────────────────────────
-- One row per authenticated user. Created automatically on sign-up.

create table profiles (
  id                       uuid        primary key references auth.users(id) on delete cascade,
  full_name                text,
  phone                    text,
  default_shipping_address jsonb,
  stripe_customer_id       text        unique,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-provision a profile row when a new auth user signs up.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─── Children ─────────────────────────────────────────────────────────────────

create table children (
  id         uuid        primary key default gen_random_uuid(),
  parent_id  uuid        not null references profiles(id) on delete cascade,
  name       text        not null,
  birth_date date        not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger children_updated_at
  before update on children
  for each row execute function set_updated_at();

create index children_parent_id_idx on children(parent_id);

-- ─── Boxes ────────────────────────────────────────────────────────────────────
-- The product catalogue. Age range expressed in months for precise matching.

create table boxes (
  id              uuid          primary key default gen_random_uuid(),
  slug            text          not null unique,
  name            text          not null,
  description     text,
  age_min_months  int           not null check (age_min_months >= 0),
  age_max_months  int           not null check (age_max_months > age_min_months),
  monthly_price   numeric(10,2) not null check (monthly_price >= 0),
  stripe_price_id text          unique,
  cover_image_url text,
  sort_order      int           not null default 0,
  is_active       boolean       not null default true,
  created_at      timestamptz   not null default now(),
  updated_at      timestamptz   not null default now()
);

create trigger boxes_updated_at
  before update on boxes
  for each row execute function set_updated_at();

-- Used when rendering the catalogue in sort order, filtered to active only.
create index boxes_active_sort_idx on boxes(is_active, sort_order);

-- ─── Subscriptions ────────────────────────────────────────────────────────────
--
-- Status values:
--   trialing   — trial period is active; no payment taken yet
--   active     — paid and current
--   paused     — parent manually paused; no upcoming shipments
--   past_due   — latest payment failed; in grace period
--   cancelled  — permanently terminated
--

create type subscription_status as enum (
  'trialing',
  'active',
  'paused',
  'past_due',
  'cancelled'
);

create table subscriptions (
  id                     uuid                primary key default gen_random_uuid(),
  profile_id             uuid                not null references profiles(id) on delete restrict,
  child_id               uuid                not null references children(id) on delete restrict,
  box_id                 uuid                not null references boxes(id) on delete restrict,
  stripe_subscription_id text                unique,
  status                 subscription_status not null default 'trialing',
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  created_at             timestamptz         not null default now(),
  updated_at             timestamptz         not null default now()
);

create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute function set_updated_at();

create index subscriptions_profile_id_idx on subscriptions(profile_id);
create index subscriptions_child_id_idx   on subscriptions(child_id);
create index subscriptions_status_idx     on subscriptions(status);

-- ─── Orders ───────────────────────────────────────────────────────────────────
--
-- Status values:
--   pending    — created but not yet paid
--   paid       — payment confirmed
--   shipped    — dispatched to carrier
--   delivered  — confirmed delivered
--   cancelled  — voided before shipment
--

create type order_status as enum (
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled'
);

create table orders (
  id                       uuid          primary key default gen_random_uuid(),
  profile_id               uuid          not null references profiles(id) on delete restrict,
  subscription_id          uuid          references subscriptions(id) on delete set null,
  stripe_payment_intent_id text          unique,
  status                   order_status  not null default 'pending',
  total_amount             numeric(10,2) not null check (total_amount >= 0),
  shipping_address         jsonb         not null,
  created_at               timestamptz   not null default now(),
  updated_at               timestamptz   not null default now()
);

create trigger orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

create index orders_profile_id_idx      on orders(profile_id);
create index orders_subscription_id_idx on orders(subscription_id);
create index orders_status_idx          on orders(status);

-- ─── Order Items ──────────────────────────────────────────────────────────────

create table order_items (
  id         uuid          primary key default gen_random_uuid(),
  order_id   uuid          not null references orders(id) on delete cascade,
  box_id     uuid          not null references boxes(id) on delete restrict,
  quantity   int           not null default 1 check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  created_at timestamptz   not null default now(),
  updated_at timestamptz   not null default now()
);

create trigger order_items_updated_at
  before update on order_items
  for each row execute function set_updated_at();

create index order_items_order_id_idx on order_items(order_id);
create index order_items_box_id_idx   on order_items(box_id);

-- =============================================================================
-- Row Level Security
-- =============================================================================

alter table profiles      enable row level security;
alter table children      enable row level security;
alter table boxes         enable row level security;
alter table subscriptions enable row level security;
alter table orders        enable row level security;
alter table order_items   enable row level security;

-- ─── profiles ─────────────────────────────────────────────────────────────────
-- Users can read and update only their own profile.
-- Insert is handled by the handle_new_user trigger (service role), not the user.

create policy "profiles: owner read"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: owner update"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── children ─────────────────────────────────────────────────────────────────

create policy "children: parent full access"
  on children for all
  using  (auth.uid() = parent_id)
  with check (auth.uid() = parent_id);

-- ─── boxes ────────────────────────────────────────────────────────────────────
-- Public read for active boxes only. All writes go through the service role
-- (admin dashboard / seeding scripts), never through the anon/user roles.

create policy "boxes: public read active"
  on boxes for select
  using (is_active = true);

-- ─── subscriptions ────────────────────────────────────────────────────────────

create policy "subscriptions: owner read"
  on subscriptions for select
  using (auth.uid() = profile_id);

-- Users may insert their own subscriptions (e.g. checkout flow).
create policy "subscriptions: owner insert"
  on subscriptions for insert
  with check (auth.uid() = profile_id);

-- Users may update their own subscriptions (e.g. pause/cancel).
create policy "subscriptions: owner update"
  on subscriptions for update
  using  (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- ─── orders ───────────────────────────────────────────────────────────────────

create policy "orders: owner read"
  on orders for select
  using (auth.uid() = profile_id);

-- Order creation is handled server-side (route handler / webhook) using the
-- service role, so users only need SELECT here.

-- ─── order_items ──────────────────────────────────────────────────────────────
-- Inherit access from the parent order.

create policy "order_items: owner read"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.profile_id = auth.uid()
    )
  );
