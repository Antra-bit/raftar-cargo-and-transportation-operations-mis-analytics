"""
Transport Operations MIS & Performance Analytics System
Raftaar Cargo & Transport Services Pvt. Ltd.
Script 2: validate_data.py
Responsibility: Data validation rules engine and Data Quality Report generation.
"""

import os
import csv
import json
from datetime import datetime

RAW_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
PROCESSED_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "processed")

def validate_operational_data():
    print("=================================================================")
    print("STEP 2: Executing Data Validation Rules Engine...")
    print("=================================================================")
    
    shipments_raw_path = os.path.join(RAW_DATA_DIR, "shipments.csv")
    cleaned_path = os.path.join(PROCESSED_DATA_DIR, "cleaned_shipments.csv")
    vehicles_path = os.path.join(RAW_DATA_DIR, "vehicles.csv")
    drivers_path = os.path.join(RAW_DATA_DIR, "drivers.csv")
    
    if not os.path.exists(cleaned_path):
        from clean_data import clean_operational_data
        clean_operational_data()
        
    with open(shipments_raw_path, mode="r", encoding="utf-8") as f:
        raw_rows = list(csv.DictReader(f))
    total_raw_records = len(raw_rows)
    
    # Check duplicates in raw
    seen = set()
    dup_count = 0
    for r in raw_rows:
        sid = r.get("Shipment_ID", "").strip()
        if sid in seen:
            dup_count += 1
        seen.add(sid)
        
    with open(vehicles_path, mode="r", encoding="utf-8") as f:
        valid_vehicles = {r["Vehicle_ID"].strip() for r in csv.DictReader(f) if r.get("Vehicle_ID")}
    with open(drivers_path, mode="r", encoding="utf-8") as f:
        valid_drivers = {r["Driver_ID"].strip() for r in csv.DictReader(f) if r.get("Driver_ID")}
        
    with open(cleaned_path, mode="r", encoding="utf-8") as f:
        cleaned_rows = list(csv.DictReader(f))
        
    invalid_dates_count = 0
    invalid_freight_count = 0
    invalid_distance_count = 0
    referential_err_count = 0
    missing_critical_count = 0
    valid_rows = []
    
    allowed_statuses = {"Delivered", "Delayed", "In Transit", "Cancelled"}
    
    for row in cleaned_rows:
        sid = row.get("Shipment_ID", "").strip()
        freight = float(row.get("Freight", 0))
        dist = float(row.get("Distance_KM", 0))
        b_date = row.get("Booking_Date", "").strip()
        a_date = row.get("Actual_Delivery", "").strip()
        v_id = row.get("Vehicle_ID", "").strip()
        d_id = row.get("Driver_ID", "").strip()
        status = row.get("Status", "").strip()
        
        is_invalid = False
        
        if not sid:
            is_invalid = True
        if freight <= 0:
            invalid_freight_count += 1
            is_invalid = True
        if dist <= 0:
            invalid_distance_count += 1
            is_invalid = True
            
        if b_date and a_date:
            try:
                b_dt = datetime.strptime(b_date, "%Y-%m-%d")
                a_dt = datetime.strptime(a_date, "%Y-%m-%d")
                if a_dt < b_dt:
                    invalid_dates_count += 1
                    is_invalid = True
            except ValueError:
                invalid_dates_count += 1
                is_invalid = True
                
        if v_id not in valid_vehicles or d_id not in valid_drivers:
            referential_err_count += 1
            is_invalid = True
            
        if status not in allowed_statuses:
            is_invalid = True
            
        if not is_invalid:
            valid_rows.append(row)
            
    quality_score = round((len(valid_rows) / total_raw_records) * 100, 2)
    quality_report = {
        "report_title": "Raftaar Cargo - Operational Data Quality Report",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "metrics": {
            "Total Records": total_raw_records,
            "Duplicate Records": dup_count,
            "Missing Values": missing_critical_count,
            "Invalid Dates": invalid_dates_count,
            "Invalid Freight (<= 0)": invalid_freight_count,
            "Invalid Distance (<= 0)": invalid_distance_count,
            "Referential Key Errors": referential_err_count,
            "Valid Records": len(valid_rows),
            "Data Quality Score": quality_score
        },
        "status": "PASSED" if len(valid_rows) >= (total_raw_records * 0.85) else "NEEDS_REVIEW"
    }
    
    # Save valid dataset
    validated_file = os.path.join(PROCESSED_DATA_DIR, "validated_shipments.csv")
    fieldnames = list(valid_rows[0].keys())
    with open(validated_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(valid_rows)
        
    report_file = os.path.join(PROCESSED_DATA_DIR, "data_quality_report.json")
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(quality_report, f, indent=4)
        
    print(f"Validation complete. Valid Records: {len(valid_rows)}/{total_raw_records} ({quality_score}%)")
    print(f"Quality report saved to: {report_file}")
    return quality_report

if __name__ == "__main__":
    validate_operational_data()
