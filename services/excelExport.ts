
import { DutyRecord } from '../types';

/**
 * Using the XLSX library available via the CDN in index.html
 */
declare const XLSX: any;

export const exportToExcel = async (records: DutyRecord[], mode: 'download' | 'share' = 'share') => {
  if (records.length === 0) {
    alert('No records to export. Please add some duties first.');
    return;
  }

  // Flatten nested data for CSV/Excel compatibility
  const flatData = records.map(r => {
    const flat: any = {
      'ID': r.id,
      'Type': r.type,
      'Date': r.date,
      'Train No': r.trainNumber || '',
      'Loco No': r.locoNumber || '',
      'Call Time': r.callTime || '',
      'Sign ON': r.signOnTime || '',
      'Sign OFF': r.signOffTime || '',
      'Pilot': r.pilotName || '',
      'Pilot ID': r.pilotId || '',
      'Guard': r.guardName || '',
      'Guard ID': r.guardId || '',
      'Section': r.section || '',
      'Nature of Leave': r.natureOfLeave || '',
      'From Date': r.fromDate || '',
      'To Date': r.toDate || '',
    };

    // Add safety items as separate columns if it's a working duty
    if (r.safetyItems) {
      r.safetyItems.forEach(item => {
        flat[`Safety: ${item.label}`] = item.ok ? 'OK' : `NOT OK (${item.remark})`;
      });
    }

    return flat;
  });

  try {
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DutyLog");
    
    // Generate file name with current date
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `ALP_DutyLog_${dateStr}.xlsx`;

    if (mode === 'share') {
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const file = new File([blob], fileName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'ALP Duty Log Upload',
          text: `Upload your duty records to Google Drive or Sheets.`,
        });
      } else {
        // Fallback to download if sharing isn't supported
        XLSX.writeFile(workbook, fileName);
        alert(`Sharing not supported on this browser. File has been downloaded as: ${fileName}`);
      }
    } else {
      // Direct download mode
      XLSX.writeFile(workbook, fileName);
    }
  } catch (err) {
    console.error('Export failed', err);
    alert('An error occurred during export. Please check your data and try again.');
  }
};
