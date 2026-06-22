-- Database Functions and Triggers
-- Automated workflows and business logic

-- ==========================================
-- FUNCTION: Auto-create profile on signup
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'investor')
  )
  ON CONFLICT (id) DO NOTHING;

  -- If role is investor, create investor profile
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'investor') = 'investor' THEN
    INSERT INTO public.investor_profiles (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- FUNCTION: Update investment value
-- ==========================================

CREATE OR REPLACE FUNCTION public.update_investment_value()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  current_nav NUMERIC(15, 4);
BEGIN
  -- Get current NAV of the fund
  SELECT nav INTO current_nav
  FROM public.mutual_funds
  WHERE id = NEW.fund_id;

  -- Update current value based on units and current NAV
  NEW.current_value := NEW.units * current_nav;
  NEW.updated_at := NOW();

  RETURN NEW;
END;
$$;

-- Trigger to update investment value
DROP TRIGGER IF EXISTS update_investment_value_trigger ON public.investments;

CREATE TRIGGER update_investment_value_trigger
  BEFORE INSERT OR UPDATE ON public.investments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_investment_value();

-- ==========================================
-- FUNCTION: Process transaction
-- ==========================================

CREATE OR REPLACE FUNCTION public.process_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  existing_investment RECORD;
  new_units NUMERIC(15, 4);
  new_total NUMERIC(15, 2);
  new_avg_nav NUMERIC(15, 4);
BEGIN
  -- Only process completed transactions
  IF NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
    
    -- Get existing investment if any
    SELECT * INTO existing_investment
    FROM public.investments
    WHERE investor_id = NEW.investor_id AND fund_id = NEW.fund_id;

    IF NEW.transaction_type = 'buy' THEN
      IF existing_investment IS NULL THEN
        -- Create new investment
        INSERT INTO public.investments (investor_id, fund_id, units, average_nav, total_invested)
        VALUES (NEW.investor_id, NEW.fund_id, NEW.units, NEW.nav, NEW.amount);
      ELSE
        -- Update existing investment
        new_total := existing_investment.total_invested + NEW.amount;
        new_units := existing_investment.units + NEW.units;
        new_avg_nav := new_total / new_units;

        UPDATE public.investments
        SET units = new_units,
            average_nav = new_avg_nav,
            total_invested = new_total,
            updated_at = NOW()
        WHERE investor_id = NEW.investor_id AND fund_id = NEW.fund_id;
      END IF;

      -- Update fund AUM
      UPDATE public.mutual_funds
      SET aum = aum + NEW.amount,
          updated_at = NOW()
      WHERE id = NEW.fund_id;

    ELSIF NEW.transaction_type = 'sell' THEN
      IF existing_investment IS NOT NULL THEN
        new_units := existing_investment.units - NEW.units;
        
        IF new_units > 0 THEN
          -- Reduce units proportionally
          new_total := existing_investment.total_invested * (new_units / existing_investment.units);
          
          UPDATE public.investments
          SET units = new_units,
              total_invested = new_total,
              updated_at = NOW()
          WHERE investor_id = NEW.investor_id AND fund_id = NEW.fund_id;
        ELSE
          -- Remove investment entirely
          DELETE FROM public.investments
          WHERE investor_id = NEW.investor_id AND fund_id = NEW.fund_id;
        END IF;

        -- Update fund AUM
        UPDATE public.mutual_funds
        SET aum = GREATEST(aum - NEW.amount, 0),
            updated_at = NOW()
        WHERE id = NEW.fund_id;
      END IF;
    END IF;

    -- Set processed timestamp
    NEW.processed_at := NOW();
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to process transactions
DROP TRIGGER IF EXISTS process_transaction_trigger ON public.transactions;

CREATE TRIGGER process_transaction_trigger
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.process_transaction();

-- ==========================================
-- FUNCTION: Log audit trail
-- ==========================================

CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values
  )
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply audit logging to critical tables
CREATE TRIGGER audit_transactions
  AFTER INSERT OR UPDATE OR DELETE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();

CREATE TRIGGER audit_investments
  AFTER INSERT OR UPDATE OR DELETE ON public.investments
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();

CREATE TRIGGER audit_mutual_funds
  AFTER INSERT OR UPDATE OR DELETE ON public.mutual_funds
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();

-- ==========================================
-- FUNCTION: Update timestamps
-- ==========================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply to tables with updated_at column
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_mutual_funds_timestamp
  BEFORE UPDATE ON public.mutual_funds
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_investments_timestamp
  BEFORE UPDATE ON public.investments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
