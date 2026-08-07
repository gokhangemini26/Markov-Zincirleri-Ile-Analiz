'use client';

import React, { useState } from 'react';
import { STOCK_PRESETS, TIMEFRAMES } from '@/lib/stockData';
import { Calendar, ChevronDown, Play, RefreshCw, Search, Sliders, Sparkles, Zap } from 'lucide-react';

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

  // Popular quick-selection chips
  const popularChips = [
    { symbol: 'THYAO.IS', label: 'THYAO' },
    { symbol: 'FROTO.IS', label: 'FROTO' },
    { symbol: 'EREGL.IS', label: 'EREGL' },
    { symbol: 'ASELS.IS', label: 'ASELS' },
    { symbol: 'TUPRS.IS', label: 'TUPRS' },
    { symbol: 'XU100.IS', label: 'BIST 100' },
    { symbol: 'SPY', label: 'S&P 500' },
    { symbol: 'NVDA', label: 'NVDA' },
    { symbol: 'BTC-USD', label: 'BITCOIN' }
  ];

  return (
    <section className="w-full glass-panel rounded-3xl p-5 md:p-7 shadow-2xl border border-white/15 relative z-20 my-4">
      {/* Top Quick Bar: Title & Quick Ticker Pills */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Hızlı Varlık Seçimi:
          </span>
        </div>

        {/* Quick Ticker Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {popularChips.map((chip) => (
            <button
              key={chip.symbol}
              onClick={() => {
                onSelectTicker(chip.symbol);
                setDropdownOpen(false);
              }}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                selectedTicker === chip.symbol
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 scale-105'
                  : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Controls: Ticker Dropdown + Timeframe Pills + Action Button */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
        {/* 1. Ticker Dropdown (Cols 4) */}
        <div className="lg:col-span-4 relative">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hisse / Endeks / Kripto Menüsü</span>
          </label>

          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500 transition-all text-left shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-500/30 flex items-center justify-center font-bold text-xs text-cyan-300 font-mono">
                {selectedTicker.slice(0, 4).replace('.', '')}
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>{selectedTicker}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono">
                    {selectedPreset?.category || 'ÖZEL'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 truncate max-w-[190px]">
                  {selectedPreset?.name || 'Kullanıcı Tanımlı Ticker'}
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-cyan-400' : ''
              }`}
            />
          </button>

          {/* Floating Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-full md:w-[420px] rounded-2xl bg-slate-950 border border-slate-700 shadow-2xl z-[100] p-3 max-h-[460px] overflow-hidden flex flex-col backdrop-blur-3xl">
              {/* Search Bar */}
              <div className="relative mb-2.5">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sembol veya hisse adı ara (örn. THYAO, NVDA, SPY)..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 mb-2.5 overflow-x-auto pb-1 scrollbar-none">
                {['ALL', 'BIST', 'INDEX', 'GLOBAL', 'CRYPTO'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[11px] px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat === 'ALL' ? 'Tümü' : cat}
                  </button>
                ))}
              </div>

              {/* Ticker List */}
              <div className="overflow-y-auto flex-1 space-y-1 pr-1 max-h-[260px]">
                {filteredPresets.map((preset) => (
                  <button
                    key={preset.symbol}
                    onClick={() => {
                      onSelectTicker(preset.symbol);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                      selectedTicker === preset.symbol
                        ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold'
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-white text-xs">{preset.symbol}</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[170px]">
                        {preset.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">{preset.exchange}</span>
                  </button>
                ))}
              </div>

              {/* Custom Ticker Direct Input Form */}
              <form onSubmit={handleCustomTickerSubmit} className="mt-2.5 pt-2.5 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={customTickerInput}
                  onChange={(e) => setCustomTickerInput(e.target.value)}
                  placeholder="Farklı Ticker (örn. SISE.IS, TSLA)"
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Seç
                </button>
              </form>
            </div>
          )}
        </div>

        {/* 2. Timeframe Selector Pills (Cols 5) */}
        <div className="lg:col-span-5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zaman Aralığı (Lookback Dönemi)</span>
          </label>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.id}
                onClick={() => onSelectTimeframe(tf.id, tf.days)}
                className={`py-2.5 px-1 text-xs font-bold rounded-xl transition-all text-center cursor-pointer ${
                  selectedTimeframe === tf.id
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-cyan-500/25 scale-[1.03]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Run Analysis & Settings (Cols 3) */}
        <div className="lg:col-span-3 flex items-center gap-2.5">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              showAdvanced
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Gelişmiş Markov Parametreleri"
          >
            <Sliders className="w-5 h-5" />
          </button>

          <button
            onClick={onRunAnalysis}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs md:text-sm tracking-wide shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>HESAPLANIYOR...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950" />
                <span>ANALİZİ BAŞLAT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Settings Drawer (Accordion) */}
      {showAdvanced && (
        <div className="mt-5 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex justify-between text-slate-300 font-bold mb-1.5">
              <span>Hareketli Pencere (Rolling Window):</span>
              <span className="text-cyan-400 font-mono font-bold">{windowDays} Gün</span>
            </div>
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

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex justify-between text-slate-300 font-bold mb-1.5">
              <span>Rejim Eşik Değeri (Threshold):</span>
              <span className="text-emerald-400 font-mono font-bold">%{thresholdPct.toFixed(1)}</span>
            </div>
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

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <label className="text-slate-300 font-bold mb-1.5 block">Özel Tarih Aralığı Seçici</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => onDateChange(e.target.value, endDate)}
                className="w-1/2 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-500">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onDateChange(startDate, e.target.value)}
                className="w-1/2 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
