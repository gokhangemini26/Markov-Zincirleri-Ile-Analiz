'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DataPoint, PositionSetup } from '@/types/markov';
import { Eye, Layers, Maximize2, Shield, Sliders, TrendingUp } from 'lucide-react';

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
  const [chartMode, setChartMode] = useState<'CANDLE' | 'AREA'>('AREA');
  const [showEMA, setShowEMA] = useState<boolean>(true);
  const [showLevels, setShowLevels] = useState<boolean>(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 480 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 900,
          height: 480
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div className="w-full h-96 glass-panel rounded-2xl flex items-center justify-center text-slate-500 text-sm">
        Grafik verisi yükleniyor...
      </div>
    );
  }

  // Zoomed slice (last 120 bars for maximum clarity, or full slice)
  const displayBars = dataPoints.slice(-Math.min(150, dataPoints.length));
  const n = displayBars.length;

  const minPrice = Math.min(...displayBars.map((d) => d.low)) * 0.96;
  const maxPrice = Math.max(...displayBars.map((d) => d.high), positionSetup.longSetup.takeProfit1) * 1.04;
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...displayBars.map((d) => d.volume)) || 1;

  const padLeft = 20;
  const padRight = 75;
  const padTop = 30;
  const mainHeight = 310;
  const volTop = 345;
  const volHeight = 70;
  const regimeTop = 425;
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
    <section className="w-full glass-panel rounded-2xl p-4 md:p-6 shadow-2xl border border-white/10 relative overflow-hidden" ref={containerRef}>
      {/* Chart Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-white tracking-wide flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>{ticker} — İnteraktif Markov & Strateji Grafiği</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono font-bold">
              {displayBars.length} Bar
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Rejim Renkleri: 🟢 Boğa Rejimi | 🟡 Yatay Rejim | 🔴 Ayı Rejimi
          </p>
        </div>

        {/* Display Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs">
            <button
              onClick={() => setChartMode('AREA')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                chartMode === 'AREA' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Çizgi / Alan
            </button>
            <button
              onClick={() => setChartMode('CANDLE')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                chartMode === 'CANDLE' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mum (OHLC)
            </button>
          </div>

          <button
            onClick={() => setShowEMA(!showEMA)}
            className={`px-3 py-1 text-xs rounded-lg border transition-all flex items-center gap-1.5 ${
              showEMA
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>EMA 20/50/200</span>
          </button>

          <button
            onClick={() => setShowLevels(!showLevels)}
            className={`px-3 py-1 text-xs rounded-lg border transition-all flex items-center gap-1.5 ${
              showLevels
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Long/Stop Seviyeleri</span>
          </button>
        </div>
      </div>

      {/* Floating Active Point Tooltip */}
      {activeHover && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs mb-3 font-mono">
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
            <span className="text-slate-500 text-[10px] block">YÜKSEK / DÜŞÜK</span>
            <span className="text-slate-300">
              {activeHover.high.toFixed(2)} / {activeHover.low.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">EMA 20</span>
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
            <span className="text-slate-500 text-[10px] block">AKTİF REJİM</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded text-[10px] inline-block ${
                activeHover.regime === 'BULL'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : activeHover.regime === 'BEAR'
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'bg-amber-500/20 text-amber-300'
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
            {/* Gradients for area chart */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="bullRegimeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="bearRegimeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="sideRegimeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          {[0.2, 0.4, 0.6, 0.8].map((pct) => {
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
          {displayBars.map((d, i) => {
            if (i === n - 1) return null;
            const x1 = getX(i);
            const x2 = getX(i + 1);
            const w = Math.max(1, x2 - x1);
            const fill =
              d.regime === 'BULL' ? 'url(#bullRegimeGrad)' : d.regime === 'BEAR' ? 'url(#bearRegimeGrad)' : 'url(#sideRegimeGrad)';
            return <rect key={`reg-bg-${i}`} x={x1} y={padTop} width={w} height={mainHeight} fill={fill} />;
          })}

          {/* Area Mode */}
          {chartMode === 'AREA' && (
            <>
              <polygon points={areaPath} fill="url(#areaGradient)" />
              <polyline points={linePoints} fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinejoin="round" />
            </>
          )}

          {/* Candlestick Mode */}
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
              const candleWidth = Math.max(2, (chartW / n) * 0.7);

              return (
                <g key={`candle-${i}`}>
                  {/* Wick */}
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={candleColor} strokeWidth="1.2" />
                  {/* Body */}
                  <rect x={x - candleWidth / 2} y={top} width={candleWidth} height={height} fill={candleColor} rx="1" />
                </g>
              );
            })}

          {/* Moving Averages */}
          {showEMA && (
            <>
              <polyline points={ema20Points} fill="none" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="4 2" />
              <polyline points={ema50Points} fill="none" stroke="#fbbf24" strokeWidth="1.5" />
              <polyline points={ema200Points} fill="none" stroke="#c084fc" strokeWidth="1.6" />
            </>
          )}

          {/* Strategic Long / Short / Stop Overlays */}
          {showLevels && (
            <>
              {/* Long TP1 */}
              <line
                x1={padLeft}
                y1={getY(positionSetup.longSetup.takeProfit1)}
                x2={dimensions.width - padRight}
                y2={getY(positionSetup.longSetup.takeProfit1)}
                stroke="#10b981"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <text
                x={dimensions.width - padRight + 6}
                y={getY(positionSetup.longSetup.takeProfit1) + 3}
                fill="#10b981"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                TP1: {positionSetup.longSetup.takeProfit1}
              </text>

              {/* Long Stop */}
              <line
                x1={padLeft}
                y1={getY(positionSetup.longSetup.stopLoss)}
                x2={dimensions.width - padRight}
                y2={getY(positionSetup.longSetup.stopLoss)}
                stroke="#f43f5e"
                strokeWidth="1.4"
                strokeDasharray="6 3"
              />
              <text
                x={dimensions.width - padRight + 6}
                y={getY(positionSetup.longSetup.stopLoss) + 3}
                fill="#f87171"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                STOP: {positionSetup.longSetup.stopLoss}
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
            const barW = Math.max(1.5, (chartW / n) * 0.65);
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
