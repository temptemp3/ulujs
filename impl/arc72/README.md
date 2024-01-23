# arc72

`arc72` is a JavaScript library for interacting with AR7 NFTs on the AVM blockchains. It provides a convenient interface for both standard and extended ARC72 token functionalities.

## Features

- Interaction with ARC72 tokens on the AVM blockchains.
- Comprehensive methods for token balance checks, transfers, approvals, and allowances.
- Extended functionalities for enhanced token management.

## Installation

Install `ulujs` in your project with:

```bash
npm install ulujs
```

## Usage

Import and initialize the `arc72` library in your project:

```javascript
import algosdk from "algosdk";
import { arc72 as Contract } from "ulujs";

// Initialize Algod client
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
const indexerClient = new algosdk.Indexer(
  indexerToken,
  indexerServer,
  indexerPort
);

// Initialize ARC200 Contract instance
const tokenId = 123456; // Replace with your token ID
const contract = new Contract(tokenId, algodClient, indexerClient);
const tokenURIR = await contract.arc72_tokenURI(tokenId);
// if(!tokenURIR.success) ...
const tokenURI = tokenURIR.returnValue
```

### Event queries

The `query` argument may be used to retrieve matching events:

```javascript
const { minRound, maxRound, address, round, txid } = query || {};
```

`minRound` and `maxRound` may be used to specify a range of rounds to query events from. `address` may be used to filter events by address. `round` and `txid` may be used to retrieve events from a specific round or transaction ID.

### Standard events

The following events are available for standard ARC200 token functionalities:

### arc200_Transfer

Triggered when tokens are transferred from one account to another.

```javascript
await contract.arc200_Transfer();
//[
//   [
//         "WR4C7PMYKZ45ZWFWHTQRWHL424VDYXKYH4X2BX4J6KZ7BD3IQD4Q",
//         1519106,
//         1699029707,
//         "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ",
//         "VIAGCPULN6FUTHUNPQZDRQIHBT7IUVT264B3XDXLZNX7OZCJP6MEF7JFQU",
//         10000000000000000n,
//   ],
//   ...
//]
```

Additionally, the `query` argument may be used to retrieve matching events:

```javascript
await contract.arc200_Transfer(query);
// returns events matching query
await contract.arc200_Transfer({minRound: 1699029707});
// returns events with round >= 1699029707
```

### arc200_Approval

Triggered when a spender is approved to withdraw from an owner's account.

```javascript
await contract.arc200_Approval();
//[
//   [
//         "WR4C7PMYKZ45ZWFWHTQRWHL424VDYXKYH4X2BX4J6KZ7BD3IQD4Q",
//         1519106,
//         1699029707,
//         "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ",
//         "VIAGCPULN6FUTHUNPQZDRQIHBT7IUVT264B3XDXLZNX7OZCJP6MEF7JFQU",
//         10000000000000000n,
//   ],
//   ...
//]
```

Additionally, the `query` argument may be used to retrieve matching events:

```javascript
await contract.arc200_Transfer(query);
// returns events matching query
await contract.arc200_Approval({minRound: 1699029707});
// returns events with round >= 1699029707
```

### Non-standard events

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

### arc200_approve

Approve a spender to withdraw from your account, multiple times, up to the specified amount.

```javascript
// Simulate transaction
await contract.arc200_approve(spenderAddress, amount);
// Send transaction and wait for confirmation
await contract.arc200_approve(spenderAddress, amount, false, true);
```

### arc200_transferFrom

Perform a transfer of tokens from one account to another by an approved spender.

```javascript
// Simulate transaction
await contract.arc200_transferFrom(fromAddress, toAddress, amount);
// Send transaction and wait for confirmation
await contract.arc200_transferFrom(fromAddress, toAddress, amount, false, true);
```

### arc200_transfer

Transfer tokens to a specified address.

```javascript
// Simulate transaction
await contract.arc200_transfer(toAddress, amount);
// Send transaction and wait for confirmation
await contract.arc200_transfer(toAddress, amount, false, true);
```

### arc200_allowance

Check the amount that a spender is still allowed to withdraw from an owner.

```javascript
const allowance = await contract.arc200_allowance(ownerAddress, spenderAddress);
console.log("Allowance:", allowance.returnValue);
```

### arc200_balanceOf

Fetch the balance of the ARC200 token for a specific address.

```javascript
const balance = await contract.arc200_balanceOf(address);
console.log("Balance:", balance.returnValue);
```

### non-standard methods

The following methods are available for extended ARC200 token functionalities:

### getMetadata

Retrieve token metadata such as name, symbol, total supply, and decimals.

```javascript
const metadata = await contract.getMetadata();
console.log(metadata);
```

### hasBalance

Check if an address has any balance of the ARC200 token.

```javascript
const hasBalance = await contract.hasBalance(address);
console.log("Has balance:", hasBalance);
```

### hasAllowance

Determine if a spender is allowed to spend from a given address.

```javascript
const hasAllowance = await contract.hasAllowance(ownerAddress, spenderAddress);
console.log("Has allowance:", hasAllowance);
```

## API Reference

Each method provided by `arc200js` offers specific functionalities:

- `getMetadata()`: Retrieves essential metadata of the ARC200 token.
- `hasBalance(address)`: Checks if the given address has a balance of the token.
- `hasAllowance(owner, spender)`: Determines if the spender is authorized to spend from the owner's account.
- `arc200_approve(spender, amount)`: Approves a spender to withdraw up to a certain amount from the caller's account.
- `arc200_transferFrom(from, to, amount)`: Allows a spender to transfer tokens from one account to another.
- `arc200_transfer(to, amount)`: Enables direct transfer of tokens to a specified address.
- `arc200_allowance(owner, spender)`: Returns the remaining amount a spender is allowed to withdraw from an owner.
- `arc200_balanceOf(address)`: Provides the token balance of a given address.
- `arc200_Transfer(query)`: Retrieves all `arc200_Transfer` events of the ARC200 token.
- `arc200_Approval(query)`: Retrieves all `arc200_Approval` events of the ARC200 token.
- `getEvents()`: Retrieves all events of the ARC200 token.

## Contributing

Contributions to `arc200js` are welcome. Please adhere to the existing code style and ensure all tests pass.

## License

`arc200js` is [MIT licensed](./LICENSE).
