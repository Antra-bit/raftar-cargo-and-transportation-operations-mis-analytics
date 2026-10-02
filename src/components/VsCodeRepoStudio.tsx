import React, { useState } from 'react';
import { PRELOADED_SQL_QUERIES } from '../data/mockLogisticsData';
import { 
  Folder, 
  FileCode, 
  FileText, 
  Play, 
  Copy, 
  Check, 
  Terminal, 
  Database, 
  BookOpen, 
  FileSpreadsheet, 
  Layers, 
  Clock, 
  Cpu
} from 'lucide-react';

export const VsCodeRepoStudio: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('notebooks/data_cleaning.ipynb');
  const [activeNotebookCell, setActiveNotebookCell] = useState<number | null>(null);
  const [executingNotebook, setExecutingNotebook] = useState<boolean>(false);
  const [cellRunStates, setCellRunStates] = useState<{ [key: string]: boolean }>({
    'cell-1': true,
    'cell-2': true,
    'cell-3': true,
  });

  // SQL Runner State
  const [selectedSqlQuery, setSelectedSqlQuery] = useState<string>(PRELOADED_SQL_QUERIES[0].sql);
  const [sqlResults, setSqlResults] = useState<any[] | null>([
    { status: 'Delivered', total_shipments: 2128, percentage_share: '90.67%' },
    { status: 'Delayed', total_shipments: 219, percentage_share: '9.33%' },
    { status: 'In Transit', total_shipments: 14, percentage_share: '0.60%' },
    { status: 'Cancelled', total_shipments: 0, percentage_share: '0.00%' }
  ]);
  const [sqlExecutionTime, setSqlExecutionTime] = useState<string>('12.4 ms');
  const [isExecutingSql, setIsExecutingSql] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleRunAllNotebook = () => {
    setExecutingNotebook(true);
    setTimeout(() => {
      setExecutingNotebook(false);
      setCellRunStates({
        'cell-1': true,
        'cell-2': true,
        'cell-3': true,
      });
    }, 800);
  };

  const handleExecuteSql = () => {
    setIsExecutingSql(true);
    setTimeout(() => {
      setIsExecutingSql(false);
      const randomMs = (Math.random() * 8 + 8).toFixed(1);
      setSqlExecutionTime(`${randomMs} ms`);

      if (selectedSqlQuery.includes('origin, destination')) {
        setSqlResults([
          { origin: 'Delhi', destination: 'Mumbai', shipment_count: 412, total_distance_km: '585,040', total_freight_revenue: '₹ 27,150,800', avg_freight_per_trip: '₹ 65,900' },
          { origin: 'Mumbai', destination: 'Bengaluru', shipment_count: 368, total_distance_km: '360,640', total_freight_revenue: '₹ 17,884,800', avg_freight_per_trip: '₹ 48,600' },
          { origin: 'Bengaluru', destination: 'Chennai', shipment_count: 341, total_distance_km: '117,645', total_freight_revenue: '₹ 7,553,150', avg_freight_per_trip: '₹ 22,150' },
          { origin: 'Delhi', destination: 'Kolkata', shipment_count: 294, total_distance_km: '449,820', total_freight_revenue: '₹ 20,844,600', avg_freight_per_trip: '₹ 70,900' },
          { origin: 'Hyderabad', destination: 'Bengaluru', shipment_count: 245, total_distance_km: '139,650', total_freight_revenue: '₹ 7,803,250', avg_freight_per_trip: '₹ 31,850' }
        ]);
      } else if (selectedSqlQuery.includes('delay_days') || selectedSqlQuery.includes('Delayed')) {
        setSqlResults([
          { origin: 'Delhi', destination: 'Kolkata', total_trips: 294, delayed_trips: 35, delay_rate_pct: '11.90%', avg_delay_days: '1.85' },
          { origin: 'Delhi', destination: 'Mumbai', total_trips: 412, delayed_trips: 31, delay_rate_pct: '7.52%', avg_delay_days: '1.40' },
          { origin: 'Mumbai', destination: 'Bengaluru', total_trips: 368, delayed_trips: 25, delay_rate_pct: '6.79%', avg_delay_days: '1.20' },
          { origin: 'Bengaluru', destination: 'Chennai', total_trips: 341, delayed_trips: 15, delay_rate_pct: '4.40%', avg_delay_days: '1.05' }
        ]);
      } else {
        setSqlResults([
          { status: 'Delivered', total_shipments: 2128, percentage_share: '90.67%' },
          { status: 'Delayed', total_shipments: 219, percentage_share: '9.33%' },
          { status: 'In Transit', total_shipments: 14, percentage_share: '0.60%' },
          { status: 'Cancelled', total_shipments: 0, percentage_share: '0.00%' }
        ]);
      }
    }, 400);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            VS Code Workspace & Data Engineering Studio
          </h1>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
            <span>Repository: <code className="text-amber-300 font-mono">Transport_Operations_MIS</code></span>
            <span aria-hidden="true">·</span>
            <span>Interactive Jupyter Notebooks & Scalable SQL Runner</span>
          </div>
        </div>
      </div>

      {/* Main Simulated VS Code Workspace */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 min-h-[680px]">
        {/* Left Sidebar: VS Code Explorer */}
        <div className="bg-neutral-900/90 border-r border-neutral-800 p-3 text-xs md:col-span-1 lg:col-span-1">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-3 px-2 flex items-center justify-between">
            <span>Explorer: Files</span>
            <span className="text-[10px] text-amber-400">git: (main)</span>
          </div>

          <div className="space-y-1 font-mono text-[12px]">
            {/* Folder: notebooks */}
            <div>
              <div className="flex items-center gap-1.5 px-2 py-1 text-neutral-300 font-semibold text-[11px]">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>notebooks/</span>
              </div>
              <div className="pl-4 space-y-0.5">
                {[
                  { file: 'notebooks/data_cleaning.ipynb', label: 'data_cleaning.ipynb' },
                  { file: 'notebooks/data_validation.ipynb', label: 'data_validation.ipynb' },
                  { file: 'notebooks/EDA.ipynb', label: 'EDA.ipynb' },
                  { file: 'notebooks/KPI_analysis.ipynb', label: 'KPI_analysis.ipynb' },
                ].map((item) => (
                  <button
                    key={item.file}
                    onClick={() => setSelectedFile(item.file)}
                    className={`w-full text-left px-2 py-1 rounded flex items-center gap-1.5 cursor-pointer transition-colors ${
                      selectedFile === item.file
                        ? 'bg-neutral-800 text-amber-300 font-medium'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                    }`}
                  >
                    <BookOpen className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Folder: sql */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 px-2 py-1 text-neutral-300 font-semibold text-[11px]">
                <Folder className="w-3.5 h-3.5 text-sky-400" />
                <span>sql/</span>
              </div>
              <div className="pl-4 space-y-0.5">
                {[
                  { file: 'sql/queries.sql', label: 'queries.sql' },
                  { file: 'sql/schema.sql', label: 'schema.sql' },
                ].map((item) => (
                  <button
                    key={item.file}
                    onClick={() => setSelectedFile(item.file)}
                    className={`w-full text-left px-2 py-1 rounded flex items-center gap-1.5 cursor-pointer transition-colors ${
                      selectedFile === item.file
                        ? 'bg-neutral-800 text-sky-300 font-medium'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                    }`}
                  >
                    <Database className="w-3 h-3 text-sky-400 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Folder: scripts */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 px-2 py-1 text-neutral-300 font-semibold text-[11px]">
                <Folder className="w-3.5 h-3.5 text-emerald-400" />
                <span>scripts/</span>
              </div>
              <div className="pl-4 space-y-0.5">
                {[
                  { file: 'scripts/clean_data.py', label: 'clean_data.py' },
                  { file: 'scripts/validate_data.py', label: 'validate_data.py' },
                  { file: 'scripts/calculate_kpis.py', label: 'calculate_kpis.py' },
                  { file: 'scripts/generate_mis.py', label: 'generate_mis.py' },
                ].map((item) => (
                  <button
                    key={item.file}
                    onClick={() => setSelectedFile(item.file)}
                    className={`w-full text-left px-2 py-1 rounded flex items-center gap-1.5 cursor-pointer transition-colors ${
                      selectedFile === item.file
                        ? 'bg-neutral-800 text-emerald-300 font-medium'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                    }`}
                  >
                    <FileCode className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Root Files */}
            <div className="pt-2">
              <div className="px-2 py-1 text-neutral-500 font-semibold text-[11px]">
                Root Configs
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => setSelectedFile('README.md')}
                  className={`w-full text-left px-2 py-1 rounded flex items-center gap-1.5 cursor-pointer transition-colors ${
                    selectedFile === 'README.md'
                      ? 'bg-neutral-800 text-white font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3 h-3 text-purple-400 shrink-0" />
                  <span>README.md</span>
                </button>
                <button
                  onClick={() => setSelectedFile('requirements.txt')}
                  className={`w-full text-left px-2 py-1 rounded flex items-center gap-1.5 cursor-pointer transition-colors ${
                    selectedFile === 'requirements.txt'
                      ? 'bg-neutral-800 text-white font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3 h-3 text-neutral-400 shrink-0" />
                  <span>requirements.txt</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Editor Pane: Interactive Notebook, SQL Runner, or Code Viewer */}
        <div className="md:col-span-3 lg:col-span-4 flex flex-col bg-neutral-950">
          {/* Editor Tab Bar */}
          <div className="bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-white font-medium">{selectedFile}</span>
              <span className="text-[11px] text-neutral-500">· VS Code Linux (WSL)</span>
            </div>

            <div className="flex items-center gap-2">
              {selectedFile.endsWith('.ipynb') && (
                <button
                  onClick={handleRunAllNotebook}
                  disabled={executingNotebook}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-600/40 rounded text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{executingNotebook ? 'Running Kernel...' : 'Run All Cells'}</span>
                </button>
              )}

              <button
                onClick={() => handleCopyCode(selectedFile)}
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Copy file path"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* 1. JUPYTER NOTEBOOK RUNNER VIEW */}
          {selectedFile.endsWith('.ipynb') && (
            <div className="p-6 space-y-6 overflow-y-auto max-h-[620px]">
              {/* Notebook Title Block */}
              <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-lg">
                <div className="text-[11px] font-mono text-amber-400">Jupyter Interactive Kernel · Python 3.11</div>
                <h2 className="font-display text-lg font-bold text-white mt-1">
                  {selectedFile === 'notebooks/data_cleaning.ipynb' && '01: Data Cleaning & Preprocessing Workflow'}
                  {selectedFile === 'notebooks/data_validation.ipynb' && '02: Data Quality Audit & Rules Engine'}
                  {selectedFile === 'notebooks/EDA.ipynb' && '03: Exploratory Data Analysis & Corridors'}
                  {selectedFile === 'notebooks/KPI_analysis.ipynb' && '04: Operational KPI & MIS Engine'}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Raftaar Cargo & Transport Services Pvt. Ltd. Operations Department
                </p>
              </div>

              {/* Cell 1 */}
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/40">
                <div className="bg-neutral-900 px-3 py-1.5 border-b border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>In [1]:</span>
                  <span>Python / Pandas Ingestion</span>
                </div>
                <pre className="p-4 font-mono text-xs text-neutral-200 overflow-x-auto bg-neutral-950">
{selectedFile === 'notebooks/data_cleaning.ipynb' && `import pandas as pd
import numpy as np

# Load multi-source operational data
df_raw = pd.read_csv('../data/raw/shipments.csv')
print(f"Raw shipments loaded: {df_raw.shape}")
print(f"Duplicate records: {df_raw.duplicated(subset=['Shipment_ID']).sum()}")`}

{selectedFile === 'notebooks/data_validation.ipynb' && `import pandas as pd
df_shipments = pd.read_csv('../data/processed/cleaned_shipments.csv')

# Rule 1: Freight > 0, Rule 2: Distance > 0
rule_freight = df_shipments['Freight'] > 0
rule_distance = df_shipments['Distance_KM'] > 0
print(f"Freight Rule Passed: {rule_freight.sum()} / {len(df_shipments)}")`}

{selectedFile === 'notebooks/EDA.ipynb' && `import pandas as pd
df = pd.read_csv('../data/processed/validated_shipments.csv')
status_counts = df['Status'].value_counts()
print("Delivery Status Breakdown:")
print(status_counts)`}

{selectedFile === 'notebooks/KPI_analysis.ipynb' && `import pandas as pd
df = pd.read_csv('../data/processed/validated_shipments.csv')
total = len(df)
delivered = (df['Status'] == 'Delivered').sum()
otd_pct = round((delivered / total) * 100, 2)
print(f"KPI 1 (Total): {total} | KPI 2 (Delivered): {delivered} | KPI 4 (OTD): {otd_pct}%")`}
                </pre>
                <div className="p-3 bg-neutral-900/80 border-t border-neutral-800/80 font-mono text-xs text-neutral-300">
                  <div className="text-[10px] text-neutral-500 mb-1">Out [1]:</div>
                  <div className="text-emerald-400">
                    {selectedFile === 'notebooks/data_cleaning.ipynb' && 'Raw shipments loaded: (34, 11)\nDuplicate records: 2'}
                    {selectedFile === 'notebooks/data_validation.ipynb' && 'Freight Rule Passed: 31 / 32\nChronology Passed: 31 / 32'}
                    {selectedFile === 'notebooks/EDA.ipynb' && 'Delivered: 19 (63.3%)\nIn Transit: 7 (23.3%)\nDelayed: 4 (13.3%)'}
                    {selectedFile === 'notebooks/KPI_analysis.ipynb' && 'KPI 1 (Total): 30 | KPI 2 (Delivered): 19 | KPI 4 (OTD): 82.61%'}
                  </div>
                </div>
              </div>

              {/* Cell 2 */}
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/40">
                <div className="bg-neutral-900 px-3 py-1.5 border-b border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>In [2]:</span>
                  <span>Operational Transformations</span>
                </div>
                <pre className="p-4 font-mono text-xs text-neutral-200 overflow-x-auto bg-neutral-950">
{selectedFile === 'notebooks/data_cleaning.ipynb' && `# City Casing Standardization
city_map = {'delhi': 'Delhi', 'DELHI': 'Delhi', 'mumbai': 'Mumbai', 'MUMBAI': 'Mumbai'}
df_clean['Origin'] = df_clean['Origin'].str.strip().apply(lambda x: city_map.get(x.lower(), x.title()))

# Compute Delay Days = Actual_Delivery - Expected_Delivery
df_clean['Delay_Days'] = (pd.to_datetime(df_clean['Actual_Delivery']) - pd.to_datetime(df_clean['Expected_Delivery'])).dt.days.clip(lower=0)
print("Standardized records preview:")
df_clean[['Shipment_ID', 'Origin', 'Destination', 'Status', 'Delay_Days']].head(3)`}

{selectedFile === 'notebooks/data_validation.ipynb' && `# Generate Data Quality Report
quality_score = round((len(df_validated) / len(df_raw)) * 100, 2)
print(f"Composite Data Quality Score: {quality_score}% (Status: PASSED)")`}

{selectedFile === 'notebooks/EDA.ipynb' && `# Top 3 Freight Corridors
routes = df.groupby(['Origin', 'Destination'])['Shipment_ID'].count().sort_values(ascending=False)
print("Top Corridors by Volume:")
print(routes.head(3))`}

{selectedFile === 'notebooks/KPI_analysis.ipynb' && `# KPI 6: Total Operational Cost (Fuel + Toll + Maintenance + Other)
df_expenses = pd.read_csv('../data/raw/expenses.csv')
total_cost = df_expenses[['Fuel_Cost', 'Toll_Cost', 'Maintenance_Cost', 'Other_Cost']].sum().sum()
print(f"KPI 6 (Total Cost): INR {total_cost:,.2f}")`}
                </pre>
                <div className="p-3 bg-neutral-900/80 border-t border-neutral-800/80 font-mono text-xs text-neutral-300">
                  <div className="text-[10px] text-neutral-500 mb-1">Out [2]:</div>
                  <div className="text-amber-300">
                    Execution completed with 0 errors. Memory usage: 1.4 MB.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. SQL RUNNER & QUERY INTERFACE */}
          {selectedFile.startsWith('sql/') && (
            <div className="p-5 flex flex-col h-full space-y-4">
              {/* Preloaded Query Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/70 p-3 rounded-lg border border-neutral-800">
                <div className="text-xs">
                  <span className="text-neutral-400 font-medium">Select Pre-Optimized Query:</span>
                  <select
                    className="ml-2 bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1 text-white focus:outline-none"
                    onChange={(e) => {
                      const q = PRELOADED_SQL_QUERIES.find(p => p.id === e.target.value);
                      if (q) setSelectedSqlQuery(q.sql);
                    }}
                  >
                    {PRELOADED_SQL_QUERIES.map((q) => (
                      <option key={q.id} value={q.id}>{q.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleExecuteSql}
                  disabled={isExecutingSql}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isExecutingSql ? 'Executing...' : 'Run SQL Query'}</span>
                </button>
              </div>

              {/* SQL Code Textarea */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 font-mono text-xs">
                <div className="text-[10px] text-neutral-500 mb-1 flex items-center justify-between">
                  <span>SQL Query Editor</span>
                  <span>PostgreSQL 16 Engine</span>
                </div>
                <textarea
                  value={selectedSqlQuery}
                  onChange={(e) => setSelectedSqlQuery(e.target.value)}
                  rows={6}
                  className="w-full bg-transparent text-sky-300 font-mono text-xs focus:outline-none resize-none"
                />
              </div>

              {/* Execution Results Grid */}
              <div className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-lg p-3 flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-800 mb-2">
                    <span className="font-semibold text-white">Query Execution Results:</span>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span>Latency: <strong className="text-emerald-400">{sqlExecutionTime}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Rows: <strong className="text-white">{sqlResults?.length || 0}</strong></span>
                    </div>
                  </div>

                  {sqlResults && (
                    <div className="overflow-x-auto max-h-[220px]">
                      <table className="w-full text-left text-xs border-collapse font-mono">
                        <thead>
                          <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400">
                            {Object.keys(sqlResults[0]).map((k) => (
                              <th key={k} className="py-2 px-3 uppercase text-[10px] tracking-wider">{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                          {sqlResults.map((row, idx) => (
                            <tr key={idx} className="hover:bg-neutral-800/40">
                              {Object.values(row).map((val: any, i) => (
                                <td key={i} className="py-2 px-3 tabular-nums">{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                  <span>High-scalability schema indexed on (booking_date, status, origin, destination).</span>
                  <span className="text-emerald-400 font-mono">Status: 200 OK</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. CODE / SCRIPT VIEWER */}
          {!selectedFile.endsWith('.ipynb') && !selectedFile.startsWith('sql/') && (
            <div className="p-6 overflow-y-auto max-h-[620px] font-mono text-xs">
              <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 text-neutral-300">
                <div className="text-[11px] text-neutral-500 mb-2">File: {selectedFile}</div>
                <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{selectedFile === 'scripts/clean_data.py' && `# clean_data.py - Data cleaning & text standardization
import csv
from datetime import datetime

# Standardizes 'delhi', 'DELHI' -> 'Delhi', handles duplicates, and calculates Delay_Days`}
{selectedFile === 'scripts/validate_data.py' && `# validate_data.py - Data validation rules engine
# Checks positive freight, positive distance, referential integrity against vehicles and drivers`}
{selectedFile === 'scripts/calculate_kpis.py' && `# calculate_kpis.py - Core operational KPIs calculation
# Computes Total Shipments, Delivered, Delayed, OTD %, Avg Delivery Time, Cost per KM`}
{selectedFile === 'scripts/generate_mis.py' && `# generate_mis.py - Automated Daily, Weekly, and Monthly MIS generator`}
{selectedFile === 'README.md' && `# Transport Operations MIS & Performance Analytics System
Raftaar Cargo & Transport Services Pvt. Ltd. (Internship Project Architecture)`}
{selectedFile === 'requirements.txt' && `pandas>=2.2.0
numpy>=1.26.0
matplotlib>=3.8.0
seaborn>=0.13.0
streamlit>=1.32.0`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
