-- Sample Data for Testing and Presentation
-- This script populates the database with realistic data

-- ==========================================
-- SAMPLE MUTUAL FUNDS
-- ==========================================

INSERT INTO public.mutual_funds (
  fund_name, fund_code, fund_type, objective, benchmark, expense_ratio, 
  minimum_investment, risk_level, nav, aum, inception_date
) VALUES
  (
    'Blue Chip Equity Fund',
    'BCEF001',
    'equity',
    'Long-term capital appreciation through investments in large-cap stocks',
    'NIFTY 50',
    0.75,
    5000,
    'medium',
    15.42,
    500000000,
    '2020-01-15'
  ),
  (
    'Growth Opportunities Fund',
    'GOF002',
    'equity',
    'Aggressive growth through mid and small-cap stocks',
    'NIFTY Midcap 100',
    1.25,
    3000,
    'high',
    22.18,
    250000000,
    '2019-06-01'
  ),
  (
    'Stable Income Debt Fund',
    'SIDF003',
    'debt',
    'Regular income with capital preservation through debt securities',
    'CRISIL Composite Bond Index',
    0.50,
    1000,
    'low',
    11.87,
    750000000,
    '2018-03-20'
  ),
  (
    'Balanced Hybrid Fund',
    'BHF004',
    'hybrid',
    'Balanced portfolio of equity and debt for moderate risk-return',
    '70% NIFTY 50 + 30% CRISIL',
    1.00,
    2500,
    'medium',
    18.95,
    400000000,
    '2020-09-10'
  ),
  (
    'Technology Sector Fund',
    'TSF005',
    'sector',
    'Investment in technology and IT sector companies',
    'NIFTY IT Index',
    1.50,
    5000,
    'high',
    28.34,
    180000000,
    '2021-02-15'
  ),
  (
    'Index Fund 50',
    'IF50006',
    'index',
    'Passive investment tracking NIFTY 50 index',
    'NIFTY 50',
    0.25,
    1000,
    'medium',
    13.67,
    900000000,
    '2017-11-01'
  );

-- ==========================================
-- SAMPLE NAV HISTORY (last 30 days)
-- ==========================================

-- Blue Chip Equity Fund history
INSERT INTO public.nav_history (fund_id, nav, date)
SELECT 
  id,
  15.42 + (random() * 0.5 - 0.25) * (30 - day_offset) / 30,
  CURRENT_DATE - day_offset
FROM public.mutual_funds
CROSS JOIN generate_series(0, 29) AS day_offset
WHERE fund_code = 'BCEF001';

-- Growth Opportunities Fund history
INSERT INTO public.nav_history (fund_id, nav, date)
SELECT 
  id,
  22.18 + (random() * 1.0 - 0.5) * (30 - day_offset) / 30,
  CURRENT_DATE - day_offset
FROM public.mutual_funds
CROSS JOIN generate_series(0, 29) AS day_offset
WHERE fund_code = 'GOF002';

-- Stable Income Debt Fund history
INSERT INTO public.nav_history (fund_id, nav, date)
SELECT 
  id,
  11.87 + (random() * 0.1 - 0.05) * (30 - day_offset) / 30,
  CURRENT_DATE - day_offset
FROM public.mutual_funds
CROSS JOIN generate_series(0, 29) AS day_offset
WHERE fund_code = 'SIDF003';

-- Balanced Hybrid Fund history
INSERT INTO public.nav_history (fund_id, nav, date)
SELECT 
  id,
  18.95 + (random() * 0.4 - 0.2) * (30 - day_offset) / 30,
  CURRENT_DATE - day_offset
FROM public.mutual_funds
CROSS JOIN generate_series(0, 29) AS day_offset
WHERE fund_code = 'BHF004';

-- Technology Sector Fund history
INSERT INTO public.nav_history (fund_id, nav, date)
SELECT 
  id,
  28.34 + (random() * 1.5 - 0.75) * (30 - day_offset) / 30,
  CURRENT_DATE - day_offset
FROM public.mutual_funds
CROSS JOIN generate_series(0, 29) AS day_offset
WHERE fund_code = 'TSF005';

-- Index Fund 50 history
INSERT INTO public.nav_history (fund_id, nav, date)
SELECT 
  id,
  13.67 + (random() * 0.3 - 0.15) * (30 - day_offset) / 30,
  CURRENT_DATE - day_offset
