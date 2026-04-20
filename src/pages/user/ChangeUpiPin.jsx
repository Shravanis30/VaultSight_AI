import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const ChangeUpiPin = () => {
  const { fetchProfile } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState('input'); // input, processing, success
  const [formData, setFormData] = useState({
    oldPin: '',
    newPin: '',
    confirmPin: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.newPin.length !== 6) {
      setError('New PIN must be 6 digits.');
      return;
    }
    if (formData.newPin !== formData.confirmPin) {
      setError('New PIN and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/user/update-pin', {
        oldPin: formData.oldPin,
        newPin: formData.newPin
      });
      setStep('success');
      await fetchProfile();
    } catch (err) {
      setError(err.message || 'Verification failed. Incorrect old PIN.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-500 bg-white shadow-2xl rounded-lg border border-slate-100 max-w-2xl mx-auto mt-20">
        <div className="mb-10 p-10 bg-success/10 rounded-lg border-4 border-white shadow-2xl">
           <CheckCircle2 className="text-success" size={80} />
        </div>
        <h2 className="text-4xl font-black text-navy-900 mb-4 italic uppercase tracking-tighter">PIN Synchronized</h2>
        <p className="font-bold text-slate-500 mb-14 max-w-md">
           Your neural access key has been updated successfully.
        </p>
        <button 
           onClick={() => navigate('/user/card')}
           className="px-16 py-6 bg-navy-900 text-white rounded-lg font-black text-xs uppercase tracking-[0.3em] italic active:scale-95 transition-all shadow-2xl hover:bg-electric"
        >
          Return to Operations
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-6 space-y-12 animate-in slide-in-from-bottom-10 duration-700">
      <div className="flex items-center gap-6">
        <button onClick={() => navigate(-1)} className="p-4 bg-white rounded-lg text-navy-900 shadow-sm border border-slate-200 hover:bg-slate-50 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-navy-900 uppercase tracking-tighter italic">Key Rotation</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">UPI PIN Internal Management</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-lg border border-slate-200 shadow-xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10 pointer-events-none">
            <Lock size={120} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {error && (
            <div className="p-4 bg-danger/5 border border-danger/10 rounded-lg text-danger text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
                <AlertCircle size={18} />
                {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Validate Current Vector (Old PIN)</label>
              <input 
                required
                type="password"
                maxLength={6}
                placeholder="......"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:border-electric focus:ring-8 focus:ring-electric/5 outline-none font-black text-2xl tracking-[0.8em] transition-all"
                value={formData.oldPin}
                onChange={(e) => setFormData({...formData, oldPin: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Initialize New Key (New PIN)</label>
              <input 
                required
                type="password"
                maxLength={6}
                placeholder="......"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:border-electric focus:ring-8 focus:ring-electric/5 outline-none font-black text-2xl tracking-[0.8em] transition-all"
                value={formData.newPin}
                onChange={(e) => setFormData({...formData, newPin: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Confirm Synchronization</label>
              <input 
                required
                type="password"
                maxLength={6}
                placeholder="......"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:border-electric focus:ring-8 focus:ring-electric/5 outline-none font-black text-2xl tracking-[0.8em] transition-all"
                value={formData.confirmPin}
                onChange={(e) => setFormData({...formData, confirmPin: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={loading || formData.newPin.length < 4}
            type="submit"
            className="w-full py-6 bg-navy-900 text-white rounded-lg font-black italic text-sm uppercase tracking-widest hover:bg-electric transition-all shadow-2xl shadow-navy-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
            Commit Key Rotation
          </button>
        </form>
      </div>

      <div className="p-8 bg-slate-50 border border-slate-200 rounded-lg">
         <div className="flex gap-4">
            <div className="p-3 bg-white rounded-lg text-electric shadow-sm">
                <ShieldCheck size={20} />
            </div>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                Changing your PIN clears all cached session vectors. Ensure you have your mobile device for future 2FA challenges.
            </p>
         </div>
      </div>
    </div>
  );
};

export default ChangeUpiPin;
