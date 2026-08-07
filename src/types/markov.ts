export type RegimeType = 'BEAR' | 'SIDEWAYS' | 'BULL';

export interface DataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema20?: number;
  ema50?: number;
  ema200?: number;
  atr?: number;
  rollingReturn?: number;
  regime: RegimeType;
  regimeCode: 0 | 1 | 2; // 0: Bear, 1: Sideways, 2: Bull
}

export interface TransitionMatrix {
  matrix: number[][]; // 3x3: [From][To] -> probability 0..1
  persistence: {
    bear: number;
    sideways: number;
    bull: number;
  };
}

export interface StationaryDistribution {
  bear: number;
  sideways: number;
  bull: number;
}

export interface ForwardProjection {
  steps: number;
  probabilities: {
    bear: number;
    sideways: number;
    bull: number;
  };
}

export interface PositionSetup {
  currentPrice: number;
  currency: string;
  currentRegime: RegimeType;
  signalScore: number; // bull_prob - bear_prob (-1 .. +1)
  verdict: 'STRONG_LONG' | 'MODERATE_LONG' | 'NEUTRAL_WAIT' | 'DEFENSIVE_SHORT' | 'STRONG_SHORT';
  atr: number;
  atrStopBuffer: number;
  longSetup: {
    entryTrigger: number;
    stopLoss: number;
    takeProfit1: number;
    takeProfit2: number;
    riskRewardRatio: number;
    potentialGainPct: number;
    maxLossPct: number;
    condition: string;
  };
  shortSetup: {
    entryTrigger: number;
    stopLoss: number;
    takeProfit1: number;
    takeProfit2: number;
    riskRewardRatio: number;
    potentialGainPct: number;
    maxLossPct: number;
    condition: string;
  };
  tacticalAdvice: string;
}

export interface BacktestResults {
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  annualizedReturn: number;
}

export interface HmmRegimeReturn {
  regime: RegimeType;
  meanDailyReturnPct: number;
  volatilityPct: number;
  stateIndex: number;
}

export interface MarkovAnalysisResult {
  ticker: string;
  name: string;
  category: string;
  currency: string;
  startDate: string;
  endDate: string;
  totalBars: number;
  currentPrice: number;
  priceChangePct: number;
  dataPoints: DataPoint[];
  transitionMatrix: TransitionMatrix;
  stationaryDistribution: StationaryDistribution;
  forwardProjections: ForwardProjection[];
  positionSetup: PositionSetup;
  backtest: BacktestResults;
  hmmReturns: HmmRegimeReturn[];
  calculatedAt: string;
}

export interface StockPreset {
  symbol: string;
  name: string;
  category: 'BIST' | 'GLOBAL' | 'CRYPTO' | 'INDEX';
  currency: string;
  icon?: string;
  exchange: string;
}
