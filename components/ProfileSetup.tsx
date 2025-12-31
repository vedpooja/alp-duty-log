
import React, { useState } from 'react';
import { UserProfile, Designation } from '../types';

interface Props {
  onSave: (profile: UserProfile) => void;
  onCancel?: () => void;
  initialProfile?: UserProfile;
}

const Input = ({ label, icon, placeholder, value, onChange, type = "text" }: any) => (
  <div className="mb-4">
    <p className="text-sm font-bold text-slate-700 mb-1.5">{label}</p>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      <input 
        type={type}
        placeholder={placeholder}
        className="input-field pl-11"
        value={value}
        onChange={e => onChange(e.target.value)}
        required
      />
    </div>
  </div>
);

const ProfileSetup: React.FC<Props> = ({ onSave, onCancel, initialProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(initialProfile || {
    name: '',
    crewId: '',
    designation: Designation.ALP,
    mobile: '',
    email: '',
    photo: ''
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-xl font-extrabold text-slate-800">Profile Setup</h1>
          <p className="text-slate-500 text-sm mt-1">Enter your details to start logging duties locally.</p>
        </div>

        <div className="flex flex-col items-center mb-10">
          <div className="w-32 h-32 rounded-full border-4 border-[#F8FAFC] shadow-xl overflow-hidden relative group bg-slate-100">
            {formData.photo ? (
              <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">👤</div>
            )}
            <label className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
               <span className="text-white text-2xl">📸</span>
               <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#1D61E7] rounded-full flex items-center justify-center border-2 border-white text-xs">
              📸
            </div>
          </div>
          <button className="mt-3 text-[#1D61E7] text-xs font-bold uppercase tracking-widest">Change Photo</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <Input label="Full Name" placeholder="Ex. Rajesh Kumar" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
          <Input label="Crew ID" placeholder="EX. 12345" value={formData.crewId} onChange={(v: string) => setFormData({...formData, crewId: v})} />
          
          <div className="mb-4">
            <p className="text-sm font-bold text-slate-700 mb-1.5">Designation</p>
            <div className="relative">
              <select 
                className="input-field appearance-none bg-white pr-10"
                value={formData.designation}
                onChange={e => setFormData({...formData, designation: e.target.value as Designation})}
              >
                {Object.values(Designation).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          <Input label="Mobile Number" type="tel" icon="📞" placeholder="98765 43210" value={formData.mobile} onChange={(v: string) => setFormData({...formData, mobile: v})} />
          <Input label="Email ID" type="email" icon="✉️" placeholder="name@example.com" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} />

          <p className="text-[10px] text-slate-400 font-medium italic mt-4">* All fields are mandatory for duty logging.</p>
        </form>
      </div>

      <div className="p-4 bg-white border-t sticky bottom-0 z-50">
        <button 
          onClick={() => handleSubmit()} 
          className="primary-button w-full p-4 flex items-center justify-center space-x-2 shadow-xl shadow-blue-500/20"
        >
          <span>Save & Continue</span>
          <span>➜</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;
