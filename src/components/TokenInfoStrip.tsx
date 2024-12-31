import React, { FC, useState } from 'react';

const TokenInfoStrip: FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('c69Z2Uc6XeJizghBkaKESQcKMqyhbf7C57Y8HW1pump');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-zinc-900/80 rounded-xl shadow-xl border border-zinc-800">
      <div className="space-y-6 text-center">
        <div>
          <div className="text-base text-zinc-400 mb-1">Contract Address</div>
          <div className="flex items-center justify-center">
            <button 
              onClick={handleCopy}
              className="text-emerald-400 text-base font-mono font-bold hover:text-emerald-300 transition-colors flex items-center group"
            >
              c69Z2Uc6XeJizghBkaKESQcKMqyhbf7C57Y8HW1pump
              <svg 
                className="w-5 h-5 ml-2 text-zinc-500 group-hover:text-emerald-400 transition-colors" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {copied ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-base text-zinc-400 mb-1">Token Supply</div>
            <div className="text-zinc-200 text-base font-bold">1,000,000,000</div>
          </div>
          <div>
            <div className="text-base text-zinc-400 mb-1">Ticker</div>
            <div className="text-zinc-200 text-base font-bold">$PUMP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInfoStrip; 