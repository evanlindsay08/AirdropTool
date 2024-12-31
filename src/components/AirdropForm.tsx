import React, { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface TokenInfo {
  balance: number;
  symbol: string;
  decimals: number;
  price?: number;
  name: string;
  image?: string;
}

interface HolderDistribution {
  address: string;
  amount: number;
}

type DistributionType = 'fixed' | 'range' | 'proportional' | '';

interface Props {
  // remove isTourActive?: boolean;
}

// Add interface for preview calculations
interface PreviewCalculations {
  distributions: HolderDistribution[];
  totalTokens: number;
  serviceFee: number;
  gasFee: number;
  totalCost: number;
}

const AirdropForm: FC = () => {
  const { connected, publicKey } = useWallet();
  const [contractAddress, setContractAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  
  // Airdrop Amount Settings
  const [distributionType, setDistributionType] = useState<DistributionType | ''>('');
  const [totalAirdropAmount, setTotalAirdropAmount] = useState('');
  const [rangeMin, setRangeMin] = useState('');
  const [rangeMax, setRangeMax] = useState('');
  const [proportionalPercentage, setProportionalPercentage] = useState('');
  
  // Distribution settings
  const [holderType, setHolderType] = useState('');
  const [numberOfHolders, setNumberOfHolders] = useState('');
  const [customAddresses, setCustomAddresses] = useState('');
  const [feeLevel, setFeeLevel] = useState('default');
  const [preview, setPreview] = useState<HolderDistribution[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Add a new state for the amount error
  const [amountError, setAmountError] = useState<string | null>(null);

  // Add state for dropdown
  const [showRecipientList, setShowRecipientList] = useState(false);

  // Add state for confirmation dialog
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Add validation function
  const isValidTokenAddress = (address: string): boolean => {
    // Check if address length is between 32-44 characters and ends with "pump"
    return address.length >= 32 && 
           address.length <= 44 && 
           address.toLowerCase().endsWith('pump');
  };

  // Calculate total tokens to be distributed
  const calculateTotalTokens = () => {
    if (!tokenInfo) return 0;
    
    const rawAmount = totalAirdropAmount.replace(/,/g, '');
    
    switch (distributionType) {
      case 'fixed':
        return Number(rawAmount) || 0;
      case 'range':
        // For preview, we'll show the maximum possible amount
        return Number(rangeMax) * (holderType === 'Custom List' 
          ? customAddresses.split('\n').filter(addr => addr.trim()).length 
          : Number(numberOfHolders)) || 0;
      case 'proportional':
        return ((Number(proportionalPercentage) / 100) * tokenInfo.balance) || 0;
      default:
        return 0;
    }
  };

  // Add a function to format number with commas
  const formatNumberWithCommas = (value: string) => {
    // Remove any existing commas first
    const number = value.replace(/,/g, '');
    // Add commas for thousands
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Add gas fee estimates
  const gasFeeEstimates = {
    low: 0.000005,
    default: 0.00001,
    high: 0.00002
  };

  // Update useEffect to use new validation
  useEffect(() => {
    if (contractAddress && isValidTokenAddress(contractAddress)) {
      checkToken();
    } else if (contractAddress && contractAddress.length >= 32 && !contractAddress.toLowerCase().endsWith('pump')) {
      setError('Invalid token: Address must end with "pump"');
      setTokenInfo(null);
    } else if (contractAddress && (contractAddress.length > 44 || contractAddress.length < 32)) {
      setError('Invalid token address');
      setTokenInfo(null);
    }
  }, [contractAddress, connected]);

  // Add a new useEffect to watch for wallet connection
  useEffect(() => {
    if (connected && contractAddress && error === 'Please connect your wallet to verify token holdings') {
      checkToken();
    }
  }, [connected, contractAddress, error]);

  const checkToken = async () => {
    if (!connected) {
      setError('Please connect your wallet to verify token holdings');
      setTokenInfo(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Simulate API call - replace with actual token check
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response - replace with actual token data
      const mockToken = {
        balance: 1000000,
        symbol: 'TEST',
        decimals: 9,
        price: 0.15,
        name: 'Test Token',
        image: 'https://via.placeholder.com/40' // Replace with actual token image
      };
      
      setTokenInfo(mockToken);
      setStep(2);
    } catch (err) {
      setError('Invalid token address or token not found');
      setTokenInfo(null);
    }
    setLoading(false);
  };

  // Add function to generate preview calculations
  const generatePreviewCalculations = (): PreviewCalculations => {
    const serviceFee = 10000; // Fixed service fee
    const baseGasFee = gasFeeEstimates[feeLevel as keyof typeof gasFeeEstimates];
    let distributions: HolderDistribution[] = [];
    let totalTokens = 0;

    // Get addresses based on selection method
    const addresses = holderType === 'Custom List' 
      ? customAddresses.split('\n').filter(addr => addr.trim())
      : Array.from({ length: Number(numberOfHolders) }, (_, i) => 
          `Address${i + 1}...${Math.random().toString(36).substring(7)}`
        );

    // Calculate total gas fee for all transactions
    const totalGasFee = baseGasFee * addresses.length;

    // Calculate distribution based on type
    switch (distributionType) {
      case 'fixed':
        const fixedAmount = Number(totalAirdropAmount.replace(/,/g, ''));
        const amountPerWallet = fixedAmount / addresses.length;
        distributions = addresses.map(addr => ({
          address: addr,
          amount: amountPerWallet
        }));
        totalTokens = fixedAmount;
        break;

      case 'range':
        const min = Number(rangeMin);
        const max = Number(rangeMax);
        distributions = addresses.map(addr => ({
          address: addr,
          amount: Math.floor(Math.random() * (max - min + 1) + min)
        }));
        totalTokens = distributions.reduce((sum, dist) => sum + dist.amount, 0);
        break;

      case 'proportional':
        const percentage = Number(proportionalPercentage);
        const totalAvailable = tokenInfo?.balance || 0;
        const amountToDistribute = (totalAvailable * percentage) / 100;
        const amountPerAddress = amountToDistribute / addresses.length;
        distributions = addresses.map(addr => ({
          address: addr,
          amount: amountPerAddress
        }));
        totalTokens = amountToDistribute;
        break;
    }

    return {
      distributions,
      totalTokens,
      serviceFee,
      gasFee: totalGasFee,
      totalCost: serviceFee + totalGasFee
    };
  };

  // Update the handleAmountChange function
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, ''); // Remove any existing commas
    const formattedValue = formatNumberWithCommas(rawValue);
    setTotalAirdropAmount(formattedValue);
    
    if (tokenInfo && Number(rawValue) > tokenInfo.balance) {
      setAmountError(`Amount exceeds your token balance of ${tokenInfo.balance.toLocaleString()} ${tokenInfo.symbol}`);
    } else {
      setAmountError(null);
    }
  };

  // Update the handleDistributionPreview function
  const handleDistributionPreview = () => {
    const preview = generatePreviewCalculations();
    setPreview(preview.distributions);
    setShowPreview(true);
  };

  return (
    <div className="max-w-3xl mx-auto mt-24 p-8 pb-12 bg-zinc-900/80 rounded-xl shadow-xl border border-zinc-800">
      <h2 className="text-2xl font-bold text-zinc-200 mb-10">Airdrop Configuration</h2>
      
      <div className="space-y-8">
        <div className="token-input-container">
          <label className="block text-zinc-400 mb-2 font-medium tracking-wide text-sm">
            Token Contract Address
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full p-3 bg-black/50 rounded-lg text-zinc-200 border border-zinc-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none font-mono"
              placeholder="Enter Solana token address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
            {loading && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
              </div>
            )}
          </div>
          
          {!connected && contractAddress && (
            <div className="mt-2 text-red-400 text-sm">
              Unable to verify token holdings, please connect your wallet.
            </div>
          )}
          
          {error && error !== 'Please connect your wallet to verify token holdings' && (
            <div className="mt-2 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {tokenInfo && (
            <div className="mt-4 space-y-4">
              {/* Token Preview Card */}
              <div className="flex items-center p-4 bg-black/30 rounded-lg border border-zinc-800">
                {tokenInfo.image ? (
                  <img 
                    src={tokenInfo.image} 
                    alt={tokenInfo.name} 
                    className="w-10 h-10 rounded-full mr-4"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center mr-4">
                    <span className="text-emerald-400 font-bold text-sm">
                      {tokenInfo.symbol.slice(0, 2)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-zinc-200 font-bold">{tokenInfo.name}</h3>
                      <p className="text-zinc-400 text-sm">${tokenInfo.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">
                        {tokenInfo.balance.toLocaleString()} {tokenInfo.symbol}
                      </p>
                      <p className="text-zinc-400 text-sm">
                        ≈ ${(tokenInfo.balance * (tokenInfo.price || 0)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {(step >= 2) && (
          <div className="distribution-type-container space-y-4">
            <label className="block text-zinc-400 mb-2 font-medium tracking-wide text-sm">
              Distribution Amount Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { type: 'fixed', label: 'Fixed Amount' },
                { type: 'range', label: 'Amount Range' },
                { type: 'proportional', label: 'Proportional' }
              ].map(({ type, label }) => (
                <button
                  key={type}
                  className={`p-4 rounded-lg border ${
                    distributionType === type
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-zinc-800 bg-black/30 text-zinc-400 hover:border-emerald-500/30'
                  } transition-all text-sm font-medium`}
                  onClick={() => {
                    setDistributionType(type as DistributionType);
                    setStep(3);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Amount Input Based on Type */}
            {step >= 3 && (
              <div className="space-y-4 pt-4">
                {distributionType === 'fixed' && (
                  <div>
                    <label className="block text-zinc-400 mb-2 font-medium tracking-wide text-sm">
                      Total Amount to Airdrop
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className={`w-full p-3 bg-black/50 rounded-lg text-zinc-200 border ${
                          amountError ? 'border-red-500' : 'border-zinc-800'
                        } focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none pr-20`}
                        placeholder="Enter amount"
                        value={totalAirdropAmount}
                        onChange={handleAmountChange}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                        {tokenInfo?.symbol}
                      </span>
                    </div>
                    {amountError && (
                      <div className="mt-2 text-red-400 text-sm">
                        {amountError}
                      </div>
                    )}
                  </div>
                )}

                {distributionType === 'range' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-2 font-medium tracking-wide text-sm">
                        Minimum Amount
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          className="w-full p-3 bg-black/50 rounded-lg text-zinc-200 border border-zinc-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none pr-20"
                          placeholder="Min amount"
                          value={rangeMin}
                          onChange={(e) => setRangeMin(e.target.value)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                          {tokenInfo?.symbol}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-2 font-medium tracking-wide text-sm">
                        Maximum Amount
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          className="w-full p-3 bg-black/50 rounded-lg text-zinc-200 border border-zinc-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none pr-20"
                          placeholder="Max amount"
                          value={rangeMax}
                          onChange={(e) => setRangeMax(e.target.value)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                          {tokenInfo?.symbol}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {distributionType === 'proportional' && (
                  <div>
                    <label className="block text-zinc-400 mb-2 font-medium tracking-wide text-sm">
                      Percentage of Holdings
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full p-3 bg-black/50 rounded-lg text-zinc-200 border border-zinc-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none pr-20"
                        placeholder="Enter percentage"
                        value={proportionalPercentage}
                        onChange={(e) => setProportionalPercentage(e.target.value)}
                        max="100"
                        min="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">%</span>
                    </div>
                    <div className="mt-2 text-sm text-zinc-400">
                      Total tokens to distribute: {calculateTotalTokens().toLocaleString()} {tokenInfo?.symbol}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step 3: Distribution Method */}
      {step >= 3 && tokenInfo && (
        <div className="space-y-6 pt-4 border-t border-zinc-800">
          <div className="holder-selection-container">
            <label className="block text-zinc-400 mb-2 font-medium tracking-wide text-sm">
              Holder Selection Method
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['Top Holders', 'Random Holders', 'Custom List'].map((method) => (
                <button
                  key={method}
                  className={`p-4 rounded-lg border ${
                    holderType === method
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-zinc-800 bg-black/30 text-zinc-400 hover:border-emerald-500/30'
                  } transition-all text-sm font-medium`}
                  onClick={() => {
                    setHolderType(method);
                    setStep(4);
                  }}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Distribution Configuration */}
          {step >= 4 && (
            <div className="space-y-6 pt-4 border-t border-zinc-800">
              {holderType !== 'Custom List' ? (
                <div>
                  <label className="block text-zinc-400 mb-2 font-medium tracking-wide text-sm">Number of Holders</label>
                  <input
                    type="number"
                    className="w-full p-3 bg-black/50 rounded-lg text-zinc-200 border border-zinc-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none"
                    placeholder="Enter number of holders"
                    value={numberOfHolders}
                    onChange={(e) => setNumberOfHolders(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-zinc-400 mb-2 font-medium tracking-wide text-sm">Custom Addresses</label>
                  <textarea
                    className="w-full p-3 bg-black/50 rounded-lg text-zinc-200 border border-zinc-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none h-32 font-mono"
                    placeholder="Enter addresses (one per line)"
                    value={customAddresses}
                    onChange={(e) => setCustomAddresses(e.target.value)}
                  />
                </div>
              )}

              {/* Fee Selection */}
              <div>
                <label className="block text-zinc-400 mb-2 font-medium tracking-wide text-sm">
                  Transaction Priority
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['low', 'default', 'high'].map((fee) => (
                    <button
                      key={fee}
                      className={`p-4 rounded-lg border ${
                        feeLevel === fee
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-zinc-800 bg-black/30 text-zinc-400 hover:border-emerald-500/30'
                      } transition-all text-sm font-medium`}
                      onClick={() => setFeeLevel(fee)}
                    >
                      <div className="font-medium">{fee.charAt(0).toUpperCase() + fee.slice(1)}</div>
                      <div className="text-xs mt-1 text-zinc-500">
                        {fee === 'low' ? '~30 seconds' : fee === 'default' ? '~15 seconds' : '~5 seconds'}
                      </div>
                      <div className="text-xs mt-1 text-emerald-400/70">
                        {gasFeeEstimates[fee as keyof typeof gasFeeEstimates]} SOL
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Disclaimer before Preview */}
              <div className="mt-4 p-4 bg-red-900 rounded-lg border-2 border-red-500">
                <p className="text-white text-sm flex items-center font-bold">
                  <svg className="w-5 h-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>
                    <span className="text-yellow-300">Important:</span> By using our service, a fee of{' '}
                    <span className="text-yellow-300">10,000 {tokenInfo?.symbol}</span> will be burnt from your balance.
                  </span>
                </p>
              </div>

              {/* Preview Button */}
              <button
                className="w-full py-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all duration-200 shadow-lg mt-8"
                onClick={handleDistributionPreview}
              >
                Preview Airdrop
              </button>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-2xl w-full border border-zinc-800 max-h-[90vh] flex flex-col">
            <h3 className="text-xl font-bold text-zinc-200 mb-4">Airdrop Preview</h3>
            
            {/* Token Info and Summary Section */}
            <div className="space-y-4 mb-4">
              {/* Token Info Card */}
              <div className="flex items-center p-3 bg-black/30 rounded-lg border border-zinc-800">
                {tokenInfo?.image ? (
                  <img src={tokenInfo.image} alt={tokenInfo.name} className="w-10 h-10 rounded-full mr-3" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center mr-3">
                    <span className="text-emerald-400 font-bold">{tokenInfo?.symbol.slice(0, 2)}</span>
                  </div>
                )}
                <div>
                  <h3 className="text-zinc-200 font-bold">{tokenInfo?.name}</h3>
                  <p className="text-zinc-400 text-sm">${tokenInfo?.symbol}</p>
                </div>
              </div>

              {/* Summary Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-black/30 rounded-lg border border-zinc-800">
                  <p className="text-zinc-400 text-sm">Total Amount</p>
                  <p className="text-emerald-400 font-bold">
                    {calculateTotalTokens().toLocaleString()} {tokenInfo?.symbol}
                  </p>
                </div>
                <div className="p-3 bg-black/30 rounded-lg border border-zinc-800">
                  <p className="text-zinc-400 text-sm">Recipients</p>
                  <p className="text-emerald-400 font-bold">{preview.length}</p>
                </div>
              </div>

              {/* Fees Section */}
              <div className="p-3 bg-black/30 rounded-lg border border-zinc-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-400">Network Fee (per tx)</span>
                  <span className="text-emerald-400 font-mono">
                    {gasFeeEstimates[feeLevel as keyof typeof gasFeeEstimates]} SOL
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Total Network Fee ({preview.length} tx)</span>
                  <span className="text-emerald-400 font-mono">
                    {(gasFeeEstimates[feeLevel as keyof typeof gasFeeEstimates] * preview.length).toFixed(6)} SOL
                  </span>
                </div>
              </div>

              {/* Warning about service fee */}
              <div className="p-3 bg-red-900/50 rounded-lg border border-red-500">
                <p className="text-white text-sm flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>
                    <span className="text-yellow-300">Warning:</span> Confirming this airdrop will burn{' '}
                    <span className="text-yellow-300">10,000 {tokenInfo?.symbol}</span> as a service fee
                  </span>
                </p>
              </div>
            </div>

            {/* Recipients List Section - Update this part */}
            <div className="flex flex-col">
              <button
                onClick={() => setShowRecipientList(!showRecipientList)}
                className="w-full p-3 bg-black/30 rounded-lg border border-zinc-800 flex justify-between items-center text-zinc-200 hover:bg-black/50 transition-all"
              >
                <span>View Recipients List</span>
                <svg
                  className={`w-5 h-5 transform transition-transform ${showRecipientList ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showRecipientList && (
                <div className="mt-2 border border-zinc-800 rounded-lg overflow-hidden">
                  <div className="bg-zinc-800 p-3 grid grid-cols-12 gap-4 sticky top-0">
                    <div className="col-span-7 text-zinc-300 text-sm font-medium">Address</div>
                    <div className="col-span-5 text-right text-zinc-300 text-sm font-medium">Amount</div>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {preview.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 p-3 hover:bg-black/30 border-t border-zinc-800/50">
                        <span className="col-span-7 text-zinc-400 font-mono text-sm truncate">
                          {item.address}
                        </span>
                        <span className="col-span-5 text-right text-emerald-400 font-mono text-sm">
                          {item.amount.toLocaleString()} {tokenInfo?.symbol}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-4">
              <button
                className="flex-1 py-3 bg-zinc-800 text-zinc-300 rounded-lg font-medium hover:bg-zinc-700 transition-all"
                onClick={() => setShowPreview(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all"
                onClick={() => setShowConfirmation(true)}
              >
                Confirm Airdrop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60]">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-md w-full border border-zinc-800">
            <h3 className="text-xl font-bold text-zinc-200 mb-4">Confirm Action</h3>
            <p className="text-zinc-300 mb-6">This action cannot be undone. Are you sure you want to continue?</p>
            
            <div className="flex space-x-4">
              <button
                className="flex-1 py-3 bg-zinc-800 text-zinc-300 rounded-lg font-medium hover:bg-zinc-700 transition-all"
                onClick={() => setShowConfirmation(false)}
              >
                Back
              </button>
              <button
                className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all"
                onClick={() => {
                  // Handle final confirmation
                  setShowConfirmation(false);
                  setShowPreview(false);
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirdropForm; 