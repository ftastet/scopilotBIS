import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ExportOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  useCORS?: boolean;
}

const A4_WIDTH = 210; // mm
const A4_HEIGHT = 297; // mm
const MARGIN = 10; // mm
const MM_PER_PX = 0.264583; // conversion

export async function exportContentToPdf(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = 'export.pdf',
    quality = 1,
    scale = 2,
    useCORS = true,
  } = options;

  const originalMaxHeight = element.style.maxHeight;
  const originalOverflowY = element.style.overflowY;

  try {
    document.body.classList.add('is-exporting-pdf');
    element.style.maxHeight = 'none';
    element.style.overflowY = 'visible';

    const canvas = await html2canvas(element, {
      scale,
      useCORS,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    const imgWidthPx = canvas.width;
    const imgHeightPx = canvas.height;
    const contentWidth = A4_WIDTH - MARGIN * 2;
    const contentHeight = A4_HEIGHT - MARGIN * 2;

    const ratio = Math.min(
      contentWidth / (imgWidthPx * MM_PER_PX),
      contentHeight / (imgHeightPx * MM_PER_PX),
    );
    const scaledWidth = imgWidthPx * MM_PER_PX * ratio;
    const scaledHeight = imgHeightPx * MM_PER_PX * ratio;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png', quality);

    let heightLeft = scaledHeight;
    let position = MARGIN;

    pdf.addImage(imgData, 'PNG', MARGIN, position, scaledWidth, scaledHeight);
    heightLeft -= contentHeight;

    while (heightLeft > 0) {
      position = MARGIN - (scaledHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', MARGIN, position, scaledWidth, scaledHeight);
      heightLeft -= contentHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Erreur lors de l\'exportation PDF:', error);
    throw error instanceof Error
      ? new Error(`Impossible d'exporter le PDF : ${error.message}`)
      : new Error("Impossible d'exporter le PDF.");
  } finally {
    element.style.maxHeight = originalMaxHeight;
    element.style.overflowY = originalOverflowY;
    document.body.classList.remove('is-exporting-pdf');
  }
}

export type Phase = 'initial' | 'options' | 'final';

export function generatePhaseFilename(
  projectName: string,
  phase: Phase,
  isExternalExport = false,
): string {
  const phaseNames: Record<Phase, string> = {
    initial: 'Opportunite',
    options: 'Scenarios',
    final: 'Engagement',
  };

  const sanitizedProjectName = projectName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);

  const timestamp = new Date().toISOString().split('T')[0];
  const externalSuffix = isExternalExport ? '_Externe' : '';
  return `${sanitizedProjectName}_${phaseNames[phase]}${externalSuffix}_${timestamp}.pdf`;
}
