'use client';

import React, { useState, useEffect } from 'react';
import { Activity, BookOpen, Clock, Download } from 'lucide-react';

interface HeaderProps {
  ticker: string;
  currency: string;
  currentPrice?: number;
  onOpenGuide: () => void;
  onExportJSON: () => void;
}

export default function Header({ ticker, currency, currentPrice, onOpenGuide, onExportJSON }: HeaderProps) {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
          ' TSİ'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full border-b border-white/10 bg-slate-950/90 backdrop-blur-md relative z-30 px-4 lg:px-8 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
              <Activity className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                  MARKOV QUANTUM
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  v3.4 HMM Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Olasılıksal Hisse, Endeks & Rejim Analiz Terminali
              </p>
            </div>
          </div>

          {/* Mobile Time */}
          <div className="flex md:hidden items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono">{timeStr}</span>
          </div>
        </div>

        {/* Center: Live Status & Active Ticker Capsule */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs shadow-inner">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400 font-medium">Aktif Varlık:</span>
            <span className="text-white font-bold tracking-wide font-mono">{ticker}</span>
            {currentPrice !== undefined && (
              <span className="font-mono font-bold text-cyan-400 pl-1 border-l border-slate-700">
                {currentPrice.toFixed(2)} {currency}
              </span>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono">{timeStr}</span>
          </div>
        </div>

        {/* Right: Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-cyan-500/50 hover:text-cyan-300 shadow-sm cursor-pointer"
            title="Markov Zinciri & HMM Rehberi"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Matematik Rehberi</span>
          </button>

          <button
            onClick={onExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-emerald-500/50 hover:text-emerald-300 shadow-sm cursor-pointer"
            title="Analiz Verilerini İndir (JSON)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rapor İndir</span>
          </button>
        </div>
      </div>
    </header>
  );
}
