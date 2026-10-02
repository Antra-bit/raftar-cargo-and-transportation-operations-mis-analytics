import React, { useState, useMemo } from 'react';
import { Shipment, DeliveryStatus } from '../types/logistics';
import { Search, Filter, ArrowUpDown, ChevronRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface ShipmentExplorerProps {
  shipments: Shipment[];
  onSelectShipment: (shipment: Shipment) => void;
}

export const ShipmentExplorer: React.FC<ShipmentExplorerProps> = ({
  shipments,
  onSelectShipment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | DeliveryStatus>('All');
  const [originFilter, setOriginFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'bookingDate' | 'freight' | 'distanceKm' | 'delayDays'>('bookingDate');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Extract unique origins
  const uniqueOrigins = useMemo(() => {
    return Array.from(new Set(shipments.map(s => s.origin))).sort();
  }, [shipments]);

  // Filter & Sort shipments
  const filteredShipments = useMemo(() => {
    return shipments
      .filter((s) => {
        const matchesSearch = 
          s.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.vehicleId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
        const matchesOrigin = originFilter === 'All' || s.origin === originFilter;

        return matchesSearch && matchesStatus && matchesOrigin;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
        }
        return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [shipments, searchTerm, statusFilter, originFilter, sortField, sortAsc]);

  const toggleSort = (field: 'bookingDate' | 'freight' | 'distanceKm' | 'delayDays') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Operational Shipments & Consignment Log
          </h1>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
            <span>Validated Relational Records</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{filteredShipments.length} matching consignments</span>
            <span aria-hidden="true">·</span>
            <span>Raftaar Transport Operations</span>
          </div>
        </div>

        {/* Status Tab Filters (Zero-Pill Discipline: Segmented Controls) */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs overflow-x-auto">
          {(['All', 'Delivered', 'In Transit', 'Delayed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === tab
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Shipment ID, AWB, Route, Vehicle, Driver..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Origin Dropdown Filter */}
        <div className="flex items-center gap-2">
          <select
            value={originFilter}
            onChange={(e) => setOriginFilter(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500/50 cursor-pointer"
          >
            <option value="All">All Origin Hubs</option>
            {uniqueOrigins.map((orig) => (
              <option key={orig} value={orig}>{orig}</option>
            ))}
          </select>
        </div>
      </div>

      {/* High-Density Data Grid */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-medium">
                <th className="py-3 px-4">Shipment / AWB</th>
                <th className="py-3 px-4">Origin → Destination</th>
                <th className="py-3 px-4">Vehicle & Driver</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => toggleSort('bookingDate')}
                >
                  <div className="flex items-center gap-1">
                    <span>Dates (Booked / ETA)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Status & SLA</th>
                <th 
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => toggleSort('distanceKm')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Distance</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => toggleSort('freight')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Freight (₹)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {filteredShipments.map((s) => (
                <tr
                  key={s.shipmentId}
                  onClick={() => onSelectShipment(s)}
                  className="hover:bg-neutral-800/40 transition-colors cursor-pointer group"
                >
                  {/* ID / AWB */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {s.shipmentId}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      {s.awbNumber}
                    </div>
                  </td>

                  {/* Route */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-neutral-200">
                      {s.origin} → {s.destination}
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate max-w-[180px]">
                      {s.cargoType}
                    </div>
                  </td>

                  {/* Vehicle & Driver */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-neutral-300 font-medium">
                      {s.vehicleId}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {s.driverName}
                    </div>
                  </td>

                  {/* Dates */}
                  <td className="py-3.5 px-4 font-mono text-[11px] tabular-nums">
                    <div>Bk: {s.bookingDate}</div>
                    <div className="text-neutral-400">
                      {s.actualDelivery ? (
                        <span className="text-emerald-400">Del: {s.actualDelivery}</span>
                      ) : (
                        <span>Exp: {s.expectedDelivery}</span>
                      )}
                    </div>
                  </td>

                  {/* Status & SLA */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-medium">
                      {s.status === 'Delivered' && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      {s.status === 'Delayed' && (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      {s.status === 'In Transit' && (
                        <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      )}
                      <span className={
                        s.status === 'Delivered' 
                          ? 'text-emerald-400' 
                          : s.status === 'Delayed'
                          ? 'text-rose-400'
                          : 'text-sky-400'
                      }>
                        {s.status}
                      </span>
                    </div>
                    {s.delayDays > 0 && (
                      <span className="text-[10px] text-rose-400 font-mono block">
                        +{s.delayDays} {s.delayDays === 1 ? 'day delay' : 'days delay'}
                      </span>
                    )}
                  </td>

                  {/* Distance */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-neutral-300">
                    {s.distanceKm.toLocaleString()} KM
                  </td>

                  {/* Freight */}
                  <td className="py-3.5 px-4 text-right font-mono font-medium tabular-nums text-white">
                    ₹ {s.freight.toLocaleString('en-IN')}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center">
                    <button className="text-neutral-500 group-hover:text-amber-400 transition-colors p-1">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="py-3 px-4 border-t border-neutral-800 bg-neutral-950/40 text-xs text-neutral-400 flex items-center justify-between">
          <span>Showing {filteredShipments.length} operational consignments</span>
          <span className="font-mono text-neutral-500">Source: SQL Table `shipments`</span>
        </div>
      </div>
    </div>
  );
};
