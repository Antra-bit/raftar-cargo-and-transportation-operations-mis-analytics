export type DeliveryStatus = 'Delivered' | 'Delayed' | 'In Transit' | 'Cancelled';

export interface Shipment {
  shipmentId: string;
  awbNumber: string;
  bookingDate: string;
  origin: string;
  destination: string;
  vehicleId: string;
  vehicleType: string;
  driverId: string;
  driverName: string;
  expectedDelivery: string;
  actualDelivery?: string;
  status: DeliveryStatus;
  freight: number; // in INR
  distanceKm: number;
  delayDays: number;
  isOnTime: boolean;
  cargoType: string;
  cargoWeightKg: number;
  temperatureCelsius?: number; // For cold chain
  currentLocation?: string;
  progressPct: number;
}

export interface Vehicle {
  vehicleId: string;
  vehicleType: string;
  capacityTonnes: number;
  vehicleStatus: 'Active' | 'Inactive' | 'Maintenance';
  maintenanceDate: string;
  assignedDriver?: string;
  currentOdometerKm: number;
  fuelEfficiencyKmPerLiter: number;
}

export interface Driver {
  driverId: string;
  driverName: string;
  experienceYears: number;
  assignedVehicle: string;
  contactNumber: string;
  safetyRating: number;
  dutyStatus: 'On Duty' | 'Rest Period' | 'Off Duty';
}

export interface ExpenseRecord {
  shipmentId: string;
  fuelCost: number;
  tollCost: number;
  maintenanceCost: number;
  otherCost: number;
  totalCost: number;
}

export interface DataQualityReport {
  reportTitle: string;
  timestamp: string;
  status: 'PASSED' | 'NEEDS_REVIEW';
  metrics: {
    totalRecords: number;
    duplicateRecords: number;
    missingValues: number;
    invalidDates: number;
    invalidFreight: number;
    invalidDistance: number;
    referentialKeyErrors: number;
    validRecords: number;
    dataQualityScore: number;
  };
}

export interface OperationalKPIs {
  totalShipments: number;
  deliveredShipments: number;
  delayedShipments: number;
  inTransitShipments: number;
  cancelledShipments: number;
  onTimeDeliveryPct: number;
  avgDeliveryTimeDays: number;
  totalOperationalCost: number;
  costPerShipment: number;
  costPerKm: number;
  totalFreightRevenue: number;
  netOperatingProfit: number;
  operatingMarginPct: number;
  costBreakdown: {
    fuelCost: number;
    tollCost: number;
    maintenanceCost: number;
    otherCost: number;
  };
}

export interface DailyMIS {
  reportType: string;
  date: string;
  generatedAt: string;
  kpis: {
    totalShipments: number;
    delivered: number;
    inTransit: number;
    delayed: number;
    cancelled: number;
    onTimeDeliveryPct: number;
    totalFreight: string;
    avgDeliveryTime: string;
    totalOperationalCost: string;
    costPerKm: string;
  };
  exceptionSummary: {
    delayedShipmentsCount: number;
    delayedShipmentSamples: string[];
    vehiclesUnderMaintenanceCount: number;
    vehiclesUnderMaintenance: string[];
    slaExceededDeliveries: number;
    actionRequired: string;
  };
}

export interface WeeklyMetric {
  week: string;
  shipments: number;
  delivered: number;
  delayed: number;
  onTimePct: number;
  freightInrLakhs: number;
  costInrLakhs: number;
}

export interface WeeklyMIS {
  reportType: string;
  month: string;
  weeklyMetrics: WeeklyMetric[];
  keyInsights: string[];
}

export interface MonthlyMIS {
  reportType: string;
  monthPeriod: string;
  executiveSummary: {
    totalShipments: string;
    delivered: string;
    delayed: string;
    onTimeDeliveryPct: string;
    totalFreight: string;
    operationalCost: string;
    netOperatingProfit: string;
    operatingMargin: string;
    totalDistanceCovered: string;
    avgCostPerKm: string;
    avgTurnaroundTime: string;
  };
  modalSplit: {
    ftlPct: string;
    ltlPct: string;
    expressPct: string;
    coldChainPct: string;
  };
  topPerformingRoutes: {
    route: string;
    volume: number;
    otdPct: number;
    profitability: string;
  }[];
}
