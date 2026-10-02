# Transport Operations MIS & Performance Analytics System

> **Raftaar Cargo & Transport Services Pvt. Ltd.**  
> *End-to-End Operational Analytics, Data Validation, KPI Engine, and Interactive MIS Dashboard*

---

## 1. Project Overview & Context

**Transport Operations MIS & Performance Analytics System** is a production-grade data analytics and reporting system designed to manage, clean, validate, and analyze real-world transportation logistics data. 

The project converts raw operational data (shipment bookings, vehicle telemetry, driver assignments, and transit expenses) into actionable operational intelligence through an automated, repeatable data analytics lifecycle.

### Origin & Internship Connection
This project is directly modeled after the operations analytics responsibilities executed during the Data Analyst internship in the Operations Department at **Raftaar Cargo & Transport Services Pvt. Ltd.**:
- Automated collection and cleaning of fragmented departmental Excel records.
- Enforcing domain-specific data validation rules and generating formal Data Quality reports.
- Storing structured schemas in SQL databases for high-speed querying.
- Calculating the 8 core operational KPIs.
- Automated generation of Daily, Weekly, and Monthly MIS reports.
- Centralized executive dashboard for management decision-making.

> *Note on Confidentiality*: For academic demonstration and repository privacy, this system uses synthetic/anonymized operational datasets designed to represent genuine logistics schemas without exposing proprietary client information.

---

## 2. End-to-End Architecture Workflow

```
                    RAW OPERATIONAL DATA
     (shipments.csv, vehicles.csv, drivers.csv, expenses.csv)
                               │
                               ▼
                        DATA INGESTION
                               │
                               ▼
                         DATA CLEANING
      (Deduplication, Text Standardization, Missing Values, Date Parsing)
                               │
                               ▼
                        DATA VALIDATION
      (Chronology Checks, Foreign Key Integrity, Positive Freight/Dist)
                               │
                               ▼
                     DATA TRANSFORMATION
        (Delay Calculation, Duration in Days, Cost Rollup)
                               │
                               ▼
                   RELATIONAL SQL DATABASE
           (PostgreSQL / DuckDB / SQLite Star Schema)
                               │
                               ▼
                         EXPLORATORY EDA
            (Corridor Bottlenecks, Status Distribution)
                               │
                               ▼
                        KPI CALCULATION
             (Total Shipments, OTD %, Cost/KM, Avg TAT)
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       AUTOMATED MIS REPORTS         INTERACTIVE DASHBOARD
    (Daily, Weekly, Monthly)      (Real-Time Analytics & Map)
               │                               │
               └───────────────┬───────────────┘
                               ▼
                      OPERATIONAL INSIGHTS
```

---

## 3. Project Folder Structure

```
Transport_Operations_MIS/
│
├── .vscode/
│   ├── settings.json         # Python, formatting, and SQLTools configurations
│   ├── launch.json           # Launch configs for scripts & dashboard
│   └── extensions.json       # Recommended VS Code extensions
│
├── data/
│   ├── raw/                  # Source CSVs with edge-cases and inconsistencies
│   │   ├── shipments.csv
│   │   ├── vehicles.csv
│   │   ├── drivers.csv
│   │   └── expenses.csv
│   └── processed/            # Cleaned, validated, and transformed outputs
│       ├── cleaned_shipments.csv
│       ├── validated_shipments.csv
│       ├── data_quality_report.json
│       └── operational_kpis.json
│
├── notebooks/                # Documented Jupyter notebooks for analysis
│   ├── data_cleaning.ipynb   # Ingestion, deduplication, and string standardization
│   ├── data_validation.ipynb # Business rules engine and quality audit
│   ├── EDA.ipynb             # Exploratory analysis and corridor distributions
│   └── KPI_analysis.ipynb    # Mathematical formulation of core 8 KPIs
│
├── sql/
│   ├── schema.sql            # DDL for SHIPMENTS, VEHICLES, DRIVERS, EXPENSES & MIS
│   └── queries.sql           # Sub-second analytical queries and window rollups
│
├── scripts/                  # Production pipeline scripts
│   ├── clean_data.py         # Automated data cleaning pipeline
│   ├── validate_data.py      # Automated data quality checker
│   ├── calculate_kpis.py     # KPI computation module
│   └── generate_mis.py       # Automated Daily, Weekly, Monthly MIS generator
│
├── reports/                  # Generated MIS reports
│   ├── daily_MIS.json        # Single-day operational scorecard & exceptions
│   ├── weekly_MIS.json       # 4-week comparative performance breakdown
│   ├── weekly_MIS.csv        # Tabular weekly metrics
│   └── monthly_MIS.json      # Executive monthly summary & modal split
│
├── src/                      # High-performance Interactive Web Dashboard
│   ├── components/           # Executive views, MIS center, VS Code studio, Viva guide
│   └── App.tsx               # Main dashboard controller
│
├── requirements.txt          # Python dependencies
└── README.md                 # Complete project documentation
```

