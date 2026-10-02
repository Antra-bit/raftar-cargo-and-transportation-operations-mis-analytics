-- ============================================================================
-- RAFTAR CARGO & TRANSPORTATION ENTERPRISE DATA WAREHOUSE DDL
-- Database: PostgreSQL 16+ / Compatible with DuckDB & Cloud SQL
-- Architecture: Star Schema with Partitioned Telemetry Logs & Rollup Tables
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For GIS geofence & spatial routing (optional)

-- ----------------------------------------------------------------------------
-- 1. MASTER TABLES
-- ----------------------------------------------------------------------------

-- Hubs & Terminals Master
CREATE TABLE IF NOT EXISTS transport_hubs (
    hub_id VARCHAR(16) PRIMARY KEY,
    hub_name VARCHAR(128) NOT NULL,
    hub_code VARCHAR(8) UNIQUE NOT NULL,
    region VARCHAR(32) NOT NULL, -- 'North', 'South', 'West', 'East', 'Central'
    city VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    dock_capacity INT NOT NULL DEFAULT 20,
    active_bays INT NOT NULL DEFAULT 16,
    storage_area_sqft INT NOT NULL DEFAULT 50000,
    is_bonded_customs BOOLEAN DEFAULT FALSE,
    reefer_charging_points INT DEFAULT 12,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fleet Vehicles Master
CREATE TABLE IF NOT EXISTS fleet_vehicles (
    vehicle_id VARCHAR(32) PRIMARY KEY,
    registration_no VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type VARCHAR(32) NOT NULL, -- 'Multi-Axle 32ft MXL', '20ft Container', '40ft High Cube', 'Reefer (Cold Chain)', 'Heavy Haulage 50T'
    payload_capacity_kg NUMERIC(10, 2) NOT NULL,
    volume_capacity_cbm NUMERIC(8, 2) NOT NULL,
    assigned_hub_id VARCHAR(16) REFERENCES transport_hubs(hub_id),
    fuel_type VARCHAR(16) DEFAULT 'Diesel', -- 'Diesel', 'LNG', 'Electric'
    telemetry_device_id VARCHAR(64) UNIQUE,
    current_odometer_km NUMERIC(10, 1) NOT NULL DEFAULT 0.0,
    emission_compliance VARCHAR(16) DEFAULT 'BS-VI',
    status VARCHAR(24) DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'IN_TRANSIT', 'MAINTENANCE', 'UNLOAD_BAY'
    last_service_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Drivers Master
CREATE TABLE IF NOT EXISTS drivers (
    driver_id VARCHAR(24) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    license_no VARCHAR(32) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    assigned_vehicle_id VARCHAR(32) REFERENCES fleet_vehicles(vehicle_id),
    home_hub_id VARCHAR(16) REFERENCES transport_hubs(hub_id),
    safety_rating NUMERIC(3, 2) DEFAULT 4.85,
    duty_status VARCHAR(20) DEFAULT 'ON_DUTY', -- 'ON_DUTY', 'REST_PERIOD', 'LEAVE'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. TRANSACTIONS & SHIPMENTS (PARTITIONED BY DISPATCH DATE)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS consignments (
    consignment_id VARCHAR(32) NOT NULL,
    awb_number VARCHAR(32) NOT NULL,
    client_name VARCHAR(128) NOT NULL,
    contract_type VARCHAR(24) NOT NULL, -- 'FTL' (Full Truckload), 'LTL' (Less Than Truckload), 'EXPRESS', 'COLD_CHAIN'
    origin_hub_id VARCHAR(16) NOT NULL REFERENCES transport_hubs(hub_id),
    destination_hub_id VARCHAR(16) NOT NULL REFERENCES transport_hubs(hub_id),
    assigned_vehicle_id VARCHAR(32) REFERENCES fleet_vehicles(vehicle_id),
    driver_id VARCHAR(24) REFERENCES drivers(driver_id),
    cargo_type VARCHAR(64) NOT NULL,
    cargo_weight_kg NUMERIC(10, 2) NOT NULL,
    cargo_volume_cbm NUMERIC(8, 2) NOT NULL,
    is_temperature_controlled BOOLEAN DEFAULT FALSE,
    target_temperature_celsius NUMERIC(4, 1),
    current_temperature_celsius NUMERIC(4, 1),
    freight_charges_inr NUMERIC(12, 2) NOT NULL,
    fuel_surcharge_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    dispatch_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_arrival_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_arrival_timestamp TIMESTAMP WITH TIME ZONE,
    status VARCHAR(32) NOT NULL, -- 'BOOKED', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELAYED_WEATHER', 'DELAYED_TRAFFIC', 'EXCEPTION'
    is_sla_breached BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (consignment_id, dispatch_timestamp)
) PARTITION BY RANGE (dispatch_timestamp);

-- Partition examples for monthly partitions
CREATE TABLE IF NOT EXISTS consignments_2026_q1 PARTITION OF consignments
    FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2026-04-01 00:00:00+00');
CREATE TABLE IF NOT EXISTS consignments_2026_q2 PARTITION OF consignments
    FOR VALUES FROM ('2026-04-01 00:00:00+00') TO ('2026-07-01 00:00:00+00');
CREATE TABLE IF NOT EXISTS consignments_2026_q3 PARTITION OF consignments
    FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');
CREATE TABLE IF NOT EXISTS consignments_2026_q4 PARTITION OF consignments
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

-- ----------------------------------------------------------------------------
-- 3. HIGH-FREQUENCY TELEMETRY LOGS (PARTITIONED BY PING TIME)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS telemetry_pings (
    ping_id BIGSERIAL,
    vehicle_id VARCHAR(32) NOT NULL,
    consignment_id VARCHAR(32),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    speed_kmh NUMERIC(5, 1) NOT NULL,
    fuel_level_percent NUMERIC(5, 2) NOT NULL,
    engine_temp_c NUMERIC(5, 1) NOT NULL,
    cargo_temp_c NUMERIC(4, 1),
    odometer_km NUMERIC(10, 1) NOT NULL,
    ignition_status BOOLEAN NOT NULL DEFAULT TRUE,
    harsh_braking_event BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (ping_id, timestamp)
) PARTITION BY RANGE (timestamp);

CREATE TABLE IF NOT EXISTS telemetry_2026_10 PARTITION OF telemetry_pings
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2026-11-01 00:00:00+00');

-- ----------------------------------------------------------------------------
-- 4. PRE-COMPUTED AGGREGATE MIS ROLLUP TABLES (FOR SUB-SECOND DASHBOARDS)
-- ----------------------------------------------------------------------------

-- Daily MIS Rollup
CREATE TABLE IF NOT EXISTS mis_daily_rollups (
    report_date DATE PRIMARY KEY,
    total_consignments_dispatched INT NOT NULL,
    total_consignments_delivered INT NOT NULL,
    total_tonnage_mt NUMERIC(10, 2) NOT NULL,
    gross_freight_revenue_inr NUMERIC(14, 2) NOT NULL,
    fuel_expense_inr NUMERIC(12, 2) NOT NULL,
    fleet_utilization_rate_pct NUMERIC(5, 2) NOT NULL,
    on_time_delivery_pct NUMERIC(5, 2) NOT NULL,
    sla_breaches_count INT NOT NULL DEFAULT 0,
    breakdown_incidents_count INT NOT NULL DEFAULT 0,
    avg_transit_time_hours NUMERIC(6, 2) NOT NULL,
    fuel_efficiency_km_per_liter NUMERIC(4, 2) NOT NULL,
    carbon_emissions_mt_co2 NUMERIC(8, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Weekly MIS Rollup
CREATE TABLE IF NOT EXISTS mis_weekly_rollups (
    week_start_date DATE PRIMARY KEY,
    week_number INT NOT NULL,
    year INT NOT NULL,
    total_tonnage_mt NUMERIC(12, 2) NOT NULL,
    gross_freight_revenue_inr NUMERIC(16, 2) NOT NULL,
    operating_cost_inr NUMERIC(16, 2) NOT NULL,
    net_operating_margin_pct NUMERIC(5, 2) NOT NULL,
    avg_fleet_utilization_pct NUMERIC(5, 2) NOT NULL,
    on_time_delivery_pct NUMERIC(5, 2) NOT NULL,
    corridor_fastest_name VARCHAR(128),
    corridor_delayed_name VARCHAR(128),
    cost_per_ton_km_inr NUMERIC(6, 3) NOT NULL,
    total_km_run NUMERIC(12, 1) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Monthly MIS Rollup
CREATE TABLE IF NOT EXISTS mis_monthly_rollups (
    month_year VARCHAR(7) PRIMARY KEY, -- '2026-10'
    total_trips_completed INT NOT NULL,
    total_tonnage_mt NUMERIC(14, 2) NOT NULL,
    gross_freight_revenue_inr NUMERIC(18, 2) NOT NULL,
    fuel_cost_inr NUMERIC(16, 2) NOT NULL,
    maintenance_cost_inr NUMERIC(14, 2) NOT NULL,
    driver_toll_expense_inr NUMERIC(14, 2) NOT NULL,
    ebitda_inr NUMERIC(16, 2) NOT NULL,
    ebitda_margin_pct NUMERIC(5, 2) NOT NULL,
    avg_otd_pct NUMERIC(5, 2) NOT NULL,
    modal_split_ftl_pct NUMERIC(5, 2) NOT NULL,
    modal_split_ltl_pct NUMERIC(5, 2) NOT NULL,
    modal_split_express_pct NUMERIC(5, 2) NOT NULL,
    modal_split_cold_chain_pct NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. PERFORMANCE INDEXES
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_consignments_awb ON consignments (awb_number);
CREATE INDEX IF NOT EXISTS idx_consignments_status ON consignments (status);
CREATE INDEX IF NOT EXISTS idx_consignments_route ON consignments (origin_hub_id, destination_hub_id);
CREATE INDEX IF NOT EXISTS idx_consignments_vehicle ON consignments (assigned_vehicle_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_vehicle_time ON telemetry_pings (vehicle_id, timestamp DESC);
