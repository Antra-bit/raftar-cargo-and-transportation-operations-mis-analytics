import React, { useState } from 'react';
import { DATA_QUALITY_STATS } from '../data/mockLogisticsData';
import { Database, CheckCircle2, ShieldCheck, ArrowRight, Sparkles, Filter, FileSpreadsheet } from 'lucide-react';

export const DataPipelineView: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number>(3); // Default on validation / quality
  const [viewMode, setViewMode] = useState<'transformed' | 'raw'>('transformed');

  const rawSampleRecords = [
    { id: 'SHP-2026-0801', origin: 'delhi', dest: 'MUMBAI', date: '2026-09-28', status: 'delivered', freight: '65400', dist: '1420', anomaly: 'Lowercase / All-Caps' },
    { id: 'SHP-2026-0801', origin: 'Delhi', dest: 'Mumbai', date: '2026-09-28', status: 'Delivered', freight: '65400', dist: '1420', anomaly: 'Duplicate ID Record' },
    { id: 'SHP-2026-0803', origin: 'DELHI', dest: 'Kolkata', date: '2026-09-28', status: 'delayed', freight: '72000', dist: '1530', anomaly: 'Inconsistent status' },
    { id: 'SHP-ERR-001', origin: 'Delhi', dest: 'Mumbai', date: '2026-10-01', status: 'Delivered', freight: '-5000', dist: '1420', anomaly: 'Negative Freight (Rule 2 Fail)' },
    { id: 'SHP-ERR-002', origin: 'Kolkata', dest: 'Delhi', date: '2026-10-01', status: 'In Transit', freight: '0', dist: '-100', anomaly: 'Negative Distance (Rule 3 Fail)' }
  ];

  const cleanedSampleRecords = [
    { id: 'SHP-2026-0801', origin: 'Delhi', dest: 'Mumbai', date: '2026-09-28', status: 'Delivered', freight: '₹ 65,400', dist: '1,420 KM', delay: '0 days', note: 'Standardized & Deduplicated' },
    { id: 'SHP-2026-0802', origin: 'Mumbai', dest: 'Bengaluru', date: '2026-09-28', status: 'Delivered', freight: '₹ 48,200', dist: '980 KM', delay: '0 days', note: 'Casing Cleaned' },
    { id: 'SHP-2026-0803', origin: 'Delhi', dest: 'Kolkata', date: '2026-09-28', status: 'Delayed', freight: '₹ 72,000', dist: '1,530 KM', delay: '+2 days', note: 'Delay Computed Automatically' },
    { id: 'SHP-2026-0804', origin: 'Bengaluru', dest: 'Chennai', date: '2026-09-29', status: 'Delivered', freight: '₹ 22,500', dist: '345 KM', delay: '0 days', note: 'Validated & Stored' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-800">
        <h1 className="font-display text-2xl font-bold tracking-tight text-white">
          Automated Data Cleaning, Validation & Transformation Pipeline
        </h1>
        <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
          <span>Enterprise ETL Workflow</span>
          <span aria-hidden="true">·</span>
          <span>Raw Ingestion → Quality Audit → Relational SQL Storage</span>
        </div>
      </div>

      {/* 6-Stage Pipeline Stepper Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
        {[
          { step: 1, label: 'Collection', desc: '4 Raw Datasets' },
          { step: 2, label: 'Cleaning', desc: 'Deduplicate & Casing' },
          { step: 3, label: 'Validation', desc: 'Quality Audit Rules' },
          { step: 4, label: 'Transformation', desc: 'Delays & Unit Costs' },
          { step: 5, label: 'SQL Storage', desc: 'Relational Star Schema' },
          { step: 6, label: 'MIS Engine', desc: 'Automated Reports' },
        ].map((item) => (
          <button
            key={item.step}
            onClick={() => setSelectedStage(item.step)}
            className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
              selectedStage === item.step
                ? 'bg-neutral-800 border-amber-500/60 text-white'
                : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1 font-mono text-[11px]">
              <span className={selectedStage === item.step ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                0{item.step}
              </span>
              {selectedStage === item.step && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </div>
            <div className="font-semibold text-white">{item.label}</div>
            <div className="text-[11px] text-neutral-500 truncate">{item.desc}</div>
          </button>
        ))}
      </div>

      {/* Active Stage Details Banner */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5">
        {selectedStage === 1 && (
          <div>
            <h2 className="font-display text-base font-semibold text-white">
              Phase 1 — Multi-Source Operational Data Ingestion
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl">
              Consolidates fragmented operational sources including shipment bookings (<code className="text-amber-300">shipments.csv</code>), commercial vehicles master (<code className="text-amber-300">vehicles.csv</code>), licensed drivers registry (<code className="text-amber-300">drivers.csv</code>), and transit direct expenses (<code className="text-amber-300">expenses.csv</code>).
            </p>
          </div>
        )}

        {selectedStage === 2 && (
          <div>
            <h2 className="font-display text-base font-semibold text-white">
              Phase 2 — Automated Data Cleaning & Standardization
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl">
              Resolves inconsistent typography (e.g. <code className="text-amber-300">delhi</code>, <code className="text-amber-300">DELHI</code> → <code className="text-emerald-400">Delhi</code>; <code className="text-amber-300">delivered</code> → <code className="text-emerald-400">Delivered</code>), purges duplicate booking records, standardizes ISO timestamps, and cleans empty strings.
            </p>
          </div>
        )}

        {selectedStage === 3 && (
          <div>
            <h2 className="font-display text-base font-semibold text-white">
              Phase 3 — Business Rule Validation & Data Quality Report
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl">
              Enforces logistics invariants: positive freight charges (<code className="text-amber-300">Freight &gt; 0</code>), valid travel distances (<code className="text-amber-300">Distance_KM &gt; 0</code>), chronology constraints (<code className="text-amber-300">Actual_Delivery &ge; Booking_Date</code>), and foreign key referential integrity against vehicles and drivers masters.
            </p>
          </div>
        )}

        {selectedStage === 4 && (
          <div>
            <h2 className="font-display text-base font-semibold text-white">
              Phase 4 — Operational Transformations & Derived Metrics
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl">
              Calculates business fields: <code className="text-amber-300">Delay_Days = max(0, Actual_Delivery - Expected_Delivery)</code>, transit duration in days, total direct trip expenses, and unit economics (<code className="text-amber-300">Cost per KM</code> and <code className="text-amber-300">Cost per Shipment</code>).
            </p>
          </div>
        )}

        {selectedStage === 5 && (
          <div>
            <h2 className="font-display text-base font-semibold text-white">
              Phase 5 — High-Scalability SQL Database Storage
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl">
              Stores validated records in a normalized star schema (<code className="text-amber-300">SHIPMENTS</code>, <code className="text-amber-300">VEHICLES</code>, <code className="text-amber-300">DRIVERS</code>, <code className="text-amber-300">EXPENSES</code>) with B-tree indexes and rollup summary tables for sub-second analytical querying.
            </p>
          </div>
        )}

        {selectedStage === 6 && (
          <div>
            <h2 className="font-display text-base font-semibold text-white">
              Phase 6 — KPI Calculation & Automated MIS Generation
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl">
              Automatically aggregates daily operational snapshots, 4-week trend matrices, and executive monthly summaries with exception logs for management reporting.
            </p>
          </div>
        )}
      </div>

      {/* Official Data Quality Report Card (Matching Section 11 of User Brief) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] font-mono text-emerald-400 uppercase">Audit Completed</div>
              <h3 className="font-display text-base font-semibold text-white mt-0.5">
                Data Quality Scorecard
              </h3>
            </div>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 text-center mb-4">
            <span className="text-xs text-neutral-400">Composite Data Quality Score</span>
            <div className="font-mono text-3xl font-bold text-emerald-400 mt-1 tabular-nums">
              {DATA_QUALITY_STATS.metrics.dataQualityScore}%
            </div>
            <span className="text-[11px] text-emerald-300">Enterprise Audit Grade A+</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-neutral-300">
              <span>Total Raw Records Ingested</span>
              <span className="font-mono tabular-nums text-white font-semibold">
                {DATA_QUALITY_STATS.metrics.totalRecords.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Duplicate Records Removed</span>
              <span className="font-mono tabular-nums text-rose-400">
                {DATA_QUALITY_STATS.metrics.duplicateRecords}
              </span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Missing Values Handled</span>
              <span className="font-mono tabular-nums text-amber-400">
                {DATA_QUALITY_STATS.metrics.missingValues}
              </span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Invalid Chronology Dates</span>
              <span className="font-mono tabular-nums text-rose-400">
                {DATA_QUALITY_STATS.metrics.invalidDates}
              </span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Non-Positive Freight Violations</span>
              <span className="font-mono tabular-nums text-rose-400">
                {DATA_QUALITY_STATS.metrics.invalidFreight}
              </span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Referential Integrity Mismatches</span>
              <span className="font-mono tabular-nums text-rose-400">
                {DATA_QUALITY_STATS.metrics.referentialKeyErrors}
              </span>
            </div>
            <div className="pt-2 border-t border-neutral-800 flex justify-between font-semibold">
              <span className="text-white">Clean Valid Records Stored</span>
              <span className="font-mono tabular-nums text-emerald-400">
                {DATA_QUALITY_STATS.metrics.validRecords.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Interactive Before vs After Comparison */}
        <div className="lg:col-span-2 bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-base font-semibold text-white">
                  Record Transformation Inspector
                </h3>
                <p className="text-xs text-neutral-400">
                  Compare raw ingested rows against cleaned, validated database records
                </p>
              </div>

              {/* Segmented Toggle */}
              <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-lg text-xs">
                <button
                  onClick={() => setViewMode('raw')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    viewMode === 'raw'
                      ? 'bg-neutral-800 text-rose-400 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Raw Ingested Records
                </button>
                <button
                  onClick={() => setViewMode('transformed')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    viewMode === 'transformed'
                      ? 'bg-neutral-800 text-emerald-400 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Cleaned & Validated Records
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-neutral-800">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 font-sans">
                    <th className="py-2.5 px-3">Shipment ID</th>
                    <th className="py-2.5 px-3">Origin → Dest</th>
                    <th className="py-2.5 px-3">Booking Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Freight</th>
                    <th className="py-2.5 px-3">Distance</th>
                    <th className="py-2.5 px-3 font-sans">
                      {viewMode === 'raw' ? 'Flagged Issue' : 'Applied Rule'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                  {viewMode === 'raw' ? (
                    rawSampleRecords.map((r, i) => (
                      <tr key={i} className="hover:bg-neutral-800/30">
                        <td className="py-2.5 px-3 text-white">{r.id}</td>
                        <td className="py-2.5 px-3">{r.origin} → {r.dest}</td>
                        <td className="py-2.5 px-3">{r.date}</td>
                        <td className="py-2.5 px-3 text-amber-300">{r.status}</td>
                        <td className="py-2.5 px-3">{r.freight}</td>
                        <td className="py-2.5 px-3">{r.dist}</td>
                        <td className="py-2.5 px-3 text-rose-400 font-sans text-[11px]">{r.anomaly}</td>
                      </tr>
                    ))
                  ) : (
                    cleanedSampleRecords.map((r, i) => (
                      <tr key={i} className="hover:bg-neutral-800/30">
                        <td className="py-2.5 px-3 text-white font-bold">{r.id}</td>
                        <td className="py-2.5 px-3 text-emerald-300">{r.origin} → {r.dest}</td>
                        <td className="py-2.5 px-3">{r.date}</td>
                        <td className="py-2.5 px-3 text-emerald-400">{r.status}</td>
                        <td className="py-2.5 px-3 tabular-nums">{r.freight}</td>
                        <td className="py-2.5 px-3 tabular-nums">{r.dist}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-sans text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          <span>{r.note}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span>Automated Script: <code className="text-amber-400 font-mono">scripts/validate_data.py</code></span>
            <span className="text-emerald-400 font-mono">Exit Code 0 (Success)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
