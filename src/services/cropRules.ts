import { GradeType, DetectedDefect, DefectSeverity } from '../types';

export interface CropThresholds {
  cropName: string;
  category: 'Fruit' | 'Vegetable';
  gradeAMaxDefectArea: number; // in %
  gradeBMaxDefectArea: number;
  gradeCMaxDefectArea: number;
  criticalDefects: string[]; // defects that instantly trigger Rejected or Grade C
  allowedGradeBDefects: string[];
  description: string;
}

export const CROP_STANDARDS: Record<string, CropThresholds> = {
  Apple: {
    cropName: 'Apple',
    category: 'Fruit',
    gradeAMaxDefectArea: 2.5,
    gradeBMaxDefectArea: 7.0,
    gradeCMaxDefectArea: 15.0,
    criticalDefects: ['Rot / Fungal Growth', 'Deep Flesh Bruise', 'Open Cut / Puncture', 'Bitter Pit Decay'],
    allowedGradeBDefects: ['Superficial Scab', 'Light Russeting', 'Minor Limb Rub', 'Lenticel Spotting'],
    description: 'International USDA/OECD commercial standards for dessert and processing apples.'
  },
  Tomato: {
    cropName: 'Tomato',
    category: 'Vegetable',
    gradeAMaxDefectArea: 2.0,
    gradeBMaxDefectArea: 6.0,
    gradeCMaxDefectArea: 14.0,
    criticalDefects: ['Blossom-End Rot', 'Open Split / Cracking', 'Bacterial Soft Rot', 'Mold Contamination'],
    allowedGradeBDefects: ['Superficial Zippering', 'Minor Catfacing', 'Light Sunscald', 'Uniform Scuff'],
    description: 'Fresh market tomato quality criteria: firm pericarp, intact calyx, and defect-free skin.'
  },
  'Bell Pepper': {
    cropName: 'Bell Pepper',
    category: 'Vegetable',
    gradeAMaxDefectArea: 2.0,
    gradeBMaxDefectArea: 6.5,
    gradeCMaxDefectArea: 13.0,
    criticalDefects: ['Anthracnose Rot', 'Sunscald Necrosis', 'Bacterial Soft Rot', 'Stem Mold'],
    allowedGradeBDefects: ['Minor Shape Asymmetry', 'Light Surface Scratch', 'Blush Color Variation'],
    description: 'Capsicum commercial standard: turgid pericarp wall, intact pedicel, zero soft lesions.'
  },
  Banana: {
    cropName: 'Banana',
    category: 'Fruit',
    gradeAMaxDefectArea: 3.0,
    gradeBMaxDefectArea: 8.0,
    gradeCMaxDefectArea: 18.0,
    criticalDefects: ['Crown Rot', 'Anthracnose Rot', 'Pulp Split', 'Insect Boring Decay'],
    allowedGradeBDefects: ['Light Finger Rub', 'Cicatrices Scars', 'Sugar Spotting (Stage 6)'],
    description: 'Cavendish export specifications: crown integrity, finger curvature, and blemish tolerance.'
  },
  Orange: {
    cropName: 'Orange',
    category: 'Fruit',
    gradeAMaxDefectArea: 3.0,
    gradeBMaxDefectArea: 8.0,
    gradeCMaxDefectArea: 16.0,
    criticalDefects: ['Penicillium Blue/Green Mold', 'Stem-End Rot', 'Brown Rot', 'Oleocellosis Breakdown'],
    allowedGradeBDefects: ['Light Wind Scar', 'Thrips Scarring', 'Pellicle Discoloration'],
    description: 'Citrus export classification: rind firmness, oil gland integrity, zero fungal spore mycelium.'
  },
  Potato: {
    cropName: 'Potato',
    category: 'Vegetable',
    gradeAMaxDefectArea: 2.0,
    gradeBMaxDefectArea: 6.0,
    gradeCMaxDefectArea: 15.0,
    criticalDefects: ['Late Blight Rot', 'Black Scurf Decay', 'Deep Hollow Heart', 'Soft Rot (Erwinia)'],
    allowedGradeBDefects: ['Common Scab (superficial)', 'Minor Growth Crack (healed)', 'Skinning'],
    description: 'Solanum tuberosum ware grading: tuber firmness, clean skin, zero greening or fungal decay.'
  },
  Strawberry: {
    cropName: 'Strawberry',
    category: 'Fruit',
    gradeAMaxDefectArea: 1.5,
    gradeBMaxDefectArea: 4.5,
    gradeCMaxDefectArea: 10.0,
    criticalDefects: ['Botrytis Grey Mold', 'Rhizopus Leak', 'Leather Rot', 'Calix Burn'],
    allowedGradeBDefects: ['Minor Green Tip', 'Light Pressure Bruise', 'Slight Seed Protrusion'],
    description: 'Soft fruit inspection: intact calyx achenes, zero sporulating mold, uniform gloss.'
  },
  Mango: {
    cropName: 'Mango',
    category: 'Fruit',
    gradeAMaxDefectArea: 2.5,
    gradeBMaxDefectArea: 7.0,
    gradeCMaxDefectArea: 15.0,
    criticalDefects: ['Stem-End Rot', 'Anthracnose Tear-staining', 'Jelly Seed Breakdown', 'Skin Splitting'],
    allowedGradeBDefects: ['Sap Burn (superficial)', 'Wind Scarring', 'Minor Lenticel Darkening'],
    description: 'Tropical mango quality grading: skin elasticity, lenticel health, absence of anthracnose.'
  },
  Cucumber: {
    cropName: 'Cucumber',
    category: 'Vegetable',
    gradeAMaxDefectArea: 2.0,
    gradeBMaxDefectArea: 6.0,
    gradeCMaxDefectArea: 12.0,
    criticalDefects: ['Bacterial Soft Rot', 'Cottony Leak', 'Deep Yellowing (Senescence)', 'Severe Constriction'],
    allowedGradeBDefects: ['Minor Crooking', 'Superficial Scar', 'Light Pale Tip'],
    description: 'Greenhouse & field cucumber standard: turgid spine, uniform greenness, cylindrical ratio.'
  },
  Carrot: {
    cropName: 'Carrot',
    category: 'Vegetable',
    gradeAMaxDefectArea: 2.0,
    gradeBMaxDefectArea: 5.5,
    gradeCMaxDefectArea: 14.0,
    criticalDefects: ['Black Rot (Alternaria)', 'Soft Rot', 'Cavity Spot Decay', 'Deep Secondary Rooting'],
    allowedGradeBDefects: ['Light Green Crown', 'Healed Growth Crack', 'Minor Curvature'],
    description: 'Root crop inspection: straight taproot, smooth periderm, absent crown rot or internal discolouration.'
  }
};

