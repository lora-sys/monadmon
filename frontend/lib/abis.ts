// Minimal ABI fragments for the FE. Keep in sync with contracts/src/*.
export const monsterNftAbi = [
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "getMonster",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "speciesId", type: "uint16" },
          { name: "level", type: "uint16" },
          { name: "xp", type: "uint32" },
          { name: "stage", type: "uint8" },
          { name: "_reserved0", type: "uint8" },
          { name: "_reserved1", type: "uint16" },
          { name: "dna", type: "uint64" },
          { name: "hp", type: "uint16" },
          { name: "atk", type: "uint16" },
          { name: "def", type: "uint16" },
          { name: "spd", type: "uint16" },
          { name: "lastTrainedAt", type: "uint64" },
          { name: "battlesWon", type: "uint16" },
          { name: "battlesLost", type: "uint16" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "hasMintedEgg",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "mintGenesis",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
  {
    type: "function",
    name: "hatch",
    stateMutability: "nonpayable",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "train",
    stateMutability: "nonpayable",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "string" }],
  },
  {
    type: "event",
    name: "EggMinted",
    inputs: [
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MonsterHatched",
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { name: "speciesId", type: "uint16" },
      { name: "dna", type: "uint64" },
      { name: "rarity", type: "uint8" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Trained",
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { name: "newXp", type: "uint32" },
      { name: "newAtk", type: "uint16" },
      { name: "trainedAt", type: "uint64" },
    ],
    anonymous: false,
  },
] as const;

export const genesisMinterAbi = [
  {
    type: "function",
    name: "mintGenesis",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
] as const;

export const battleAbi = [
  {
    type: "function",
    name: "challengeCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "getChallenge",
    stateMutability: "view",
    inputs: [{ name: "challengeId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "challenger", type: "address" },
          { name: "challengerTokenId", type: "uint256" },
          { name: "opponent", type: "address" },
          { name: "opponentTokenId", type: "uint256" },
          { name: "state", type: "uint8" },
          { name: "winnerTokenId", type: "uint256" },
          { name: "loserTokenId", type: "uint256" },
          { name: "turns", type: "uint8" },
          { name: "draw", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "challenge",
    stateMutability: "nonpayable",
    inputs: [
      { name: "myTokenId", type: "uint256" },
      { name: "opponent", type: "address" },
      { name: "oppTokenId", type: "uint256" },
    ],
    outputs: [{ name: "challengeId", type: "uint256" }],
  },
  {
    type: "function",
    name: "acceptAndResolve",
    stateMutability: "nonpayable",
    inputs: [{ name: "challengeId", type: "uint256" }],
    outputs: [],
  },
] as const;
