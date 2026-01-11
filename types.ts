
export enum Designation {
  ALP = 'Assistant Loco Pilot',
  LP = 'Loco Pilot',
  Guard = 'Train Manager (Guard)',
  CLI = 'CLI'
}

export enum DutyType {
  WORKING = 'Working',
  SPARE = 'Spare',
  PERIODIC_REST = 'Periodic Rest',
  LEAVE = 'Leave'
}

export interface UserProfile {
  photo?: string;
  name: string;
  crewId: string;
  designation: Designation;
  mobile: string;
  email: string;
}

export interface SafetyItem {
  id: string;
  label: string;
  ok: boolean;
  remark: string;
}

export interface DutyRecord {
  id: string;
  type: DutyType;
  timestamp: number;
  
  // Common
  date: string;
  trainNumber?: string;
  trainName?: string;
  pilotName?: string;
  pilotId?: string;
  guardName?: string;
  guardId?: string;
  signOnTime?: string;
  signOffTime?: string;
  callTime?: string;
  section?: string;
  fromStation?: string;
  toStation?: string;

  // Working specific - General
  locoNumber?: string;
  locoClass?: string;
  shed?: string;
  hood?: 'SH' | 'LH' | 'CAB1' | 'CAB2';
  
  // Working specific - Timing
  departureTime?: string;
  arrivalTime?: string;

  // Working specific - Certificates
  bpcNo?: string;
  issuedBy?: string;
  issuedDate?: string;
  validUptoDate?: string;
  fsdNo?: string;
  detonatorExpiry?: string;
  BPCType?: string;

  // Working specific - Oil (Section E)
  hsdReceived?: number;
  hsdBalance?: number;
  hsdConsumption?: number;
  engineOilOk?: boolean;
  engineOilRemark?: string;
  governorOilOk?: boolean;
  governorOilRemark?: string;
  compressorOilOk?: boolean;
  compressorOilRemark?: string;
  transformerOilOk?: boolean; // Legacy but kept
  transformerOilRemark?: string;

  // Working specific - Lights (Section F)
  headLightOk?: boolean;
  headLightRemark?: string;
  markerLightOk?: boolean;
  markerLightRemark?: string;
  flasherLightOk?: boolean;
  flasherLightRemark?: string;

  // Working specific - Control Panel / Safety (Section G)
  fireExtinguisherCount?: string;
  fireExpiryDate?: string;
  vcdWorking?: boolean;
  vcdRemark?: string;
  pcpAvailable?: boolean;
  pcpRemark?: string;
  uClampAvailable?: boolean;
  uClampCount?: string;
  bpCount?: string;
  fpCount?: string;
  wtNo?: string;
  woodenWedgesCount?: string;
  repairBookAvailable?: boolean;
  tripCardAvailable?: boolean;

  // Working specific - Machine Room (Section H)
  cpOk?: boolean;
  cpRemark?: string;
  srOk?: boolean;
  srRemark?: string;
  tfoOk?: boolean;
  tfoRemark?: string;
  teC?: string;
  teR?: string;
  meC?: string;
  meR?: string;
  con?: string;
  hog1?: string;
  hog2?: string;
  tcReading?: string;
  mcReading?: string;

  remarks?: string;
  safetyItems?: SafetyItem[];

  // PR / Leave specific
  fromDate?: string;
  fromTime?: string;
  toDate?: string;
  toTime?: string;
  natureOfLeave?: string;
  totalLeaveDays?: number;
}
