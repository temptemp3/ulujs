# swap

`swap` is a JavaScript library for interacting with HumbleSwap liquidity pools to perform swaps on Voi Chain. It provides a convenient interface for swapping both standard and smart assets.

## Features

- Interaction with ARC200 tokens on the AVM blockchains.
- Comprehensive methods for token balance checks, transfers, approvals, and allowances.
- Extended functionalities for enhanced token management.
- Swap standard and smart assets on Voi Chain.

## Installation

Install `ulujs` in your project with:

```bash
npm install ulujs
```

## Usage

Import and initialize the `swap` library in your project:

```javascript
import algosdk from "algosdk";
import { arc200 as Contract } from "ulujs";

// Initialize Algod client
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
const indexerClient = new algosdk.Indexer(
  indexerToken,
  indexerServer,
  indexerPort
);

// Initialize ARC200 Contract instance
const tokenId = 123456; // Replace with your token ID (pool ID)
const contract = new Contract(tokenId, algodClient, indexerClient);
```

## Usage

```javascript
// el
const A = {
  contractId: el.tokAId,
  tokenId: el.tokATokenId,
  symbol: el.tokAName,
  amount,
};
const B = {
  contractId: el.tokBId,
  tokenId: el.tokBTokenId,
  symbol: el.tokBName,
  decimals: `${el.tokBDecimals || 0}`,
};
const acc = {
  addr: activeAccount.address,
  sk: new Uint8Array(0),
};
const ci = new swap(poolId, algodClient, indexerClient, { acc });
const swapR = await ci.swap(acc.addr, poolId, A, B);
console.log(swapR);
if (!swapR.success) {
  throw new Error("Swap failed");
}
// sign and send swapR.txns
```

## Contributing

Contributions to `arc200js` are welcome. Please adhere to the existing code style and ensure all tests pass.

## License

`arc200js` is [MIT licensed](./LICENSE).