---

## 4. The 8 Core Operational KPIs

| KPI # | Metric Name | Operational Formula | Description |
|:---:|:---|:---|:---|
| **KPI 1** | **Total Shipments** | $\sum \text{Shipment Units}$ | Total volume processed in period |
| **KPI 2** | **Delivered Shipments** | Count of $\text{Status} = \text{'Delivered'}$ | Completed consignments |
| **KPI 3** | **Delayed Shipments** | Count of $\text{Status} = \text{'Delayed'}$ | Shipments exceeding SLA target |
| **KPI 4** | **On-Time Delivery (OTD %)** | $\frac{\text{On-Time Deliveries}}{\text{Total Delivered}} \times 100$ | Primary operational SLA indicator |
| **KPI 5** | **Average Delivery Time** | $\frac{\sum (\text{Actual Delivery} - \text{Booking Date})}{\text{Total Completed}}$ | Operational transit velocity |
| **KPI 6** | **Total Operational Cost** | $\text{Fuel} + \text{Toll} + \text{Maintenance} + \text{Other}$ | Aggregate transport direct expenses |
| **KPI 7** | **Cost Per Shipment** | $\frac{\text{Total Operational Cost}}{\text{Total Shipments}}$ | Unit economic cost per trip |
| **KPI 8** | **Cost Per KM** | $\frac{\text{Total Operational Cost}}{\text{Total Distance (KM)}}$ | Route efficiency benchmark |

---

## 5. Automated MIS Reports Structure

1. **Daily MIS Report**:
   - Total Shipments: **148**
   - Delivered: **126** | In Transit: **14** | Delayed: **8**
   - On-Time Delivery %: **89.4%**
   - Total Freight: **₹ 8.42 Lakhs** | Total Cost: **₹ 2.65 Lakhs**
   - Exception Summary: 8 delayed shipments, 3 vehicles under maintenance, 5 deliveries exceeded SLA.
2. **Weekly MIS Report**:
   - 4-Week trend tracking (Week 1: 520 consignments $\rightarrow$ Week 4: 641 consignments).
   - On-Time rate improvement from 90.6% to 91.9%.
3. **Monthly MIS Report**:
   - Total Shipments: **2,347** | Delivered: **2,128** | Delayed: **219**
   - On-Time Delivery: **90.7%**
   - Total Freight: **₹ 1.24 Crore** | Operational Cost: **₹ 38.6 Lakhs** | Net Margin: **68.8%**

---

## 6. How to Run & Reproduce

### Running the Python Pipeline
```bash
# Clone the repository
git clone https://github.com/your-username/Transport_Operations_MIS.git
cd Transport_Operations_MIS

# Run the complete automated pipeline
python3 scripts/clean_data.py
python3 scripts/validate_data.py
python3 scripts/calculate_kpis.py
python3 scripts/generate_mis.py
```

### Running the Interactive Dashboard
```bash
npm install
npm run dev
```

---

## 7. Viva & Presentation Guide

### 2-Minute Elevator Pitch
> *"My project is Transport Operations MIS and Performance Analytics System, developed based on the data analytics workflow I experienced during my internship in the Operations Department at Raftaar Cargo & Transport Services Pvt. Ltd. The problem addressed is that transportation companies generate massive volumes of fragmented operational data across bookings, vehicles, drivers, and expenses. Manual compilation in Excel leads to duplicates, missing records, and slow reporting. I designed an end-to-end automated pipeline using Python, Pandas, and SQL to clean and validate data, compute core operational KPIs, and generate automated Daily, Weekly, and Monthly MIS reports alongside an interactive real-time dashboard."*
