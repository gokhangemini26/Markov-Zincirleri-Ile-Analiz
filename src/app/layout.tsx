import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Markov Quantum — Markov Zincirleri ve HMM ile Hisse Analiz Terminali',
  description: 'Markov zincirleri, Gizli Markov Modelleri (HMM), geçiş matrisleri ve dinamik ATR stop-loss tamponları ile BIST ve küresel hisse senedi rejim analizi.',
  keywords: ['Markov Zincirleri', 'Hisse Analizi', 'BIST 100', 'THYAO', 'FROTO', 'Rejim Analizi', 'Kantitatif Finans', 'HMM', 'Al-Sat Sinyalleri']
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className="antialiased min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
