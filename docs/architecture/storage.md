# Off-chain Storage

## tokenURI
- ERC-721 `tokenURI` returns `ipfs://<cid>/<tokenId>.json`.
- JSON schema (per OZ ERC-721 standard):
```json
{
  "name": "EmberFox #10293",
  "description": "A MonadMon. Born on Monad.",
  "image": "ipfs://<cid>/monsters/emberfox/stage2.png",
  "attributes": [
    { "trait_type": "Species", "value": "EmberFox" },
    { "trait_type": "Element", "value": "Fire" },
    { "trait_type": "Stage", "value": 2 },
    { "trait_type": "Level", "value": 14 },
    { "trait_type": "DNA", "value": "A83F92" },
    { "trait_type": "Rarity", "value": "Rare" }
  ]
}
```

## Pinata
- One Pinata account, one project.
- Upload species art + per-token metadata via Pinata API.
- Pin via `pinata.pinFileToIPFS` + `pinJSONToIPFS`.

## Public species catalog
- `/public/data/species.json` — the source of truth for the 12 species.
- Versioned. Frontend reads from here, never from contract (contract only stores IDs).

## Local dev
- In dev, `tokenURI` may return a `/api/mock-token/<id>` HTTP URL.
- Real testnet deploy uses IPFS.
