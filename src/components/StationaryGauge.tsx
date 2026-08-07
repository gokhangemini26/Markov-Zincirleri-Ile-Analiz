'use client';

import React from 'react';
import { StationaryDistribution, ForwardProjection } from '@/types/markov';
import { Compass, FastForward, PieChart, Sparkles } from 'lucide-react';

interface StationaryGaugeProps {
  stationary: StationaryDistribution;
  forwardProjections: ForwardProjection[];
}

export default function StationaryGauge({ stationary, forwardProjections }: StationaryGaugeProps) {
  const bearPct = stationary.bear * 100;
  const sidePct = stationary.sideways * 100;
  const bullPct = stationary.bull * 100;

  return (
    <div className="w-full glass-panel rounded-2xl p-5 md:p-6 shadow-2xl border border-white/10 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h3 className="font-black text-sm uppercase tracking-wider text-white">
              Durağan Dağılım & n-Adım İleri Tahminler
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Uzun Vadeli Rejim Dengesi ve Matris Kuvveti (P^n) Projeksiyonu
          </p>
        </div>

        <div className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 font-mono">
          Asimptotik Denge
        </div>
      </div>

      {/* Long-run Stationary Distribution Bars */}
      <div className="space-y-3 mb-6">
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span>🐂 Boğa Rejiminde Geçen Süre:</span>
            </span>
            <span className="font-mono text-emerald-300">%{bullPct.toFixed(2)}</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 shadow-md shadow-emerald-500/30 transition-all duration-700"
              style={{ width: `${bullPct}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-rose-400 flex items-center gap-1.5">
              <span>🐻 Ayı Rejiminde Geçen Süre:</span>
            </span>
            <span className="font-mono text-rose-300">%{bearPct.toFixed(2)}</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-600 to-rose-400 shadow-md shadow-rose-500/30 transition-all duration-700"
              style={{ width: `${bearPct}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-amber-400 flex items-center gap-1.5">
              <span>↔️ Yatay Konsolidasyonda Geçen Süre:</span>
            </span>
            <span className="font-mono text-amber-300">%{sidePct.toFixed(2)}</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-md shadow-amber-500/30 transition-all duration-700"
              style={{ width: `${sidePct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Multi-step Forward Projections Table (P^1, P^5, P^20, P^60) */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
          <FastForward className="w-3.5 h-3.5 text-cyan-400" />
          <span>İleriye Dönük Rejim Olasılıkları (P^n Matris Kuvveti)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {forwardProjections.map((proj) => (
            <div key={proj.steps} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
              <div className="font-mono font-bold text-[11px] text-cyan-400 mb-1.5 pb-1 border-b border-white/5">
                {proj.steps === 1 ? '1 Gün Sonra (t+1)' : `${proj.steps} Gün Sonra (t+${proj.steps})`}
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-emerald-400">
                  <span>Boğa:</span>
                  <span className="font-bold">%{(proj.probabilities.bull * 100).toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>Ayı:</span>
                  <span className="font-bold">%{(proj.probabilities.bear * 100).toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Yatay:</span>
                  <span className="font-bold">%{(proj.probabilities.sideways * 100).toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
