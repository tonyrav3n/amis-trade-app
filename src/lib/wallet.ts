'use client';

import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

const sepoliaRpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

export const config = getDefaultConfig({
  appName: 'Amis Trade',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? '',
  chains: [
    {
      ...sepolia,
      rpcUrls: {
        default: { http: [sepoliaRpcUrl!] },
      },
    },
  ],
  ssr: true,
});
