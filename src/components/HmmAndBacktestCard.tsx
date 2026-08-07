'use client';

import React from 'react';
import { BacktestResults, HmmRegimeReturn } from '@/types/markov';
import { Award, BarChart3, Flame, History, Percent, TrendingDown, TrendingUp, Zap } from 'lucide-react';

interface HmmAndBacktestCardProps {
  hmmReturns: HmmRegimeReturn[];
  backtest: BacktestResults;
}

export default function HmmAndBacktestCard({ hmmReturns, backtest }: HmmAndBacktestCardProps) {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Panel 1: Hidden Markov Model (HMM) Return Distributions */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="font-black text-sm uppercase tracking-wider text-white">
                Gizli Markov Modeli (HMM — Baum-Welch)
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">
              3-Durumlu Gaussian
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Her bir gizli piyasa rejiminin beklenen ortalama günlük getiri ve volatilite projeksiyonu:
          </p>

          <div className="space-y-2.5">
            {hmmReturns.map((hmm) => {
              const isBull = hmm.regime === 'BULL';
              const isBear = hmm.regime === 'BEAR';
              const isPositive = hmm.meanDailyReturnPct >= 0;

              return (
                <div
                  key={hmm.regime}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    isBull
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : isBear
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : 'bg-amber-950/20 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isBull
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isBear
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {isBull ? '🐂' : isBear ? '🐻' : '↔️'}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">
                        {isBull ? 'Boğa Rejimi (State 1)' : isBear ? 'Ayı Rejimi (State 2)' : 'Yatay Rejim (State 0)'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Volatilite: ±%{hmm.volatilityPct.toFixed(2)} / gün
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-mono text-sm font-black ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {hmm.meanDailyReturnPct.toFixed(3)}% / gün
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Yıllıklandırılmış: ~{isPositive ? '+' : ''}
                      {(hmm.meanDailyReturnPct * 252).toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500">
          * HMM durumları Baum-Welch Expectation-Maximization ve Viterbi decoding ile fit edilmiştir.
        </div>
      </div>

      {/* Panel 2: Walk-Forward Backtest & Quantitative Performance */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <h3 className="font-black text-sm uppercase tracking-wider text-white">
                Walk-Forward Backtest Performansı
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
              Sıfır Lookahead Bias
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Her adımda geçmiş verilerle yeniden hesaplanan Markov rejim modelinin tarihsel simülasyonu:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Sharpe Oranı</span>
              <span className="font-mono text-base font-black text-emerald-400">
                {backtest.sharpeRatio.toFixed(3)}
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Yıllıklandırılmış</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Maks. Düşüş (MDD)</span>
              <span className="font-mono text-base font-black text-rose-400">
                %{backtest.maxDrawdown}
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Tepe-Dip Gerilemesi</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Kazanma Oranı</span>
              <span className="font-mono text-base font-black text-cyan-400">
                %{backtest.winRate}
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Kârlı Gün Oranı</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Kâr Faktörü (PF)</span>
              <span className="font-mono text-base font-black text-amber-400">
                {backtest.profitFactor}
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Brüt Kazanç/Kayıp</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Yıllık Getiri</span>
              <span className="font-mono text-base font-black text-emerald-400">
                +%{backtest.annualizedReturn}
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Bileşik CAGR</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Test Edilen Bar</span>
              <span className="font-mono text-base font-black text-slate-200">
                {backtest.totalTrades.toLocaleString('tr-TR')}
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">İşlem Günü</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
          <span>Hedge Fund Markov Mimarisi</span>
          <span className="font-mono text-slate-400">Walk-Forward Re-estimation</span>
        </div>
      </div>
    </div>
  );
}
