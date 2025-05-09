import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDFGenerator = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('generated.pdf');
    }
  };

  return (
    <div>
      <div ref={contentRef} style={{ padding: '20px', backgroundColor: '#fff' }}>
        <h1>Sample Content</h1>
        <p>This content will be captured as an image and embedded into a PDF.</p>
      </div>
      <button onClick={generatePDF} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Generate PDF
      </button>
    </div>
  );
};

export default PDFGenerator;