-- Row Level Security (RLS) Policies
-- This ensures users can only access their own data

-- ==========================================
-- PROFILES TABLE
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==========================================
-- INVESTOR PROFILES TABLE
-- ==========================================

ALTER TABLE public.investor_profiles ENABLE ROW LEVEL SECURITY;

-- Investors can view and update their own data
CREATE POLICY "Investors can view own data"
  ON public.investor_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Investors can update own data"
  ON public.investor_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Investors can insert own data"
  ON public.investor_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- MUTUAL FUNDS TABLE
-- ==========================================

ALTER TABLE public.mutual_funds ENABLE ROW LEVEL SECURITY;

-- Everyone can view active funds
CREATE POLICY "Anyone can view active funds"
  ON public.mutual_funds FOR SELECT
  USING (is_active = TRUE);

-- Portfolio managers can manage funds they're assigned to
CREATE POLICY "Portfolio managers can update their funds"
  ON public.mutual_funds FOR UPDATE
  USING (
    auth.uid() = manager_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can insert new funds
CREATE POLICY "Admins can insert funds"
  ON public.mutual_funds FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==========================================
-- NAV HISTORY TABLE
-- ==========================================

ALTER TABLE public.nav_history ENABLE ROW LEVEL SECURITY;

-- Everyone can view NAV history
CREATE POLICY "Anyone can view NAV history"
  ON public.nav_history FOR SELECT
  USING (TRUE);

-- Portfolio managers can insert NAV updates
CREATE POLICY "Portfolio managers can insert NAV"
  ON public.nav_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('portfolio_manager', 'admin')
    )
  );

-- ==========================================
-- INVESTMENTS TABLE
-- ==========================================

ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Investors can view their own investments
CREATE POLICY "Investors can view own investments"
  ON public.investments FOR SELECT
  USING (auth.uid() = investor_id);

-- Investors can insert their own investments
CREATE POLICY "Investors can insert own investments"
  ON public.investments FOR INSERT
  WITH CHECK (auth.uid() = investor_id);

-- Investors can update their own investments
CREATE POLICY "Investors can update own investments"
  ON public.investments FOR UPDATE
  USING (auth.uid() = investor_id);

-- Admins can view all investments
CREATE POLICY "Admins can view all investments"
  ON public.investments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==========================================
-- TRANSACTIONS TABLE
-- ==========================================

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Investors can view their own transactions
CREATE POLICY "Investors can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = investor_id);

-- Investors can insert their own transactions
CREATE POLICY "Investors can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = investor_id);

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==========================================
-- WATCHLIST TABLE
-- ==========================================

ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- Users can manage their own watchlist
CREATE POLICY "Users can view own watchlist"
  ON public.watchlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own watchlist"
  ON public.watchlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own watchlist"
  ON public.watchlist FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- SECURITIES & FUND HOLDINGS
-- ==========================================

ALTER TABLE public.securities ENABLE ROW LEVEL SECURITY;

-- Everyone can view securities
CREATE POLICY "Anyone can view securities"
  ON public.securities FOR SELECT
  USING (TRUE);

-- Portfolio managers and admins can manage securities
CREATE POLICY "Managers can manage securities"
  ON public.securities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('portfolio_manager', 'admin')
    )
  );

ALTER TABLE public.fund_holdings ENABLE ROW LEVEL SECURITY;

-- Everyone can view fund holdings
CREATE POLICY "Anyone can view fund holdings"
  ON public.fund_holdings FOR SELECT
  USING (TRUE);

-- Portfolio managers can manage holdings
CREATE POLICY "Managers can manage holdings"
  ON public.fund_holdings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('portfolio_manager', 'admin')
    )
  );

-- ==========================================
-- AUDIT LOGS
-- ==========================================

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (TRUE);

-- ==========================================
-- FUND PERFORMANCE
-- ==========================================

ALTER TABLE public.fund_performance ENABLE ROW LEVEL SECURITY;

-- Everyone can view fund performance
CREATE POLICY "Anyone can view fund performance"
  ON public.fund_performance FOR SELECT
  USING (TRUE);

-- Portfolio managers can insert/update performance metrics
CREATE POLICY "Managers can manage performance metrics"
  ON public.fund_performance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('portfolio_manager', 'admin')
    )
  );
