-- ═══════════════════════════════════════════════════════════════
-- SV Medicare Institute — Seed Data (3 starter missions)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO modules (title, description, slug, xp_reward, order_index, level_required) VALUES
  (
    'Mission 1: Medicare Basics',
    'Define Parts A, B, C, D. Master eligibility and enrollment periods.',
    'medicare-basics',
    150,
    1,
    'level_1_foundation'
  ),
  (
    'Mission 2: Plan Types & Benefits',
    'Compare Medicare Advantage vs Original Medicare. Explore Medigap and Part D.',
    'plan-types',
    200,
    2,
    'level_1_foundation'
  ),
  (
    'Mission 3: Compliance Drills',
    'CMS regulations for Medicare marketing. Compliant vs non-compliant messaging.',
    'compliance-drills',
    250,
    3,
    'level_1_foundation'
  );
