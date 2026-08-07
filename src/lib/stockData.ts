import { StockPreset } from '@/types/markov';

export const STOCK_PRESETS: StockPreset[] = [
  // BIST Star Stocks
  { symbol: 'THYAO.IS', name: 'Türk Hava Yolları', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'FROTO.IS', name: 'Ford Otomotiv', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'EREGL.IS', name: 'Ereğli Demir Çelik', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'ASELS.IS', name: 'Aselsan', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'TUPRS.IS', name: 'Tüpraş', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'BIMAS.IS', name: 'BİM Mağazacılık', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'AKBNK.IS', name: 'Akbank', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'GARAN.IS', name: 'Garanti BBVA', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'SISE.IS', name: 'Şişecam', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'KCHOL.IS', name: 'Koç Holding', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'SASA.IS', name: 'SASA Polyester', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'PETKM.IS', name: 'Petkim', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'YKBNK.IS', name: 'Yapı ve Kredi Bankası', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'ISCTR.IS', name: 'İş Bankası (C)', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'TCELL.IS', name: 'Turkcell', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'PGSUS.IS', name: 'Pegasus Hava Taşımacılığı', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'SAHOL.IS', name: 'Sabancı Holding', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },
  { symbol: 'ENKAI.IS', name: 'Enka İnşaat', category: 'BIST', currency: 'TL', exchange: 'Borsa İstanbul' },

  // Indices
  { symbol: 'XU100.IS', name: 'BIST 100 Endeksi', category: 'INDEX', currency: 'Puan', exchange: 'Borsa İstanbul' },
  { symbol: 'XU030.IS', name: 'BIST 30 Endeksi', category: 'INDEX', currency: 'Puan', exchange: 'Borsa İstanbul' },
  { symbol: 'SPY', name: 'S&P 500 ETF Trust', category: 'INDEX', currency: 'USD', exchange: 'NYSE Arca' },
  { symbol: 'QQQ', name: 'Invesco QQQ (Nasdaq 100)', category: 'INDEX', currency: 'USD', exchange: 'NASDAQ' },

  // Global Megacaps
  { symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'GLOBAL', currency: 'USD', exchange: 'NASDAQ' },
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'GLOBAL', currency: 'USD', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', category: 'GLOBAL', currency: 'USD', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'GLOBAL', currency: 'USD', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'GLOBAL', currency: 'USD', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'GLOBAL', currency: 'USD', exchange: 'NASDAQ' },

  // Cryptos
  { symbol: 'BTC-USD', name: 'Bitcoin / US Dollar', category: 'CRYPTO', currency: 'USD', exchange: 'Crypto' },
  { symbol: 'ETH-USD', name: 'Ethereum / US Dollar', category: 'CRYPTO', currency: 'USD', exchange: 'Crypto' },
  { symbol: 'SOL-USD', name: 'Solana / US Dollar', category: 'CRYPTO', currency: 'USD', exchange: 'Crypto' }
];

export const TIMEFRAMES = [
  { id: '1M', label: '1 Ay', days: 30 },
  { id: '3M', label: '3 Ay', days: 90 },
  { id: '6M', label: '6 Ay', days: 180 },
  { id: '1Y', label: '1 Yıl', days: 365 },
  { id: '3Y', label: '3 Yıl', days: 365 * 3 },
  { id: '5Y', label: '5 Yıl', days: 365 * 5 },
  { id: '10Y', label: '10 Yıl', days: 365 * 10 },
  { id: 'CUSTOM', label: 'Özel Tarih', days: 0 }
];
