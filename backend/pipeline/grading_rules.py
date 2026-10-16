"""
Crop-Specific Grading Rules Engine
Evaluates YOLO segmentation defect areas, critical biological pathologies,
and classification confidences against validated agricultural standards.
"""
from typing import List, Dict, Any, Tuple


CROP_STANDARDS: Dict[str, Dict[str, Any]] = {
    "Apple": {
        "cropName": "Apple",
        "category": "Fruit",
        "gradeAMaxDefectArea": 2.5,
        "gradeBMaxDefectArea": 7.0,
        "gradeCMaxDefectArea": 15.0,
        "criticalDefects": ["Rot / Fungal Growth", "Deep Flesh Bruise", "Open Cut / Puncture", "Bitter Pit Decay"],
        "allowedGradeBDefects": ["Superficial Scab", "Light Russeting", "Minor Limb Rub", "Lenticel Spotting"],
        "description": "International USDA/OECD commercial standards for dessert and processing apples."
    },
    "Tomato": {
        "cropName": "Tomato",
        "category": "Vegetable",
        "gradeAMaxDefectArea": 2.0,
        "gradeBMaxDefectArea": 6.0,
        "gradeCMaxDefectArea": 14.0,
        "criticalDefects": ["Blossom-End Rot", "Open Split / Cracking", "Bacterial Soft Rot", "Mold Contamination"],
        "allowedGradeBDefects": ["Superficial Zippering", "Minor Catfacing", "Light Sunscald", "Uniform Scuff"],
        "description": "Fresh market tomato quality criteria: firm pericarp, intact calyx, and defect-free skin."
    },
    "Bell Pepper": {
        "cropName": "Bell Pepper",
        "category": "Vegetable",
        "gradeAMaxDefectArea": 2.0,
        "gradeBMaxDefectArea": 6.5,
        "gradeCMaxDefectArea": 13.0,
        "criticalDefects": ["Anthracnose Rot", "Sunscald Necrosis", "Bacterial Soft Rot", "Stem Mold"],
        "allowedGradeBDefects": ["Minor Shape Asymmetry", "Light Surface Scratch", "Blush Color Variation"],
        "description": "Capsicum commercial standard: turgid pericarp wall, intact pedicel, zero soft lesions."
    },
    "Banana": {
        "cropName": "Banana",
        "category": "Fruit",
        "gradeAMaxDefectArea": 3.0,
        "gradeBMaxDefectArea": 8.0,
        "gradeCMaxDefectArea": 18.0,
        "criticalDefects": ["Crown Rot", "Anthracnose Rot", "Pulp Split", "Insect Boring Decay"],
        "allowedGradeBDefects": ["Light Finger Rub", "Cicatrices Scars", "Sugar Spotting (Stage 6)"],
        "description": "Cavendish export specifications: crown integrity, finger curvature, and blemish tolerance."
    },
    "Orange": {
        "cropName": "Orange",
        "category": "Fruit",
        "gradeAMaxDefectArea": 3.0,
        "gradeBMaxDefectArea": 8.0,
        "gradeCMaxDefectArea": 16.0,
        "criticalDefects": ["Penicillium Blue/Green Mold", "Stem-End Rot", "Brown Rot", "Oleocellosis Breakdown"],
        "allowedGradeBDefects": ["Light Wind Scar", "Thrips Scarring", "Pellicle Discoloration"],
        "description": "Citrus export classification: rind firmness, oil gland integrity, zero fungal spore mycelium."
    }
}


def evaluate_grading_rules(
    produce_name: str,
    defects: List[Dict[str, Any]],
    overall_defect_area_percent: float,
    classification_confidence: float,
    produce_id_confidence: float
) -> Dict[str, Any]:
    standard = CROP_STANDARDS.get(produce_name, {
        "cropName": produce_name,
        "category": "Fruit",
        "gradeAMaxDefectArea": 2.5,
        "gradeBMaxDefectArea": 7.0,
        "gradeCMaxDefectArea": 15.0,
        "criticalDefects": ["Rot / Fungal Growth", "Bacterial Soft Rot", "Mold"],
        "allowedGradeBDefects": ["Superficial Scab", "Light Blemish"],
        "description": "Universal baseline produce grading standards."
    })

    is_unsupported_crop = produce_name not in CROP_STANDARDS
    reasons = []
    review_reasons = []
    human_review_required = False

    if produce_id_confidence < 0.70:
        human_review_required = True
        review_reasons.append(f"Produce identification confidence ({produce_id_confidence * 100:.1f}%) is below calibrated certainty threshold (70%).")

    if classification_confidence < 0.65:
        human_review_required = True
        review_reasons.append(f"Quality classification confidence ({classification_confidence * 100:.1f}%) indicates optical ambiguity.")

    if is_unsupported_crop:
        human_review_required = True
        review_reasons.append(f'Crop "{produce_name}" uses universal baseline heuristics. Manual agricultural review advised.')

    has_critical_defect = any(
        any(cd.lower() in d.get("type", "").lower() for cd in standard["criticalDefects"]) or
        d.get("severity") == "Severe" or
        any(k in d.get("type", "").lower() for k in ["rot", "mold", "decay"])
        for d in defects
    )

    has_moderate_defects = [d for d in defects if d.get("severity") == "Moderate"]

    if has_critical_defect:
        final_grade = "Rejected"
        quality_class = "Non-Commercial / Rejected"
        reasons.append("Critical biological pathology detected (active decay, rot, or fungal sporulation). Exceeds commercial distribution tolerances.")
    elif overall_defect_area_percent > standard["gradeCMaxDefectArea"]:
        final_grade = "Rejected"
        quality_class = "Non-Commercial / Rejected"
        reasons.append(f"Cumulative defect area ({overall_defect_area_percent:.1f}%) exceeds maximum Grade C tolerance ({standard['gradeCMaxDefectArea']}%).")
    elif overall_defect_area_percent > standard["gradeBMaxDefectArea"] or len(has_moderate_defects) >= 2:
        final_grade = "Grade C"
        quality_class = "Low Quality / Industrial Processing"
        reasons.append(f"Total defect area ({overall_defect_area_percent:.1f}%) falls within secondary processing tier.")
        reasons.append("Suitable for purée, juicing, or industrial food processing.")
    elif overall_defect_area_percent > standard["gradeAMaxDefectArea"] or len(defects) > 0:
        final_grade = "Grade B"
        quality_class = "Standard Commercial Grade"
        reasons.append(f"Minor superficial blemishes detected occupying {overall_defect_area_percent:.1f}% of surface area (within Grade B tolerance <= {standard['gradeBMaxDefectArea']}%).")
        reasons.append("Meets retail distribution criteria with zero fungal decay.")
    else:
        final_grade = "Grade A"
        quality_class = "Premium Class 1"
        reasons.append(f"Superficial defect area ({overall_defect_area_percent:.1f}%) satisfies Grade A strict limits (<= {standard['gradeAMaxDefectArea']}%).")
        reasons.append("Uniform skin pigmentation and absence of mechanical lesions.")
        reasons.append("Approved for premium export packaging.")

    return {
        "finalGrade": final_grade,
        "qualityClass": quality_class,
        "reasons": reasons,
        "gradingRulesApplied": standard["description"],
        "humanReviewRequired": human_review_required,
        "reviewReasons": review_reasons
    }
