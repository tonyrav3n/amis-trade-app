# P2P Escrow Trading Platform

A secure peer-to-peer escrow trading platform built on Ethereum for trading digital goods with smart contract protection.

## 🌟 Features

- **No Upfront Payment**: Buyers create escrow proposals without paying upfront
- **Smart Contract Security**: Built-in escrow protection using Solidity smart contracts
- **Dispute Resolution**: Built-in dispute mechanism for trade conflicts
- **Multi-step Trading Process**: Structured workflow from proposal to completion
- **Transaction Transparency**: All trades are recorded on the blockchain
- **Modern UI**: Clean, responsive interface built with Next.js and TailwindCSS

## 🚀 How It Works

1. **Create Escrow**: Buyer creates an escrow proposal (no payment required yet)
2. **Seller Accepts**: Seller reviews and accepts the deal terms
3. **Secure Payment**: Buyer funds escrow, seller delivers digital goods
4. **Complete Trade**: Buyer confirms receipt and releases payment to seller

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS
- **Blockchain**: Ethereum, Solidity
- **Web3**: Viem, Wagmi
- **Development**: Hardhat, TypeScript
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 18+ 
- pnpm
- MetaMask or compatible wallet
- Sepolia testnet ETH for testing

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd amis-trade-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SEPOLIA_RPC_URL=your_sepolia_rpc_url
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
   PRIVATE_KEY=your_private_key_for_deployment
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

4. **Compile smart contracts**
   ```bash
   npx hardhat compile
   ```

5. **Deploy contracts (optional)**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

6. **Start development server**
   ```bash
   pnpm dev
   ```

## 📁 Project Structure

```
├── contracts/           # Solidity smart contracts
│   └── Escrow.sol      # Main P2P escrow contract
├── scripts/            # Deployment scripts
├── src/
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   └── lib/            # Utilities and configurations
├── artifacts/          # Compiled contract artifacts
└── typechain-types/    # TypeScript contract types
```

## 🔒 Smart Contract

The P2P escrow contract (`contracts/Escrow.sol`) includes:

- **Escrow Creation**: Create escrow without upfront payment
- **Multi-party System**: Buyer, seller, and optional arbitrator roles
- **State Management**: Track escrow status through different states
- **Dispute Resolution**: Built-in arbitration mechanism
- **Secure Payments**: Funds are held securely until completion

### Contract Functions

- `createEscrow()`: Create new escrow proposal
- `acceptEscrow()`: Seller accepts the deal
- `fundEscrow()`: Buyer funds the escrow
- `confirmDelivery()`: Seller confirms item delivery
- `releasePayment()`: Buyer releases payment to seller
- `initiateDispute()`: Start dispute resolution process

## 🌐 Deployment

The application is configured for deployment on:

- **Testnet**: Sepolia (for testing)
- **Frontend**: Can be deployed to Vercel, Netlify, or similar platforms

## 🔗 Live Demo

[Add your deployment URL here when deployed]

## 🤝 Contributing

This is a proprietary project. If you're interested in contributing or collaborating, please contact the project owner for permission and licensing terms.

## ⚠️ Security Considerations

- This is a proprietary project with all rights reserved
- Smart contracts should be audited before mainnet deployment
- Always test thoroughly on testnets first
- Be cautious with private keys and sensitive information

## 📄 License

This project is proprietary and all rights are reserved. See the [LICENSE](LICENSE) file for details.

Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without prior written consent from the copyright holder.

## 🆘 Support

For support, licensing inquiries, or business discussions:

1. Contact the project owner directly
2. All usage requires explicit written permission
3. Commercial licensing available upon request

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Smart contracts powered by [Hardhat](https://hardhat.org/)
- Web3 integration using [Wagmi](https://wagmi.sh/) and [Viem](https://viem.sh/)
- UI styled with [TailwindCSS](https://tailwindcss.com/)

---

**⚡ Built for secure peer-to-peer trading on Ethereum**
