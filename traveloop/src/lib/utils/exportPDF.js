import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Direct import karein

export const generateTripPDF = (trip, stops) => {
  const doc = new jsPDF();

  // Header - Trip Name
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59); // Slate-900
  doc.text(trip.name, 14, 22);

  // Subheader - Dates
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Duration: ${trip.start_date || 'N/A'} to ${trip.end_date || 'N/A'}`, 14, 30);
  
  doc.setLineWidth(0.5);
  doc.line(14, 35, 196, 35); 

  let finalY = 40;

  stops.forEach((stop, index) => {
    // City Name
    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text(`Stop #${index + 1}: ${stop.city_name}`, 14, finalY + 10);
    
    // Activities Table Data
    const tableData = (stop.activities || []).map(act => [
      act.name,
      act.description || "-",
      `$${act.cost}`
    ]);

    // ✅ Method ki jagah autoTable function ko use karein
    autoTable(doc, {
      startY: finalY + 15,
      head: [['Activity', 'Description', 'Cost']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59] },
      margin: { left: 14 },
    });

    // doc.lastAutoTable.finalY access karne ke liye doc object check karein
    finalY = doc.lastAutoTable.finalY + 10;
  });

  // Footer - Total Budget
  const total = stops.reduce((acc, s) => acc + (s.activities?.reduce((sum, a) => sum + Number(a.cost), 0) || 0), 0);
  
  // Page check: Agar jagah kam hai toh naya page add karein
  if (finalY > 260) {
    doc.addPage();
    finalY = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text(`Estimated Total Budget: $${total.toFixed(2)}`, 14, finalY + 10);

  // Download the file
  doc.save(`${trip.name.replace(/\s+/g, '_')}_Itinerary.pdf`);
};