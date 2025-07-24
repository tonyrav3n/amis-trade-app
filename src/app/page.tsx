'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import CreateEscrowModal from '@/components/CreateEscrowModal';
import toast from 'react-hot-toast';

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [createdEscrowId, setCreatedEscrowId] = useState<string | null>(null);
  const { address, isConnected } = useAccount();

  const handleEscrowCreated = (transactionHash: string) => {
    setCreatedEscrowId(transactionHash);
    toast.success('Escrow created successfully!');
  };

  const getEscrowLink = () => {
    if (!createdEscrowId) return '';
    return `${window.location.origin}/escrow/${createdEscrowId}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getEscrowLink());
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleCreateEscrowClick = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setShowModal(true);
  };

  return (
      <div className="min-h-screen bg-white">
        {/* Enhanced Gradient Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-white to-blue-50 -z-10"/>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-100/30 via-transparent to-transparent -z-10"/>

        {/* Main Content */}
        <main className="flex items-center justify-center px-4 pt-16 pb-8">
          <div className="w-full max-w-lg">
            {/* Enhanced Hero Section */}
            <div className="text-center mb-10">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                P2P Escrow Trading
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Secure peer-to-peer trades with built-in escrow protection.<br/>
                <span className="text-sm text-gray-500">Trade digital goods safely with smart contracts.</span>
              </p>
            </div>

            {/* Wallet Connection Status */}
            {isConnected && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span className="font-medium">Wallet Connected</span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
            )}

            {/* Success Message */}
            {createdEscrowId && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-6 shadow-lg">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Escrow Created!</h3>
                    <p className="text-green-600 text-sm mb-4">Share this link with the seller to begin the trade:</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <input
                          type="text"
                          value={getEscrowLink()}
                          readOnly
                          className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                      />
                      <button
                          onClick={copyLink}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                        onClick={() => setCreatedEscrowId(null)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                    >
                      ← Create Another Escrow
                    </button>
                  </div>
                </div>
            )}

            {/* Main Action Card */}
            {!createdEscrowId && (
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                  {/* Create Escrow Button */}
                  <button
                      onClick={handleCreateEscrowClick}
                      disabled={!isConnected}
                      className={`w-full font-semibold py-8 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                        isConnected 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white cursor-pointer' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className={`p-3 rounded-full ${isConnected ? 'bg-white/20' : 'bg-gray-200'}`}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-xl">Create Escrow Link</div>
                        {!isConnected && (
                          <div className="text-sm opacity-75 mt-1">Connect wallet to continue</div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Info Cards */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-blue-600 font-semibold text-sm">No Upfront Payment</div>
                      <div className="text-blue-500 text-xs mt-1">Pay only after seller accepts</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <div className="text-purple-600 font-semibold text-sm">Secure & Safe</div>
                      <div className="text-purple-500 text-xs mt-1">Smart contract protection</div>
                    </div>
                  </div>
                </div>
            )}

            {/* Enhanced How it works */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">How it works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-2xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <div className="font-medium text-gray-900">Create Escrow</div>
                    <div className="text-sm text-gray-600">Buyer creates escrow proposal (no payment required yet)</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-2xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <div className="font-medium text-gray-900">Seller Accepts</div>
                    <div className="text-sm text-gray-600">Seller reviews and accepts the deal terms</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-2xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <div className="font-medium text-gray-900">Secure Payment</div>
                    <div className="text-sm text-gray-600">Buyer funds escrow, seller delivers digital goods</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-2xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                  <div>
                    <div className="font-medium text-gray-900">Complete Trade</div>
                    <div className="text-sm text-gray-600">Buyer confirms receipt and releases payment to seller</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-10 text-center">
              <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Dispute Protection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <span>Smart Contract</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <span>Instant Settlement</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Modal */}
        {showModal && (
            <CreateEscrowModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleEscrowCreated}
            />
        )}
      </div>
  );
}
