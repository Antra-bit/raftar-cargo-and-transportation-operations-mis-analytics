"""
Transport Operations MIS & Performance Analytics System
Raftaar Cargo & Transport Services Pvt. Ltd.
Script 1: clean_data.py
Responsibility: Data ingestion, text standardization, duplicate removal, date parsing, and transformation.
Compatible with standard library (csv/datetime) & Pandas for zero-dependency execution.
"""

import os
import csv
from datetime import datetime

RAW_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
PROCESSED_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "processed")

CITY_MAP = {
    "delhi": "Delhi", "DELHI": "Delhi", "Delhi": "Delhi",
    "mumbai": "Mumbai", "MUMBAI": "Mumbai", "Mumbai": "Mumbai",
    "bengaluru": "Bengaluru", "bangalore": "Bengaluru", "Bengaluru": "Bengaluru",
    "kolkata": "Kolkata", "KOLKATA": "Kolkata", "calcutta": "Kolkata",
    "chennai": "Chennai", "CHENNAI": "Chennai", "madras": "Chennai",
    "hyderabad": "Hyderabad", "HYDERABAD": "Hyderabad",
    "ahmedabad": "Ahmedabad", "pune": "Pune", "jaipur": "Jaipur"
}

STATUS_MAP = {
    "delivered": "Delivered", "DELIVERED": "Delivered",
    "delayed": "Delayed", "DELAYED": "Delayed",
    "in transit": "In Transit", "IN TRANSIT": "In Transit", "in_transit": "In Transit",
    "cancelled": "Cancelled", "CANCELLED": "Cancelled"
}

def clean_operational_data():
    os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
    print("=================================================================")
    print("STEP 1: Ingesting Raw Logistics Data Sources...")
    print("=================================================================")
    
    shipments_path = os.path.join(RAW_DATA_DIR, "shipments.csv")
    cleaned_path = os.path.join(PROCESSED_DATA_DIR, "cleaned_shipments.csv")
    
    with open(shipments_path, mode="r", encoding="utf-8") as f:
        reader = list(csv.DictReader(f))
        
    initial_count = len(reader)
    print(f"Loaded raw shipments: {initial_count} records")
    
    seen_ids = set()
    cleaned_rows = []
    
    for row in reader:
        shp_id = row.get("Shipment_ID", "").strip()
        # 1. Deduplication
        if shp_id in seen_ids or not shp_id:
            continue
        seen_ids.add(shp_id)
        
        # 2. Text standardization
        origin_raw = row.get("Origin", "").strip()
        dest_raw = row.get("Destination", "").strip()
        status_raw = row.get("Status", "").strip()
        
        row["Origin"] = CITY_MAP.get(origin_raw.lower(), origin_raw.title())
        row["Destination"] = CITY_MAP.get(dest_raw.lower(), dest_raw.title())
        row["Status"] = STATUS_MAP.get(status_raw.lower(), "In Transit")
        
        # 3. Numeric conversion & checks
        try:
            freight = float(row.get("Freight", 0))
        except ValueError:
            freight = 0.0
        row["Freight"] = str(freight)
        
        try:
            distance = float(row.get("Distance_KM", 0))
        except ValueError:
            distance = 0.0
        row["Distance_KM"] = str(distance)
        
        # 4. Dates & delay calculations
        exp_date_str = row.get("Expected_Delivery", "").strip()
        act_date_str = row.get("Actual_Delivery", "").strip()
        book_date_str = row.get("Booking_Date", "").strip()
        
        delay_days = 0
        if exp_date_str and act_date_str:
            try:
                exp_dt = datetime.strptime(exp_date_str, "%Y-%m-%d")
                act_dt = datetime.strptime(act_date_str, "%Y-%m-%d")
                diff = (act_dt - exp_dt).days
                delay_days = max(0, diff)
            except ValueError:
                pass
                
        row["Delay_Days"] = str(delay_days)
        row["Is_On_Time"] = "True" if delay_days == 0 else "False"
        if delay_days > 0 and row["Status"] == "Delivered":
            row["Status"] = "Delayed"
            
        delivery_duration = ""
        if book_date_str and act_date_str:
            try:
                b_dt = datetime.strptime(book_date_str, "%Y-%m-%d")
                a_dt = datetime.strptime(act_date_str, "%Y-%m-%d")
                delivery_duration = str((a_dt - b_dt).days)
            except ValueError:
                pass
        row["Delivery_Duration_Days"] = delivery_duration
        
        cleaned_rows.append(row)
        
    print(f"Removed duplicates: {initial_count - len(cleaned_rows)} records dropped")
    
    # Write to cleaned_shipments.csv
    fieldnames = list(cleaned_rows[0].keys())
    with open(cleaned_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(cleaned_rows)
        
    print(f"Data cleaning successfully completed. Saved to: {cleaned_path}")
    return cleaned_rows

if __name__ == "__main__":
    clean_operational_data()
