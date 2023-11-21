# arc200js

`arc200js` is a JavaScript library for interacting with ARC200 tokens on the AVM blockchains. It provides a convenient interface for both standard and extended ARC200 token functionalities.

## Features

- Interaction with ARC200 tokens on the AVM blockchains.
- Comprehensive methods for token balance checks, transfers, approvals, and allowances.
- Extended functionalities for enhanced token management.

## Installation

Install `arc200js` in your project with:

```bash
npm install arc200js
```

## Usage

Import and initialize the `arc200js` library in your project:

```javascript
import algosdk from 'algosdk';
import Contract from 'arc200js';

// Initialize Algod client
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Initialize ARC200 Contract instance
const tokenId = 123456; // Replace with your token ID
const contract = new Contract(tokenId, algodClient);
```

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

## Contributing

Contributions to `arc200js` are welcome. Please adhere to the existing code style and ensure all tests pass.

## License

`arc200js` is [MIT licensed](./LICENSE).