
import React, { useState } from 'react';
import { DutyRecord, DutyType } from '../types';

interface Props {
  onSave: (record: DutyRecord) => void;
  onBack: () => void;
  initialData?: DutyRecord;
}

const InputField = ({ label, value, onChange, type = "text", placeholder = "", required = false, className = "" }: any) => (
  <div className="mb-4">
    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">{label}</p>
    <input 
      type={type}
      required={required}
      placeholder={placeholder}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className={`input-field bg-[#F8FAFC] ${className}`}
    />
  </div>
);

const SpareDutyForm: React.FC<Props> = ({ onSave, onBack, initialData }) => {
  const [formData, setFormData] = useState<Partial<DutyRecord>>(initialData || {
    id: crypto.randomUUID(),
    type: DutyType.SPARE,
    timestamp: Date.now(),
    date: new Date().toISOString().split('T')[0]
  });

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSave(formData as DutyRecord);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      <div className="p-5 flex items-center justify-between bg-white border-b sticky top-0 z-50">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50">←</button>
        <h1 className="font-bold text-slate-800">Spare Duty Details</h1>
        <button onClick={() => handleSave()} className="bg-blue-50 text-[#1D61E7] px-4 py-2 rounded-xl font-bold text-sm">Save</button>
      </div>

      <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Route Information Box */}
        <div className="bg-white rounded-2xl p-4 border border-blue-50 shadow-sm">
          <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Route Information</p>
          <InputField 
            label="Section (From - To)" 
            placeholder="EX: NDLS - BCT" 
            value={formData.section} 
            onChange={(v: string) => setFormData({...formData, section: v.toUpperCase()})} 
            className="uppercase font-bold"
          />
        </div>

        <div className="bg-white rounded-2xl p-4 border border-blue-50 shadow-sm">
          <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Timing Information</p>
          <InputField label="Date" type="date" value={formData.date} onChange={(v: string) => setFormData({...formData, date: v})} required />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Call Time" type="time" value={formData.callTime} onChange={(v: string) => setFormData({...formData, callTime: v})} />
            <InputField label="Sign ON" type="time" value={formData.signOnTime} onChange={(v: string) => setFormData({...formData, signOnTime: v})} />
          </div>
          <InputField 
            label="Sign OFF (Date & Time)" 
            type="datetime-local" 
            value={formData.signOffTime} 
            onChange={(v: string) => setFormData({...formData, signOffTime: v})} 
          />
          <p className="text-[9px] text-slate-400 italic px-1 mt-1">Note: Sign off includes both date and time for accuracy.</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-blue-50 shadow-sm mb-6">
          <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Staff & Train Details</p>
          <InputField label="Pilot Name" placeholder="Enter pilot name" value={formData.pilotName} onChange={(v: string) => setFormData({...formData, pilotName: v})} />
          <InputField label="Pilot User ID" placeholder="Ex. 45892" value={formData.pilotId} onChange={(v: string) => setFormData({...formData, pilotId: v})} />
          
          <InputField label="Guard Name" placeholder="Enter guard name" value={formData.guardName} onChange={(v: string) => setFormData({...formData, guardName: v})} />
          <InputField label="Guard User ID" placeholder="Ex. 12345" value={formData.guardId} onChange={(v: string) => setFormData({...formData, guardId: v})} />
          
          <InputField label="Train Number" placeholder="Ex. 12345" value={formData.trainNumber} onChange={(v: string) => setFormData({...formData, trainNumber: v})} />
        </div>
      </form>

      <div className="p-4 bg-white border-t sticky bottom-0 z-50">
        <button 
          type="button" 
          onClick={() => handleSave()} 
          className="primary-button w-full p-4 flex items-center justify-center space-x-2 shadow-xl shadow-blue-500/20"
        >
          <span>📥</span>
          <span>{initialData ? 'Update Record' : 'Save Record'}</span>
        </button>
      </div>
    </div>
  );
};

export default SpareDutyForm;
