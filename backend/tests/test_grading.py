"""
Automated Unit and Integration Tests for AI Grading Pipeline and Crop Rules
"""
import pytest
from pipeline.grading_rules import evaluate_grading_rules, CROP_STANDARDS


def test_grade_a_apple_evaluation():
    """Test that an Apple with zero defects and high confidence achieves Grade A."""
    result = evaluate_grading_rules(
        produce_name="Apple",
        defects=[],
        overall_defect_area_percent=0.5,
        classification_confidence=0.95,
        produce_id_confidence=0.98
    )
    assert result["finalGrade"] == "Grade A"
    assert "Premium" in result["qualityClass"]
    assert result["humanReviewRequired"] is False


def test_grade_b_tomato_evaluation():
    """Test that a Tomato with superficial zippering blemish receives Grade B."""
    defects = [{
        "id": "DEF-1",
        "type": "Superficial Zippering",
        "severity": "Minor",
        "affectedAreaPercent": 3.2
    }]
    result = evaluate_grading_rules(
        produce_name="Tomato",
        defects=defects,
        overall_defect_area_percent=3.2,
        classification_confidence=0.92,
        produce_id_confidence=0.96
    )
    assert result["finalGrade"] == "Grade B"
    assert "Standard Commercial" in result["qualityClass"]


def test_rejected_due_to_rot():
    """Test that active rot immediately causes produce rejection."""
    defects = [{
        "id": "DEF-2",
        "type": "Fungal Rot Breakdown",
        "severity": "Severe",
        "affectedAreaPercent": 1.5
    }]
    result = evaluate_grading_rules(
        produce_name="Bell Pepper",
        defects=defects,
        overall_defect_area_percent=1.5,
        classification_confidence=0.94,
        produce_id_confidence=0.97
    )
    assert result["finalGrade"] == "Rejected"
    assert "Non-Commercial" in result["qualityClass"]


def test_human_review_trigger_on_low_confidence():
    """Test that low optical recognition confidence triggers human review flag."""
    result = evaluate_grading_rules(
        produce_name="Apple",
        defects=[],
        overall_defect_area_percent=0.0,
        classification_confidence=0.58,  # Below 0.65 threshold
        produce_id_confidence=0.62       # Below 0.70 threshold
    )
    assert result["humanReviewRequired"] is True
    assert len(result["reviewReasons"]) >= 2
