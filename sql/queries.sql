-- ==============================================================================
-- Transport Operations MIS & Performance Analytics System
-- Raftaar Cargo & Transport Services Pvt. Ltd.
-- Analytical & MIS SQL Queries (High Scalability & Sub-Second Reporting)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- QUERY 1: Shipment Volume by Delivery Status
-- ------------------------------------------------------------------------------
SELECT
    status,
    COUNT(*) AS total_shipments,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM shipments)), 2) AS percentage_share
FROM shipments
GROUP BY status
ORDER BY total_shipments DESC;

-- ------------------------------------------------------------------------------
-- QUERY 2: Top Freight Corridors (Origin -> Destination Volume)
-- ------------------------------------------------------------------------------
SELECT
    origin,
    destination,
    COUNT(*) AS shipment_count,
    ROUND(SUM(distance_km), 2) AS total_distance_km,
    ROUND(SUM(freight), 2) AS total_freight_revenue,
    ROUND(AVG(freight), 2) AS avg_freight_per_trip
FROM shipments
GROUP BY origin, destination
ORDER BY shipment_count DESC
LIMIT 10;

-- ------------------------------------------------------------------------------
-- QUERY 3: Delay Analysis by Route (Diagnostic Analytics)
-- ------------------------------------------------------------------------------
SELECT
    origin,
    destination,
    COUNT(*) AS total_trips,
    SUM(CASE WHEN status = 'Delayed' THEN 1 ELSE 0 END) AS delayed_trips,
    ROUND((SUM(CASE WHEN status = 'Delayed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) AS delay_rate_pct,
    ROUND(AVG(CASE WHEN status = 'Delayed' THEN delay_days ELSE 0 END), 2) AS avg_delay_days
FROM shipments
GROUP BY origin, destination
HAVING COUNT(*) >= 5
ORDER BY delay_rate_pct DESC;

-- ------------------------------------------------------------------------------
-- QUERY 4: Core Operational KPIs Calculation (Single-Pass Aggregation)
-- ------------------------------------------------------------------------------
SELECT
    COUNT(*) AS total_shipments,
    SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) AS delivered_shipments,
    SUM(CASE WHEN status = 'Delayed' THEN 1 ELSE 0 END) AS delayed_shipments,
    SUM(CASE WHEN status = 'In Transit' THEN 1 ELSE 0 END) AS in_transit_shipments,
    SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled_shipments,
    -- KPI 4: On-Time Delivery % = (On-Time / Total Delivered) * 100
    ROUND(
        (SUM(CASE WHEN is_on_time = TRUE AND status = 'Delivered' THEN 1 ELSE 0 END) * 100.0) /
        NULLIF(SUM(CASE WHEN status IN ('Delivered', 'Delayed') THEN 1 ELSE 0 END), 0),
        2
    ) AS on_time_delivery_pct,
    -- KPI 5: Average Delivery Time in Days
    ROUND(AVG(actual_delivery - booking_date), 2) AS avg_delivery_time_days,
    -- Financials
    SUM(s.freight) AS total_freight_revenue,
    SUM(e.total_operational_cost) AS total_operational_cost,
    -- KPI 7: Cost per Shipment
    ROUND(SUM(e.total_operational_cost) / NULLIF(COUNT(*), 0), 2) AS cost_per_shipment,
    -- KPI 8: Cost per KM
    ROUND(SUM(e.total_operational_cost) / NULLIF(SUM(s.distance_km), 0), 2) AS cost_per_km
FROM shipments s
LEFT JOIN expenses e ON s.shipment_id = e.shipment_id;

-- ------------------------------------------------------------------------------
-- QUERY 5: Vehicle Utilization & Downtime Performance
-- ------------------------------------------------------------------------------
SELECT
    v.vehicle_id,
    v.vehicle_type,
    v.capacity,
    v.vehicle_status,
    COUNT(s.shipment_id) AS total_trips_assigned,
    COALESCE(SUM(s.distance_km), 0) AS total_km_covered,
    COALESCE(SUM(e.fuel_cost), 0) AS total_fuel_spent,
    COALESCE(SUM(e.maintenance_cost), 0) AS total_maintenance_spent,
    ROUND(COALESCE(SUM(e.fuel_cost) / NULLIF(SUM(s.distance_km), 0), 0), 2) AS fuel_cost_per_km
FROM vehicles v
LEFT JOIN shipments s ON v.vehicle_id = s.vehicle_id
LEFT JOIN expenses e ON s.shipment_id = e.shipment_id
GROUP BY v.vehicle_id, v.vehicle_type, v.capacity, v.vehicle_status
ORDER BY total_trips_assigned DESC;

-- ------------------------------------------------------------------------------
-- QUERY 6: Monthly Operational Cost Component Breakdown
-- ------------------------------------------------------------------------------
SELECT
    TO_CHAR(s.booking_date, 'YYYY-MM') AS month_period,
    COUNT(s.shipment_id) AS shipment_volume,
    ROUND(SUM(s.freight), 2) AS gross_freight,
    ROUND(SUM(e.fuel_cost), 2) AS fuel_expense,
    ROUND(SUM(e.toll_cost), 2) AS toll_expense,
    ROUND(SUM(e.maintenance_cost), 2) AS maintenance_expense,
    ROUND(SUM(e.other_cost), 2) AS other_operational_expense,
    ROUND(SUM(e.total_operational_cost), 2) AS total_cost,
    ROUND(SUM(s.freight) - SUM(e.total_operational_cost), 2) AS net_operating_margin,
    ROUND(((SUM(s.freight) - SUM(e.total_operational_cost)) * 100.0 / NULLIF(SUM(s.freight), 0)), 2) AS margin_pct
FROM shipments s
JOIN expenses e ON s.shipment_id = e.shipment_id
GROUP BY TO_CHAR(s.booking_date, 'YYYY-MM')
ORDER BY month_period DESC;
