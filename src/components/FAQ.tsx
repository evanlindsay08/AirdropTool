import React, { FC, useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Where can I get support?",
    answer: "Join our Discord community for immediate support or reach out via Twitter. Our team is available 24/7 to help with any questions."
  },
  {
    question: "Where is the reclaimed SOL coming from?",
    answer: "The SOL is reclaimed from burned tokens and redistributed to participants in the ecosystem."
  },
  {
    question: "How much can I reclaim from burning?",
    answer: "The amount varies based on the token and current burn rates. Check the calculator in our tool for an estimate."
  },
  {
    question: 'What does "cleanup" do?',
    answer: "Cleanup helps optimize your wallet by removing unnecessary token accounts and reclaiming rent."
  },
  {
    question: "Why can't I see my wallet to connect it?",
    answer: "Make sure you have a Solana wallet installed (Phantom, Solflare, etc.) and it's properly set up in your browser."
  },
  {
    question: "Why can't I reclaim any SOL from a compressed NFT?",
    answer: "Compressed NFTs use a different storage method that doesn't allow for traditional SOL reclamation."
  },
  {
    question: "Do you charge any fees?",
    answer: "We charge a small processing fee for each transaction to maintain the service and develop new features."
  },
  {
    question: "How can I burn an LP (Liquidity Pool)?",
    answer: "Select the LP token from your wallet and use our specialized LP burning tool for optimal results."
  },
  {
    question: "How do I burn a specific amount of tokens?",
    answer: "Enter the desired amount in the input field after selecting your token. Our tool will calculate the optimal burn strategy."
  },
  {
    question: "I burned but I don't think I got anything. What's going on?",
    answer: "Transactions can take a few moments to process. Check your wallet history or transaction ID for confirmation."
  }
];

const FAQ: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto mt-16 p-8">
      <h2 className="text-2xl font-bold text-emerald-400 mb-8 text-center">FAQ</h2>
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50 hover:border-emerald-500/30 transition-colors"
          >
            <button
              className="w-full px-8 py-6 text-left flex justify-between items-center text-zinc-200 hover:text-emerald-400 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="text-base font-medium pr-8">{item.question}</span>
              <span className="flex-shrink-0">
                {openIndex === index ? (
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-8 pb-6 text-base text-zinc-400 border-t border-zinc-800 pt-4 mt-2">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ; 