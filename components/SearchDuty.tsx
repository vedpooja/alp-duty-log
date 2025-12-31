
import React, { useState, useMemo } from 'react';
import { DutyRecord } from '../types';

interface Props {
  duties: DutyRecord[];
  onBack: () => void;
  onEdit: (record: DutyRecord) => void;
}

const SearchDuty: React.FC<Props> = ({ duties, onBack, onEdit }) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const s = query.toLowerCase().trim();
    if (!s) return duties;
    
    return duties.filter(d => {
      return (
        d.date.includes(s) ||
        d.trainNumber?.toLowerCase().includes(s) ||
        d.locoNumber?.toLowerCase().includes(s) ||
        d.pilotName?.toLowerCase().includes(s) ||
        d.guardName?.toLowerCase().includes(s) ||
        d.section?.toLowerCase().includes(s) ||
        d.type.toLowerCase().includes(s)
      );
    });
  }, [query, duties]);

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-[#F8FAFC]">
      <div className="p-4 bg-white border-b sticky top-0 z-50 flex items-center shadow-sm">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 mr-4">←</button>
        <div className="flex-1 relative">
          <input 
            type="text"
            autoFocus
            placeholder="Search records..."
            className="input-field pl-10"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">🔍</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24">
        <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest px-1">
          {filtered.length} matching {filtered.length === 1 ? 'record' : 'records'} found
        </p>
        
        <div className="space-y-4">
          {filtered.map(duty => (
            <div 
              key={duty.id} 
              className="app-card p-5 relative transition-all active:scale-[0.98]"
              onClick={() => onEdit(duty)}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${duty.type === 'Working' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                  {duty.type}
                </span>
                <span className="font-bold text-slate-400 text-xs">{duty.date}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {duty.trainNumber && (
                  <div>
                    <p className="text-[8px] font-bold text-slate-300 uppercase">Train / Loco</p>
                    <p className="font-black text-slate-700 text-sm">{duty.trainNumber} / {duty.locoNumber || '-'}</p>
                  </div>
                )}
                {duty.pilotName && (
                  <div>
                    <p className="text-[8px] font-bold text-slate-300 uppercase">Pilot</p>
                    <p className="font-black text-slate-700 text-sm truncate">{duty.pilotName}</p>
                  </div>
                )}
                {duty.signOnTime && (
                  <div>
                    <p className="text-[8px] font-bold text-slate-300 uppercase">Timing</p>
                    <p className="font-black text-slate-700 text-sm">{duty.signOnTime} - {duty.signOffTime || '--:--'}</p>
                  </div>
                )}
                {duty.section && (
                  <div>
                    <p className="text-[8px] font-bold text-slate-300 uppercase">Section</p>
                    <p className="font-black text-slate-700 text-sm truncate">{duty.section}</p>
                  </div>
                )}
              </div>
              
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                <span className="text-xl">➜</span>
              </div>
            </div>
          ))}
          
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🔦</div>
              <p className="text-slate-400 font-bold italic">No results found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDuty;
