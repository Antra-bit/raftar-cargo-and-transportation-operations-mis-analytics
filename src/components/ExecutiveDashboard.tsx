import React, { useState } from 'react';
import { Shipment, OperationalKPIs } from '../types/logistics';
import { CORE_KPIS, FREIGHT_CORRIDORS } from '../data/mockLogisticsData';
import { 
  TrendingUp, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  ArrowUpRight,
  ShieldAlert,
  Fuel,
  IndianRupee,
  Navigation
} from 'lucide-react';

interface ExecutiveDashboardProps {
  shipments: Shipment[];
  onSelectShipment: (shipment: Shipment) => void;
  onNavigateTab: (tab: any) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  shipments,
  onSelectShipment,
  onNavigateTab
}) => {
  const [selectedOrigin, setSelectedOrigin] = useState<string>('All');
  const [selectedCorridor, setSelectedCorridor] = useState<string>(FREIGHT_CORRIDORS[0].id);

  // Filter shipments based on selected origin if not 'All'
  const filteredShipments = selectedOrigin === 'All' 
    ? shipments 
    : shipments.filter(s => s.origin === selectedOrigin || s.destination === selectedOrigin);

  // Dynamic KPI calculations based on current filter
  const currentTotal = filteredShipments.length;
  const currentDelivered = filteredShipments.filter(s => s.status === 'Delivered').length;
  const currentDelayed = filteredShipments.filter(s => s.status === 'Delayed').length;
  const currentInTransit = filteredShipments.filter(s => s.status === 'In Transit').length;
  const completed = currentDelivered + currentDelayed;
  const currentOtd = completed > 0 ? ((currentDelivered / completed) * 100).toFixed(1) : CORE_KPIS.onTimeDeliveryPct.toFixed(1);

  const activeCorridorData = FREIGHT_CORRIDORS.find(c => c.id === selectedCorridor) || FREIGHT_CORRIDORS[0];

  return (
    <div className="space-y-6">
      {/* Top Header & Operational Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Operations & Performance Analytics Cockpit
          </h1>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
            <span>Raftaar Cargo Fleet Operations</span>
            <span aria-hidden="true">·</span>
            <span>September – October 2026 Cycle</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Telemetry Active
            </span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg p-1 text-xs">
            <span className="text-neutral-400 px-2 font-medium">Hub:</span>
            {['All', 'Delhi', 'Mumbai', 'Bengaluru', 'Kolkata'].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedOrigin(city)}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  selectedOrigin === city
                    ? 'bg-neutral-800 text-amber-400 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Exception Alert Banner */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-md shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-amber-200">
              Active Exception Advisory: NH48 Surat-Vapi Corridor
            </div>
            <div className="text-neutral-400 mt-0.5">
              8 consignments flagged with potential delay risk due to highway maintenance near Gujarat-Maharashtra border. Automated rerouting suggested.
            </div>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('mis-reports')}
          className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium rounded border border-amber-700/50 transition-colors whitespace-nowrap cursor-pointer shrink-0"
        >
          Review Daily MIS Exceptions
        </button>
      </div>

      {/* 8 Core Operational KPIs Scorecard */}
      <div>
        <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
          Core Operational Performance Indicators (8 KPIs)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* KPI 1: Total Shipments */}
          <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-lg">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-xs font-medium">KPI 1: Total Shipments</span>
              <Truck className="w-3.5 h-3.5 text-neutral-500" />
            </div>
            <div className="font-mono text-2xl font-bold text-white tabular-nums">
              {selectedOrigin === 'All' ? CORE_KPIS.totalShipments.toLocaleString() : currentTotal}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
              <span className="text-emerald-400 font-mono">+12.4%</span>
              <span aria-hidden="true">·</span>
              <span>vs previous cycle</span>
            </div>
          </div>

          {/* KPI 2: Delivered Shipments */}
          <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-lg">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-xs font-medium">KPI 2: Delivered</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
              {selectedOrigin === 'All' ? CORE_KPIS.deliveredShipments.toLocaleString() : currentDelivered}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
              <span>90.7% completion</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-500">Verified POD</span>
            </div>
          </div>

          {/* KPI 3: Delayed Shipments */}
          <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-lg">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-xs font-medium">KPI 3: Delayed</span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="font-mono text-2xl font-bold text-rose-400 tabular-nums">
              {selectedOrigin === 'All' ? CORE_KPIS.delayedShipments.toLocaleString() : currentDelayed}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
              <span>9.3% delay rate</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400">8 today</span>
            </div>
          </div>

          {/* KPI 4: On-Time Delivery % */}
          <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-lg">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-xs font-medium">KPI 4: On-Time Delivery %</span>
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="font-mono text-2xl font-bold text-amber-400 tabular-nums">
              {currentOtd}%
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
              <span>Target: 90.0%</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">+0.7% above SLA</span>
            </div>
          </div>

          {/* KPI 5: Average Delivery Time */}
          <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-lg">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-xs font-medium">KPI 5: Avg Delivery Time</span>
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
            </div>
            <div className="font-mono text-2xl font-bold text-white tabular-nums">
              {CORE_KPIS.avgDeliveryTimeDays} <span className="text-sm font-normal text-neutral-400">Days</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
              <span>National Turnaround</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">-0.2d faster</span>
            </div>
          </div>

          {/* KPI 6: Total Operational Cost */}
          <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-lg">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-xs font-medium">KPI 6: Operational Cost</span>
              <IndianRupee className="w-3.5 h-3.5 text-neutral-500" />
            </div>
            <div className="font-mono text-2xl font-bold text-white tabular-nums">
              ₹ 38.6 <span className="text-sm font-normal text-neutral-400">Lakhs</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
              <span>Fuel 51%</span>
              <span aria-hidden="true">·</span>
              <span>Toll 21%</span>
            </div>
          </div>

          {/* KPI 7: Cost Per Shipment */}
          <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-lg">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-xs font-medium">KPI 7: Cost / Shipment</span>
              <IndianRupee className="w-3.5 h-3.5 text-neutral-500" />
            </div>
            <div className="font-mono text-2xl font-bold text-white tabular-nums">
              ₹ {CORE_KPIS.costPerShipment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
              <span>Unit Economic Baseline</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">-4.2%</span>
            </div>
          </div>

          {/* KPI 8: Cost Per KM */}
          <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-lg">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-xs font-medium">KPI 8: Cost / KM</span>
              <Navigation className="w-3.5 h-3.5 text-neutral-500" />
            </div>
            <div className="font-mono text-2xl font-bold text-white tabular-nums">
              ₹ {CORE_KPIS.costPerKm.toFixed(2)} <span className="text-sm font-normal text-neutral-400">/ KM</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
              <span>Fleet Fuel Index</span>
              <span aria-hidden="true">·</span>
              <span>3.7 Km/L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Freight Corridor Map + Real-Time Telemetry Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Logistics Corridor Map */}
        <div className="lg:col-span-2 bg-neutral-900/70 border border-neutral-800 rounded-lg p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-base font-semibold text-white">
                National Freight Corridors & Real-Time Fleet Tracking
              </h2>
              <p className="text-xs text-neutral-400">
                Live inter-hub transit lines with active telemetry and checkpoint status
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-mono">
                {FREIGHT_CORRIDORS.reduce((acc, c) => acc + c.activeTrucks, 0)} Trucks Active
              </span>
            </div>
          </div>

          {/* Interactive SVG Map */}
          <div className="relative bg-neutral-950/80 border border-neutral-800/80 rounded-lg p-3 overflow-hidden flex items-center justify-center min-h-[380px]">
            <svg
              viewBox="0 0 700 600"
              className="w-full h-full max-h-[440px] select-none"
            >
              <defs>
                <linearGradient id="corridorGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Background Map Grid */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#262626" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Simplified India Territorial Outline */}
              <path
                d="M 280 80 Q 320 60 360 80 Q 400 120 370 160 Q 420 180 520 200 Q 560 240 540 290 Q 510 320 480 300 Q 440 320 410 370 Q 390 450 350 560 Q 330 580 310 550 Q 270 470 240 400 Q 200 370 190 320 Q 180 260 220 200 Q 240 140 280 80 Z"
                fill="#121212"
                stroke="#333333"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Corridor Lines */}
              {FREIGHT_CORRIDORS.map((c) => {
                const isSelected = selectedCorridor === c.id;
                return (
                  <g key={c.id} className="cursor-pointer" onClick={() => setSelectedCorridor(c.id)}>
                    {/* Underlying line glow */}
                    <line
                      x1={c.x1}
                      y1={c.y1}
                      x2={c.x2}
                      y2={c.y2}
                      stroke={isSelected ? '#f59e0b' : '#525252'}
                      strokeWidth={isSelected ? 4 : 2}
                      strokeLinecap="round"
                    />

                    {/* Animated moving truck packet */}
                    <circle
                      r={isSelected ? 5 : 3.5}
                      fill={isSelected ? '#f59e0b' : '#38bdf8'}
                      filter="url(#glow)"
                    >
                      <animateMotion
                        path={`M ${c.x1} ${c.y1} L ${c.x2} ${c.y2}`}
                        dur={c.id === 'c1' ? '6s' : c.id === 'c3' ? '4s' : '8s'}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}

              {/* Major Hub Cities */}
              {[
                { name: 'Delhi NCR', x: 290, y: 180, code: 'DEL' },
                { name: 'Mumbai JNPT', x: 240, y: 370, code: 'BOM' },
                { name: 'Bengaluru', x: 300, y: 520, code: 'BLR' },
                { name: 'Kolkata', x: 510, y: 280, code: 'CCU' },
                { name: 'Chennai', x: 370, y: 510, code: 'MAA' },
                { name: 'Hyderabad', x: 340, y: 420, code: 'HYD' },
                { name: 'Ahmedabad', x: 220, y: 280, code: 'AMD' },
              ].map((hub) => (
                <g key={hub.name} className="pointer-events-none">
                  <circle cx={hub.x} cy={hub.y} r="6" fill="#0a0a0a" stroke="#f59e0b" strokeWidth="2.5" />
                  <circle cx={hub.x} cy={hub.y} r="2.5" fill="#f59e0b" />
                  <text
                    x={hub.x + 9}
                    y={hub.y + 4}
                    fill="#e5e5e5"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    {hub.name}
                  </text>
                </g>
              ))}
            </svg>

            {/* Selected Corridor Info Overlay */}
            <div className="absolute bottom-3 left-3 bg-neutral-900/90 border border-neutral-700/80 p-3 rounded-md backdrop-blur text-xs max-w-xs">
              <div className="font-semibold text-white">{activeCorridorData.name}</div>
              <div className="flex items-center gap-2 text-neutral-400 mt-1">
                <span>OTD Rate: <strong className="text-amber-400">{activeCorridorData.otd}</strong></span>
                <span aria-hidden="true">·</span>
                <span>{activeCorridorData.activeTrucks} Active Trucks</span>
              </div>
              <div className="text-neutral-400 mt-1 text-[11px]">
                Status: <span className="text-emerald-400">{activeCorridorData.status}</span>
              </div>
            </div>
          </div>

          {/* Quick Corridor Selector Pills */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {FREIGHT_CORRIDORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCorridor(c.id)}
                className={`px-3 py-1.5 rounded-md border text-left cursor-pointer transition-colors ${
                  selectedCorridor === c.id
                    ? 'bg-neutral-800 text-amber-300 border-amber-500/50'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                <div className="font-medium">{c.origin} → {c.dest}</div>
                <div className="text-[10px] text-neutral-400">{c.otd} OTD</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Live Telemetry & In-Transit Tracking */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-base font-semibold text-white">
                Live Consignment Telemetry
              </h2>
              <button
                onClick={() => onNavigateTab('shipments')}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                All Shipments <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              Active consignments currently moving across national transit lanes.
            </p>

            {/* List of active shipments */}
            <div className="space-y-3">
              {shipments.slice(0, 5).map((s) => (
                <div
                  key={s.shipmentId}
                  onClick={() => onSelectShipment(s)}
                  className="p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-md hover:border-neutral-700 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-medium text-white group-hover:text-amber-400 transition-colors">
                      {s.shipmentId}
                    </span>
                    <span className={`font-mono font-medium ${
                      s.status === 'Delivered' 
                        ? 'text-emerald-400' 
                        : s.status === 'Delayed'
                        ? 'text-rose-400'
                        : 'text-sky-400'
                    }`}>
                      {s.status}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-300 font-medium">
                    {s.origin} → {s.destination}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2">
                    <span className="truncate max-w-[140px]">{s.driverName}</span>
                    <span className="font-mono tabular-nums">₹ {s.freight.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        s.status === 'Delayed' ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${s.progressPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 text-xs text-neutral-400 flex items-center justify-between">
            <span>Operational SLA Threshold: 48h</span>
            <span className="font-mono text-emerald-400">98.2% Tracked</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row: Status Donut + Route Volume + Operational Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 1: Delivery Status Split */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-5">
          <h3 className="font-display text-sm font-semibold text-white mb-1">
            Delivery Status Distribution
          </h3>
          <p className="text-xs text-neutral-400 mb-4">
            Total active cycle volume breakdown
          </p>

          <div className="flex items-center justify-center py-2">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Delivered: 63.3% -> circumference is ~251.2 */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#16a34a"
                  strokeWidth="16"
                  strokeDasharray="159 251.2"
                  strokeDashoffset="0"
                />
                {/* In Transit: 23.3% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#0284c7"
                  strokeWidth="16"
                  strokeDasharray="58.5 251.2"
                  strokeDashoffset="-159"
                />
                {/* Delayed: 13.4% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#e11d48"
                  strokeWidth="16"
                  strokeDasharray="33.7 251.2"
                  strokeDashoffset="-217.5"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-lg font-bold text-white tabular-nums">2,347</span>
                <span className="text-[10px] text-neutral-400">Total Trips</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-neutral-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Delivered
              </span>
              <span className="font-mono tabular-nums text-white">2,128 (90.7%)</span>
            </div>
            <div className="flex items-center justify-between text-neutral-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                In Transit
              </span>
              <span className="font-mono tabular-nums text-white">14 (0.6%)</span>
            </div>
            <div className="flex items-center justify-between text-neutral-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                Delayed
              </span>
              <span className="font-mono tabular-nums text-rose-400">219 (9.3%)</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Top Freight Corridors by Volume */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-5">
          <h3 className="font-display text-sm font-semibold text-white mb-1">
            Top Freight Corridors
          </h3>
          <p className="text-xs text-neutral-400 mb-4">
            Volume and on-time performance ranking
          </p>

          <div className="space-y-3">
            {[
              { route: 'Delhi → Mumbai', volume: 412, pct: 100, otd: '92.4%' },
              { route: 'Mumbai → Bengaluru', volume: 368, pct: 89, otd: '93.1%' },
              { route: 'Bengaluru → Chennai', volume: 341, pct: 82, otd: '95.6%' },
              { route: 'Delhi → Kolkata', volume: 294, pct: 71, otd: '88.2%' },
              { route: 'Hyderabad → Bengaluru', volume: 245, pct: 59, otd: '94.0%' },
            ].map((r) => (
              <div key={r.route} className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-neutral-300 font-medium">{r.route}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white tabular-nums">{r.volume} trips</span>
                    <span className="text-[11px] text-amber-400 font-mono">({r.otd})</span>
                  </div>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Cost Component Breakdown */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display text-sm font-semibold text-white">
              Operational Cost Breakdown
            </h3>
            <Fuel className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400 mb-4">
            Aggregate ₹ 38.60 Lakhs direct logistics expenses
          </p>

          <div className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-neutral-300 font-medium">Diesel & Fuel Costs</span>
                <span className="font-mono text-white tabular-nums">₹ 19.68 L (51.0%)</span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '51%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-neutral-300 font-medium">National Toll & FASTag</span>
                <span className="font-mono text-white tabular-nums">₹ 8.10 L (21.0%)</span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: '21%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-neutral-300 font-medium">Fleet Maintenance & Spares</span>
                <span className="font-mono text-white tabular-nums">₹ 6.56 L (17.0%)</span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '17%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-neutral-300 font-medium">Driver Allowance & Other</span>
                <span className="font-mono text-white tabular-nums">₹ 4.26 L (11.0%)</span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '11%' }} />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Operating Profit Margin:</span>
            <span className="font-mono font-bold text-emerald-400">68.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
