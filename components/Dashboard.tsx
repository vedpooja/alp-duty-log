
import React, { useState, useRef } from 'react';
import { UserProfile, DutyRecord } from '../types';

interface Props {
  profile: UserProfile;
  duties: DutyRecord[];
  onAdd: () => void;
  onSearch: () => void;
  onEdit: (record: DutyRecord) => void;
  onDelete: (id: string) => void;
  onUploadToDrive: () => void;
}

const Dashboard: React.FC<Props> = ({ profile, duties, onAdd, onSearch, onEdit, onDelete, onUploadToDrive }) => {
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const longPressTimer = useRef<any>(null);

  const confirmDelete = () => {
    if (showConfirm) {
      onDelete(showConfirm);
      setShowConfirm(null);
    }
  };

  const handleTouchStart = (duty: DutyRecord) => {
    longPressTimer.current = setTimeout(() => {
      onEdit(duty);
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    }, 600);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-[#F8FAFC]">
      {/* Confirmation Dialog Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
              🗑️
            </div>
            <h3 className="text-center font-bold text-slate-800 text-lg mb-2">Delete Record?</h3>
            <p className="text-center text-slate-500 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete this record? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-500 bg-slate-100 active:scale-95 transition-transform"
              >
                No
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 active:scale-95 transition-transform shadow-lg shadow-red-500/30"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reverted Header Section: 90% width card */}
      <div className="mx-auto w-[90%] mt-6 bg-[#1D61E7] text-white p-5 pb-4 rounded-[2rem] relative shadow-xl shadow-blue-500/20">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-1.5 bg-white/10 px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/90">Ready for Duty</span>
          </div>
          <button className="bg-white/10 p-2 rounded-xl" onClick={onSearch}>
             <span className="text-sm">🔍</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full border-2 border-white/30 overflow-hidden shadow-lg bg-slate-200 flex-shrink-0">
            {profile.photo ? (
              <img src={profile.photo} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-black text-slate-400">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <h1 className="text-base font-bold truncate leading-tight">{profile.name}</h1>
            <p className="text-white/70 text-xs font-medium truncate">{profile.designation}</p>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-1">ID: {profile.crewId}</p>
          </div>
        </div>
      </div>

      {/* Action Cards (Dedicated row below header) */}
      <div className="px-6 mt-8 grid grid-cols-2 gap-4">
        <button 
          onClick={onAdd}
          className="app-card p-6 flex flex-col items-center justify-center text-center hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
             <span className="text-[#1D61E7] text-2xl">➕</span>
          </div>
          <p className="font-bold text-slate-800">Log New Duty</p>
          <p className="text-[10px] text-slate-400 font-medium">Start shift entry</p>
        </button>
        <button 
          onClick={onSearch}
          className="app-card p-6 flex flex-col items-center justify-center text-center hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
             <span className="text-slate-600 text-2xl">🔍</span>
          </div>
          <p className="font-bold text-slate-800">Search Logs</p>
          <p className="text-[10px] text-slate-400 font-medium">View history</p>
        </button>
      </div>

      {/* Cloud Backup Section */}
      <div className="px-6 mt-6">
        <div className="app-card p-4 flex items-center justify-between border border-blue-50 bg-white/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 via-green-400 to-yellow-400 flex items-center justify-center p-[2px]">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <span className="text-lg">☁️</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Backup Vault</p>
              <p className="font-bold text-slate-700 text-sm">Upload to Drive</p>
            </div>
          </div>
          <button 
            onClick={onUploadToDrive}
            className="bg-[#1D61E7] text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all shadow-md shadow-blue-500/20"
          >
            Upload
          </button>
        </div>
      </div>

      {/* Recent Duties List */}
      <div className="px-6 mt-8 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-slate-800 text-lg">Recent Duties</h2>
          <button onClick={onSearch} className="text-[#1D61E7] text-xs font-bold">View All</button>
        </div>
        
        {duties.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold italic">No logs yet.</p>
          </div>
        ) : (
          <div className="space-y-4 pb-10">
            {duties.slice(0, 5).map(duty => (
              <div 
                key={duty.id} 
                className="bg-white rounded-[1.5rem] p-5 relative overflow-hidden active:bg-slate-50 transition-colors border border-slate-50 shadow-sm"
                onTouchStart={() => handleTouchStart(duty)}
                onTouchEnd={handleTouchEnd}
                onMouseDown={() => handleTouchStart(duty)}
                onMouseUp={handleTouchEnd}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-tighter">
                      {new Date(duty.timestamp).toLocaleDateString('en-GB', { weekday: 'long' })}
                    </p>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{duty.date}</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${duty.type === 'Working' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    {duty.type.toUpperCase()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Train No.</p>
                    <p className="font-black text-slate-700">{duty.trainNumber || 'N/A'}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Section</p>
                    <p className="font-black text-slate-700 truncate max-w-[120px]">{duty.section || '---'}</p>
                  </div>
                  
                  <div className="ml-4 flex items-center space-x-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(duty); }} 
                      className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl text-slate-400 hover:text-[#1D61E7] transition-colors active:bg-blue-100 shadow-sm"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowConfirm(duty.id); }} 
                      className="w-10 h-10 bg-red-50 flex items-center justify-center rounded-xl text-red-300 hover:text-red-500 transition-colors active:bg-red-100 shadow-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
