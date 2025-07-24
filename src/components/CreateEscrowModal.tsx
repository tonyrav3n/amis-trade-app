'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { decodeEventLog, parseEther } from 'viem';
import { P2P_ESCROW_CONTRACT } from '@/lib/contract';

const escrowCreatedEvent = {
  type: 'event',
  name: 'EscrowCreated',
  inputs: [
    { indexed: true, name: 'escrowId', type: 'uint256' },
    { indexed: true, name: 'buyer', type: 'address' },
    { indexed: true, name: 'seller', type: 'address' },
    { indexed: false, name: 'amount', type: 'uint256' },
  ],
};

interface FormData {
  item: string;
  description: string;
  amount: string;
  sellerAddress: string;
}

interface CreateEscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transactionHash: string) => void;
}

export default function CreateEscrowModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateEscrowModalProps) {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: wagmiReceipt,
  } =
      useWaitForTransactionReceipt({ hash });

  const [formData, setFormData] = useState<FormData>({
    item: '',
    description: '',
    amount: '',
    sellerAddress: '',
  });
  const [isReviewMode, setIsReviewMode] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Validate seller address is different from buyer
    if (address && formData.sellerAddress.toLowerCase() ===
        address.toLowerCase()) {
      toast.error('Seller address cannot be the same as your wallet address');
      return;
    }

    // Validate seller address format
    if (!formData.sellerAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    // Validate amount is greater than 0
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    setIsReviewMode(true);
  };

  const handleConfirm = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    console.log('Creating escrow with:', {
      seller: formData.sellerAddress,
      item: formData.item,
      description: formData.description,
      amount: formData.amount,
      amountInWei: parseEther(formData.amount).toString(),
    });

    try {
      // Call the smart contract to create escrow (no funding required)
      writeContract({
        address: P2P_ESCROW_CONTRACT.address,
        abi: P2P_ESCROW_CONTRACT.abi,
        functionName: 'createEscrow',
        args: [
          formData.sellerAddress as `0x${string}`,
          parseEther(formData.amount),
          formData.item,
          formData.description
        ],
        // No value needed - funding happens after seller accepts
      });

    } catch (err) {
      console.error('Error creating escrow:', err);
      toast.error('Failed to create escrow');
    }
  };

  // Handle transaction success
  React.useEffect(() => {
    const handleRedirect = async () => {
      if (isConfirmed && hash) {
        try {
          // Prefer wagmi's receipt if available
          let receipt = wagmiReceipt;
          if (!receipt) {
            // Fallback: fetch from Infura if wagmi receipt is missing
            const infuraUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || '';
            const res = await fetch(
                infuraUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_getTransactionReceipt',
                    params: [hash],
                    id: 1,
                  }),
                });
            if (!res.ok) {
              toast.error(
                  `Failed to fetch transaction receipt: ${res.status} ${res.statusText}`);
              return;
            }
            const data = await res.json();
            if (!data.result) {
              toast.error(
                  'Transaction receipt not found yet. Please wait and refresh.');
              return;
            }
            receipt = data.result;
          }
          // Find EscrowCreated event log using viem's decodeEventLog
          let escrowId = null;
          if (receipt && Array.isArray(receipt.logs)) {
            console.log('All logs in receipt:', receipt.logs);
            for (const log of receipt.logs) {
              try {
                if (!log || !log.data || !log.topics) continue;
                const decoded = decodeEventLog({
                  abi: [escrowCreatedEvent],
                  data: log.data,
                  topics: log.topics,
                });
                console.log('Decoded log:', decoded);
                if (decoded.eventName === 'EscrowCreated' && decoded.args) {
                  const args = decoded.args as { escrowId: bigint; buyer: string; seller: string; amount: bigint };
                  escrowId = Number(args.escrowId);
                  break;
                }
              } catch (error) {
                console.error('Failed to decode log:', error, log);
              }
            }
          }
          if (escrowId !== null) {
            onSubmit(hash); // Use transaction hash instead of escrow ID
            // Optionally, close the modal after creation
            onClose();
          } else {
            toast.error(
                'Could not find EscrowCreated event in transaction logs. The transaction may have failed or is not yet indexed. Check the browser console for log details.');
          }
        } catch (err) {
          toast.error(
              'Failed to parse transaction receipt. Please check the transaction on Etherscan.');
        }
      }
    };
    handleRedirect();
     
  }, [isConfirmed, hash, wagmiReceipt, onSubmit, onClose]);

  // Handle transaction error
  React.useEffect(() => {
    if (error) {
      toast.error('Transaction failed: ' + error.message);
    }
  }, [error]);

  const handleBack = () => {
    setIsReviewMode(false);
  };

  const handleClose = () => {
    onClose();
    setIsReviewMode(false);
    // Reset form when closing
    setFormData({
      item: '',
      description: '',
      amount: '',
      sellerAddress: '',
    });
  };

  if (!isOpen) return null;

  return (
      <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}>
        <div
            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative z-10"
            onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {isReviewMode ? 'Review Escrow Details' : 'Create Escrow'}
            </h3>
            <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none"
                   stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {!isReviewMode ? (
              /* Form */
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Item Field */}
                <div>
                  <label
                      className="block text-sm font-medium text-gray-700 mb-2">
                    Item
                  </label>
                  <input
                      type="text"
                      name="item"
                      value={formData.item}
                      onChange={handleInputChange}
                      placeholder="Digital artwork, software license, domain name..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                      required
                  />
                </div>

                {/* Item Description Field */}
                <div>
                  <label
                      className="block text-sm font-medium text-gray-700 mb-2">
                    Item Description
                  </label>
                  <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detailed description of the item, including specifications, condition, or terms..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all resize-none placeholder-gray-500"
                      required
                  />
                </div>

                {/* Seller Address Field */}
                <div>
                  <label
                      className="block text-sm font-medium text-gray-700 mb-2">
                    Seller Wallet Address
                  </label>
                  <input
                      type="text"
                      name="sellerAddress"
                      value={formData.sellerAddress}
                      onChange={handleInputChange}
                      placeholder="0x1234...abcd"
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                      required
                  />
                </div>

                {/* Amount Field */}
                <div>
                  <label
                      className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (ETH)
                  </label>
                  <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.05"
                      step="0.001"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                      required
                  />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!isConnected}
                    className="w-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!isConnected ? 'Connect Wallet First' : 'Review Details'}
                </button>
              </form>
          ) : (
              /* Review Mode */
              <div className="space-y-6">
                {/* Review Card */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Item</h4>
                    <p className="text-lg font-semibold text-gray-900">{formData.item}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                    <p className="text-gray-700">{formData.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Seller
                      Address</h4>
                    <p className="text-gray-700 font-mono text-sm break-all">{formData.sellerAddress}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Amount</h4>
                    <p className="text-2xl font-bold text-pink-600">{formData.amount} ETH</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                      onClick={handleBack}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-2xl transition-all"
                  >
                    Back
                  </button>
                  <button
                      onClick={handleConfirm}
                      disabled={isPending || isConfirming}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-2xl transition-all disabled:opacity-50"
                  >
                    {isPending ? 'Confirm in Wallet...' :
                        isConfirming ? 'Creating Escrow...' :
                            'Create Escrow'}
                  </button>
                </div>

                {hash && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Transaction Hash:</p>
                      <a
                          href={`https://sepolia.etherscan.io/tx/${hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-600 text-sm font-mono break-all"
                      >
                        {hash}
                      </a>
                    </div>
                )}
              </div>
          )}
        </div>
      </div>
  );
}
