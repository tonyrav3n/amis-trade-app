// Contract deployed on Sepolia testnet
export const P2P_ESCROW_CONTRACT = {
  address: '0x2207Bab64eAF91daf61e3EB562E97E1a26be8f73' as `0x${string}`,
  abi: [
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'internalType': 'uint256',
          'name': 'escrowId',
          'type': 'uint256',
        },
        {
          'indexed': true,
          'internalType': 'address',
          'name': 'seller',
          'type': 'address',
        },
      ],
      'name': 'EscrowAccepted',
      'type': 'event',
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'internalType': 'uint256',
          'name': 'escrowId',
          'type': 'uint256',
        },
        {
          'indexed': true,
          'internalType': 'address',
          'name': 'buyer',
          'type': 'address',
        },
      ],
      'name': 'EscrowCompleted',
      'type': 'event',
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'internalType': 'uint256',
          'name': 'escrowId',
          'type': 'uint256',
        },
        {
          'indexed': true,
          'internalType': 'address',
          'name': 'buyer',
          'type': 'address',
        },
        {
          'indexed': true,
          'internalType': 'address',
          'name': 'seller',
          'type': 'address',
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256',
        },
      ],
      'name': 'EscrowCreated',
      'type': 'event',
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'internalType': 'uint256',
          'name': 'escrowId',
          'type': 'uint256',
        },
        {
          'indexed': true,
          'internalType': 'address',
          'name': 'buyer',
          'type': 'address',
        },
      ],
      'name': 'EscrowRefunded',
      'type': 'event',
    },
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': '_escrowId',
          'type': 'uint256',
        },
      ],
      'name': 'acceptEscrow',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function',
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': '_seller',
          'type': 'address',
        },
        {
          'internalType': 'string',
          'name': '_item',
          'type': 'string',
        },
        {
          'internalType': 'string',
          'name': '_description',
          'type': 'string',
        },
      ],
      'name': 'createEscrow',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256',
        },
      ],
      'stateMutability': 'payable',
      'type': 'function',
    },
    {
      'inputs': [],
      'name': 'escrowCounter',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256',
        },
      ],
      'stateMutability': 'view',
      'type': 'function',
    },
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256',
        },
      ],
      'name': 'escrows',
      'outputs': [
        {
          'internalType': 'address',
          'name': 'buyer',
          'type': 'address',
        },
        {
          'internalType': 'address',
          'name': 'seller',
          'type': 'address',
        },
        {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256',
        },
        {
          'internalType': 'string',
          'name': 'item',
          'type': 'string',
        },
        {
          'internalType': 'string',
          'name': 'description',
          'type': 'string',
        },
        {
          'internalType': 'enum P2PEscrow.EscrowStatus',
          'name': 'status',
          'type': 'uint8',
        },
        {
          'internalType': 'uint256',
          'name': 'createdAt',
          'type': 'uint256',
        },
      ],
      'stateMutability': 'view',
      'type': 'function',
    },
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': '_escrowId',
          'type': 'uint256',
        },
      ],
      'name': 'getEscrow',
      'outputs': [
        {
          'internalType': 'address',
          'name': 'buyer',
          'type': 'address',
        },
        {
          'internalType': 'address',
          'name': 'seller',
          'type': 'address',
        },
        {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256',
        },
        {
          'internalType': 'string',
          'name': 'item',
          'type': 'string',
        },
        {
          'internalType': 'string',
          'name': 'description',
          'type': 'string',
        },
        {
          'internalType': 'enum P2PEscrow.EscrowStatus',
          'name': 'status',
          'type': 'uint8',
        },
        {
          'internalType': 'uint256',
          'name': 'createdAt',
          'type': 'uint256',
        },
      ],
      'stateMutability': 'view',
      'type': 'function',
    },
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': '_escrowId',
          'type': 'uint256',
        },
      ],
      'name': 'refund',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function',
    },
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': '_escrowId',
          'type': 'uint256',
        },
      ],
      'name': 'releaseFunds',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function',
    },
  ],
} as const;

// Escrow status enum
export enum EscrowStatus {
  Created = 0,
  Accepted = 1,
  Completed = 2,
  Refunded = 3
}

// Type definitions
export interface EscrowData {
  buyer: `0x${string}`;
  seller: `0x${string}`;
  amount: bigint;
  item: string;
  description: string;
  status: EscrowStatus;
  createdAt: bigint;
}
