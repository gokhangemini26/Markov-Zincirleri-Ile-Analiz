'use client';

import React from 'react';
import { TransitionMatrix } from '@/types/markov';
import { ArrowRight, Grid, HelpCircle, Info } from 'lucide-react';

interface TransitionMatrixHeatmapProps {
  matrixData: TransitionMatrix;
}

const REGIME_NAMES = [
  { id: 0, label: '🐻 AYI (Bear)', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
  { id: 1, label: '↔️ YATAY (Sideways)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  { id: 2, label: '🐂 BOĞA (Bull)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' }
];

export default function TransitionMatrixHeatmap({ matrixData }: TransitionMatrixHeatmapProps) {
  const P = matrixData.matrix;

  const getHeatmapColor = (val: number, isDiagonal: boolean) => {
    const pct = val * 100;
    if (isDiagonal) {
      if (pct > 80) return 'bg-cyan-500/30 text-cyan-200 border-cyan-400/60 font-black shadow-lg shadow-cyan-500/20';
      if (pct > 50) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold';
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    }
    if (pct > 30) return 'bg-slate-800 text-white font-bold border-slate-700';
    if (pct > 15) return 'bg-slate-900/80 text-slate-300 border-slate-800';
    return 'bg-slate-950 text-slate-500 border-slate-900';
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 md:p-6 shadow-2xl border border-white/10 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-cyan-400" />
            <h3 className="font-black text-sm uppercase tracking-wider text-white">
              3x3 Rejim Geçiş Matrisi (Transition Matrix P)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Satırlar = Mevcut Durum (t), Sütunlar = Bir Sonraki Durum (t+1)
          </p>
        </div>

        <div className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono">
          Satır Toplamı = %100
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-2.5 text-left text-slate-500 font-mono uppercase text-[10px]">
                Mevcut \ Hedef
              </th>
              {REGIME_NAMES.map((col) => (
                <th key={col.id} className={`p-2.5 text-center font-bold ${col.color}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REGIME_NAMES.map((row, i) => (
              <tr key={row.id} className="border-t border-white/5">
                <td className={`p-2.5 font-bold ${row.color} whitespace-nowrap`}>
                  {row.label}
                </td>
                {P[i].map((prob, j) => {
                  const isDiag = i === j;
                  return (
                    <td key={j} className="p-2 text-center">
                      <div
                        className={`p-3 rounded-xl border transition-all font-mono text-sm ${getHeatmapColor(
                          prob,
                          isDiag
                        )}`}
                      >
                        <div>{(prob * 100).toFixed(2)}%</div>
                        {isDiag && (
                          <div className="text-[9px] uppercase tracking-wider opacity-75 font-sans mt-0.5">
                            Kalıcılık
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Diagonal Persistence Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5 text-xs">
        <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20">
          <div className="text-[10px] uppercase font-bold text-rose-400 mb-0.5">Ayı Kalıcılığı (P_00)</div>
          <div className="font-mono text-base font-black text-white">
            %{(matrixData.persistence.bear * 100).toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Düşüş trendinin ertesi güne taşınma olasılığı</p>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
          <div className="text-[10px] uppercase font-bold text-amber-400 mb-0.5">Yatay Kalıcılık (P_11)</div>
          <div className="font-mono text-base font-black text-white">
            %{(matrixData.persistence.sideways * 100).toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Sıkışma ve testere piyasasında kalma oranı</p>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <div className="text-[10px] uppercase font-bold text-emerald-400 mb-0.5">Boğa Kalıcılığı (P_22)</div>
          <div className="font-mono text-base font-black text-white">
            %{(matrixData.persistence.bull * 100).toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Yükseliş momentumunun korunma gücü</p>
        </div>
      </div>
    </div>
  );
}
