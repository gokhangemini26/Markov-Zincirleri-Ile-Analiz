'use client';

import React, { useState } from 'react';
import { PositionSetup } from '@/types/markov';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Crosshair,
  Percent,
  ShieldAlert,
  ShieldCheck,
  Target,
  Zap
} from 'lucide-react';

interface ExecutiveDecisionCardProps {
  setup: PositionSetup;
  ticker: string;
  name: string;
}

export default function ExecutiveDecisionCard({ setup, ticker, name }: ExecutiveDecisionCardProps) {
  const [portfolioSize, setPortfolioSize] = useState<number>(100000);
  const [riskTolerancePct, setRiskTolerancePct] = useState<number>(2.0); // 2% portfolio risk

  // Calculate position sizing based on Stop-Loss distance
  const currentSetup = setup.verdict.includes('LONG') ? setup.longSetup : setup.shortSetup;
  const price = setup.currentPrice;
  const stopLoss = currentSetup.stopLoss;
  const riskPerShare = Math.abs(price - stopLoss);
  const maxRiskAmount = (portfolioSize * riskTolerancePct) / 100;
  const calculatedShares = riskPerShare > 0 ? Math.floor(maxRiskAmount / riskPerShare) : 0;
  const positionValue = calculatedShares * price;
  const expectedProfitTP1 = calculatedShares * Math.abs(currentSetup.takeProfit1 - price);

  const getVerdictStyle = () => {
    switch (setup.verdict) {
      case 'STRONG_LONG':
      case 'MODERATE_LONG':
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10',
          title: '🟢 BOĞA REJİMİ & LONG ALIM ÖNCELİĞİ',
          border: 'border-emerald-500/40',
          glow: 'from-emerald-500/10 via-transparent to-transparent',
          icon: ArrowUpRight
        };
      case 'STRONG_SHORT':
      case 'DEFENSIVE_SHORT':
        return {
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/10',
          title: '🔴 AYI REJİMİ & SHORT / DEFANSİF BEKLEME',
          border: 'border-rose-500/40',
          glow: 'from-rose-500/10 via-transparent to-transparent',
          icon: ArrowDownRight
        };
      default:
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10',
          title: '🟡 YATAY KONSOLİDASYON / KIRILIM BEKLE',
          border: 'border-amber-500/40',
          glow: 'from-amber-500/10 via-transparent to-transparent',
          icon: Crosshair
        };
    }
  };

  const style = getVerdictStyle();
  const IconComponent = style.icon;

  return (
    <div className={`w-full rounded-2xl glass-panel border ${style.border} p-5 md:p-7 shadow-2xl relative overflow-hidden`}>
      {/* Background radial glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.glow} pointer-events-none`}></div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
              MARKOV POZİSYON VE AKSİYON KARARI
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-medium">{ticker}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-3">
            <span>{style.title}</span>
          </h2>
        </div>

        {/* Signal Score Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Markov Sinyal Skoru</div>
            <div className="text-base font-black font-mono">
              <span className={setup.signalScore > 0 ? 'text-emerald-400' : setup.signalScore < 0 ? 'text-rose-400' : 'text-amber-400'}>
                {setup.signalScore > 0 ? `+${setup.signalScore}` : setup.signalScore}
              </span>
              <span className="text-xs text-slate-500 ml-1 font-normal">(P_bull - P_bear)</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border ${style.badge} shadow-lg flex items-center justify-center`}>
            <IconComponent className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Long Setup vs Short Setup & Strategic Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6 relative z-10">
        {/* Long Setup Box */}
        <div className={`p-5 rounded-xl border ${setup.verdict.includes('LONG') ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <h3 className="font-bold text-sm text-emerald-300">LONG POZİSYON STRATEJİSİ (YÜKSELİŞ)</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              R:R 1:{setup.longSetup.riskRewardRatio}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                Giriş Onay Seviyesi (Entry Trigger):
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {setup.longSetup.entryTrigger} {setup.currency}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Zarar Kes (Stop-Loss — 1.5x ATR):
              </span>
              <span className="font-mono font-bold text-rose-400 text-sm">
                {setup.longSetup.stopLoss} {setup.currency}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Hedef 1 (TP1 — Swing Direnç):
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {setup.longSetup.takeProfit1} {setup.currency} (+%{setup.longSetup.potentialGainPct})
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                Hedef 2 (TP2 — Üst Kanal):
              </span>
              <span className="font-mono font-bold text-cyan-400 text-sm">
                {setup.longSetup.takeProfit2} {setup.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Short Setup Box */}
        <div className={`p-5 rounded-xl border ${setup.verdict.includes('SHORT') ? 'bg-rose-950/30 border-rose-500/50' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400 animate-pulse"></div>
              <h3 className="font-bold text-sm text-rose-300">SHORT / DEFANSİF STRATEJİ (DÜŞÜŞ)</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
              R:R 1:{setup.shortSetup.riskRewardRatio}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-rose-400" />
                Giriş Kırılım Seviyesi (Entry Trigger):
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {setup.shortSetup.entryTrigger} {setup.currency}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Zarar Kes (Short Stop-Loss):
              </span>
              <span className="font-mono font-bold text-rose-400 text-sm">
                {setup.shortSetup.stopLoss} {setup.currency}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                Hedef 1 (TP1 — Dip Destek):
              </span>
              <span className="font-mono font-bold text-cyan-400 text-sm">
                {setup.shortSetup.takeProfit1} {setup.currency} (+%{setup.shortSetup.potentialGainPct})
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                Hedef 2 (TP2 — Ana Taban):
              </span>
              <span className="font-mono font-bold text-indigo-400 text-sm">
                {setup.shortSetup.takeProfit2} {setup.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verbal Tactical Advice Box */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed mb-6 relative z-10 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block mb-0.5 font-bold">Kantitatif Taktik Değerlendirmesi:</strong>
          {setup.tacticalAdvice}
        </div>
      </div>

      {/* Interactive Position Size & Capital Calculator */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900/90 to-slate-950 border border-cyan-500/20 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-cyan-400" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-300">
            Otomatik Risk & Pozisyon Büyüklüğü Hesaplayıcı
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Toplam Portföy Büyüklüğü ({setup.currency})</label>
            <input
              type="number"
              value={portfolioSize}
              onChange={(e) => setPortfolioSize(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">İşlem Başına Risk Toleransı (%)</label>
            <div className="flex gap-1.5">
              {[1.0, 2.0, 3.0, 5.0].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setRiskTolerancePct(pct)}
                  className={`flex-1 py-2 rounded-lg font-mono font-bold text-xs transition-all ${
                    riskTolerancePct === pct
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 border border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  %{pct}
                </button>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Önerilen Alım / Pozisyon Miktarı</span>
            <span className="font-mono text-base font-black text-cyan-400">
              {calculatedShares.toLocaleString('tr-TR')} Adet
            </span>
            <span className="text-[10px] text-slate-500 block">
              (~{positionValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} {setup.currency})
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Maksimum Risk / Stop Zararı</span>
            <span className="font-mono text-base font-black text-rose-400">
              -{maxRiskAmount.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} {setup.currency}
            </span>
            <span className="text-[10px] text-emerald-400 block">
              Hedef 1 Kârı: +{expectedProfitTP1.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} {setup.currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
