
import React, { useState, useEffect } from 'react';
import { DutyRecord, DutyType } from '../types';

interface Props {
  onSave: (record: DutyRecord) => void;
  onBack: () => void;
  initialData?: DutyRecord;
}

const Accordion = ({ id, title, children, activeAccordion, onToggle, icon }: any) => (
  <div className="bg-white rounded-2xl mb-4 border border-slate-100 overflow-hidden shadow-sm">
    <button 
      type="button"
      onClick={() => onToggle(id)}
      className="w-full flex items-center p-4 text-left"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${activeAccordion === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-400'}`}>
        <span className="text-sm">{icon || id}</span>
      </div>
      <span className="flex-1 font-bold text-slate-700">{title}</span>
      <span className={`transform transition-transform duration-200 ${activeAccordion === id ? 'rotate-180' : ''}`}>▼</span>
    </button>
    {activeAccordion === id && (
      <div className="p-4 pt-0 space-y-4 border-t border-slate-50 animate-in slide-in-from-top-2 duration-200">
        {children}
      </div>
    )}
  </div>
);

const Input = ({ label, placeholder, type = "text", value, onChange, className = "" }: any) => (
  <div className={className}>
    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1 tracking-wider">{label}</p>
    <input 
      type={type}
      className="input-field bg-[#F8FAFC] text-sm font-semibold text-slate-700"
      placeholder={placeholder}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

const Select = ({ label, options, value, onChange, className = "" }: any) => (
  <div className={className}>
    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1 tracking-wider">{label}</p>
    <select 
      className="input-field bg-[#F8FAFC] appearance-none text-sm font-semibold text-slate-700"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">Select...</option>
      {options.map((opt: any) => (
        <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
      ))}
    </select>
  </div>
);

const ToggleSection = ({ label, okValue, remarkValue, onOkChange, onRemarkChange }: any) => (
  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <div className="flex bg-white rounded-lg p-1 border border-slate-100 shadow-sm">
        <button 
          type="button"
          onClick={() => onOkChange(true)}
          className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${okValue ? 'bg-green-500 text-white shadow-sm' : 'text-slate-400'}`}
        >
          OK
        </button>
        <button 
          type="button"
          onClick={() => onOkChange(false)}
          className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${okValue === false ? 'bg-red-500 text-white shadow-sm' : 'text-slate-400'}`}
        >
          NOT OK
        </button>
      </div>
    </div>
    <input 
      type="text"
      placeholder="Remark (optional)"
      className="w-full bg-white border border-slate-100 rounded-lg p-2 text-[11px] outline-none focus:border-blue-300"
      value={remarkValue || ''}
      onChange={e => onRemarkChange(e.target.value)}
    />
  </div>
);

const CheckboxRemark = ({ label, checked, onCheckedChange, remarkValue, onRemarkChange }: any) => (
  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <input 
        type="checkbox" 
        className="w-5 h-5 rounded border-slate-300 accent-blue-600"
        checked={!!checked}
        onChange={e => onCheckedChange(e.target.checked)}
      />
    </div>
    <input 
      type="text"
      placeholder="Remark if needed"
      className="w-full bg-white border border-slate-100 rounded-lg p-2 text-[11px] outline-none focus:border-blue-300"
      value={remarkValue || ''}
      onChange={e => onRemarkChange(e.target.value)}
    />
  </div>
);

const WorkingDutyForm: React.FC<Props> = ({ onSave, onBack, initialData }) => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('A');
  const [formData, setFormData] = useState<Partial<DutyRecord>>(initialData || {
    id: crypto.randomUUID(),
    type: DutyType.WORKING,
    timestamp: Date.now(),
    date: new Date().toISOString().split('T')[0],
  });

  // Load previous duty data for suggestions if new form
  useEffect(() => {
    if (!initialData) {
      const savedDuties = localStorage.getItem('alp_duties');
      if (savedDuties) {
        const duties: DutyRecord[] = JSON.parse(savedDuties);
        const lastWorking = duties.find(d => d.type === DutyType.WORKING);
        if (lastWorking) {
          // Auto-suggest fields that tend to stay the same
          setFormData(prev => ({
            ...prev,
            pilotName: lastWorking.pilotName,
            pilotId: lastWorking.pilotId,
            guardName: lastWorking.guardName,
            guardId: lastWorking.guardId,
            bpcNo: lastWorking.bpcNo,
            issuedBy: lastWorking.issuedBy,
            issuedDate: lastWorking.issuedDate,
            validUptoDate: lastWorking.validUptoDate,
            fsdNo: lastWorking.fsdNo,
            detonatorExpiry: lastWorking.detonatorExpiry,
          }));
        }
      }
    }
  }, [initialData]);

  // HSD Consumption Auto-Calculate
  useEffect(() => {
    const received = Number(formData.hsdReceived) || 0;
    const balance = Number(formData.hsdBalance) || 0;
    const consumption = received - balance;
    if (formData.hsdConsumption !== consumption) {
      setFormData(prev => ({ ...prev, hsdConsumption: consumption }));
    }
  }, [formData.hsdReceived, formData.hsdBalance]);

  const toggleAccordion = (key: string) => setActiveAccordion(activeAccordion === key ? null : key);

  const range = (n: number) => Array.from({ length: n }, (_, i) => (i + 1).toString());

  const handleSave = () => {
    onSave(formData as DutyRecord);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      <div className="mx-auto w-[90%] my-3 p-3.5 pb-2.5 flex items-center justify-between bg-white border border-slate-100 rounded-2xl sticky top-2 z-50 shadow-lg shadow-slate-200/50">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50">←</button>
        <h1 className="font-bold text-slate-800 text-sm">Working Duty Log</h1>
        <button 
          onClick={handleSave} 
          className="bg-blue-600 text-white px-4 py-1.5 rounded-xl font-bold text-[10px] shadow-md shadow-blue-200"
        >
          Save
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        {/* SECTION A: Duty Details */}
        <Accordion id="A" title="Duty Details" icon="📍" activeAccordion={activeAccordion} onToggle={toggleAccordion}>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date" type="date" value={formData.date} onChange={(v: string) => setFormData({...formData, date: v})} />
            <Input label="Loco Number" placeholder="30245" value={formData.locoNumber} onChange={(v: string) => setFormData({...formData, locoNumber: v})} />
            <Input label="Schedule Done" type="date" value={formData.issuedDate} onChange={(v: string) => setFormData({...formData, issuedDate: v})} />
            <Input label="Schedule Due" type="date" value={formData.validUptoDate} onChange={(v: string) => setFormData({...formData, validUptoDate: v})} />
            <Input label="Train Number" placeholder="12904" value={formData.trainNumber} onChange={(v: string) => setFormData({...formData, trainNumber: v})} />
            <Input label="Loco Class" placeholder="WAP-7" value={formData.locoClass} onChange={(v: string) => setFormData({...formData, locoClass: v})} />
            <Input label="Shed" placeholder="GZB" value={formData.shed} onChange={(v: string) => setFormData({...formData, shed: v})} />
            <Select label="Hood" options={['SH', 'LH','CAB1','CAB2']} value={formData.hood} onChange={(v: string) => setFormData({...formData, hood: v as any})} />
          </div>
          <Input label="Section" placeholder="e.g. NDLS - BCT" value={formData.section} onChange={(v: string) => setFormData({...formData, section: v})} />
        </Accordion>

        {/* SECTION B: Time Details */}
        <Accordion id="B" title="Time Details" icon="⏰" activeAccordion={activeAccordion} onToggle={toggleAccordion}>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Call Time" type="time" value={formData.callTime} onChange={(v: string) => setFormData({...formData, callTime: v})} />
            <Input label="Sign ON" type="time" value={formData.signOnTime} onChange={(v: string) => setFormData({...formData, signOnTime: v})} />
          </div>
          <Input label="Departure (Date & Time)" type="datetime-local" value={formData.departureTime} onChange={(v: string) => setFormData({...formData, departureTime: v})} />
          <Input label="Arrival (Date & Time)" type="datetime-local" value={formData.arrivalTime} onChange={(v: string) => setFormData({...formData, arrivalTime: v})} />
          <Input label="Sign OFF" type="time" value={formData.signOffTime} onChange={(v: string) => setFormData({...formData, signOffTime: v})} />
        </Accordion>

        {/* SECTION C: Crew Details */}
        <Accordion id="C" title="Crew Details" icon="👥" activeAccordion={activeAccordion} onToggle={toggleAccordion}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Pilot Name" placeholder="Name" value={formData.pilotName} onChange={(v: string) => setFormData({...formData, pilotName: v})} />
              <Input label="Crew ID" placeholder="ID" value={formData.pilotId} onChange={(v: string) => setFormData({...formData, pilotId: v})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Guard Name" placeholder="Name" value={formData.guardName} onChange={(v: string) => setFormData({...formData, guardName: v})} />
              <Input label="Crew ID" placeholder="ID" value={formData.guardId} onChange={(v: string) => setFormData({...formData, guardId: v})} />
            </div>
          </div>
        </Accordion>

        {/* SECTION D: Certificates */}
        <Accordion id="D" title="Certificates" icon="📜" activeAccordion={activeAccordion} onToggle={toggleAccordion}>
          <div className="grid grid-cols-2 gap-3">
            <Input label="BPC NO." value={formData.bpcNo} onChange={(v: string) => setFormData({...formData, bpcNo: v})} />
            <Input label="ISSUED BY" value={formData.issuedBy} onChange={(v: string) => setFormData({...formData, issuedBy: v})} />
            <Input label="ISSUED DATE" type="date" value={formData.issuedDate} onChange={(v: string) => setFormData({...formData, issuedDate: v})} />
            <Input label="VALID UPTO" type="date" value={formData.validUptoDate} onChange={(v: string) => setFormData({...formData, validUptoDate: v})} />
            <Input label="FSD NO." value={formData.fsdNo} onChange={(v: string) => setFormData({...formData, fsdNo: v})} />
            <Input label="Detonator Expiry" placeholder="MM/YY" value={formData.detonatorExpiry} onChange={(v: string) => setFormData({...formData, detonatorExpiry: v})} />
          </div>
          <Select label="BPC Type" options={['Intensive End-to-End', 'Premium BPC','Close Circuit (CC)','Material Train BPC']} value={formData.BPCType} onChange={(v: string) => setFormData({...formData, BPCType: v as any})} />
        </Accordion>

        {/* SECTION E: Oil Particulars */}
        <Accordion id="E" title="Oil Particulars" icon="🛢️" activeAccordion={activeAccordion} onToggle={toggleAccordion}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Input label="HSD Received" type="number" value={formData.hsdReceived} onChange={(v: string) => setFormData({...formData, hsdReceived: Number(v)})} />
            <Input label="HSD Balance" type="number" value={formData.hsdBalance} onChange={(v: string) => setFormData({...formData, hsdBalance: Number(v)})} />
          </div>
          <div className="bg-blue-50 p-3 rounded-xl flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-blue-600 uppercase">Auto Consumption:</span>
            <span className="font-black text-blue-800 text-lg">{formData.hsdConsumption || 0} Ltr</span>
          </div>
          <div className="space-y-3">
            <ToggleSection label="Engine (Lube Oil)" okValue={formData.engineOilOk} remarkValue={formData.engineOilRemark} onOkChange={(v: boolean) => setFormData({...formData, engineOilOk: v})} onRemarkChange={(v: string) => setFormData({...formData, engineOilRemark: v})} />
            <ToggleSection label="Governor Oil" okValue={formData.governorOilOk} remarkValue={formData.governorOilRemark} onOkChange={(v: boolean) => setFormData({...formData, governorOilOk: v})} onRemarkChange={(v: string) => setFormData({...formData, governorOilRemark: v})} />
            <ToggleSection label="Compressor Oil" okValue={formData.compressorOilOk} remarkValue={formData.compressorOilRemark} onOkChange={(v: boolean) => setFormData({...formData, compressorOilOk: v})} onRemarkChange={(v: string) => setFormData({...formData, compressorOilRemark: v})} />
          </div>
        </Accordion>

        {/* SECTION F: Light Particulars */}
        <Accordion id="F" title="Light Particulars" icon="💡" activeAccordion={activeAccordion} onToggle={toggleAccordion}>
          <div className="space-y-3">
            <ToggleSection label="Head Light" okValue={formData.headLightOk} remarkValue={formData.headLightRemark} onOkChange={(v: boolean) => setFormData({...formData, headLightOk: v})} onRemarkChange={(v: string) => setFormData({...formData, headLightRemark: v})} />
            <ToggleSection label="Marker Light" okValue={formData.markerLightOk} remarkValue={formData.markerLightRemark} onOkChange={(v: boolean) => setFormData({...formData, markerLightOk: v})} onRemarkChange={(v: string) => setFormData({...formData, markerLightRemark: v})} />
            <ToggleSection label="Flasher Light" okValue={formData.flasherLightOk} remarkValue={formData.flasherLightRemark} onOkChange={(v: boolean) => setFormData({...formData, flasherLightOk: v})} onRemarkChange={(v: string) => setFormData({...formData, flasherLightRemark: v})} />
            <ToggleSection label="Guage Light" okValue={formData.GuageLightOk} remarkValue={formData.GuageLightRemark} onOkChange={(v: boolean) => setFormData({...formData, GuageLightOk: v})} onRemarkChange={(v: string) => setFormData({...formData, GuageLightRemark: v})} />
          </div>
        </Accordion>

        {/* SECTION G: Control Panel / Safety */}
        <Accordion id="G" title="Control Panel & Safety" icon="🛡️" activeAccordion={activeAccordion} onToggle={toggleAccordion}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Select label="Fire Ext. Count" options={range(10)} value={formData.fireExtinguisherCount} onChange={(v: string) => setFormData({...formData, fireExtinguisherCount: v})} />
            <Input label="Fire Expiry" type="date" value={formData.fireExpiryDate} onChange={(v: string) => setFormData({...formData, fireExpiryDate: v})} />
          </div>
          <div className="space-y-3">
            <CheckboxRemark label="VCD Working?" checked={formData.vcdWorking} onCheckedChange={(v: boolean) => setFormData({...formData, vcdWorking: v})} remarkValue={formData.vcdRemark} onRemarkChange={(v: string) => setFormData({...formData, vcdRemark: v})} />
            <CheckboxRemark label="PCP Available?" checked={formData.pcpAvailable} onCheckedChange={(v: boolean) => setFormData({...formData, pcpAvailable: v})} remarkValue={formData.pcpRemark} onRemarkChange={(v: string) => setFormData({...formData, pcpRemark: v})} />
            <div className="grid grid-cols-2 gap-3">
               <CheckboxRemark label="U Clamp Avail?" checked={formData.uClampAvailable} onCheckedChange={(v: boolean) => setFormData({...formData, uClampAvailable: v})} />
               <Select label="U Clamp Count" options={range(4)} value={formData.uClampCount} onChange={(v: string) => setFormData({...formData, uClampCount: v})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select label="BP" options={range(5)} value={formData.bpCount} onChange={(v: string) => setFormData({...formData, bpCount: v})} />
              <Select label="FP" options={range(5)} value={formData.fpCount} onChange={(v: string) => setFormData({...formData, fpCount: v})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="WT No." value={formData.wtNo} onChange={(v: string) => setFormData({...formData, wtNo: v})} />
              <Select label="Wooden Wedges" options={range(10)} value={formData.woodenWedgesCount} onChange={(v: string) => setFormData({...formData, woodenWedgesCount: v})} />
            </div>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-600">Repair Book</span>
                <input type="checkbox" className="w-4 h-4 accent-blue-600" checked={!!formData.repairBookAvailable} onChange={e => setFormData({...formData, repairBookAvailable: e.target.checked})} />
              </label>
              <label className="flex-1 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-600">Trip Card</span>
                <input type="checkbox" className="w-4 h-4 accent-blue-600" checked={!!formData.tripCardAvailable} onChange={e => setFormData({...formData, tripCardAvailable: e.target.checked})} />
              </label>
            </div>
          </div>
        </Accordion>

        {/* SECTION H: Machine Room & Energy */}
        <Accordion id="H" title="Machine Room & Energy" icon="⚡" activeAccordion={activeAccordion} onToggle={toggleAccordion}>
          <div className="space-y-3">
            <ToggleSection label="CP1, CP2, CP3, CPA" okValue={formData.cpOk} remarkValue={formData.cpRemark} onOkChange={(v: boolean) => setFormData({...formData, cpOk: v})} onRemarkChange={(v: string) => setFormData({...formData, cpRemark: v})} />
            <ToggleSection label="SR1, SR2, GR, TF" okValue={formData.srOk} remarkValue={formData.srRemark} onOkChange={(v: boolean) => setFormData({...formData, srOk: v})} onRemarkChange={(v: string) => setFormData({...formData, srRemark: v})} />
            <ToggleSection label="TFO1, TFO2" okValue={formData.tfoOk} remarkValue={formData.tfoRemark} onOkChange={(v: boolean) => setFormData({...formData, tfoOk: v})} onRemarkChange={(v: string) => setFormData({...formData, tfoRemark: v})} />
            
            <div className="grid grid-cols-2 gap-3">
              <Input label="T/E C" value={formData.teC} onChange={(v: string) => setFormData({...formData, teC: v})} />
              <Input label="T/E R" value={formData.teR} onChange={(v: string) => setFormData({...formData, teR: v})} />
              <Input label="M/E C" value={formData.meC} onChange={(v: string) => setFormData({...formData, meC: v})} />
              <Input label="M/E R" value={formData.meR} onChange={(v: string) => setFormData({...formData, meR: v})} />
              <Input label="CON" value={formData.con} onChange={(v: string) => setFormData({...formData, con: v})} />
              <Input label="HOG 1" value={formData.hog1} onChange={(v: string) => setFormData({...formData, hog1: v})} />
              <Input label="HOG 2" value={formData.hog2} onChange={(v: string) => setFormData({...formData, hog2: v})} />
              <Input label="T/C" value={formData.tcReading} onChange={(v: string) => setFormData({...formData, tcReading: v})} />
              <Input label="M/C" value={formData.mcReading} onChange={(v: string) => setFormData({...formData, mcReading: v})} className="col-span-2" />
            </div>
          </div>
        </Accordion>

        <div className="mt-6 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-10">
          <p className="font-bold text-slate-800 mb-2 flex items-center">
             <span className="mr-2 text-lg">📝</span> General Remark Area
          </p>
          <p className="text-[10px] text-slate-400 font-bold mb-2">MAX 500 WORDS</p>
          <textarea 
            className="input-field min-h-[150px] resize-none text-sm font-medium" 
            placeholder="Add any additional notes here..."
            value={formData.remarks}
            onChange={e => setFormData({...formData, remarks: e.target.value})}
          ></textarea>
        </div>
      </div>

      <div className="p-4 bg-white border-t sticky bottom-0 z-50">
        <button 
          onClick={handleSave}
          className="primary-button w-full p-4 flex items-center justify-center space-x-3 shadow-xl shadow-blue-500/30"
        >
          <span className="text-xl">✅</span>
          <span>Submit Complete Log</span>
        </button>
      </div>
    </div>
  );
};

export default WorkingDutyForm;
