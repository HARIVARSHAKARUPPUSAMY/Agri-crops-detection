export type AccountType = 'Organisation' | 'Individual Person';

export interface User {
  id: string;
  username: string;
  email: string;
  accountType: AccountType;
  organizationName?: string;
  department?: string;
  contactNumber?: string;
  createdAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  speed: 'fast' | 'balanced' | 'detailed';
  model: 'premium' | 'general';
}

export type GradeType = 'Grade A' | 'Grade B' | 'Grade C' | 'Rejected';
export type DefectSeverity = 'None' | 'Minor' | 'Moderate' | 'Severe';

export interface BoundingBox {
  x: number; // percentage 0-100 or pixels
  y: number;
  width: number;
  height: number;
}

export interface DetectedDefect {
  id: string;
  type: string;
  severity: DefectSeverity;
  affectedAreaPercent: number;
  confidence: number;
  boundingBox: BoundingBox;
  polygon?: Array<{ x: number; y: number }>;
  description: string;
}

export interface DetectedProduceItem {
  id: string;
  label: string;
  confidence: number;
  boundingBox: BoundingBox;
  qualityClass: string;
}

export interface GradingResult {
  id: string;
  userId: string;
  userEmail: string;
  accountType: AccountType;
  produceName: string;
  cropCategory: 'Fruit' | 'Vegetable';
  detectedItemCount: number;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  finalGrade: GradeType;
  qualityClass: string;
  confidences: {
    produceId: number;
    defectDetection: number;
    qualityClassification: number;
    overall: number;
  };
  defects: DetectedDefect[];
  detectedItems: DetectedProduceItem[];
  overallDefectAreaPercent: number;
  reasons: string[];
  gradingRulesApplied: string;
  humanReviewRequired: boolean;
  reviewReasons?: string[];
  processingDate: string;
  status: 'Completed' | 'Processing' | 'Failed';
  speedModeUsed: 'fast' | 'balanced' | 'detailed';
  modelModeUsed: 'premium' | 'general';
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}
