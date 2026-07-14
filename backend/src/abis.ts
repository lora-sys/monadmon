export const monsterNftAbi = [
  {
    type: "event",
    name: "EggMinted",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MonsterHatched",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
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
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "newXp", type: "uint32" },
      { name: "newAtk", type: "uint16" },
      { name: "trainedAt", type: "uint64" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BattleResolved",
    inputs: [
      { name: "winnerTokenId", type: "uint256", indexed: true },
      { name: "loserTokenId", type: "uint256", indexed: true },
      { name: "draw", type: "bool" },
      { name: "turns", type: "uint8" },
    ],
    anonymous: false,
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
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "battleView",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "hp", type: "uint16" },
      { name: "atk", type: "uint16" },
      { name: "def", type: "uint16" },
      { name: "spd", type: "uint16" },
      { name: "element", type: "uint8" },
    ],
  },
] as const;

export const battleAbi = [
  {
    type: "event",
    name: "ChallengeCreated",
    inputs: [
      { name: "challengeId", type: "uint256", indexed: true },
      { name: "challenger", type: "address", indexed: true },
      { name: "challengerTokenId", type: "uint256", indexed: false },
      { name: "opponent", type: "address", indexed: true },
      { name: "opponentTokenId", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ChallengeAccepted",
    inputs: [{ name: "challengeId", type: "uint256", indexed: true }],
    anonymous: false,
  },
  {
    type: "event",
    name: "ChallengeResolved",
    inputs: [
      { name: "challengeId", type: "uint256", indexed: true },
      { name: "winnerTokenId", type: "uint256" },
      { name: "loserTokenId", type: "uint256" },
      { name: "draw", type: "bool" },
      { name: "turns", type: "uint8" },
    ],
    anonymous: false,
  },
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
] as const;
