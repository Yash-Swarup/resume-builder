import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const downloadPDF = async (elementId, filename = 'Resume') => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    alert('Resume not found');
    return;
  }

  // Show loading overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed; top:0; left:0; width:100vw; height:100vh;
    background:rgba(0,0,0,0.8); z-index:99999;
    display:flex; align-items:center; justify-content:center;
    color:white; font-size:18px; font-family:sans-serif;
  `;
  overlay.innerText = '⏳ Generating PDF... Please wait';
  document.body.appendChild(overlay);

  try {
    await new Promise(r => setTimeout(r, 300));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('portrait', 'mm', 'a4');

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * pageW) / canvas.width;

    let y = 0;
    let remaining = imgH;

    pdf.addImage(imgData, 'JPEG', 0, y, imgW, imgH);
    remaining -= pageH;

    while (remaining > 0) {
      y -= pageH;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, y, imgW, imgH);
      remaining -= pageH;
    }

    pdf.save(`${filename}.pdf`);
    document.body.removeChild(overlay);

  } catch (err) {
    document.body.removeChild(overlay);
    alert('Failed: ' + err.message);
  }
};

export default downloadPDF;