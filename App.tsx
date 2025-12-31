
import React, { useState, useEffect } from 'react';
import { UserProfile, DutyRecord, DutyType } from './types';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import DutyTypeSelector from './components/DutyTypeSelector';
import WorkingDutyForm from './components/WorkingDutyForm';
import SpareDutyForm from './components/SpareDutyForm';
import PeriodicRestForm from './components/PeriodicRestForm';
import LeaveForm from './components/LeaveForm';
import SearchDuty from './components/SearchDuty';
import ExportLogs from './components/ExportLogs';
import { exportToExcel } from './services/excelExport';

type Screen = 'PROFILE' | 'DASHBOARD' | 'REPORTS' | 'SELECT_TYPE' | 'ADD_WORKING' | 'ADD_SPARE' | 'ADD_PR' | 'ADD_LEAVE' | 'SEARCH';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [duties, setDuties] = useState<DutyRecord[]>([]);
  const [activeScreen, setActiveScreen] = useState<Screen>('DASHBOARD');
  const [editingDuty, setEditingDuty] = useState<DutyRecord | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('alp_profile');
    const savedDuties = localStorage.getItem('alp_duties');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedDuties) setDuties(JSON.parse(savedDuties));
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (profile) localStorage.setItem('alp_profile', JSON.stringify(profile));
      localStorage.setItem('alp_duties', JSON.stringify(duties));
    }
  }, [profile, duties, isInitialized]);

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeScreen]);

  const handleProfileSave = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setActiveScreen('DASHBOARD');
  };

  const handleDutySave = (record: DutyRecord) => {
    setDuties(prev => {
      const exists = prev.find(d => d.id === record.id);
      if (exists) return prev.map(d => d.id === record.id ? record : d);
      return [record, ...prev];
    });
    setEditingDuty(null);
    setActiveScreen('DASHBOARD');
  };

  const handleDeleteDuty = (id: string) => {
    setDuties(prev => prev.filter(d => d.id !== id));
  };

  const handleEditDuty = (record: DutyRecord) => {
    setEditingDuty(record);
    if (record.type === DutyType.WORKING) setActiveScreen('ADD_WORKING');
    else if (record.type === DutyType.SPARE) setActiveScreen('ADD_SPARE');
    else if (record.type === DutyType.PERIODIC_REST) setActiveScreen('ADD_PR');
    else if (record.type === DutyType.LEAVE) setActiveScreen('ADD_LEAVE');
  };

  const handleUploadToDrive = async () => {
    if (duties.length === 0) {
      alert("No records found to backup. Please add some duties first.");
      return;
    }
    await exportToExcel(duties, 'share');
  };

  if (!isInitialized) return null;
  if (!profile && activeScreen !== 'PROFILE') return <ProfileSetup onSave={handleProfileSave} />;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] pb-20">
      {activeScreen === 'DASHBOARD' && profile && (
        <Dashboard 
          profile={profile} 
          duties={duties} 
          onAdd={() => { setEditingDuty(null); setActiveScreen('SELECT_TYPE'); }} 
          onSearch={() => setActiveScreen('SEARCH')}
          onEdit={handleEditDuty}
          onDelete={handleDeleteDuty}
          onUploadToDrive={handleUploadToDrive}
        />
      )}
      
      {activeScreen === 'REPORTS' && (
        <ExportLogs duties={duties} onBack={() => setActiveScreen('DASHBOARD')} />
      )}

      {activeScreen === 'PROFILE' && (
        <ProfileSetup 
          onSave={handleProfileSave} 
          initialProfile={profile || undefined} 
          onCancel={() => setActiveScreen('DASHBOARD')}
        />
      )}

      {activeScreen === 'SELECT_TYPE' && (
        <DutyTypeSelector 
          onSelect={(type) => {
            setEditingDuty(null);
            if (type === DutyType.WORKING) setActiveScreen('ADD_WORKING');
            else if (type === DutyType.SPARE) setActiveScreen('ADD_SPARE');
            else if (type === DutyType.PERIODIC_REST) setActiveScreen('ADD_PR');
            else if (type === DutyType.LEAVE) setActiveScreen('ADD_LEAVE');
          }}
          onBack={() => setActiveScreen('DASHBOARD')}
        />
      )}

      {activeScreen === 'ADD_WORKING' && <WorkingDutyForm initialData={editingDuty || undefined} onSave={handleDutySave} onBack={() => setActiveScreen('DASHBOARD')} />}
      {activeScreen === 'ADD_SPARE' && <SpareDutyForm initialData={editingDuty || undefined} onSave={handleDutySave} onBack={() => setActiveScreen('DASHBOARD')} />}
      {activeScreen === 'ADD_PR' && <PeriodicRestForm initialData={editingDuty || undefined} onSave={handleDutySave} onBack={() => setActiveScreen('DASHBOARD')} />}
      {activeScreen === 'ADD_LEAVE' && <LeaveForm initialData={editingDuty || undefined} onSave={handleDutySave} onBack={() => setActiveScreen('DASHBOARD')} />}
      {activeScreen === 'SEARCH' && <SearchDuty duties={duties} onBack={() => setActiveScreen('DASHBOARD')} onEdit={handleEditDuty} />}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-3 z-50 max-w-[450px] mx-auto shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveScreen('DASHBOARD')} className={`flex flex-col items-center transition-all ${activeScreen === 'DASHBOARD' ? 'text-[#1D61E7] scale-110' : 'text-slate-400'}`}>
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-bold mt-1">Home</span>
        </button>
        <button onClick={() => setActiveScreen('REPORTS')} className={`flex flex-col items-center transition-all ${activeScreen === 'REPORTS' ? 'text-[#1D61E7] scale-110' : 'text-slate-400'}`}>
          <span className="text-xl">📄</span>
          <span className="text-[10px] font-bold mt-1">Reports</span>
        </button>
        <button onClick={() => setActiveScreen('PROFILE')} className={`flex flex-col items-center transition-all ${activeScreen === 'PROFILE' ? 'text-[#1D61E7] scale-110' : 'text-slate-400'}`}>
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] font-bold mt-1">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default App;
