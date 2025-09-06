
-- First, let's drop the existing view
DROP VIEW IF EXISTS public.customer_purchase_history;

-- Recreate the view with SECURITY INVOKER explicitly specified
CREATE OR REPLACE VIEW public.customer_purchase_history 
WITH (security_invoker = true) 
AS
SELECT 
    c.email AS customer_email,
    c.id AS customer_id,
    c.name AS customer_name,
    e.date AS event_date,
    et.event_id,
    e.title AS event_title,
    et.food_service_price,
    et.includes_food_service,
    o.order_date,
    o.id AS order_id,
    et.quantity,
    et.ticket_type,
    et.tier_title,
    et.quantity * et.unit_price AS total_ticket_amount,
    et.unit_price
FROM 
    public.event_tickets et
JOIN 
    public.orders o ON et.order_id = o.id
JOIN 
    public.customers c ON o.customer_id = c.id
JOIN 
    public.events e ON et.event_id = e.id;

-- Ensure proper ownership and permissions
ALTER VIEW public.customer_purchase_history OWNER TO postgres;
GRANT SELECT ON public.customer_purchase_history TO authenticated;
GRANT SELECT ON public.customer_purchase_history TO service_role;

-- Add a comment to document the security settings
COMMENT ON VIEW public.customer_purchase_history IS 'Purchase history view with explicitly set SECURITY INVOKER';
