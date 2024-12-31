import { FC, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import AirdropForm from '../components/AirdropForm';
import TokenInfoStrip from '../components/TokenInfoStrip';
import FAQ from '../components/FAQ';
import InfoModal from '../components/InfoModal';

const WalletContextProvider = dynamic(
  () => import('../components/WalletContextProvider'),
  { ssr: false }
);

export default function Home() {
  const [showInitialInfo, setShowInitialInfo] = useState(false);

  return (
    <WalletContextProvider>
      <div className="relative min-h-screen">
        <Header onInfoClick={() => setShowInitialInfo(true)} />
        <main className="container mx-auto px-4 pt-24 pb-8">
          <AirdropForm />
          <TokenInfoStrip />
          <FAQ />
        </main>
        <InfoModal isOpen={showInitialInfo} onClose={() => setShowInitialInfo(false)} />
      </div>
    </WalletContextProvider>
  );
} 