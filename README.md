# 🌌 MARKOV QUANTUM — Markov Zincirleri & HMM ile Kantitatif Hisse Analiz Terminali

> **Borsa İstanbul (BIST 30 / 100), Global Megacap Hisseler (NVDA, AAPL, MSFT), Endeksler (SPY, QQQ) ve Kripto Varlıklar için Olasılıksal Rejim Modellemesi, 3x3 Geçiş Matrisi, Durağan Dağılım, Dinamik ATR Stop-Loss ve Al-Sat Sinyal Terminali.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

---

## ⚡ Özellikler

- **🎯 Net Pozisyon & Strateji Karar Merkezi:**
  - 🟢 **GÜÇLÜ BOĞA (Strong Long):** Trend devamı ve kırılım teyidi.
  - 🔴 **AYI BASKISI (Defensive Short):** Düşüş baskısı ve defansif korunma.
  - 🟡 **YATAY KONSOLİDASYON (Neutral / Wait):** Sıkışma bandı ve kırılım bekleyişi.
- **🛡️ 1.5x ATR Dinamik Volatilite Stop-Loss:**
  - Sabit yüzdeli stoplar yerine piyasa gürültüsünden arındırılmış dinamik koruma tamponu.
- **📊 3x3 Markov Rejim Geçiş Matrisi ($P$):**
  - Ayı $\rightarrow$ Ayı, Ayı $\rightarrow$ Yatay, Ayı $\rightarrow$ Boğa olasılıkları ve kalıcılık köşegeni ($P_{00}, P_{11}, P_{22}$).
- **🧭 Durağan Dağılım ($\pi$) & $P^n$ Matris Kuvveti:**
  - Hissenin tarihsel rejim dengesi ($\pi P = \pi$) ve $t+1, t+5, t+20, t+60$ gün sonraki olasılık projeksiyonları.
- **📈 Gizli Markov Modeli (HMM — Baum-Welch & Viterbi):**
  - Her rejim durumuna karşılık gelen beklenen günlük ortalama getiri ve volatilite analizi.
- **🧪 Walk-Forward Backtest Simülasyonu:**
  - Sıfır lookahead bias ile Sharpe Oranı, Maksimum Düşüş (MDD), Kâr Faktörü ve Kazanma Oranı.
- **🎛️ Geniş Varlık & Zaman Yelpazesi:**
  - `THYAO`, `FROTO`, `EREGL`, `ASELS`, `TUPRS`, `BIMAS`, `AKBNK`, `GARAN`, `SISE`, `KCHOL`, `SASA`, `PETKM`, `XU100`, `SPY`, `QQQ`, `NVDA`, `AAPL`, `BTC-USD`, `ETH-USD` ve Özel Ticker girişi.
  - 1 Ay, 3 Ay, 6 Ay, 1 Yıl, 3 Yıl, 5 Yıl, 10 Yıl veya Özel Tarih Aralığı.
- **🧮 İnteraktif Risk & Sermaye Hesaplayıcı:**
  - Portföy büyüklüğü ve risk toleransına göre otomatik lot ve zarar kes miktarı hesaplama.

---

## 🚀 Hızlı Başlangıç & Yerel Kurulum

```bash
# Depoyu klonlayın
git clone https://github.com/gokhangemini26/Markov-Zincirleri-Ile-Analiz.git
cd Markov-Zincirleri-Ile-Analiz

# Bağımlılıkları yükleyin
npm install

# Geliştirici sunucusunu başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

---

## ☁️ Vercel Üzerinde Tek Tıkla Dağıtım

1. [Vercel](https://vercel.com)'e gidin ve **"Add New Project"** butonuna tıklayın.
2. `https://github.com/gokhangemini26/Markov-Zincirleri-Ile-Analiz` deposunu seçin.
3. Framework Preset olarak **Next.js** otomatik algılanacaktır.
4. **Deploy** butonuna basarak canlıya alın!

---

## 📐 Matematiksel Altyapı

Markov süreci, gelecekteki fiyat rejiminin sadece bugünkü duruma bağlı olduğunu varsayar:

$$P(X_{t+1} = j \mid X_t = i) = P_{ij}$$

Durağan dağılım ($\pi$) şu lineer sistem çözülerek elde edilir:

$$\pi P = \pi \quad \text{ve} \quad \sum_{i} \pi_i = 1.0$$

Stop-Loss seviyesi ise ortalama gerçek aralık ($ATR_{14}$) ile hesaplanır:

$$\text{Long Stop} = \text{Giriş Fiyatı} - (1.5 \times ATR_{14})$$

---

## 📄 Lisans

MIT License © 2026. Bütün kantitatif analiz modelleri açık kaynak ve geliştirmeye açıktır.
