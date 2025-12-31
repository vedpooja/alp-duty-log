
import React, { useState, useEffect } from 'react';
import { DutyRecord, DutyType } from '../types';

interface Props {
  onSave: (record: DutyRecord) => void;
  onBack: () => void;
  initialData?: DutyRecord;
}

const InputField = ({ label, value, onChange, type = "text", placeholder = "", required = false, readOnly = false }: any) => (
  <div className="mb-4">
    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">{label}</p>
    <input 
      type={type}
      required={required}
      readOnly={readOnly}
      placeholder={placeholder}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className={`input-field ${readOnly ? 'bg-slate-50 text-slate-500 font-bold' : 'bg-[#F8FAFC]'}`}
    />
  </div>
);

const PeriodicRestForm: React.FC<Props> = ({ onSave, onBack, initialData }) => {
  const [formData, setFormData] = useState<Partial<DutyRecord>>(initialData || {
    id: crypto.randomUUID(),
    type: DutyType.PERIODIC_REST,
    timestamp: Date.now(),
    fromDate: new Date().toISOString().split('T')[0],
    fromTime: '00:00',
    toDate: new Date().toISOString().split('T')[0],
    toTime: '00:00',
    trainNumber: ''
  });

  const [durationText, setDurationText] = useState<string>('0 Hours 0 Minutes');

  // Auto-calculate rest duration
  useEffect(() => {
    if (formData.fromDate && formData.fromTime && formData.toDate && formData.toTime) {
      const start = new Date(`${formData.fromDate}T${formData.fromTime}`);
      const end = new Date(`${formData.toDate}T${formData.toTime}`);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffMs = end.getTime() - start.getTime();
        if (diffMs > 0) {
          const totalMinutes = Math.floor(diffMs / (1000 * 60));
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          setDurationText(`${hours} Hours ${minutes} Minutes`);
        } else {
          setDurationText('Invalid Duration');
        }
      }
    }
  }, [formData.fromDate, formData.fromTime, formData.toDate, formData.toTime]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSave(formData as DutyRecord);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      <div className="p-5 flex items-center justify-between bg-white border-b sticky top-0 z-50 shadow-sm">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50">←</button>
        <h1 className="font-bold text-slate-800">Periodic Rest Log</h1>
        <button onClick={() => handleSave()} className="bg-blue-50 text-[#1D61E7] px-4 py-2 rounded-xl font-bold text-sm">Save</button>
      </div>

      <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Train Reference Box */}
        <div className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-lg">🚂</div>
            <p className="font-bold text-slate-700">Train Reference</p>
          </div>
          <InputField 
            label="Train Name / No." 
            placeholder="Ex. 12904 or Golden Temple" 
            value={formData.trainNumber} 
            onChange={(v: string) => setFormData({...formData, trainNumber: v})} 
          />
        </div>

        {/* Start Period */}
        <div className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-lg">📅</div>
            <p className="font-bold text-slate-700">Rest Period - START</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="From Date" type="date" value={formData.fromDate} onChange={(v: string) => setFormData({...formData, fromDate: v})} required />
            <InputField label="From Time" type="time" value={formData.fromTime} onChange={(v: string) => setFormData({...formData, fromTime: v})} />
          </div>
        </div>

        {/* End Period */}
        <div className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-lg">🏁</div>
            <p className="font-bold text-slate-700">Rest Period - END</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="To Date" type="date" value={formData.toDate} onChange={(v: string) => setFormData({...formData, toDate: v})} required />
            <InputField label="To Time" type="time" value={formData.toTime} onChange={(v: string) => setFormData({...formData, toTime: v})} />
          </div>
        </div>

        {/* Duration Calculation Box */}
        <div className="bg-[#1D61E7]/5 rounded-2xl p-6 border-2 border-dashed border-[#1D61E7]/20 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-[#1D61E7] uppercase tracking-widest mb-1">Total Rest Duration</p>
              <h3 className="text-xl font-black text-slate-800">{durationText}</h3>
            </div>
            <div className="w-12 h-12 bg-[#1D61E7] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              ⌛
            </div>
          </div>
        </div>
      </form>

      <div className="p-4 bg-white border-t sticky bottom-0 z-50">
        <button 
          type="button" 
          onClick={() => handleSave()} 
          className="primary-button w-full p-4 flex items-center justify-center space-x-2 shadow-xl shadow-blue-500/20"
        >
          <span>🏠</span>
          <span>{initialData ? 'Update Record' : 'Save Rest Record'}</span>
        </button>
      </div>
    </div>
  );
};

export default PeriodicRestForm;
