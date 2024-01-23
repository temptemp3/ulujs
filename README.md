# ulujs

`ulujs` is a JavaScript library for interacting with smart contracts on the AVM blockchains. It provides a convenient interface for interacting with the smart contract tokens, nfts, and dexes.

## Features

- Interaction with smart contract tokens (arc200, arc72)
- Comprehensive methods for performing swaps and liquidity provision (swap200)

## Installation

Install `ulujs` in your project with:

```bash
npm install ulujs
```

## Implementations

- `hsv2` - HumbleSwap Protocol (v2)
- `arc200` - ARC200 Smart Contract Token
- `arc72` - ARC72 Smart Contract NFT
  
## Usage

Import and initialize the `ulujs` library in your project:

```javascript
import algosdk from "algosdk";
import { arc200 as Contract } from "hsv2js";

// Initialize Algod client
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
const indexerClient = new algosdk.Indexer(
  indexerToken,
  indexerServer,
  indexerPort
);

// Initialize ARC200 Contract instance
const tokenId = 123456; // Replace with your token ID
const contract = new Contract.netTok(tokenId, algodClient, indexerClient);
```

### Event queries

The `query` argument may be used to retrieve matching events:

```javascript
const { minRound, maxRound, address, round, txid } = query || {};
```

`minRound` and `maxRound` may be used to specify a range of rounds to query events from. `address` may be used to filter events by address. `round` and `txid` may be used to retrieve events from a specific round or transaction ID.

The following events are available for extended ARC200 token functionalities:

### getEvents

Retrieve all events of the ARC200 token.

```javascript
await contract.getEvents();
//{
//   arc200_Transfer: {
//     name: "arc200_Transfer",
//     signature: "...",
//     selector: "...",
//     events: [
//       [
//         "WR4C7PMYKZ45ZWFWHTQRWHL424VDYXKYH4X2BX4J6KZ7BD3IQD4Q",
//         1519106,
//         1699029707,
//         "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ",
//         "VIAGCPULN6FUTHUNPQZDRQIHBT7IUVT264B3XDXLZNX7OZCJP6MEF7JFQU",
//         10000000000000000n,
//       ],
//       ...
//     ]
//   },
//   arc200_Approval: {
//     name: "arc200_Approval",
//     signature: "...",
//     selector: "...",
//     events: [
//       [
//         "WR4C7PMYKZ45ZWFWHTQRWHL424VDYXKYH4X2BX4J6KZ7BD3IQD4Q",
//         1519106,
//         1699029707,
//         "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ",
//         "VIAGCPULN6FUTHUNPQZDRQIHBT7IUVT264B3XDXLZNX7OZCJP6MEF7JFQU",
//         10000000000000000n,
//       ],
//       ...
//     ]
//   }
//}
```

### standard methods

The following methods are available for standard ARC200 token functionalities:

## API Reference

Each method provided by `ulujs` offers specific functionalities:

- `getEvents()`: Retrieves all events of the smart contract.

## Contributing

Contributions to `ulujs` are welcome. Please adhere to the existing code style and ensure all tests pass.

## License

`ulujs` is [MIT licensed](./LICENSE).
