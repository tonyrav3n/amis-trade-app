'use client';

import { useState } from 'react';
import CreateEscrowModal from '@/components/CreateEscrowModal';

interface FormData {
  item: string;
  description: string;
  amount: string;
}

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [createdEscrowId, setCreatedEscrowId] = useState<string | null>(null);

  const handleEscrowCreated = (escrowId: string) => {
    setCreatedEscrowId(escrowId);
  };

  const getEscrowLink = () => {
    if (!createdEscrowId) return '';
    return `${window.location.origin}/escrow/${createdEscrowId}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getEscrowLink());
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
      <div className="min-h-screen bg-white">
        {/* Gradient Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-white to-pink-50 -z-10"/>

        {/* Main Content */}
        <main className="flex items-center justify-center px-4 pt-16">
          <div className="w-full max-w-md">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">P2P Escrow Trading</h2>
              <p className="text-gray-600">Secure peer-to-peer trades with built-in escrow protection</p>
            </div>

            {/* Success Message */}
            {createdEscrowId && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Escrow Created Successfully!</h3>
                  <p className="text-green-600 text-sm mb-4">Share this link with the seller:</p>
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                        type="text"
                        value={getEscrowLink()}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm"
                    />
                    <button
                        onClick={copyLink}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                  <button
                      onClick={() => setCreatedEscrowId(null)}
                      className="text-green-600 hover:text-green-800 text-sm"
                  >
                    Create Another Escrow
                  </button>
                </div>
            )}

            {/* Main Action Card */}
            {!createdEscrowId && (
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 shadow-xl">
                  {/* Create Escrow Link */}
                  <button
                      onClick={() => setShowModal(true)}
                      className="w-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold py-6 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                      </svg>
                      <span>Create Escrow Link</span>
                    </div>
                  </button>
                </div>
            )}

            {/* How it works */}
            <div className="mt-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span>Buyer creates escrow proposal (no payment yet)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span>Seller reviews and accepts escrow</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span>Buyer pays after seller accepts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <span>Seller ships item and confirms</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-bold">5</div>
                  <span>Buyer confirms receipt and releases funds</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Create Escrow Modal */}
        <CreateEscrowModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={handleEscrowCreated}
        />
      </div>
  );
}
