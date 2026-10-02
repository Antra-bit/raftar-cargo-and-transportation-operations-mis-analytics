import React, { useState } from 'react';
import { DAILY_MIS_DATA, WEEKLY_MIS_DATA, MONTHLY_MIS_DATA } from '../data/mockLogisticsData';
import { Download, Printer, FileText, Calendar, AlertTriangle, CheckCircle2, TrendingUp, Truck } from 'lucide-react';

export const MisReportsView: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExportCSV = () => {
    let csvContent = '';
    let fileName = '';

    if (activeReportTab === 'daily') {
      fileName = 'Raftaar_Daily_MIS_2026-10-01.csv';
      csvContent = 'KPI,Value\n';
      Object.entries(DAILY_MIS_DATA.kpis).forEach(([k, v]) => {
        csvContent += `"${k}","${v}"\n`;
      });
    } else if (activeReportTab === 'weekly') {
      fileName = 'Raftaar_Weekly_MIS_Comparative.csv';
      csvContent = 'Week,Shipments,Delivered,Delayed,On_Time_Pct,Freight_Lakhs,Cost_Lakhs\n';
      WEEKLY_MIS_DATA.weeklyMetrics.forEach((m) => {
        csvContent += `"${m.week}",${m.shipments},${m.delivered},${m.delayed},${m.onTimePct},${m.freightInrLakhs},${m.costInrLakhs}\n`;
      });
    } else {
      fileName = 'Raftaar_Monthly_Executive_MIS_Sep2026.csv';
      csvContent = 'Metric,Value\n';
      Object.entries(MONTHLY_MIS_DATA.executiveSummary).forEach(([k, v]) => {
        csvContent += `"${k}","${v}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`Downloaded ${fileName}`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Management Information System (MIS) Reports Center
          </h1>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
            <span>Automated Operational Reporting Engine</span>
            <span aria-hidden="true">·</span>
            <span>Raftaar Cargo & Transport Services</span>
            <span aria-hidden="true">·</span>
            <span>Standardized Analytics Hierarchy</span>
          </div>
        </div>

        {/* Tab Switcher & Export buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
            <button
              onClick={() => setActiveReportTab('daily')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeReportTab === 'daily'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Daily MIS
            </button>
            <button
              onClick={() => setActiveReportTab('weekly')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeReportTab === 'weekly'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Weekly MIS
            </button>
            <button
              onClick={() => setActiveReportTab('monthly')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeReportTab === 'monthly'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monthly MIS
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-md hover:text-white transition-colors cursor-pointer"
            title="Print formal report"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs px-4 py-2.5 rounded-md flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadSuccess} successfully generated from backend pipeline.</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. DAILY MIS VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeReportTab === 'daily' && (
        <div className="space-y-6">
          {/* Executive Document Canvas */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-neutral-800 gap-3">
              <div>
                <div className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">
                  Official Operations Document
                </div>
                <h2 className="font-display text-xl font-bold text-white mt-0.5">
                  Daily Operations MIS Scorecard
                </h2>
                <div className="text-xs text-neutral-400 mt-1">
                  Report Date: <strong className="text-neutral-200 font-mono">{DAILY_MIS_DATA.date}</strong> · Generated at: {DAILY_MIS_DATA.generatedAt}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-800/60 rounded font-mono">
                  SLA Rate: {DAILY_MIS_DATA.kpis.onTimeDeliveryPct}%
                </span>
                <span className="px-2.5 py-1 bg-neutral-800 text-neutral-300 rounded font-mono">
                  Status: Standard Audit
                </span>
              </div>
            </div>

            {/* Daily Operational Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <div className="text-xs text-neutral-500 font-medium">Total Shipments</div>
                <div className="font-mono text-2xl font-bold text-white mt-1 tabular-nums">
                  {DAILY_MIS_DATA.kpis.totalShipments}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">100% Dispatched</div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <div className="text-xs text-neutral-500 font-medium">Delivered (On-Time)</div>
                <div className="font-mono text-2xl font-bold text-emerald-400 mt-1 tabular-nums">
                  {DAILY_MIS_DATA.kpis.delivered}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">{DAILY_MIS_DATA.kpis.onTimeDeliveryPct}% Success Rate</div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <div className="text-xs text-neutral-500 font-medium">Delayed Shipments</div>
                <div className="font-mono text-2xl font-bold text-rose-400 mt-1 tabular-nums">
                  {DAILY_MIS_DATA.kpis.delayed}
                </div>
                <div className="text-[11px] text-rose-400 mt-1">Action Required</div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <div className="text-xs text-neutral-500 font-medium">In Transit Units</div>
                <div className="font-mono text-2xl font-bold text-sky-400 mt-1 tabular-nums">
                  {DAILY_MIS_DATA.kpis.inTransit}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">Moving on Schedule</div>
              </div>
            </div>

            {/* Daily Financial & Operational Benchmarks Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 font-medium bg-neutral-950/40">
                    <th className="py-2.5 px-3">Daily Operations KPI</th>
                    <th className="py-2.5 px-3">Recorded Value</th>
                    <th className="py-2.5 px-3">Target Benchmark</th>
                    <th className="py-2.5 px-3">Variance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-300 font-mono">
                  <tr>
                    <td className="py-3 px-3 font-sans font-medium text-white">Gross Freight Booked</td>
                    <td className="py-3 px-3 text-amber-300 font-bold tabular-nums">{DAILY_MIS_DATA.kpis.totalFreight}</td>
                    <td className="py-3 px-3 text-neutral-500">₹ 8.00 Lakhs</td>
                    <td className="py-3 px-3 text-emerald-400 font-sans">+5.25% Above Target</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-sans font-medium text-white">Direct Operational Cost</td>
                    <td className="py-3 px-3 tabular-nums">{DAILY_MIS_DATA.kpis.totalOperationalCost}</td>
                    <td className="py-3 px-3 text-neutral-500">₹ 2.80 Lakhs</td>
                    <td className="py-3 px-3 text-emerald-400 font-sans">Cost Optimized (-5.3%)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-sans font-medium text-white">Average Delivery Time</td>
                    <td className="py-3 px-3 tabular-nums">{DAILY_MIS_DATA.kpis.avgDeliveryTime}</td>
                    <td className="py-3 px-3 text-neutral-500">2.5 Days</td>
                    <td className="py-3 px-3 text-emerald-400 font-sans">Nominal Speed</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-sans font-medium text-white">Cost per KM</td>
                    <td className="py-3 px-3 tabular-nums">{DAILY_MIS_DATA.kpis.costPerKm}</td>
                    <td className="py-3 px-3 text-neutral-500">₹ 28.50 / KM</td>
                    <td className="py-3 px-3 text-emerald-400 font-sans">Efficient Fleet Run</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Daily Operational Exceptions Box */}
            <div className="mt-6 bg-neutral-950 border border-neutral-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Daily Exception & Escalation Log</span>
              </div>
              <div className="space-y-2 text-xs text-neutral-300">
                <div className="flex items-start gap-2">
                  <span className="text-neutral-500">·</span>
                  <span>
                    <strong>Delayed Consignments ({DAILY_MIS_DATA.exceptionSummary.delayedShipmentsCount} units):</strong> Sample IDs flagged: {DAILY_MIS_DATA.exceptionSummary.delayedShipmentSamples.join(', ')}.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neutral-500">·</span>
                  <span>
                    <strong>Vehicles Under Maintenance ({DAILY_MIS_DATA.exceptionSummary.vehiclesUnderMaintenanceCount} units):</strong> {DAILY_MIS_DATA.exceptionSummary.vehiclesUnderMaintenance.join('; ')}.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neutral-500">·</span>
                  <span>
                    <strong>Operational Action Taken:</strong> {DAILY_MIS_DATA.exceptionSummary.actionRequired}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. WEEKLY MIS VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeReportTab === 'weekly' && (
        <div className="space-y-6">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-neutral-800 gap-3">
              <div>
                <div className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">
                  Operational Progression
                </div>
                <h2 className="font-display text-xl font-bold text-white mt-0.5">
                  Weekly Comparative Operations MIS
                </h2>
                <div className="text-xs text-neutral-400 mt-1">
                  Tracking Period: <strong>{WEEKLY_MIS_DATA.month}</strong> · 4 Operational Cycles
                </div>
              </div>
            </div>

            {/* Weekly Metrics Matrix Table */}
            <div className="my-6 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 font-medium bg-neutral-950/60">
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4 text-right">Week 1</th>
                    <th className="py-3 px-4 text-right">Week 2</th>
                    <th className="py-3 px-4 text-right">Week 3</th>
                    <th className="py-3 px-4 text-right text-amber-400">Week 4 (Current)</th>
                    <th className="py-3 px-4 text-right">Month Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono text-neutral-300">
                  <tr>
                    <td className="py-3 px-4 font-sans font-medium text-white">Total Shipments</td>
                    <td className="py-3 px-4 text-right tabular-nums">520</td>
                    <td className="py-3 px-4 text-right tabular-nums">574</td>
                    <td className="py-3 px-4 text-right tabular-nums">612</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-white">641</td>
                    <td className="py-3 px-4 text-right font-sans text-emerald-400">+23.3% ↗</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-sans font-medium text-white">Delivered Shipments</td>
                    <td className="py-3 px-4 text-right tabular-nums">471</td>
                    <td className="py-3 px-4 text-right tabular-nums">523</td>
                    <td className="py-3 px-4 text-right tabular-nums">551</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-emerald-400">589</td>
                    <td className="py-3 px-4 text-right font-sans text-emerald-400">+25.0% ↗</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-sans font-medium text-white">Delayed Shipments</td>
                    <td className="py-3 px-4 text-right tabular-nums text-rose-400">49</td>
                    <td className="py-3 px-4 text-right tabular-nums text-rose-400">51</td>
                    <td className="py-3 px-4 text-right tabular-nums text-rose-400">61</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-rose-400">52</td>
                    <td className="py-3 px-4 text-right font-sans text-emerald-400">Stabilized</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-sans font-medium text-white">On-Time Delivery (OTD %)</td>
                    <td className="py-3 px-4 text-right tabular-nums">90.6%</td>
                    <td className="py-3 px-4 text-right tabular-nums">91.1%</td>
                    <td className="py-3 px-4 text-right tabular-nums">90.0%</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-amber-300">91.9%</td>
                    <td className="py-3 px-4 text-right font-sans text-emerald-400">+1.3% pt</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-sans font-medium text-white">Gross Freight (₹ Lakhs)</td>
                    <td className="py-3 px-4 text-right tabular-nums">₹ 29.4 L</td>
                    <td className="py-3 px-4 text-right tabular-nums">₹ 32.8 L</td>
                    <td className="py-3 px-4 text-right tabular-nums">₹ 35.1 L</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-white">₹ 37.2 L</td>
                    <td className="py-3 px-4 text-right font-sans text-emerald-400">+26.5% ↗</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-sans font-medium text-white">Operating Cost (₹ Lakhs)</td>
                    <td className="py-3 px-4 text-right tabular-nums">₹ 9.1 L</td>
                    <td className="py-3 px-4 text-right tabular-nums">₹ 10.2 L</td>
                    <td className="py-3 px-4 text-right tabular-nums">₹ 11.0 L</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-white">₹ 11.4 L</td>
                    <td className="py-3 px-4 text-right font-sans text-neutral-400">Scale Linear</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Weekly Insights Box */}
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-lg text-xs space-y-2">
              <div className="text-amber-400 font-semibold mb-1">Weekly Analytical Observations:</div>
              {WEEKLY_MIS_DATA.keyInsights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2 text-neutral-300">
                  <span className="text-amber-400">0{idx + 1}.</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. MONTHLY MIS VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeReportTab === 'monthly' && (
        <div className="space-y-6">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-neutral-800 gap-3">
              <div>
                <div className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">
                  Executive Leadership Report
                </div>
                <h2 className="font-display text-xl font-bold text-white mt-0.5">
                  Monthly Executive Operations MIS
                </h2>
                <div className="text-xs text-neutral-400 mt-1">
                  Full Operational Cycle: <strong>{MONTHLY_MIS_DATA.monthPeriod}</strong>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-neutral-400">Gross Freight Turnover:</div>
                <div className="font-mono text-xl font-bold text-white">
                  {MONTHLY_MIS_DATA.executiveSummary.totalFreight}
                </div>
              </div>
            </div>

            {/* Monthly Top Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <span className="text-xs text-neutral-500">Total Consignments</span>
                <div className="font-mono text-2xl font-bold text-white mt-1 tabular-nums">
                  {MONTHLY_MIS_DATA.executiveSummary.totalShipments}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Delivered: {MONTHLY_MIS_DATA.executiveSummary.delivered}
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <span className="text-xs text-neutral-500">On-Time Delivery %</span>
                <div className="font-mono text-2xl font-bold text-amber-400 mt-1 tabular-nums">
                  {MONTHLY_MIS_DATA.executiveSummary.onTimeDeliveryPct}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">Target SLA: 90.0%</div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <span className="text-xs text-neutral-500">Operational Cost</span>
                <div className="font-mono text-2xl font-bold text-white mt-1 tabular-nums">
                  {MONTHLY_MIS_DATA.executiveSummary.operationalCost}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Avg Cost/KM: {MONTHLY_MIS_DATA.executiveSummary.avgCostPerKm}
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <span className="text-xs text-neutral-500">Net Operating Profit</span>
                <div className="font-mono text-2xl font-bold text-emerald-400 mt-1 tabular-nums">
                  {MONTHLY_MIS_DATA.executiveSummary.netOperatingProfit}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">
                  Operating Margin: {MONTHLY_MIS_DATA.executiveSummary.operatingMargin}
                </div>
              </div>
            </div>

            {/* Modal Split and Top Routes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
              {/* Modal Split */}
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <h3 className="font-semibold text-white text-xs mb-3">Freight Modal Split</h3>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between mb-1 text-neutral-300">
                      <span>Full Truckload (FTL)</span>
                      <span className="font-mono text-white font-bold">{MONTHLY_MIS_DATA.modalSplit.ftlPct}</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full" style={{ width: '58.4%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-neutral-300">
                      <span>Less Than Truckload (LTL)</span>
                      <span className="font-mono text-white font-bold">{MONTHLY_MIS_DATA.modalSplit.ltlPct}</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-sky-400 h-full" style={{ width: '26.2%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-neutral-300">
                      <span>Express Cargo Priority</span>
                      <span className="font-mono text-white font-bold">{MONTHLY_MIS_DATA.modalSplit.expressPct}</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full" style={{ width: '11.1%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-neutral-300">
                      <span>Cold Chain Reefer Logistics</span>
                      <span className="font-mono text-white font-bold">{MONTHLY_MIS_DATA.modalSplit.coldChainPct}</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-400 h-full" style={{ width: '4.3%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Routes */}
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <h3 className="font-semibold text-white text-xs mb-3">Top Route Profitability</h3>
                <div className="space-y-3 text-xs">
                  {MONTHLY_MIS_DATA.topPerformingRoutes.map((r) => (
                    <div key={r.route} className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
                      <div>
                        <div className="font-medium text-white">{r.route}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">{r.volume} consignments</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-amber-400 font-bold">{r.otdPct}% OTD</div>
                        <span className="text-[10px] text-emerald-400 uppercase font-medium">{r.profitability} Margin</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
