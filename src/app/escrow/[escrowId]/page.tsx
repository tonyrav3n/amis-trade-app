'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { formatEther } from 'viem';
import {
  type EscrowData,
  EscrowStatus,
  P2P_ESCROW_CONTRACT,
} from '@/lib/contract';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import toast from 'react-hot-toast';

export default function EscrowPage() {
  const { escrowId } = useParams();
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const [actualEscrowId, setActualEscrowId] = useState<number | null>(null);
  const [isLoadingTxData, setIsLoadingTxData] = useState(true);

  // Contract interaction hooks
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: txConfirmed,
  } = useWaitForTransactionReceipt({ hash: txHash });

  // Fetch escrow details from contract
  const {
    data: escrowData,
    isLoading: isLoadingEscrow,
    error: escrowError,
    refetch,
  } = useReadContract({
    address: P2P_ESCROW_CONTRACT.address,
    abi: P2P_ESCROW_CONTRACT.abi,
    functionName: 'getEscrow',
    args: actualEscrowId !== null ? [BigInt(actualEscrowId)] : undefined,
    query: {
      enabled: actualEscrowId !== null,
    },
  }) as {
    data: EscrowData | undefined,
    isLoading: boolean,
    error: any,
    refetch: () => void
  };

  // Map escrowData array to object if needed
  let mappedEscrowData = escrowData;
  if (escrowData && Array.isArray(escrowData)) {
    mappedEscrowData = {
      buyer: escrowData[0],
      seller: escrowData[1],
      amount: escrowData[2],
      item: escrowData[3],
      description: escrowData[4],
      status: escrowData[5],
      deadline: escrowData[6],
    };
  }

  // Extract escrow ID from transaction hash
  useEffect(() => {
    const fetchEscrowId = async () => {
      if (!escrowId || !publicClient || typeof escrowId !== 'string' ||
          !escrowId.startsWith('0x')) {
        setIsLoadingTxData(false);
        return;
      }
      try {
        setIsLoadingTxData(true);
        const receipt = await publicClient.getTransactionReceipt(
            { hash: escrowId as `0x${string}` });
        // Parse logs to find EscrowCreated event
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
        for (const log of receipt.logs) {
          try {
            if (!log || !log.data || !log.topics) continue;
            const decoded = (await import('viem')).decodeEventLog({
              abi: [escrowCreatedEvent],
              data: log.data,
              topics: log.topics,
            });
            if (decoded.eventName === 'EscrowCreated') {
              setActualEscrowId(Number(decoded.args.escrowId));
              break;
            }
          } catch (err) {
            // ignore decoding errors for unrelated logs
          }
        }
      } catch (error) {
        toast.error('Failed to load escrow details');
      } finally {
        setIsLoadingTxData(false);
      }
    };
    fetchEscrowId();
  }, [escrowId, publicClient]);

  // Debug escrow data loading
  useEffect(() => {
    console.log('Escrow data state - escrowData:', escrowData,
        'isLoadingEscrow:', isLoadingEscrow);
    if (escrowError) {
      console.error('Contract read error:', escrowError);
    }
    if (actualEscrowId !== null && !isLoadingEscrow && !escrowData &&
        !escrowError) {
      console.log('Contract call completed but returned no data - args:',
          [BigInt(actualEscrowId)]);
      console.log('Contract address:', P2P_ESCROW_CONTRACT.address);
      console.log('Function name:', 'getEscrow');
    }
  }, [escrowData, isLoadingEscrow, escrowError, actualEscrowId]);

  // Alternative: If transaction parsing fails, try to get the latest escrow
  useEffect(() => {
    if (actualEscrowId === null && !isLoadingTxData) {
      console.log('Transaction parsing failed, trying alternative approach...');
      // You could implement logic here to get the latest escrow or show a form
      // for the user to manually enter the escrow ID
    }
  }, [actualEscrowId, isLoadingTxData]);

  // Handle transaction success
  useEffect(() => {
    if (txConfirmed) {
      toast.success('Transaction completed successfully!');
      refetch(); // Refresh escrow data
    }
  }, [txConfirmed, refetch]);

  const handleAcceptEscrow = () => {
    if (!isConnected || actualEscrowId === null) {
      toast.error('Please connect your wallet');
      return;
    }

    writeContract({
      address: P2P_ESCROW_CONTRACT.address,
      abi: P2P_ESCROW_CONTRACT.abi,
      functionName: 'acceptEscrow',
      args: [BigInt(actualEscrowId)],
    });
  };

  const handleReleaseFunds = () => {
    if (!isConnected || actualEscrowId === null) {
      toast.error('Please connect your wallet');
      return;
    }

    writeContract({
      address: P2P_ESCROW_CONTRACT.address,
      abi: P2P_ESCROW_CONTRACT.abi,
      functionName: 'releaseFunds',
      args: [BigInt(actualEscrowId)],
    });
  };

  const handleRefund = () => {
    if (!isConnected || actualEscrowId === null) {
      toast.error('Please connect your wallet');
      return;
    }

    writeContract({
      address: P2P_ESCROW_CONTRACT.address,
      abi: P2P_ESCROW_CONTRACT.abi,
      functionName: 'refund',
      args: [BigInt(actualEscrowId)],
    });
  };

  const getStatusText = (status: EscrowStatus) => {
    switch (status) {
      case EscrowStatus.Created:
        return 'Created - Awaiting Seller';
      case EscrowStatus.Accepted:
        return 'Accepted - Awaiting Delivery';
      case EscrowStatus.Completed:
        return 'Completed';
      case EscrowStatus.Refunded:
        return 'Refunded';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: EscrowStatus) => {
    switch (status) {
      case EscrowStatus.Created:
        return 'text-yellow-600 bg-yellow-100';
      case EscrowStatus.Accepted:
        return 'text-blue-600 bg-blue-100';
      case EscrowStatus.Completed:
        return 'text-green-600 bg-green-100';
      case EscrowStatus.Refunded:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const canAccept = mappedEscrowData && typeof address === 'string' &&
      typeof mappedEscrowData.seller === 'string' && address.toLowerCase() ===
      mappedEscrowData.seller.toLowerCase() && mappedEscrowData.status ===
      EscrowStatus.Created;
  const canRelease = mappedEscrowData && typeof address === 'string' &&
      typeof mappedEscrowData.buyer === 'string' && address.toLowerCase() ===
      mappedEscrowData.buyer.toLowerCase() && mappedEscrowData.status ===
      EscrowStatus.Accepted;
  const canRefund = mappedEscrowData && typeof address === 'string' &&
      typeof mappedEscrowData.buyer === 'string' && address.toLowerCase() ===
      mappedEscrowData.buyer.toLowerCase() && mappedEscrowData.status ===
      EscrowStatus.Created;

  if (isLoadingTxData) {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-white">
          <div
              className="bg-white/80 border rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
            <div
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading escrow details...</p>
          </div>
        </div>
    );
  }

  if (actualEscrowId === null) {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-white">
          <div
              className="bg-white/80 border rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Escrow Not
              Found</h2>
            <p className="text-gray-600 mb-4">Could not find escrow details for
              this transaction.</p>
            <a href="/" className="text-pink-500 hover:text-pink-600 underline">
              Return to Home
            </a>
          </div>
        </div>
    );
  }

  return (
      <div
          className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div
            className="bg-white/80 border rounded-3xl p-8 shadow-xl max-w-lg w-full">

          {isLoadingEscrow ? (
              <div className="text-center">
                <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading escrow data...</p>
              </div>
          ) : mappedEscrowData ? (
              <>
                {/* Escrow Status Badge */}
                <div className="mb-6">
                <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                        mappedEscrowData.status)}`}>
                  {getStatusText(mappedEscrowData.status)}
                </span>
                </div>

                {/* Escrow Details */}
                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Item</h4>
                      <p className="text-lg font-semibold text-gray-900">{mappedEscrowData.item}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                      <p className="text-gray-700">{mappedEscrowData.description}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Amount</h4>
                      <p className="text-2xl font-bold text-pink-600">
                        {mappedEscrowData?.amount
                            ? formatEther(mappedEscrowData.amount)
                            : '0'} ETH
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Buyer</h4>
                        <p className="text-xs font-mono text-gray-700 break-all">
                          {mappedEscrowData.buyer}
                          {address && mappedEscrowData.buyer &&
                              address.toLowerCase() ===
                              mappedEscrowData.buyer.toLowerCase() && (
                                  <span
                                      className="text-pink-600 font-semibold"> (You)</span>
                              )}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Seller</h4>
                        <p className="text-xs font-mono text-gray-700 break-all">
                          {mappedEscrowData.seller}
                          {address && mappedEscrowData.seller &&
                              address.toLowerCase() ===
                              mappedEscrowData.seller.toLowerCase() && (
                                  <span
                                      className="text-pink-600 font-semibold"> (You)</span>
                              )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isConnected ? (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">Connect your wallet to
                        interact with this escrow</p>
                      <ConnectButton/>
                    </div>
                ) : (
                    <div className="space-y-3">
                      {canAccept && (
                          <button
                              onClick={handleAcceptEscrow}
                              disabled={isPending || isConfirming}
                              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50"
                          >
                            {isPending || isConfirming
                                ? 'Processing...'
                                : 'Accept Escrow'}
                          </button>
                      )}

                      {canRelease && (
                          <button
                              onClick={handleReleaseFunds}
                              disabled={isPending || isConfirming}
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50"
                          >
                            {isPending || isConfirming
                                ? 'Processing...'
                                : 'Release Funds to Seller'}
                          </button>
                      )}

                      {canRefund && (
                          <button
                              onClick={handleRefund}
                              disabled={isPending || isConfirming}
                              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50"
                          >
                            {isPending || isConfirming
                                ? 'Processing...'
                                : 'Request Refund'}
                          </button>
                      )}

                      {!canAccept && !canRelease && !canRefund && (
                          <div className="text-center text-gray-600">
                            <p>No actions available for your wallet address at
                              this time.</p>
                          </div>
                      )}
                    </div>
                )}

                {/* Transaction Hash Link */}
                <div
                    className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-500 mb-2">Escrow
                    Transaction:</p>
                  <a
                      href={`https://sepolia.etherscan.io/tx/${escrowId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-600 text-sm font-mono break-all"
                  >
                    {escrowId}
                  </a>
                </div>
              </>
          ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 text-red-600">Failed to
                  Load Escrow</h2>
                <p className="text-gray-600">Could not fetch escrow data from
                  the blockchain.</p>
              </div>
          )}
        </div>
      </div>
  );
}
