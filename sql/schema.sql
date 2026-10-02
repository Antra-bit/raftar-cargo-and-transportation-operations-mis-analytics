-- ==============================================================================
-- Transport Operations MIS & Performance Analytics System
-- Raftaar Cargo & Transport Services Pvt. Ltd. (Internship Analytics Architecture)
-- Relational Database Schema (PostgreSQL / SQLite / MySQL Compatible)
-- ==============================================================================

-- Drop tables in reverse order of dependency if needed
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS shipments;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS daily_mis_records;
DROP TABLE IF EXISTS weekly_mis_records;
DROP TABLE IF EXISTS monthly_mis_records;

-- ------------------------------------------------------------------------------
-- 1. VEHICLES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE vehicles (
    vehicle_id VARCHAR(20) PRIMARY KEY,
    vehicle_type VARCHAR(50) NOT NULL, -- 'Multi-Axle 32ft', '20ft Container', '40ft High Cube', 'Reefer (Cold Chain)', 'Heavy Haulage'
    capacity NUMERIC(10, 2) NOT NULL, -- Capacity in Tonnes / KG
    vehicle_status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (vehicle_status IN ('Active', 'Inactive', 'Maintenance')),
    maintenance_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. DRIVERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE drivers (
    driver_id VARCHAR(20) PRIMARY KEY,
    driver_name VARCHAR(100) NOT NULL,
    experience_years INT NOT NULL CHECK (experience_years >= 0),
    assigned_vehicle VARCHAR(20) REFERENCES vehicles(vehicle_id) ON DELETE SET NULL,
    contact_number VARCHAR(15),
    safety_rating NUMERIC(3, 2) DEFAULT 4.80,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 3. SHIPMENTS TABLE (Cleaned & Validated Operational Records)
-- ------------------------------------------------------------------------------
CREATE TABLE shipments (
    shipment_id VARCHAR(30) PRIMARY KEY,
    booking_date DATE NOT NULL,
    origin VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    vehicle_id VARCHAR(20) NOT NULL REFERENCES vehicles(vehicle_id),
    driver_id VARCHAR(20) NOT NULL REFERENCES drivers(driver_id),
    expected_delivery DATE NOT NULL,
    actual_delivery DATE, -- Can be NULL if shipment is currently 'In Transit'
    status VARCHAR(30) NOT NULL CHECK (status IN ('Delivered', 'Delayed', 'In Transit', 'Cancelled')),
    freight NUMERIC(12, 2) NOT NULL CHECK (freight > 0),
    distance_km NUMERIC(10, 2) NOT NULL CHECK (distance_km > 0),
    delay_days INT DEFAULT 0, -- Calculated: actual_delivery - expected_delivery (if positive)
    is_on_time BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 4. EXPENSES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,
    shipment_id VARCHAR(30) UNIQUE NOT NULL REFERENCES shipments(shipment_id) ON DELETE CASCADE,
    fuel_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.0 CHECK (fuel_cost >= 0),
    toll_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.0 CHECK (toll_cost >= 0),
    maintenance_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.0 CHECK (maintenance_cost >= 0),
    other_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.0 CHECK (other_cost >= 0),
    total_operational_cost NUMERIC(12, 2) GENERATED ALWAYS AS (fuel_cost + toll_cost + maintenance_cost + other_cost) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 5. DAILY MIS REPORT STORAGE (Pre-aggregated Rollup for Sub-Second Reporting)
-- ------------------------------------------------------------------------------
CREATE TABLE daily_mis_records (
    report_date DATE PRIMARY KEY,
    total_shipments INT NOT NULL,
    delivered_shipments INT NOT NULL,
    in_transit_shipments INT NOT NULL,
    delayed_shipments INT NOT NULL,
    cancelled_shipments INT NOT NULL,
    on_time_delivery_pct NUMERIC(5, 2) NOT NULL,
    total_freight_inr NUMERIC(14, 2) NOT NULL,
    total_operational_cost_inr NUMERIC(14, 2) NOT NULL,
    avg_delivery_time_days NUMERIC(4, 2) NOT NULL,
    cost_per_km_inr NUMERIC(8, 2) NOT NULL,
    vehicles_under_maintenance INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 6. WEEKLY MIS REPORT STORAGE
-- ------------------------------------------------------------------------------
CREATE TABLE weekly_mis_records (
    week_start_date DATE PRIMARY KEY,
    week_number INT NOT NULL,
    year INT NOT NULL,
    total_shipments INT NOT NULL,
    delivered_shipments INT NOT NULL,
    delayed_shipments INT NOT NULL,
    on_time_delivery_pct NUMERIC(5, 2) NOT NULL,
    gross_freight_inr NUMERIC(16, 2) NOT NULL,
    total_operational_cost_inr NUMERIC(16, 2) NOT NULL,
    operating_margin_pct NUMERIC(5, 2) NOT NULL,
    avg_cost_per_shipment_inr NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 7. MONTHLY MIS REPORT STORAGE
-- ------------------------------------------------------------------------------
CREATE TABLE monthly_mis_records (
    month_year VARCHAR(7) PRIMARY KEY, -- Format: 'YYYY-MM' (e.g. '2026-10')
    total_shipments INT NOT NULL,
    delivered_shipments INT NOT NULL,
    delayed_shipments INT NOT NULL,
    on_time_delivery_pct NUMERIC(5, 2) NOT NULL,
    total_freight_inr NUMERIC(16, 2) NOT NULL,
    operational_cost_inr NUMERIC(16, 2) NOT NULL,
    net_profit_inr NUMERIC(16, 2) NOT NULL,
    profit_margin_pct NUMERIC(5, 2) NOT NULL,
    total_distance_covered_km NUMERIC(14, 2) NOT NULL,
    cost_per_km_inr NUMERIC(8, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 8. INDEXES FOR PERFORMANCE & QUERY ACCELERATION
-- ------------------------------------------------------------------------------
CREATE INDEX idx_shipments_booking_date ON shipments(booking_date);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_origin_dest ON shipments(origin, destination);
CREATE INDEX idx_shipments_vehicle ON shipments(vehicle_id);
CREATE INDEX idx_shipments_driver ON shipments(driver_id);
CREATE INDEX idx_expenses_shipment ON expenses(shipment_id);
