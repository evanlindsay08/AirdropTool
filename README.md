# Solana Token Airdrop Tool

A user-friendly dashboard for distributing tokens on the Solana blockchain.

## Features
- Token verification and balance checking
- Multiple distribution methods:
  - Fixed amount distribution
  - Range-based distribution
  - Proportional distribution
- Flexible recipient selection:
  - Top holders
  - Random holders
  - Custom address list
- Transaction priority settings
- Preview functionality
- Service fee implementation

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- Solana Web3.js
- Wallet Adapter

## Project Structure

src/
├── components/
│ ├── AirdropForm.tsx # Main airdrop form component
│ ├── Header.tsx # Navigation header
│ └── WalletContextProvider.tsx
├── pages/
│ └── index.tsx # Main page
└── styles/
└── globals.css # Global styles

## Getting Started

1. Clone the repository:

bash
git clone https://github.com/evanlindsay08/AirdropTool.git
cd AirdropTool

2. Install dependencies:

bash
npm install

3. Run the development server:

bash
npm run dev

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License
MIT

