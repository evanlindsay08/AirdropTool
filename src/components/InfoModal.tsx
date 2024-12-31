import React, { FC, useState } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  if (!isOpen) return null;

  const intro = {
    title: "Welcome to PUMP Airdrop",
    description: (
      <div className="space-y-4">
        <p>
          PUMP Airdrop is a specialized tool designed for the Solana ecosystem, enabling token creators and projects to efficiently distribute tokens to their community.
        </p>
        <p>
          Our platform offers advanced distribution methods including fixed amounts, range-based allocations, and proportional distributions based on holder criteria.
        </p>
        <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20 mt-6">
          <h4 className="text-emerald-400 font-bold mb-2">Key Features:</h4>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li>Multiple distribution methods</li>
            <li>Automatic holder snapshot integration</li>
            <li>Custom address list support</li>
            <li>Preview and verification system</li>
            <li>Transaction priority options</li>
          </ul>
        </div>
      </div>
    )
  };

  const steps = [
    {
      title: "Enter Token Details",
      description: "Input your token's contract address. Our system will automatically verify and load your token's information.",
      icon: (
        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      title: "Configure Distribution",
      description: "Choose how you want to distribute your tokens: fixed amount, range-based, or proportional to holdings. Then select your target holders.",
      icon: (
        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      title: "Review & Execute",
      description: "Preview your airdrop configuration, confirm the details, and execute the distribution. A small fee will be burned to support the ecosystem.",
      icon: (
        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-xl p-8 max-w-2xl w-full border border-zinc-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {currentPage === 0 ? (
          <>
            <h2 className="text-2xl font-bold text-emerald-400 mb-8">{intro.title}</h2>
            <div className="text-zinc-300 leading-relaxed">
              {intro.description}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-emerald-400 mb-8">How It Works</h2>
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-200 mb-2">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-4 mt-8">
          {currentPage === 1 && (
            <button
              onClick={() => setCurrentPage(0)}
              className="flex-1 py-4 bg-zinc-800 text-zinc-300 rounded-lg font-medium hover:bg-zinc-700 transition-all duration-200"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (currentPage === 0) {
                setCurrentPage(1);
              } else {
                setCurrentPage(0);
                onClose();
              }
            }}
            className="flex-1 py-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all duration-200"
          >
            {currentPage === 0 ? 'Next' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal; 