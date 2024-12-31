import React, { FC, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import InfoModal from './InfoModal';

interface HeaderProps {
  onInfoClick: () => void;
}

const Header: FC<HeaderProps> = ({ onInfoClick }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-black/90 backdrop-blur-sm shadow-lg border-b border-zinc-800">
        {/* Left section */}
        <div className="flex items-center w-[200px]">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        </div>
        
        {/* Center section - Burn Counter */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-zinc-900 px-8 py-4 rounded-xl shadow-xl border border-zinc-800 hover:border-emerald-500/20 transition-colors">
            <div className="text-zinc-400 text-sm font-medium mb-1 tracking-wide">TOTAL BURN</div>
            <div className="flex items-baseline justify-center">
              <span id="burn-counter" className="text-3xl font-bold text-emerald-400 tabular-nums">
                1,234,567
              </span>
              <span className="text-sm text-zinc-500 ml-2 font-medium">TOKENS</span>
            </div>
          </div>
        </div>

        {/* Right section - Navigation and Wallet */}
        <div className="flex items-center gap-12">
          <nav className="flex items-center space-x-8">
            {[
              { name: 'pump.fun', href: '#' },
              { name: 'Twitter', href: '#' },
              { name: 'Info', onClick: onInfoClick }
            ].map((link) => (
              <button
                key={link.name}
                onClick={link.onClick}
                className="px-4 py-2 text-base font-medium text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/50 rounded-lg transition-all duration-200"
              >
                {link.name}
              </button>
            ))}
          </nav>
          
          <WalletMultiButton className="!bg-zinc-900 hover:!bg-zinc-800 !transition-all !duration-200 !rounded-lg !px-6 !py-3 !text-sm !font-medium !border !border-emerald-500/20 hover:!border-emerald-500/50 !text-emerald-400 !shadow-lg hover:!shadow-emerald-500/10" />
        </div>
      </header>

      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </>
  );
};

export default Header; 