import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setAuth(data.user, data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#151619] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00FF00]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#00FF00] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,255,0,0.4)]">
            <Lock size={32} className="text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Prijava na sistem</h1>
          <p className="text-gray-400 mt-2">Pristupite BTOMS platformi</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email adresa</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00FF00] focus:ring-1 focus:ring-[#00FF00] transition-all"
                placeholder="admin@enterprise.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Lozinka</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00FF00] focus:ring-1 focus:ring-[#00FF00] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center font-medium bg-red-400/10 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#00FF00] hover:bg-[#00DD00] text-black font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-[0_0_20px_rgba(0,255,0,0.2)] active:scale-[0.98]"
          >
            {loading ? 'Autentifikacija...' : (
              <>
                <span>Prijavi se</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-gray-500">
            Zaboravili ste podatke? Kontaktirajte administratora sistema.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
