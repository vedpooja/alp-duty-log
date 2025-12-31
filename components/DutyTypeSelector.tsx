
import React, { useState } from 'react';
import { DutyType } from '../types';

interface Props {
  onSelect: (type: DutyType) => void;
  onBack: () => void;
}

const DutyTypeSelector: React.FC<Props> = ({ onSelect, onBack }) => {
  const [selected, setSelected] = useState<DutyType>(DutyType.WORKING);

  const categories = [
    { type: DutyType.WORKING, label: 'Working', sub: 'ACTIVE DUTY', icon: '🚂', color: 'bg-blue-50 text-[#1D61E7]' },
    { type: DutyType.SPARE, label: 'Spare', sub: 'STANDBY', icon: '🚋', color: 'bg-slate-50 text-slate-600' },
    { type: DutyType.PERIODIC_REST, label: 'Periodic Rest', sub: 'HQ REST', icon: '🏠', color: 'bg-slate-50 text-slate-600' },
    { type: DutyType.LEAVE, label: 'Leave', sub: 'OFF DUTY', icon: '📄', color: 'bg-slate-50 text-slate-600' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto w-[90%] my-4 p-3.5 pb-2.5 flex items-center bg-white border border-slate-100 rounded-2xl sticky top-2 z-50 shadow-lg shadow-slate-200/50">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 mr-2">←</button>
        <h1 className="font-bold text-slate-800 text-xs flex-1 text-center truncate pr-8">Select Duty Category</h1>
      </div>

      <div className="p-8 flex-1">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Category</h2>
        <p className="text-sm text-slate-500 font-medium mb-10 leading-snug">Choose the category for this new log entry.</p>

        <div className="grid grid-cols-2 gap-4">
          {categories.map(cat => (
            <button 
              key={cat.type}
              onClick={() => setSelected(cat.type)}
              className={`app-card p-6 flex flex-col items-center justify-center relative transition-all border-2 ${selected === cat.type ? 'border-[#1D61E7]' : 'border-transparent'}`}
            >
              {selected === cat.type && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#1D61E7] rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
              )}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 text-3xl ${cat.color} ${selected === cat.type ? 'shadow-inner' : ''}`}>
                {cat.icon}
              </div>
              <p className="font-extrabold text-slate-800 leading-none">{cat.label}</p>
              <p className="text-[8px] font-black text-slate-400 mt-2 tracking-widest uppercase">{cat.sub}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 bg-white border-t sticky bottom-0">
        <button onClick={() => onSelect(selected)} className="primary-button w-full p-4 flex items-center justify-center space-x-2 shadow-xl shadow-blue-500/20">
          <span>Next Step</span>
          <span>➜</span>
        </button>
      </div>
    </div>
  );
};

export default DutyTypeSelector;
