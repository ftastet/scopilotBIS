import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ExportOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  useCORS?: boolean;
}

export const exportContentToPdf = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> => {
  const {
    filename = 'export.pdf',
    quality = 1,
    scale = 2,
    useCORS = true
  } = options;

  // Store original styles to restore later
  const originalMaxHeight = element.style.maxHeight;
  const originalOverflowY = element.style.overflowY;
  try {
    // Add class to hide modals and other UI elements during export
    document.body.classList.add('is-exporting-pdf');

    // Temporarily remove height constraints and scrolling to capture full content
    element.style.maxHeight = 'none';
    element.style.overflowY = 'visible';
    // Configuration pour html2canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight
    });

    // Dimensions du canvas
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Configuration du PDF (format A4)
    const pdfWidth = 210; // mm
    const pdfHeight = 297; // mm
    const margin = 10; // mm
    const contentWidth = pdfWidth - (margin * 2);
    const contentHeight = pdfHeight - (margin * 2);

    // Calculer le ratio pour ajuster l'image
    const ratio = Math.min(contentWidth / (imgWidth * 0.264583), contentHeight / (imgHeight * 0.264583));
    const scaledWidth = imgWidth * 0.264583 * ratio;
    const scaledHeight = imgHeight * 0.264583 * ratio;

    // Créer le PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Convertir le canvas en image
    const imgData = canvas.toDataURL('image/png', quality);

    // Si le contenu tient sur une page
    if (scaledHeight <= contentHeight) {
      pdf.addImage(imgData, 'PNG', margin, margin, scaledWidth, scaledHeight);
    } else {
      // Si le contenu nécessite plusieurs pages
      let remainingHeight = scaledHeight;
      let position = 0;
      let pageNumber = 1;

      while (remainingHeight > 0) {
        const pageHeight = Math.min(contentHeight, remainingHeight);
        
        if (pageNumber > 1) {
          pdf.addPage();
        }

        // Créer un canvas temporaire pour cette portion
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          const sourceY = (position / ratio) / 0.264583;
          const sourceHeight = (pageHeight / ratio) / 0.264583;
          
          tempCanvas.width = imgWidth;
          tempCanvas.height = sourceHeight;
          
          tempCtx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);
          
          const tempImgData = tempCanvas.toDataURL('image/png', quality);
          pdf.addImage(tempImgData, 'PNG', margin, margin, scaledWidth, pageHeight);
        }

        remainingHeight -= pageHeight;
        position += pageHeight;
        pageNumber++;
      }
    }

    // Sauvegarder le PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Erreur lors de l\'exportation PDF:', error);
    throw new Error('Impossible d\'exporter le PDF. Veuillez réessayer.');
  } finally {
    // Always remove the PDF export class
    document.body.classList.remove('is-exporting-pdf');
  }
};

export const generatePhaseFilename = (
  projectName: string,
  phase: 'initial' | 'options' | 'final',
  isExternalExport: boolean = false
): string => {
  const phaseNames = {
    initial: 'Opportunite',
    options: 'Scenarios',
    final: 'Engagement'
  };

  const sanitizedProjectName = projectName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);

  const timestamp = new Date().toISOString().split('T')[0];
  
  const externalSuffix = isExternalExport ? '_Externe' : '';
  return `${sanitizedProjectName}_${phaseNames[phase]}${externalSuffix}_${timestamp}.pdf`;
};