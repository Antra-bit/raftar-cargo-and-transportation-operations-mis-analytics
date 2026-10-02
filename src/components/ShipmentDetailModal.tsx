import React from 'react';
import { Shipment } from '../types/logistics';
import { X, Truck, User, Calendar, MapPin, CheckCircle, Clock, AlertTriangle, Thermometer } from 'lucide-react';

interface ShipmentDetailModalProps {
  shipment: Shipment | null;
  onClose: () => void;
}

export const ShipmentDetailModal: React.FC<ShipmentDetailModalProps> = ({ shipment, onClose }) => {
  if (!shipment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-neutral-900 border border-neutral-700/80 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-neutral-400 hover:text-white bg-neutral-800 rounded-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-white">
                {shipment.shipmentId}
              </h2>
              <span className="font-mono text-xs text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                AWB: {shipment.awbNumber}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {shipment.cargoType} · {shipment.cargoWeightKg.toLocaleString()} KG
            </p>
          </div>
        </div>

        {/* Status & Timing Banner */}
        <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 flex items-center justify-between text-xs mb-5">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium">Consignment Status:</span>
            <span className={`font-mono font-bold ${
              shipment.status === 'Delivered' 
                ? 'text-emerald-400' 
                : shipment.status === 'Delayed'
                ? 'text-rose-400'
                : 'text-sky-400'
            }`}>
              {shipment.status.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            {shipment.delayDays > 0 ? (
              <span className="text-rose-400 flex items-center gap-1 font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                Delayed by {shipment.delayDays} {shipment.delayDays === 1 ? 'day' : 'days'}
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                On-Time SLA Compliant
              </span>
            )}
          </div>
        </div>

        {/* Route Details */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" /> Origin Hub
            </div>
            <div className="font-semibold text-white text-sm">{shipment.origin} Terminal</div>
            <div className="text-xs text-neutral-400 mt-1">Booked: {shipment.bookingDate}</div>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" /> Destination Hub
            </div>
            <div className="font-semibold text-white text-sm">{shipment.destination} Depot</div>
            <div className="text-xs text-neutral-400 mt-1">
              Expected: {shipment.expectedDelivery}
              {shipment.actualDelivery && (
                <span className="block text-emerald-400">Delivered: {shipment.actualDelivery}</span>
              )}
            </div>
          </div>
        </div>

        {/* Telemetry & Driver Details */}
        <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-3 mb-5 text-xs">
          <div className="text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
            Vehicle & Driver Allocation
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-neutral-500 block">Assigned Commercial Vehicle:</span>
              <span className="font-mono text-white font-medium">{shipment.vehicleId}</span>
              <span className="text-neutral-400 block text-[11px]">{shipment.vehicleType}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Fleet Driver:</span>
              <span className="text-white font-medium">{shipment.driverName}</span>
              <span className="font-mono text-neutral-400 block text-[11px]">{shipment.driverId}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
            <span className="text-neutral-400">Current Checkpoint / Location:</span>
            <span className="font-mono text-amber-300">{shipment.currentLocation || 'In Transit'}</span>
          </div>

          {shipment.temperatureCelsius !== undefined && (
            <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-sky-400">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5" /> Reefer Cold Chain Monitor:
              </span>
              <span className="font-mono font-bold">{shipment.temperatureCelsius}°C (Nominal)</span>
            </div>
          )}
        </div>

        {/* Financials & Distance */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-center">
            <span className="text-neutral-500 block">Freight Charges</span>
            <span className="font-mono text-base font-bold text-white tabular-nums">
              ₹ {shipment.freight.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-center">
            <span className="text-neutral-500 block">Total Distance</span>
            <span className="font-mono text-base font-bold text-white tabular-nums">
              {shipment.distanceKm} KM
            </span>
          </div>
          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-center">
            <span className="text-neutral-500 block">Freight / KM</span>
            <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
              ₹ {(shipment.freight / shipment.distanceKm).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
