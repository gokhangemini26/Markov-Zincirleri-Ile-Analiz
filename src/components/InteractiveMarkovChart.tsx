'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DataPoint, PositionSetup } from '@/types/markov';
import { ArrowDownRight, ArrowUpRight, Eye, Layers, Maximize2, Shield, ShieldAlert, Sliders, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';

interface InteractiveMarkovChartProps {
  dataPoints: DataPoint[];
  positionSetup: PositionSetup;
  ticker: string;
  currency: string;
}

export default function InteractiveMarkovChart({
  dataPoints,
  positionSetup,
  ticker,
  currency
}: InteractiveMarkovChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Default to CANDLESTICKS as requested by user
  const [chartMode, setChartMode] = useState<'CANDLE' | 'AREA'>('CANDLE');
  const [showEMA, setShowEMA] = useState<boolean>(true);
  const [showLongLevels, setShowLongLevels] = useState<boolean>(true);
  const [showShortLevels, setShowShortLevels] = useState<boolean>(true);
  const [showRegimeGlow, setShowRegimeGlow] = useState<boolean>(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 500 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 900,
          height: 500
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div className="w-full h-96 glass-panel rounded-3xl flex items-center justify-center text-slate-500 text-sm">
        Grafik verisi yükleniyor...
      </div>
    );
  }

  // Zoomed slice for maximum visual clarity
  const displayBars = dataPoints.slice(-Math.min(150, dataPoints.length));
  const n = displayBars.length;

  const minPrice = Math.min(
    ...displayBars.map((d) => d.low),
    showShortLevels ? positionSetup.shortSetup.takeProfit2 : 999999,
    showLongLevels ? positionSetup.longSetup.stopLoss : 999999
  ) * 0.96;

  const maxPrice = Math.max(
    ...displayBars.map((d) => d.high),
    showLongLevels ? positionSetup.longSetup.takeProfit2 : 0,
    showShortLevels ? positionSetup.shortSetup.stopLoss : 0
  ) * 1.04;

  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...displayBars.map((d) => d.volume)) || 1;

  const padLeft = 20;
  const padRight = 85;
  const padTop = 30;
  const mainHeight = 320;
  const volTop = 360;
  const volHeight = 65;
  const regimeTop = 440;
  const regimeHeight = 25;

  const chartW = dimensions.width - padLeft - padRight;
  const getX = (index: number) => padLeft + (index / (n - 1 || 1)) * chartW;
  const getY = (price: number) => padTop + (1 - (price - minPrice) / priceRange) * mainHeight;
  const getVolY = (vol: number) => volTop + (1 - vol / maxVolume) * volHeight;

  const activeHover = hoverIndex !== null && hoverIndex >= 0 && hoverIndex < n ? displayBars[hoverIndex] : displayBars[n - 1];

  // SVG Paths
  const linePoints = displayBars.map((d, i) => `${getX(i)},${getY(d.close)}`).join(' ');
  const areaPath = `${getX(0)},${getY(minPrice)} ${linePoints} ${getX(n - 1)},${getY(minPrice)}`;

  const ema20Points = displayBars
    .filter((d) => d.ema20 !== undefined)
    .map((d, i) => `${getX(i)},${getY(d.ema20!)}`)
    .join(' ');

  const ema50Points = displayBars
    .filter((d) => d.ema50 !== undefined)
    .map((d, i) => `${getX(i)},${getY(d.ema50!)}`)
    .join(' ');

  const ema200Points = displayBars
    .filter((d) => d.ema200 !== undefined)
    .map((d, i) => `${getX(i)},${getY(d.ema200!)}`)
    .join(' ');

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - padLeft;
    const ratio = Math.max(0, Math.min(1, mouseX / chartW));
    const idx = Math.round(ratio * (n - 1));
    setHoverIndex(idx);
  };

  return (
    <section className="w-full glass-panel rounded-3xl p-5 md:p-7 shadow-2xl border border-white/15 relative overflow-hidden" ref={containerRef}>
      {/* Chart Control Toolbar */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-black text-white tracking-wide">
              {ticker} — İnteraktif Mum Grafiği & Strateji Seviyeleri
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono font-bold border border-cyan-500/20">
              {displayBars.length} Bar (Canlı)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Grafik varsayılan olarak <strong className="text-cyan-300">Mum (Candlestick)</strong> modundadır. İstenildiğinde Long ve Short seviyeleri tek tıkla açılıp kapatılabilir.
          </p>
        </div>

        {/* Display Toggles Group */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Candle vs Area Switcher */}
          <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs shadow-inner">
            <button
              onClick={() => setChartMode('CANDLE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                chartMode === 'CANDLE' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              🕯️ Mum Grafik
            </button>
            <button
              onClick={() => setChartMode('AREA')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                chartMode === 'AREA' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              📈 Çizgi / Alan
            </button>
          </div>

          {/* Long Levels Toggle Button */}
          <button
            onClick={() => setShowLongLevels(!showLongLevels)}
            className={`px-3.5 py-1.5 text-xs rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              showLongLevels
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/15'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Long Seviyeleri</span>
          </button>

          {/* Short Levels Toggle Button */}
          <button
            onClick={() => setShowShortLevels(!showShortLevels)}
            className={`px-3.5 py-1.5 text-xs rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              showShortLevels
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/15'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Short Seviyeleri</span>
          </button>

          {/* EMAs Toggle Button */}
          <button
            onClick={() => setShowEMA(!showEMA)}
            className={`px-3 py-1.5 text-xs rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              showEMA
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>EMA 20/50/200</span>
          </button>

          {/* Regime Background Glow Toggle Button */}
          <button
            onClick={() => setShowRegimeGlow(!showRegimeGlow)}
            className={`px-3 py-1.5 text-xs rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              showRegimeGlow
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rejim Işıltısı</span>
          </button>
        </div>
      </div>

      {/* Floating Active Crosshair Info Bar */}
      {activeHover && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs mb-3 font-mono">
          <div>
            <span className="text-slate-500 text-[10px] block">TARİH</span>
            <span className="text-slate-200 font-bold">{activeHover.date}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">KAPANIŞ</span>
            <span className="text-cyan-400 font-bold">
              {activeHover.close.toFixed(2)} {currency}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">AÇILIŞ / YÜKSEK / DÜŞÜK</span>
            <span className="text-slate-300 text-[11px]">
              {activeHover.open.toFixed(1)} / {activeHover.high.toFixed(1)} / {activeHover.low.toFixed(1)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">EMA 20 DESTEK</span>
            <span className="text-sky-300">{activeHover.ema20?.toFixed(2) || '-'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">14-ATR VOLATİLİTE</span>
            <span className="text-amber-300">{activeHover.atr?.toFixed(2) || '-'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">HACİM</span>
            <span className="text-slate-300">{(activeHover.volume / 1e6).toFixed(2)}M</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">MARKOV DURUMU</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[10px] inline-block ${
                activeHover.regime === 'BULL'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : activeHover.regime === 'BEAR'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {activeHover.regime === 'BULL' ? '🐂 BOĞA' : activeHover.regime === 'BEAR' ? '🐻 AYI' : '↔️ YATAY'}
            </span>
          </div>
        </div>
      )}

      {/* SVG Canvas Renderer */}
      <div className="relative w-full overflow-x-auto select-none">
        <svg
          width={dimensions.width}
          height={dimensions.height}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
          className="w-full cursor-crosshair"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="bullRegimeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="bearRegimeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="sideRegimeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Background Horizontal Grid Lines & Price Labels */}
          {[0.15, 0.35, 0.55, 0.75, 0.95].map((pct) => {
            const p = minPrice + priceRange * pct;
            const y = getY(p);
            return (
              <g key={pct}>
                <line x1={padLeft} y1={y} x2={dimensions.width - padRight} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <text x={dimensions.width - padRight + 6} y={y + 3} fill="#64748b" fontSize="10" fontFamily="monospace">
                  {p.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Markov Regime Background Shading Spans */}
          {showRegimeGlow &&
            displayBars.map((d, i) => {
              if (i === n - 1) return null;
              const x1 = getX(i);
              const x2 = getX(i + 1);
              const w = Math.max(1, x2 - x1);
              const fill =
                d.regime === 'BULL' ? 'url(#bullRegimeGrad)' : d.regime === 'BEAR' ? 'url(#bearRegimeGrad)' : 'url(#sideRegimeGrad)';
              return <rect key={`reg-bg-${i}`} x={x1} y={padTop} width={w} height={mainHeight} fill={fill} />;
            })}

          {/* 1. Candlestick Mode (DEFAULT) */}
          {chartMode === 'CANDLE' &&
            displayBars.map((d, i) => {
              const x = getX(i);
              const isUp = d.close >= d.open;
              const candleColor = isUp ? '#10b981' : '#f43f5e';
              const yOpen = getY(d.open);
              const yClose = getY(d.close);
              const yHigh = getY(d.high);
              const yLow = getY(d.low);
              const top = Math.min(yOpen, yClose);
              const height = Math.max(2, Math.abs(yClose - yOpen));
              const candleWidth = Math.max(2.5, (chartW / n) * 0.72);

              return (
                <g key={`candle-${i}`}>
                  {/* High-Low Wick */}
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={candleColor} strokeWidth="1.2" />
                  {/* Candle Body */}
                  <rect x={x - candleWidth / 2} y={top} width={candleWidth} height={height} fill={candleColor} rx="1" />
                </g>
              );
            })}

          {/* 2. Area Mode (Alternative) */}
          {chartMode === 'AREA' && (
            <>
              <polygon points={areaPath} fill="url(#areaGradient)" />
              <polyline points={linePoints} fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinejoin="round" />
            </>
          )}

          {/* Moving Averages */}
          {showEMA && (
            <>
              <polyline points={ema20Points} fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
              <polyline points={ema50Points} fill="none" stroke="#fbbf24" strokeWidth="1.5" />
              <polyline points={ema200Points} fill="none" stroke="#c084fc" strokeWidth="1.7" />
            </>
          )}

          {/* Long Strategic Overlays */}
          {showLongLevels && (
            <>
              {/* Long TP1 */}
              <line
                x1={padLeft}
                y1={getY(positionSetup.longSetup.takeProfit1)}
                x2={dimensions.width - padRight}
                y2={getY(positionSetup.longSetup.takeProfit1)}
                stroke="#10b981"
                strokeWidth="1.3"
                strokeDasharray="4 3"
              />
              <text
                x={dimensions.width - padRight + 4}
                y={getY(positionSetup.longSetup.takeProfit1) + 3}
                fill="#10b981"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                LONG TP1: {positionSetup.longSetup.takeProfit1}
              </text>

              {/* Long Entry Trigger */}
              <line
                x1={padLeft}
                y1={getY(positionSetup.longSetup.entryTrigger)}
                x2={dimensions.width - padRight}
                y2={getY(positionSetup.longSetup.entryTrigger)}
                stroke="#38bdf8"
                strokeWidth="1.3"
                strokeDasharray="6 3"
              />
              <text
                x={dimensions.width - padRight + 4}
                y={getY(positionSetup.longSetup.entryTrigger) + 3}
                fill="#38bdf8"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                LONG GİRİŞ: {positionSetup.longSetup.entryTrigger}
              </text>

              {/* Long Stop */}
              <line
                x1={padLeft}
                y1={getY(positionSetup.longSetup.stopLoss)}
                x2={dimensions.width - padRight}
                y2={getY(positionSetup.longSetup.stopLoss)}
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />
              <text
                x={dimensions.width - padRight + 4}
                y={getY(positionSetup.longSetup.stopLoss) + 3}
                fill="#f87171"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                LONG STOP: {positionSetup.longSetup.stopLoss}
              </text>
            </>
          )}

          {/* Short Strategic Overlays */}
          {showShortLevels && (
            <>
              {/* Short Stop Loss */}
              <line
                x1={padLeft}
                y1={getY(positionSetup.shortSetup.stopLoss)}
                x2={dimensions.width - padRight}
                y2={getY(positionSetup.shortSetup.stopLoss)}
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="8 4"
              />
              <text
                x={dimensions.width - padRight + 4}
                y={getY(positionSetup.shortSetup.stopLoss) - 4}
                fill="#f43f5e"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                SHORT STOP: {positionSetup.shortSetup.stopLoss}
              </text>

              {/* Short Entry Trigger */}
              <line
                x1={padLeft}
                y1={getY(positionSetup.shortSetup.entryTrigger)}
                x2={dimensions.width - padRight}
                y2={getY(positionSetup.shortSetup.entryTrigger)}
                stroke="#fb923c"
                strokeWidth="1.3"
                strokeDasharray="6 3"
              />
              <text
                x={dimensions.width - padRight + 4}
                y={getY(positionSetup.shortSetup.entryTrigger) + 3}
                fill="#fb923c"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                SHORT GİRİŞ: {positionSetup.shortSetup.entryTrigger}
              </text>

              {/* Short TP1 */}
              <line
                x1={padLeft}
                y1={getY(positionSetup.shortSetup.takeProfit1)}
                x2={dimensions.width - padRight}
                y2={getY(positionSetup.shortSetup.takeProfit1)}
                stroke="#38bdf8"
                strokeWidth="1.3"
                strokeDasharray="4 3"
              />
              <text
                x={dimensions.width - padRight + 4}
                y={getY(positionSetup.shortSetup.takeProfit1) + 3}
                fill="#38bdf8"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                SHORT TP1: {positionSetup.shortSetup.takeProfit1}
              </text>
            </>
          )}

          {/* Volume Sub-chart */}
          <line x1={padLeft} y1={volTop} x2={dimensions.width - padRight} y2={volTop} stroke="rgba(255,255,255,0.1)" />
          {displayBars.map((d, i) => {
            const x = getX(i);
            const y = getVolY(d.volume);
            const h = Math.max(1, volTop + volHeight - y);
            const isUp = i === 0 ? true : d.close >= displayBars[i - 1].close;
            const barW = Math.max(1.5, (chartW / n) * 0.68);
            return (
              <rect
                key={`vol-${i}`}
                x={x - barW / 2}
                y={y}
                width={barW}
                height={h}
                fill={isUp ? '#10b981' : '#f43f5e'}
                opacity={0.65}
              />
            );
          })}

          {/* Regime Timeline Strip */}
          <line x1={padLeft} y1={regimeTop} x2={dimensions.width - padRight} y2={regimeTop} stroke="rgba(255,255,255,0.1)" />
          {displayBars.map((d, i) => {
            const x1 = getX(i);
            const x2 = i === n - 1 ? x1 + 5 : getX(i + 1);
            const color = d.regime === 'BULL' ? '#10b981' : d.regime === 'BEAR' ? '#f43f5e' : '#f59e0b';
            return (
              <rect
                key={`strip-${i}`}
                x={x1}
                y={regimeTop}
                width={Math.max(1.5, x2 - x1)}
                height={regimeHeight}
                fill={color}
                opacity={0.85}
              />
            );
          })}
          <text x={padLeft + 8} y={regimeTop + 16} fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            REJİM AKIŞI (MARKOV DÖNGÜSÜ)
          </text>

          {/* Hover Crosshair Vertical Line */}
          {hoverIndex !== null && hoverIndex >= 0 && hoverIndex < n && (
            <line
              x1={getX(hoverIndex)}
              y1={padTop}
              x2={getX(hoverIndex)}
              y2={regimeTop + regimeHeight}
              stroke="#ffffff"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}
        </svg>
      </div>
    </section>
  );
}