export interface GradingEvaluation {
  finalGrade: GradeType;
  qualityClass: string;
  reasons: string[];
  gradingRulesApplied: string;
  humanReviewRequired: boolean;
  reviewReasons: string[];
}

export function evaluateCropQuality(
  produceName: string,
  defects: DetectedDefect[],
  overallDefectAreaPercent: number,
  classificationConfidence: number,
  produceIdConfidence: number
): GradingEvaluation {
  const standard = CROP_STANDARDS[produceName] || {
    cropName: produceName,
    category: 'Fruit' as const,
    gradeAMaxDefectArea: 2.5,
    gradeBMaxDefectArea: 7.0,
    gradeCMaxDefectArea: 15.0,
    criticalDefects: ['Rot / Fungal Growth', 'Bacterial Soft Rot', 'Open Split / Cracking', 'Mold'],
    allowedGradeBDefects: ['Superficial Scab', 'Light Blemish', 'Minor Rub'],
    description: 'Universal baseline produce grading standards.'
  };

  const isUnsupportedCrop = !CROP_STANDARDS[produceName];
  const reasons: string[] = [];
  const reviewReasons: string[] = [];
  let humanReviewRequired = false;

  // Confidence check
  if (produceIdConfidence < 0.70) {
    humanReviewRequired = true;
    reviewReasons.push(`Produce recognition confidence (${(produceIdConfidence * 100).toFixed(1)}%) is below calibrated certainty threshold (70%).`);
  }

  if (classificationConfidence < 0.65) {
    humanReviewRequired = true;
    reviewReasons.push(`Quality classification confidence (${(classificationConfidence * 100).toFixed(1)}%) indicates visual ambiguity.`);
  }

  if (isUnsupportedCrop) {
    humanReviewRequired = true;
    reviewReasons.push(`Crop "${produceName}" uses universal baseline heuristics. Manual agricultural review advised.`);
  }

  // Check for critical defects (rot, mold, deep punctures)
  const hasCriticalDefect = defects.some(d =>
    standard.criticalDefects.some(cd => d.type.toLowerCase().includes(cd.toLowerCase())) ||
    d.severity === 'Severe' ||
    d.type.toLowerCase().includes('rot') ||
    d.type.toLowerCase().includes('mold') ||
    d.type.toLowerCase().includes('decay')
  );

  const hasModerateDefects = defects.filter(d => d.severity === 'Moderate');

  let finalGrade: GradeType = 'Grade A';
  let qualityClass = 'Premium Export Quality';

  if (hasCriticalDefect) {
    finalGrade = 'Rejected';
    qualityClass = 'Non-Commercial / Rejected';
    const criticalList = defects
      .filter(d => d.severity === 'Severe' || d.type.toLowerCase().includes('rot') || d.type.toLowerCase().includes('mold'))
      .map(d => `${d.type} (${d.severity})`)
      .join(', ');
    reasons.push(`Critical biological defect detected: ${criticalList || 'Active decay/spoilage'}. Exceeds commercial distribution tolerances.`);
  } else if (overallDefectAreaPercent > standard.gradeCMaxDefectArea) {
    finalGrade = 'Rejected';
    qualityClass = 'Non-Commercial / Rejected';
    reasons.push(`Total cumulative defect area (${overallDefectAreaPercent.toFixed(1)}%) exceeds maximum Grade C threshold (${standard.gradeCMaxDefectArea}%).`);
  } else if (overallDefectAreaPercent > standard.gradeBMaxDefectArea || hasModerateDefects.length >= 2) {
    finalGrade = 'Grade C';
    qualityClass = 'Low Quality / Industrial Processing';
    reasons.push(`Total defect area (${overallDefectAreaPercent.toFixed(1)}%) falls in Grade C range (${standard.gradeBMaxDefectArea}% - ${standard.gradeCMaxDefectArea}%).`);
    if (hasModerateDefects.length > 0) {
      reasons.push(`Presence of moderate surface blemishes: ${hasModerateDefects.map(d => d.type).join(', ')}.`);
    }
    reasons.push('Produce suitable for secondary processing, purée, or immediate culinary preparation.');
  } else if (overallDefectAreaPercent > standard.gradeAMaxDefectArea || defects.length > 0) {
    finalGrade = 'Grade B';
    qualityClass = 'Standard Commercial Grade';
    reasons.push(`Minor superficial defects detected occupying ${overallDefectAreaPercent.toFixed(1)}% of surface area (within Grade B tolerance $\\le$ ${standard.gradeBMaxDefectArea}%).`);
    reasons.push('No critical fungal rot or deep flesh lesions observed.');
    reasons.push('Meets retail standard commercial distribution criteria.');
  } else {
    finalGrade = 'Grade A';
    qualityClass = 'Premium Class 1';
    reasons.push(`Superficial defect area (${overallDefectAreaPercent.toFixed(1)}%) is within strict Grade A threshold ($\le$ ${standard.gradeAMaxDefectArea}%).`);
    reasons.push('Uniform skin pigmentation, firm perimeter geometry, and zero fungal or mechanical lesions.');
    reasons.push('Eligible for premium retail and international export specifications.');
  }

  return {
    finalGrade,
    qualityClass,
    reasons,
    gradingRulesApplied: standard.description,
    humanReviewRequired,
    reviewReasons
  };
}