FROM public.mutual_funds
CROSS JOIN generate_series(0, 29) AS day_offset
WHERE fund_code = 'IF50006';

-- ==========================================
-- SAMPLE PERFORMANCE METRICS
-- ==========================================

INSERT INTO public.fund_performance (fund_id, period, returns, sharpe_ratio, alpha, beta, standard_deviation)
SELECT 
  id,
  period,
  CASE period
    WHEN '1D' THEN random() * 2 - 1
    WHEN '1W' THEN random() * 3 - 1.5
    WHEN '1M' THEN random() * 5 - 2
    WHEN '3M' THEN random() * 8 - 2
    WHEN '6M' THEN random() * 12 - 3
    WHEN '1Y' THEN random() * 20 - 5
    WHEN '3Y' THEN random() * 40 - 10
    WHEN '5Y' THEN random() * 80 - 20
  END,
  1.2 + random() * 0.5,
  random() * 2 - 0.5,
  0.9 + random() * 0.3,
  random() * 5 + 10
FROM public.mutual_funds
CROSS JOIN (VALUES ('1D'), ('1W'), ('1M'), ('3M'), ('6M'), ('1Y'), ('3Y'), ('5Y')) AS periods(period);

-- ==========================================
-- SAMPLE SECURITIES
-- ==========================================

INSERT INTO public.securities (symbol, name, sector, current_price, previous_close, market_cap, volume)
VALUES
  ('TCS', 'Tata Consultancy Services', 'IT', 3850.50, 3825.75, 1400000000000, 5234567),
  ('INFY', 'Infosys Limited', 'IT', 1650.25, 1642.10, 680000000000, 8765432),
  ('RELIANCE', 'Reliance Industries', 'Energy', 2450.80, 2435.50, 1650000000000, 12345678),
  ('HDFCBANK', 'HDFC Bank', 'Banking', 1575.30, 1568.20, 950000000000, 9876543),
  ('ICICIBANK', 'ICICI Bank', 'Banking', 1125.60, 1118.40, 780000000000, 7654321),
  ('WIPRO', 'Wipro Limited', 'IT', 485.75, 482.30, 265000000000, 6543210),
  ('BHARTIARTL', 'Bharti Airtel', 'Telecom', 1285.40, 1275.80, 750000000000, 4321098),
  ('ITC', 'ITC Limited', 'FMCG', 425.90, 422.50, 530000000000, 8901234);

-- ==========================================
-- SAMPLE FUND HOLDINGS
-- ==========================================

-- Blue Chip Equity Fund holdings
INSERT INTO public.fund_holdings (fund_id, security_id, quantity, allocation_percentage, purchase_price, current_value)
SELECT 
  f.id,
  s.id,
  10000 + random() * 5000,
  CASE s.symbol
    WHEN 'TCS' THEN 25.0
    WHEN 'RELIANCE' THEN 20.0
    WHEN 'HDFCBANK' THEN 18.0
    WHEN 'ICICIBANK' THEN 15.0
    WHEN 'BHARTIARTL' THEN 12.0
    WHEN 'ITC' THEN 10.0
  END,
  s.current_price * 0.9,
  s.current_price * (10000 + random() * 5000)
FROM public.mutual_funds f
CROSS JOIN public.securities s
WHERE f.fund_code = 'BCEF001'
  AND s.symbol IN ('TCS', 'RELIANCE', 'HDFCBANK', 'ICICIBANK', 'BHARTIARTL', 'ITC');

-- Technology Sector Fund holdings
INSERT INTO public.fund_holdings (fund_id, security_id, quantity, allocation_percentage, purchase_price, current_value)
SELECT 
  f.id,
  s.id,
  8000 + random() * 4000,
  CASE s.symbol
    WHEN 'TCS' THEN 35.0
    WHEN 'INFY' THEN 35.0
    WHEN 'WIPRO' THEN 30.0
  END,
  s.current_price * 0.85,
  s.current_price * (8000 + random() * 4000)
FROM public.mutual_funds f
CROSS JOIN public.securities s
WHERE f.fund_code = 'TSF005'
  AND s.symbol IN ('TCS', 'INFY', 'WIPRO');
