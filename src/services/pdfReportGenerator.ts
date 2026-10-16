import { jsPDF } from 'jspdf';
import { GradingResult } from '../types';

export function generateGradingPDF(result: GradingResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Header Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AI-Based Universal Fruit & Vegetable Quality Grading System', margin, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('AUTOMATED COMPUTER VISION QUALITY INSPECTION REPORT', margin, 18);
  doc.text(`REPORT ID: ${result.id}  ·  ISSUED: ${new Date(result.processingDate).toLocaleString()}`, margin, 23);

  // Status / Grade Stamp in top right
  const gradeColors: Record<string, [number, number, number]> = {
    'Grade A': [22, 163, 74], // green
    'Grade B': [37, 99, 235], // blue
    'Grade C': [217, 119, 6], // amber
    'Rejected': [220, 38, 38] // red
  };
  const color = gradeColors[result.finalGrade] || [71, 85, 105];

  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(pageWidth - margin - 38, 7, 38, 14, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(result.finalGrade.toUpperCase(), pageWidth - margin - 19, 16, { align: 'center' });

  let y = 36;

  // Metadata Row (Account, Crop, Items, Mode)
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');

  doc.text('ACCOUNT REFERENCE', margin + 4, y + 6);
  doc.text('PRODUCE CLASSIFICATION', margin + 55, y + 6);
  doc.text('DETECTED UNITS', margin + 115, y + 6);
  doc.text('PIPELINE MODE', margin + 145, y + 6);

  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  doc.text(`${result.userEmail} (${result.accountType})`, margin + 4, y + 13);
  doc.text(`${result.produceName} (${result.cropCategory})`, margin + 55, y + 13);
  doc.text(`${result.detectedItemCount} item(s)`, margin + 115, y + 13);
  doc.text(`${result.modelModeUsed.toUpperCase()} / ${result.speedModeUsed.toUpperCase()}`, margin + 145, y + 13);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Quality Class: ${result.qualityClass}`, margin + 4, y + 19);
  doc.text(`Overall Model Confidence: ${(result.confidences.overall * 100).toFixed(1)}%`, margin + 55, y + 19);

  y += 30;

  // Quality Assessment Summary & Criteria
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Quality Assessment & Assigned Grade Rationale', margin, y);

  y += 5;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 28, 1, 1, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  let rationaleY = y + 6;
  for (const reason of result.reasons.slice(0, 3)) {
    doc.text(`•  ${reason}`, margin + 4, rationaleY);
    rationaleY += 6;
  }
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Applied Grading Benchmark: ${result.gradingRulesApplied}`, margin + 4, rationaleY + 2);

  y += 34;

  // Quantitative Metric Breakdown
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Computer Vision & Model Confidence Breakdown', margin, y);

  y += 5;
  const colW = contentWidth / 4;
  const metrics = [
    { label: 'PRODUCE ID CONF.', val: `${(result.confidences.produceId * 100).toFixed(1)}%` },
    { label: 'DEFECT LOCALIZATION', val: `${(result.confidences.defectDetection * 100).toFixed(1)}%` },
    { label: 'EFFICIENTNET QUALITY', val: `${(result.confidences.qualityClassification * 100).toFixed(1)}%` },
    { label: 'TOTAL DEFECT AREA', val: `${result.overallDefectAreaPercent.toFixed(1)}%` }
  ];

  metrics.forEach((m, idx) => {
    const mx = margin + idx * colW;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(mx, y, colW - 2, 16, 1, 1, 'FD');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, mx + 4, y + 5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(m.val, mx + 4, y + 12);
  });

  y += 22;

  // Defect Inspection Table
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`3. Visible Defect Localization (${result.defects.length} detected)`, margin, y);

  y += 5;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('DEFECT TYPE', margin + 4, y + 5);
  doc.text('SEVERITY', margin + 50, y + 5);
  doc.text('AFFECTED AREA', margin + 80, y + 5);
  doc.text('CONFIDENCE', margin + 115, y + 5);
  doc.text('ANALYSIS NOTE', margin + 140, y + 5);

  y += 7;

  if (result.defects.length === 0) {
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(22, 163, 74);
    doc.text('✓ No visible surface defects or pathological decay lesions detected by segmentation pipeline.', margin + 4, y + 5.5);
    y += 8;
  } else {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    for (const defect of result.defects) {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(241, 245, 249);
      doc.rect(margin, y, contentWidth, 8, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.text(defect.type, margin + 4, y + 5.5);

      const sevColor: Record<string, [number, number, number]> = {
        'Minor': [22, 163, 74],
        'Moderate': [217, 119, 6],
        'Severe': [220, 38, 38]
      };
      const [sr, sg, sb] = sevColor[defect.severity] || [100, 116, 139];
      doc.setTextColor(sr, sg, sb);
      doc.text(defect.severity, margin + 50, y + 5.5);

      doc.setTextColor(15, 23, 42);
      doc.text(`${defect.affectedAreaPercent.toFixed(1)}%`, margin + 80, y + 5.5);
      doc.text(`${(defect.confidence * 100).toFixed(0)}%`, margin + 115, y + 5.5);
      doc.setTextColor(100, 116, 139);
      const note = defect.description.length > 36 ? defect.description.substring(0, 33) + '...' : defect.description;
      doc.text(note, margin + 140, y + 5.5);

      y += 8;
    }
  }

  y += 8;

  // Human Review Notice
  if (result.humanReviewRequired) {
    doc.setFillColor(254, 242, 242); // red-50
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin, y, contentWidth, 14, 1, 1, 'FD');
    doc.setTextColor(185, 28, 28);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠ HUMAN AUDIT / REVIEW REQUIRED', margin + 4, y + 5.5);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(result.reviewReasons ? result.reviewReasons.join(' ') : 'Produce features require qualified agronomist confirmation.', margin + 4, y + 10.5);
    y += 18;
  } else {
    doc.setFillColor(240, 253, 244); // green-50
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, y, contentWidth, 10, 1, 1, 'FD');
    doc.setTextColor(21, 128, 61);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('✓ Automated verification passed: confidence metrics and clear focal features meet threshold standards.', margin + 4, y + 6);
    y += 14;
  }

  // Footer Disclaimer
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  const disclaimer1 = 'Responsible-use Statement: The system assesses visible characteristics from images/video using computer vision (YOLO segmentation + EfficientNet-B0).';
  const disclaimer2 = 'It does not independently certify food safety, pesticide residues, chemical limits, or internal flesh quality. Results should be reviewed by qualified inspectors.';
  doc.text(disclaimer1, margin, pageHeight - 12);
  doc.text(disclaimer2, margin, pageHeight - 8);

  // Download PDF
  doc.save(`AgriGrade_Report_${result.id}_${result.produceName}.pdf`);
}
