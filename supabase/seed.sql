-- =============================================================================
-- Seed data for Kids Box App
--
-- HOW TO RUN:
--   Option A — Supabase SQL Editor:
--     Paste the contents of this file and click Run.
--
--   Option B — Supabase CLI (requires `supabase link`):
--     supabase db seed
--
-- Safe to re-run: ON CONFLICT DO NOTHING.
-- =============================================================================

insert into public.boxes
  (slug, name, description, age_min_months, age_max_months, monthly_price, sort_order)
values
  (
    'wonder',
    'Wonder Box',
    'Gentle sensory exploration for your newest arrival. Soft textures, high-contrast visuals, and soothing sounds to nurture early neural connections.',
    0, 6, 39.00, 1
  ),
  (
    'discovery',
    'Discovery Box',
    'Cause-and-effect toys that reward every reach and grab. Designed to fuel curiosity and build the fine motor skills developing right now.',
    6, 8, 39.00, 2
  ),
  (
    'explorer',
    'Explorer Box',
    'Object permanence games and crawl-friendly toys for babies always on the move. Keeps up with every new discovery.',
    8, 10, 42.00, 3
  ),
  (
    'mover',
    'Mover Box',
    'Tools for pulling up, cruising, and the vocabulary explosion that comes with newfound independence. Celebrates every milestone.',
    10, 12, 42.00, 4
  ),
  (
    'builder',
    'Builder Box',
    'Stacking, sorting, and first pretend play for your confident little walker. Grows with the imagination waking up inside them.',
    12, 18, 45.00, 5
  ),
  (
    'thinker',
    'Thinker Box',
    'Problem-solving puzzles and open-ended play materials for the toddler who questions everything and remembers it all.',
    18, 24, 45.00, 6
  )
on conflict (slug) do nothing;
