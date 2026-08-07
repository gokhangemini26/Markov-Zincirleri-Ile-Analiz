'use client';

import React, { useState } from 'react';
import { STOCK_PRESETS, TIMEFRAMES } from '@/lib/stockData';
import { StockPreset } from '@/types/markov';
import { Calendar, ChevronDown, Filter, Play, RefreshCw, Search, Settings2, Sliders, Zap } from 'lucide-react';

interface ControlPanelProps {
  selectedTicker: string;
  onSelectTicker: (ticker: string) => void;
  selectedTimeframe: string;
  onSelectTimeframe: (tf: string, days: number) => void;
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
  windowDays: number;
  thresholdPct: number;
  onParamsChange: (windowDays: number, thresholdPct: number) => void;
  onRunAnalysis: () => void;
  loading: boolean;
}

export default function ControlPanel({
  selectedTicker,
  onSelectTicker,
  selectedTimeframe,
  onSelectTimeframe,
  startDate,
  endDate,
  onDateChange,
  windowDays,
  thresholdPct,
  onParamsChange,
  onRunAnalysis,
  loading
}: ControlPanelProps) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [customTickerInput, setCustomTickerInput] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const selectedPreset = STOCK_PRESETS.find((p) => p.symbol === selectedTicker);

  const filteredPresets = STOCK_PRESETS.filter((preset) => {
    const matchCategory = activeCategory === 'ALL' || preset.category === activeCategory;
    const matchSearch =
      preset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCustomTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTickerInput.trim()) {
      const clean = customTickerInput.trim().toUpperCase();
      onSelectTicker(clean);
      setDropdownOpen(false);
      setCustomTickerInput('');
    }
  };

  return (
    <section className="w-full glass-panel rounded-2xl p-4 md:p-6 shadow-2xl border border-white/10 relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left Section: Ticker Dropdown Selector */}
        <div className="w-full lg:w-auto flex flex-col md:flex-row items-start md:items-center gap-4 flex-1">
          <div className="relative w-full md:w-80">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hisse / Varlık / Endeks Seçimi</span>
            </label>

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/60 transition-all text-left shadow-lg group focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
                  {selectedTicker.slice(0, 3)}
                </div>
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span>{selectedTicker}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {selectedPreset?.category || 'ÖZEL'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 truncate max-w-[170px]">
                    {selectedPreset?.name || 'Kullanıcı Tanımlı Sembol'}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180 text-cyan-400' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Modal */}
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-full md:w-96 rounded-2xl bg-slate-950/95 border border-slate-700/80 backdrop-blur-2xl shadow-2xl z-50 p-3 max-h-[460px] overflow-hidden flex flex-col">
                {/* Search Bar */}
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Sembol veya şirket adı ara..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    autoFocus
                  />
                </div>

                {/* Category Filter Chips */}
                <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-none">
                  {['ALL', 'BIST', 'INDEX', 'GLOBAL', 'CRYPTO'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-[10px] px-2.5 py-1 rounded-md font-semibold transition-all whitespace-nowrap ${
                        activeCategory === cat
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {cat === 'ALL' ? 'Tümü' : cat}
                    </button>
                  ))}
                </div>

                {/* Ticker List */}
                <div className="overflow-y-auto flex-1 space-y-1 pr-1">
                  {filteredPresets.map((preset) => (
                    <button
                      key={preset.symbol}
                      onClick={() => {
                        onSelectTicker(preset.symbol);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                        selectedTicker === preset.symbol
                          ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-bold'
                          : 'hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{preset.symbol}</span>
                        <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {preset.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase">{preset.exchange}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Ticker Direct Input */}
                <form onSubmit={handleCustomTickerSubmit} className="mt-2 pt-2 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={customTickerInput}
                    onChange={(e) => setCustomTickerInput(e.target.value)}
                    placeholder="Farklı Ticker (örn. SISE.IS, TSLA)"
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-400 font-bold text-xs rounded-lg transition-colors"
                  >
                    Ekle
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Timeframe Selector Pills */}
          <div className="flex-1 w-full">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Analiz Zaman Aralığı (Lookback Dönemi)</span>
            </label>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => onSelectTimeframe(tf.id, tf.days)}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition-all text-center ${
                    selectedTimeframe === tf.id
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md shadow-cyan-500/20 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Action Button & Settings Toggle */}
        <div className="w-full lg:w-auto flex items-center gap-3 justify-end">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-3 rounded-xl border transition-all text-slate-400 hover:text-white ${
              showAdvanced
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                : 'bg-slate-900/90 border-slate-700/80 hover:bg-slate-800'
            }`}
            title="Gelişmiş Markov Parametreleri"
          >
            <Sliders className="w-5 h-5" />
          </button>

          <button
            onClick={onRunAnalysis}
            disabled={loading}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Hesaplanıyor...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950" />
                <span>ANALİZ ET VE STRATEJİYİ ÇALIŞTIR</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Parameters Drawer (Rolling Window, Threshold, Custom Dates) */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <label className="text-slate-400 font-semibold mb-1 block">
              Hareketli Pencere (Rolling Window): <span className="text-cyan-400 font-bold">{windowDays} Gün</span>
            </label>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={windowDays}
              onChange={(e) => onParamsChange(Number(e.target.value), thresholdPct)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Standart hedge-fund parametresi: 20 gün</span>
          </div>

          <div>
            <label className="text-slate-400 font-semibold mb-1 block">
              Rejim Eşik Değeri (Threshold): <span className="text-emerald-400 font-bold">%{thresholdPct.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={thresholdPct}
              onChange={(e) => onParamsChange(windowDays, Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Boğa / Ayı ayrım sınırı: ±%2.0</span>
          </div>

          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Özel Tarih Aralığı</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => onDateChange(e.target.value, endDate)}
                className="w-1/2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-500">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onDateChange(startDate, e.target.value)}
                className="w-1/2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
