'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div
              className="w-8 h-8 bg-pink-500 rounded-lg"/>
          <h1 className="text-xl font-bold text-gray-900">Amis Trade</h1>
        </div>

        {/* Custom Styled Connect Button */}
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            return (
                <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                          <button
                              onClick={openConnectModal}
                              type="button"
                              className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-2 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                          >
                            Connect Wallet
                          </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                          <button
                              onClick={openChainModal}
                              type="button"
                              className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                          >
                            Wrong network
                          </button>
                      );
                    }

                    return (
                        <div className="flex items-center space-x-3">
                          <button
                              onClick={openChainModal}
                              type="button"
                              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-pink-700 font-medium px-4 py-2 rounded-2xl transition-all hover:bg-white/90 shadow-lg"
                          >
                            {chain.hasIcon && (
                                <div
                                    style={{
                                      background: chain.iconBackground,
                                      width: 16,
                                      height: 16,
                                      borderRadius: 999,
                                      overflow: 'hidden',
                                    }}
                                >
                                  {chain.iconUrl && (
                                      <img
                                          alt={chain.name ?? 'Chain icon'}
                                          src={chain.iconUrl}
                                          style={{ width: 16, height: 16 }}
                                      />
                                  )}
                                </div>
                            )}
                            <span>{chain.name}</span>
                          </button>

                          <button
                              onClick={openAccountModal}
                              type="button"
                              className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-2 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                          >
                            {account.displayName}
                            {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ''}
                          </button>
                        </div>
                    );
                  })()}
                </div>
            );
          }}
        </ConnectButton.Custom>
      </header>
  );
}
