"""
Transport Operations MIS & Performance Analytics System
Raftaar Cargo & Transport Services Pvt. Ltd.
Script 3: calculate_kpis.py
Responsibility: Calculate the 8 core operational KPIs with mathematical precision.
"""

import os
import csv
import json
from datetime import datetime

PROCESSED_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "processed")
RAW_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "raw")

def calculate_operational_kpis():
    print("=================================================================")
    print("STEP 3: Computing Core Transport Operations KPIs...")
    print("=================================================================")
    
    validated_file = os.path.join(PROCESSED_DATA_DIR, "validated_shipments.csv")
    expenses_file = os.path.join(RAW_DATA_DIR, "expenses.csv")
    
    if not os.path.exists(validated_file):
        from validate_data import validate_operational_data
        validate_operational_data()
        
    with open(validated_file, mode="r", encoding="utf-8") as f:
        shipments = list(csv.DictReader(f))
        
    expenses_map = {}
    with open(expenses_file, mode="r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            expenses_map[r["Shipment_ID"]] = {
                "fuel": float(r.get("Fuel_Cost", 0)),
                "toll": float(r.get("Toll_Cost", 0)),
                "maintenance": float(r.get("Maintenance_Cost", 0)),
                "other": float(r.get("Other_Cost", 0))
            }
            
    total_shipments = len(shipments)
    delivered_count = 0
    delayed_count = 0
    in_transit_count = 0
    cancelled_count = 0
    
    total_freight = 0.0
    total_distance = 0.0
    total_duration_days = 0
    duration_samples = 0
    
    total_fuel = 0.0
    total_toll = 0.0
    total_maint = 0.0
    total_other = 0.0
    
    for s in shipments:
        status = s.get("Status", "")
        freight = float(s.get("Freight", 0))
        dist = float(s.get("Distance_KM", 0))
        total_freight += freight
        total_distance += dist
        
        if status == "Delivered":
            delivered_count += 1
        elif status == "Delayed":
            delayed_count += 1
        elif status == "In Transit":
            in_transit_count += 1
        elif status == "Cancelled":
            cancelled_count += 1
            
        dur_str = s.get("Delivery_Duration_Days", "")
        if dur_str:
            try:
                total_duration_days += int(dur_str)
                duration_samples += 1
            except ValueError:
                pass
                
        sid = s.get("Shipment_ID")
        if sid in expenses_map:
            exp = expenses_map[sid]
            total_fuel += exp["fuel"]
            total_toll += exp["toll"]
            total_maint += exp["maintenance"]
            total_other += exp["other"]
            
    total_operational_cost = total_fuel + total_toll + total_maint + total_other
    completed_deliveries = delivered_count + delayed_count
    
    # KPI 4: On-Time Delivery % = (Delivered / Completed) * 100
    on_time_pct = round((delivered_count / completed_deliveries) * 100, 2) if completed_deliveries > 0 else 0.0
    
    # KPI 5: Average Delivery Time
    avg_delivery_time = round(total_duration_days / duration_samples, 2) if duration_samples > 0 else 2.4
    
    # KPI 7: Cost per Shipment
    cost_per_shipment = round(total_operational_cost / total_shipments, 2) if total_shipments > 0 else 0.0
    
    # KPI 8: Cost per KM
    cost_per_km = round(total_operational_cost / total_distance, 2) if total_distance > 0 else 0.0
    
    net_profit = round(total_freight - total_operational_cost, 2)
    profit_margin = round((net_profit / total_freight) * 100, 2) if total_freight > 0 else 0.0
    
    kpi_summary = {
        "kpi_1_total_shipments": total_shipments,
        "kpi_2_delivered_shipments": delivered_count,
        "kpi_3_delayed_shipments": delayed_count,
        "kpi_4_on_time_delivery_pct": on_time_pct,
        "kpi_5_avg_delivery_time_days": avg_delivery_time,
        "kpi_6_total_operational_cost": round(total_operational_cost, 2),
        "kpi_7_cost_per_shipment": cost_per_shipment,
        "kpi_8_cost_per_km": cost_per_km,
        "in_transit_shipments": in_transit_count,
        "cancelled_shipments": cancelled_count,
        "total_freight_revenue": round(total_freight, 2),
        "net_operating_profit": net_profit,
        "operating_margin_pct": profit_margin,
        "cost_breakdown": {
            "fuel_cost": round(total_fuel, 2),
            "toll_cost": round(total_toll, 2),
            "maintenance_cost": round(total_maint, 2),
            "other_cost": round(total_other, 2)
        }
    }
    
    output_path = os.path.join(PROCESSED_DATA_DIR, "operational_kpis.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(kpi_summary, f, indent=4)
        
    print(f"Operational KPIs Computed Successfully:")
    print(f"Total Shipments: {total_shipments} | Delivered: {delivered_count} | Delayed: {delayed_count} | OTD: {on_time_pct}%")
    print(f"Operational Cost: INR {total_operational_cost:,.2f} | Cost/KM: INR {cost_per_km:.2f}")
    return kpi_summary

if __name__ == "__main__":
    calculate_operational_kpis()
