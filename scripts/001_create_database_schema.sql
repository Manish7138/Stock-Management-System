-- Mutual Fund Management System Database Schema
-- This script creates all necessary tables with proper relationships and constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- USER PROFILES & ROLES
-- ==========================================

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('investor', 'portfolio_manager', 'admin')),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investor-specific data
CREATE TABLE IF NOT EXISTS public.investor_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
  investment_experience TEXT CHECK (investment_experience IN ('beginner', 'intermediate', 'advanced')),
  annual_income NUMERIC(15, 2),
  investment_goals TEXT,
  completed_risk_assessment BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- MUTUAL FUNDS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.mutual_funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_name TEXT NOT NULL UNIQUE,
  fund_code TEXT NOT NULL UNIQUE,
  fund_type TEXT NOT NULL CHECK (fund_type IN ('equity', 'debt', 'hybrid', 'index', 'sector')),
  objective TEXT NOT NULL,
  benchmark TEXT,
  expense_ratio NUMERIC(5, 3),
  minimum_investment NUMERIC(15, 2) DEFAULT 1000,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  aum NUMERIC(20, 2) DEFAULT 0, -- Assets Under Management
  nav NUMERIC(15, 4) DEFAULT 10.00, -- Net Asset Value
  inception_date DATE DEFAULT CURRENT_DATE,
  manager_id UUID REFERENCES public.profiles(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NAV History (for tracking daily NAV changes)
CREATE TABLE IF NOT EXISTS public.nav_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID NOT NULL REFERENCES public.mutual_funds(id) ON DELETE CASCADE,
  nav NUMERIC(15, 4) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fund_id, date)
);

-- ==========================================
-- INVESTMENTS & HOLDINGS
-- ==========================================

-- User investments in mutual funds
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fund_id UUID NOT NULL REFERENCES public.mutual_funds(id) ON DELETE RESTRICT,
  units NUMERIC(15, 4) DEFAULT 0,
  average_nav NUMERIC(15, 4),
  total_invested NUMERIC(15, 2) DEFAULT 0,
  current_value NUMERIC(15, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(investor_id, fund_id)
);

-- ==========================================
-- TRANSACTIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fund_id UUID NOT NULL REFERENCES public.mutual_funds(id) ON DELETE RESTRICT,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buy', 'sell', 'dividend')),
  units NUMERIC(15, 4) NOT NULL,
  nav NUMERIC(15, 4) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- WATCHLIST
-- ==========================================

CREATE TABLE IF NOT EXISTS public.watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fund_id UUID NOT NULL REFERENCES public.mutual_funds(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fund_id)
);

-- ==========================================
-- MARKET DATA (for securities/stocks)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.securities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sector TEXT,
  current_price NUMERIC(15, 2),
  previous_close NUMERIC(15, 2),
  market_cap NUMERIC(20, 2),
  volume BIGINT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fund holdings (which securities each fund holds)
CREATE TABLE IF NOT EXISTS public.fund_holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID NOT NULL REFERENCES public.mutual_funds(id) ON DELETE CASCADE,
  security_id UUID REFERENCES public.securities(id) ON DELETE SET NULL,
  quantity NUMERIC(15, 4),
  allocation_percentage NUMERIC(5, 2),
  purchase_price NUMERIC(15, 2),
  current_value NUMERIC(15, 2),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- AUDIT LOGS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- PERFORMANCE METRICS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.fund_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID NOT NULL REFERENCES public.mutual_funds(id) ON DELETE CASCADE,
  period TEXT NOT NULL CHECK (period IN ('1D', '1W', '1M', '3M', '6M', '1Y', '3Y', '5Y')),
  returns NUMERIC(8, 4),
  sharpe_ratio NUMERIC(8, 4),
  alpha NUMERIC(8, 4),
  beta NUMERIC(8, 4),
  standard_deviation NUMERIC(8, 4),
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fund_id, period)
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_mutual_funds_active ON public.mutual_funds(is_active);
CREATE INDEX IF NOT EXISTS idx_mutual_funds_type ON public.mutual_funds(fund_type);
CREATE INDEX IF NOT EXISTS idx_investments_investor ON public.investments(investor_id);
CREATE INDEX IF NOT EXISTS idx_investments_fund ON public.investments(fund_id);
CREATE INDEX IF NOT EXISTS idx_transactions_investor ON public.transactions(investor_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_nav_history_fund_date ON public.nav_history(fund_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
