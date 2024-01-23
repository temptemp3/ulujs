# HumbleSwap V2 Protocol library (hsv2)

`hsv2` is a JavaScript library for interacting with HumbleSwapV2 tokens on the AVM blockchains. It provides a convenient interface for interacting with the HumbleSwapV2 AMM.

## Features

- Interaction with HumbleSwapV2 AMM.
- Comprehensive methods for performing swaps and liquidity provision.

## Installation

Install `hsv2` in your project with:

```bash
npm install hsv2
```

## Implementations

`hsv2` is spit into multiple implementations for each class of smart contract making up the HumbleSwapV2 AMM. The following implementations are available:

- `ann` - HumbleSwapV2 Announcer for staking pools
- `netTok` - HumbleSwapV2 Network-Token liquidity pool
- `tokTok` - HumbleSwapV2 Token-Token liquidity pool
- `tri` - HumbleSwapV2 Announcer for liquidity pools

## Usage

Import and initialize the `hsv2` library in your project:

```javascript
import algosdk from "algosdk";
import { CONTRACT, abi } from "hsv2";

// Initialize Algod client
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
const indexerClient = new algosdk.Indexer(
  indexerToken,
  indexerServer,
  indexerPort
);

// Initialize hsv2 Contract instance
const HMBLPALGOGALGO = 1234123; // Replace with your pool id
const ci = new CONTRACT(HMBLPALGOGALGO, algodClient, indexerClient, abi.hsv2.swap)
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
await ci.getEvents();
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


### deposit liquidity

```javascript
ci.setFee(2000);
ci.setPaymentAmount(1000); // 0.001 Algo
ci.setAssetTransfers([[1000, GALGO]]); // 0.001 gAlgo
const Provider_depositR = await ci.Provider_deposit([1000, 1000]); // 0.000967
//if (!Provider_depositR.success) ...
await signSendAndConfirm(Provider_depositR.txns, sk);
```

### withdraw liquidity

### swapAForB

### swapBForA

## API Reference

Each method provided by `hsv2` offers specific functionalities:

- `getEvents()`: Retrieves all events of the ARC200 token.

## Contributing

Contributions to `hsv2` are welcome. Please adhere to the existing code style and ensure all tests pass.

## todo 

- [ ] complete impl safe function non-read-only methods
- [ ] add events
- [ ] correct abi args

## License

`hsv2` is [MIT licensed](./LICENSE).
