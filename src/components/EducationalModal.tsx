'use client';

import React from 'react';
import { BookOpen, Check, HelpCircle, Shield, X, Zap } from 'lucide-react';

interface EducationalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EducationalModal({ isOpen, onClose }: EducationalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto glass-panel rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              Markov Zincirleri ve Kantitatif Finans Rehberi
            </h2>
            <p className="text-xs text-slate-400">
              Piyasa Rejimleri, Olasılıksal Geçiş Matrisleri ve Matematiksel Modeller
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-cyan-300 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              1. Markov Mülkiyeti (Memoryless Property) Nedir?
            </h3>
            <p>
              Bir Markov süreci, gelecekteki durumun (X_t+1) yalnızca mevcut duruma (X_t) bağlı olduğunu,
              geçmişteki tüm durumlardan bağımsız olduğunu varsayar:
            </p>
            <div className="my-2 p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 border border-slate-800">
              P(X_t+1 = j | X_t = i, X_t-1 = i_t-1, ..., X_0 = i_0) = P(X_t+1 = j | X_t = i) = P_ij
            </div>
            <p>
              Finansal piyasalarda bu yaklaşım; hissenin 20 günlük hareketli getirilerine göre <strong>Boğa (Bull)</strong>,
              <strong>Ayı (Bear)</strong> veya <strong>Yatay (Sideways)</strong> rejimlerinde bulunma olasılıklarını modeller.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-emerald-300 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              2. Durağan Dağılım (Stationary Distribution) &pi;
            </h3>
            <p>
              Uzun vadede hissenin hangi rejimde ne kadar süre kalacağını gösteren denge vektörüdür:
            </p>
            <div className="my-2 p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-emerald-300 border border-slate-800">
              &pi; &times; P = &pi; &nbsp; ve &nbsp; &sum; &pi;_i = 1.0
            </div>
            <p>
              Örneğin THYAO için Boğa durağan dağılımı <strong>%50.44</strong> ise, hisse senedi tarihsel olarak zamanının
              yaklaşık yarısını yükseliş trendinde geçirmektedir.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-amber-300 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              3. 1.5 &times; ATR Volatiliteye Dayalı Stop-Loss
            </h3>
            <p>
              Sabit yüzde stopları piyasa gürültüsünde erken stoplanmaya yol açabilir. Bu nedenle sistemimiz, son 14 günlük
              <strong>Average True Range (ATR)</strong> değerini kullanarak dinamik bir güvenlik tamponu hesaplar:
            </p>
            <div className="my-2 p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-amber-300 border border-slate-800">
              Long Stop = Giriş Fiyatı - (1.5 &times; ATR_14)
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg cursor-pointer"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
