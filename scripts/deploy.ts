import { ethers } from 'hardhat';

async function main() {
  console.log('Deploying P2PEscrow contract...');

  // Get the contract factory
  const P2PEscrow = await ethers.getContractFactory('P2PEscrow');

  // Deploy the contract
  const escrow = await P2PEscrow.deploy();

  // Wait for deployment to complete
  await escrow.waitForDeployment();

  // Use type assertion to access contract address
  const contractAddress = (escrow as any).address;

  console.log(`P2PEscrow deployed to: ${contractAddress}`);
  console.log(`Transaction hash: ${escrow.deploymentTransaction()?.hash}`);

  // Save deployment info
  console.log('\n🎉 Deployment Complete!');
  console.log('Add this to your frontend:');
  console.log(`Contract Address: ${contractAddress}`);
  console.log('Network: Sepolia Testnet');
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
