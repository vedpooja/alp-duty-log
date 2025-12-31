
import React, { useState, useMemo, useEffect } from 'react';
import { DutyRecord, DutyType } from '../types';
import { exportToExcel } from '../services/excelExport';

interface Props {
  duties: DutyRecord[];
  onBack: () => void;
}

const ExportLogs: React.FC<Props> = ({ duties, onBack }) => {
  const [rangeType, setRangeType] = useState<'7days' | 'month' | 'last' | 'custom'>('7days');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<DutyType[]>(Object.values(DutyType));

  // Initialize dates based on default range (7 days)
  useEffect(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    
    setFromDate(sevenDaysAgoStr);
    setToDate(todayStr);
  }, []);

  const handlePresetChange = (type: '7days' | 'month' | 'last') => {
    setRangeType(type);
    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (type === '7days') {
      start.setDate(now.getDate() - 7);
    } else if (type === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (type === 'last') {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    setFromDate(start.toISOString().split('T')[0]);
    setToDate(end.toISOString().split('T')[0]);
  };

  const filteredDuties = useMemo(() => {
    if (!fromDate || !toDate) return [];
    
    const start = new Date(fromDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);
    
    return duties.filter(d => {
      // Filter by type
      if (!selectedTypes.includes(d.type)) return false;

      // Filter by custom date range
      const recordDate = new Date(d.date);
      return recordDate >= start && recordDate <= end;
    });
  }, [duties, fromDate, toDate, selectedTypes]);

  const toggleType = (type: DutyType) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleExport = () => {
    if (filteredDuties.length === 0) {
      alert("No records found for the selected filters.");
      return;
    }
    exportToExcel(filteredDuties);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="p-5 flex items-center bg-white border-b sticky top-0 z-50">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 mr-4">←</button>
        <h1 className="font-bold text-slate-800 text-lg flex-1 text-center pr-10">Export Duty Log</h1>
      </div>

      <div className="p-6 flex-1 space-y-8 pb-24">
        <section>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Select Date Range</h2>
          <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">Choose a preset or pick specific dates manually.</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <button 
              onClick={() => handlePresetChange('7days')} 
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${rangeType === '7days' ? 'bg-[#1D61E7] text-white' : 'bg-white text-slate-400'}`}
            >
              Last 7 Days
            </button>
            <button 
              onClick={() => handlePresetChange('month')} 
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${rangeType === 'month' ? 'bg-[#1D61E7] text-white' : 'bg-white text-slate-400'}`}
            >
              This Month
            </button>
            <button 
              onClick={() => handlePresetChange('last')} 
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${rangeType === 'last' ? 'bg-[#1D61E7] text-white' : 'bg-white text-slate-400'}`}
            >
              Last Month
            </button>
            <button 
              onClick={() => setRangeType('custom')} 
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${rangeType === 'custom' ? 'bg-[#1D61E7] text-white' : 'bg-white text-slate-400'}`}
            >
              Custom
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">From Date</p>
              <div className="relative">
                <input 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setRangeType('custom');
                  }}
                  className="w-full bg-white border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-700 shadow-sm outline-none focus:border-blue-300"
                />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">To Date</p>
              <div className="relative">
                <input 
                  type="date" 
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setRangeType('custom');
                  }}
                  className="w-full bg-white border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-700 shadow-sm outline-none focus:border-blue-300"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-800">Include Duty Types</h2>
            <button className="text-[#1D61E7] text-xs font-bold" onClick={() => setSelectedTypes(Object.values(DutyType))}>Select All</button>
          </div>
          <div className="space-y-3">
            {Object.values(DutyType).map(type => (
              <label key={type} className={`flex items-center p-4 bg-white rounded-2xl border transition-all ${selectedTypes.includes(type) ? 'border-[#1D61E7] bg-blue-50/10' : 'border-slate-100 opacity-60'}`}>
                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 mr-4 accent-blue-600" checked={selectedTypes.includes(type)} onChange={() => toggleType(type)} />
                <div className="flex-1">
                  <p className="font-bold text-slate-800 leading-none">{type}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">Include in record</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        <div className="bg-white rounded-2xl p-6 border border-blue-50">
           <div className="flex justify-between items-center mb-4">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pre-Export Check</p>
             <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${filteredDuties.length > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
               • {filteredDuties.length > 0 ? 'Ready' : 'No Data'}
             </span>
           </div>
           
           <div className="space-y-4">
             <div className="flex items-center">
               <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-4 text-lg">📋</div>
               <div className="flex-1 flex justify-between border-b border-slate-50 pb-2">
                 <span className="text-slate-500 font-medium">Records Found</span>
                 <span className={`font-bold ${filteredDuties.length > 0 ? 'text-slate-800' : 'text-red-400'}`}>{filteredDuties.length} Records</span>
               </div>
             </div>
             <div className="flex items-center">
               <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mr-4 text-lg">📊</div>
               <div className="flex-1 flex justify-between">
                 <span className="text-slate-500 font-medium">File Format</span>
                 <span className="font-bold text-slate-800">Excel (.XLSX)</span>
               </div>
             </div>
           </div>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50">
           <span className="text-blue-400 text-sm">ℹ️</span>
           <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
             All records within the selected date range ({fromDate || '...'} to {toDate || '...'}) will be included in the exported file.
           </p>
        </div>
      </div>

      <div className="p-6 bg-white border-t sticky bottom-0 z-[60]">
        <button 
          disabled={filteredDuties.length === 0}
          onClick={handleExport} 
          className={`primary-button w-full p-4 flex items-center justify-center space-x-2 shadow-xl ${filteredDuties.length === 0 ? 'opacity-50 grayscale cursor-not-allowed' : 'shadow-blue-500/20'}`}
        >
          <span>📥</span>
          <span>Export {filteredDuties.length} Records</span>
        </button>
      </div>
    </div>
  );
};

export default ExportLogs;
