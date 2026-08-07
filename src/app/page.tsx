'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import ControlPanel from '@/components/ControlPanel';
import ExecutiveDecisionCard from '@/components/ExecutiveDecisionCard';
import InteractiveMarkovChart from '@/components/InteractiveMarkovChart';
import TransitionMatrixHeatmap from '@/components/TransitionMatrixHeatmap';
import StationaryGauge from '@/components/StationaryGauge';
import HmmAndBacktestCard from '@/components/HmmAndBacktestCard';
import EducationalModal from '@/components/EducationalModal';
import { MarkovAnalysisResult } from '@/types/markov';
import confetti from 'canvas-confetti';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileSpreadsheet,
  Globe,
  Grid,
  Info,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';

export default function Home() {
  const [selectedTicker, setSelectedTicker] = useState<string>('THYAO.IS');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1Y');
  const [timeframeDays, setTimeframeDays] = useState<number>(365);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [windowDays, setWindowDays] = useState<number>(20);
  const [thresholdPct, setThresholdPct] = useState<number>(2.0);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<MarkovAnalysisResult | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: selectedTicker,
          days: timeframeDays,
          startDate,
          endDate,
          window: windowDays,
          threshold: thresholdPct / 100
        })
      });

      const json = await response.json();
      if (json.success && json.data) {
        setAnalysisResult(json.data);

        // Confetti celebration if strong bullish setup detected
        if (json.data.positionSetup.verdict === 'STRONG_LONG') {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
      } else {
        throw new Error(json.error || 'Veri çekilemedi.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analiz sırasında bağlantı hatası oluştu.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [selectedTicker, timeframeDays, startDate, endDate, windowDays, thresholdPct]);

  // Initial calculation on component mount
  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  const handleSelectTimeframe = (tf: string, days: number) => {
    setSelectedTimeframe(tf);
    if (days > 0) {
      setTimeframeDays(days);
    }
  };

  const handleExportJSON = () => {
    if (!analysisResult) return;
    const blob = new Blob([JSON.stringify(analysisResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Markov_${selectedTicker}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation Header */}
      <Header
        ticker={selectedTicker}
        currency={analysisResult?.currency || 'TL'}
        currentPrice={analysisResult?.currentPrice}
        onOpenGuide={() => setIsGuideOpen(true)}
        onExportJSON={handleExportJSON}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-6 flex-1">
        {/* Interactive Control & Timeframe Ribbon */}
        <ControlPanel
          selectedTicker={selectedTicker}
          onSelectTicker={(t) => {
            setSelectedTicker(t);
          }}
          selectedTimeframe={selectedTimeframe}
          onSelectTimeframe={handleSelectTimeframe}
          startDate={startDate}
          endDate={endDate}
          onDateChange={(s, e) => {
            setStartDate(s);
            setEndDate(e);
            setSelectedTimeframe('CUSTOM');
          }}
          windowDays={windowDays}
          thresholdPct={thresholdPct}
          onParamsChange={(w, th) => {
            setWindowDays(w);
            setThresholdPct(th);
          }}
          onRunAnalysis={runAnalysis}
          loading={loading}
        />

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={runAnalysis}
              className="px-3 py-1.5 rounded-lg bg-rose-500 text-slate-950 font-bold hover:bg-rose-400 transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Live Loaded Results Section */}
        {analysisResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. Executive Position & Strategic Level Decision Card */}
            <ExecutiveDecisionCard
              setup={analysisResult.positionSetup}
              ticker={analysisResult.ticker}
              name={analysisResult.name}
            />

            {/* 2. Interactive Multi-Tier Visual Chart */}
            <InteractiveMarkovChart
              dataPoints={analysisResult.dataPoints}
              positionSetup={analysisResult.positionSetup}
              ticker={analysisResult.ticker}
              currency={analysisResult.currency}
            />

            {/* 3. 3x3 Transition Matrix & Stationary Distribution Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransitionMatrixHeatmap matrixData={analysisResult.transitionMatrix} />
              <StationaryGauge
                stationary={analysisResult.stationaryDistribution}
                forwardProjections={analysisResult.forwardProjections}
              />
            </div>

            {/* 4. Hidden Markov Model (HMM) & Walk-Forward Backtest Metrics */}
            <HmmAndBacktestCard
              hmmReturns={analysisResult.hmmReturns}
              backtest={analysisResult.backtest}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 glass-panel py-6 px-4 lg:px-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            <span className="font-bold text-slate-300">Markov Quantum Terminal</span>
            <span>—</span>
            <span>Olasılıksal Borsa & Rejim Analiz Platformu</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-slate-400 hover:text-cyan-400 transition-colors font-medium"
            >
              Markov & HMM Metodolojisi
            </button>
            <span>•</span>
            <a
              href="https://github.com/gokhangemini26/Markov-Zincirleri-Ile-Analiz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors font-medium"
            >
              GitHub Deposu
            </a>
          </div>
        </div>
      </footer>

      {/* Educational Guide Modal */}
      <EducationalModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
