// Mock data for the traffic violation detection system

export interface Violation {
  id: string;
  trackId: number;
  violationType: 'red_light' | 'overspeeding' | 'no_helmet' | 'wrong_way' | 'stop_line';
  vehicleType: string;
  plateNumber: string;
  timestamp: string;
  frameNumber: number;
  confidence: number;
  camera: string;
  status: 'pending' | 'verified' | 'rejected';
  details: Record<string, unknown>;
}

export interface Challan {
  id: string;
  challanNumber: string;
  violationId: string;
  vehicleNumber: string;
  ownerName: string;
  violationType: string;
  penaltyAmount: number;
  issueDate: string;
  dueDate: string;
  status: 'issued' | 'sent' | 'paid' | 'cancelled';
}

export interface DashboardStats {
  totalViolationsToday: number;
  pendingChallans: number;
  activeCameras: number;
  systemUptime: string;
  detectionAccuracy: number;
  processedChallans: number;
}

export const mockStats: DashboardStats = {
  totalViolationsToday: 247,
  pendingChallans: 89,
  activeCameras: 12,
  systemUptime: '99.7%',
  detectionAccuracy: 97.3,
  processedChallans: 158,
};

export const mockViolations: Violation[] = [
  { id: 'v1', trackId: 101, violationType: 'red_light', vehicleType: 'car', plateNumber: 'MH-12-AB-1234', timestamp: '2026-02-12T14:23:45', frameNumber: 1420, confidence: 98.5, camera: 'Camera 1 - Main Square', status: 'pending', details: { line_y: 350, vehicle_y: 380 } },
  { id: 'v2', trackId: 102, violationType: 'overspeeding', vehicleType: 'car', plateNumber: 'MH-14-CD-5678', timestamp: '2026-02-12T14:20:12', frameNumber: 1280, confidence: 95.2, camera: 'Camera 3 - Highway Entry', status: 'verified', details: { speed_kph: 82.4, speed_limit: 50 } },
  { id: 'v3', trackId: 103, violationType: 'no_helmet', vehicleType: 'motorbike', plateNumber: 'MH-12-EF-9012', timestamp: '2026-02-12T13:55:30', frameNumber: 980, confidence: 92.1, camera: 'Camera 2 - Junction B', status: 'pending', details: {} },
  { id: 'v4', trackId: 104, violationType: 'wrong_way', vehicleType: 'truck', plateNumber: 'MH-09-GH-3456', timestamp: '2026-02-12T13:40:18', frameNumber: 850, confidence: 96.8, camera: 'Camera 5 - One Way', status: 'rejected', details: {} },
  { id: 'v5', trackId: 105, violationType: 'stop_line', vehicleType: 'car', plateNumber: 'MH-12-IJ-7890', timestamp: '2026-02-12T13:15:55', frameNumber: 720, confidence: 89.3, camera: 'Camera 1 - Main Square', status: 'verified', details: {} },
  { id: 'v6', trackId: 106, violationType: 'red_light', vehicleType: 'bus', plateNumber: 'MH-04-KL-2345', timestamp: '2026-02-12T12:50:33', frameNumber: 610, confidence: 97.1, camera: 'Camera 4 - School Zone', status: 'pending', details: { line_y: 350, vehicle_y: 395 } },
  { id: 'v7', trackId: 107, violationType: 'overspeeding', vehicleType: 'motorbike', plateNumber: 'MH-12-MN-6789', timestamp: '2026-02-12T12:30:10', frameNumber: 500, confidence: 91.7, camera: 'Camera 3 - Highway Entry', status: 'pending', details: { speed_kph: 95.1, speed_limit: 50 } },
  { id: 'v8', trackId: 108, violationType: 'no_helmet', vehicleType: 'motorbike', plateNumber: 'MH-12-OP-0123', timestamp: '2026-02-12T11:45:22', frameNumber: 380, confidence: 94.5, camera: 'Camera 6 - Market Road', status: 'verified', details: {} },
];

export const mockChallans: Challan[] = [
  { id: 'c1', challanNumber: 'CH2026021201', violationId: 'v2', vehicleNumber: 'MH-14-CD-5678', ownerName: 'Rajesh Kumar', violationType: 'overspeeding', penaltyAmount: 2000, issueDate: '2026-02-12', dueDate: '2026-03-14', status: 'sent' },
  { id: 'c2', challanNumber: 'CH2026021202', violationId: 'v5', vehicleNumber: 'MH-12-IJ-7890', ownerName: 'Priya Sharma', violationType: 'stop_line', penaltyAmount: 500, issueDate: '2026-02-12', dueDate: '2026-03-14', status: 'paid' },
  { id: 'c3', challanNumber: 'CH2026021103', violationId: 'v8', vehicleNumber: 'MH-12-OP-0123', ownerName: 'Amit Patel', violationType: 'no_helmet', penaltyAmount: 1000, issueDate: '2026-02-11', dueDate: '2026-03-13', status: 'issued' },
];

export const violationTypeLabels: Record<string, string> = {
  red_light: 'Red Light',
  overspeeding: 'Overspeeding',
  no_helmet: 'No Helmet',
  wrong_way: 'Wrong Way',
  stop_line: 'Stop Line',
};

export const violationPenalties: Record<string, number> = {
  red_light: 1000,
  overspeeding: 2000,
  no_helmet: 1000,
  wrong_way: 1500,
  stop_line: 500,
};

export const hourlyViolationData = [
  { hour: '6AM', violations: 5 },
  { hour: '7AM', violations: 12 },
  { hour: '8AM', violations: 28 },
  { hour: '9AM', violations: 35 },
  { hour: '10AM', violations: 22 },
  { hour: '11AM', violations: 18 },
  { hour: '12PM', violations: 25 },
  { hour: '1PM', violations: 30 },
  { hour: '2PM', violations: 32 },
  { hour: '3PM', violations: 20 },
  { hour: '4PM', violations: 15 },
  { hour: '5PM', violations: 38 },
  { hour: '6PM', violations: 42 },
  { hour: '7PM', violations: 28 },
  { hour: '8PM', violations: 15 },
  { hour: '9PM', violations: 8 },
];

export const violationTypeDistribution = [
  { name: 'Red Light', value: 35, fill: 'hsl(0, 72%, 51%)' },
  { name: 'Overspeeding', value: 28, fill: 'hsl(38, 92%, 50%)' },
  { name: 'No Helmet', value: 20, fill: 'hsl(199, 89%, 48%)' },
  { name: 'Wrong Way', value: 10, fill: 'hsl(280, 67%, 55%)' },
  { name: 'Stop Line', value: 7, fill: 'hsl(142, 71%, 45%)' },
];
