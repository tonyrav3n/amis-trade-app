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

  const handleFormSubmit = (formData: FormData) => {
    // TODO: Handle form submission
    console.log('Form data:', formData);
    setShowModal(false);
  };

  return (
      <div className="min-h-screen bg-white">
        {/* Gradient Background */}
        <div
            className="fixed inset-0 bg-gradient-to-br from-pink-50 via-white to-pink-50 -z-10"/>

        {/* Main Content */}
        <main className="flex items-center justify-center px-4 pt-16">
          <div className="w-full max-w-md">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">P2P Escrow
                Trading</h2>
              <p className="text-gray-600">Secure peer-to-peer trades with
                built-in escrow protection</p>
            </div>

            {/* Main Action Card */}
            <div
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 shadow-xl">
              {/* Create Escrow Link */}
              <button
                  onClick={() => setShowModal(true)}
                  className="w-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold py-6 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                <div className="flex flex-col items-center space-y-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                  </svg>
                  <span className="text-lg">Create Escrow Link</span>
                </div>
              </button>
            </div>

            {/* Connect Wallet Prompt */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Connect your wallet to start trading securely
              </p>
            </div>
          </div>
        </main>

        {/* Modal */}
        <CreateEscrowModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleFormSubmit}
        />
      </div>
  );
}
