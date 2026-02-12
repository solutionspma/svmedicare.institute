-- ═══════════════════════════════════════════════════════════════
-- SV Medicare Institute — RLS Policies
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rank_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;

-- Modules: public read (published), admin write
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─────────────────────────────────────────────────────────────
-- THEME STATE
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own theme state"
  ON theme_state FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own theme state"
  ON theme_state FOR UPDATE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- XP RECORDS
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own XP"
  ON xp_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own XP (via trigger)"
  ON xp_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update XP"
  ON xp_records FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─────────────────────────────────────────────────────────────
-- RANK HISTORY
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own rank history"
  ON rank_history FOR SELECT
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- MODULES (public read for published)
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can view published modules"
  ON modules FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage modules"
  ON modules FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─────────────────────────────────────────────────────────────
-- MODULE COMPLETIONS
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own completions"
  ON module_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
  ON module_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- QUIZ ATTEMPTS
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- BADGES (public read)
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage badges"
  ON badges FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─────────────────────────────────────────────────────────────
-- USER BADGES
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view others' badges (for leaderboard)"
  ON user_badges FOR SELECT
  USING (true);

-- ─────────────────────────────────────────────────────────────
-- PERFORMANCE LOGS
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own performance logs"
  ON performance_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own performance logs"
  ON performance_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- LEADERBOARDS (public read for ranking)
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can view leaderboard"
  ON leaderboards FOR SELECT
  USING (true);

CREATE POLICY "Users can view own leaderboard entry"
  ON leaderboards FOR SELECT
  USING (auth.uid() = user_id);
