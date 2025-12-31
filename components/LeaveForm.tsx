
import React, { useState, useEffect } from 'react';
import { DutyRecord, DutyType } from '../types';

interface Props {
  onSave: (record: DutyRecord) => void;
  onBack: () => void;
  initialData?: DutyRecord;
}

const InputField = ({ label, value, onChange, type = "text", required = false, readOnly = false }: any) => (
  <div className="mb-4">
    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">{label}</p>
    <input 
      type={type}
      required={required}
      readOnly={readOnly}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className={`input-field ${readOnly ? 'bg-slate-50 text-slate-500' : 'bg-[#F8FAFC]'}`}
    />
  </div>
);

const LeaveForm: React.FC<Props> = ({ onSave, onBack, initialData }) => {
  const [formData, setFormData] = useState<Partial<DutyRecord>>(initialData || {
    id: crypto.randomUUID(),
    type: DutyType.LEAVE,
    timestamp: Date.now(),
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    natureOfLeave: 'CL',
    totalLeaveDays: 1
  });

  // Auto-calculate leave days whenever fromDate or toDate changes
  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const start = new Date(formData.fromDate);
      const end = new Date(formData.toDate);
      
      // Reset hours to ensure pure date comparison
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      // Calculate difference in milliseconds
      const diffTime = end.getTime() - start.getTime();
      // Convert to days and add 1 (inclusive of start and end date)
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      // Update if the calculation yields a valid non-negative number
      const calculatedDays = diffDays > 0 ? diffDays : 0;
      
      if (formData.totalLeaveDays !== calculatedDays) {
        setFormData(prev => ({ ...prev, totalLeaveDays: calculatedDays }));
      }
    }
  }, [formData.fromDate, formData.toDate]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSave(formData as DutyRecord);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      <div className="p-5 flex items-center justify-between bg-white border-b sticky top-0 z-50">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50">←</button>
        <h1 className="font-bold text-slate-800">Leave Record</h1>
        <button onClick={() => handleSave()} className="bg-blue-50 text-[#1D61E7] px-4 py-2 rounded-xl font-bold text-sm">Save</button>
      </div>

      <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm space-y-4 mb-6">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Nature of Leave</p>
            <div className="relative">
              <select 
                className="input-field bg-[#F8FAFC] appearance-none pr-10"
                value={formData.natureOfLeave}
                onChange={e => setFormData({...formData, natureOfLeave: e.target.value})}
              >
                <option value="CL">CL (Casual Leave)</option>
                <option value="LAP">LAP (Leave Average Pay)</option>
                <option value="LHAP">LHAP (Leave Half Average Pay)</option>
                <option value="PL">PL (Privilege Leave)</option>
                <option value="SICK">SICK (Medical Leave)</option>
                <option value="HOD">HOD Leave</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          <InputField 
            label="From Date" 
            type="date" 
            value={formData.fromDate} 
            onChange={(v: string) => setFormData({...formData, fromDate: v})} 
            required 
          />
          
          <InputField 
            label="To Date" 
            type="date" 
            value={formData.toDate} 
            onChange={(v: string) => setFormData({...formData, toDate: v})} 
            required 
          />
          
          <div className="relative">
            <InputField 
              label="Total Number of Leave Days" 
              type="number" 
              value={formData.totalLeaveDays} 
              readOnly={true}
              onChange={() => {}} // Controlled by useEffect
            />
            <span className="absolute right-4 bottom-3 text-[10px] font-bold text-blue-400 uppercase italic">Calculated</span>
          </div>
        </div>
      </form>

      <div className="p-4 bg-white border-t sticky bottom-0 z-50">
        <button 
          type="button" 
          onClick={() => handleSave()} 
          className="primary-button w-full p-4 flex items-center justify-center space-x-2 shadow-xl shadow-blue-500/20"
        >
          <span>📄</span>
          <span>{initialData ? 'Update Leave Record' : 'Submit Leave Record'}</span>
        </button>
      </div>
    </div>
  );
};

export default LeaveForm;
