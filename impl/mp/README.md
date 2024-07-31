# mp

`mp` is a JavaScript library for interacting with Nautilus NFT Marketplace listings. It provides a convenient interface for sales in both network tokens and smart assets.

## usage

### Buy asset listed on marketplace 

```javascript
import { mp } from "ulujs";
// address 
// algodClient, indexerClient
// listing NFTIndexerListing (https://arc72-idx.nftnavigator.xyz/nft-indexer/v1/mp/listings?active=true)
// currency ARC200IndexerToken (https://arc72-idx.nautilus.sh/nft-indexer/v1/arc200/tokens?contractId=51060671)
const customR = await mp.buy(
  address,  // Address of buyer
  listing,  // NFTIndexerListing
  currency, // ARC200IndexerToken
  {
    algodClient,
    indexerClient,
    paymentTokenId: listing.currency === 0 ? TOKEN_WVOI2 : listing.currency, // which token to use for payment with network token as wrapped network 
    wrappedNetworkTokenId: TOKEN_WVOI2, // which token to use for wrapped network token
    extraTxns: [], // optional extra transactions to include in the atomic transfer such voi swap to payment token if available
});
// sign and send txns if using txnlabs/use-wallet
await signTransactions(
  customR.txns.map(
    (txn: string) => new Uint8Array(Buffer.from(txn, "base64"))
  )
).then(sendTransactions);
```

Return value of `mp.buy`

on **failure**

```javascript
{
  success: false;
  error: string;
}
```

on **success**

```
{
  success: true;
  txns: string[]; // base64 encoded txns to sign
  objs: any[]; // can be used as extra txns to ci custom
}
```

### List asset on marketplace 

```javascript
import { mp } from "ulujs";
// address 
// algodClient, indexerClient
// nft NFTIndexerTokenI (https://arc72-idx.nautilus.sh/nft-indexer/v1/tokens?limit=1)
// currency ARC200IndexerToken (https://arc72-idx.nautilus.sh/nft-indexer/v1/arc200/tokens?contractId=51060671)
const customR = await mp.list(
  address, // string
  nft, // NFTIndexerTokenI
  price, // string (AU) (ex "10000000000")
  currency, // ARC200IndexerToken
  {
    algodClient, 
    indexerClient,  
    paymentTokenId, // number
    wrappedNetworkTokenId: TOKEN_WVOI2, // number 
    mpContractId: ctcInfoMp206, // number 
    extraTxns: [], // extar transaction to include before listing txn (optional)
    enforceRoyalties: false, // include royalty payout in listing (optional, default=false) 
    listingBoxPaymentOverride: ListingBoxCost + nft.tokenId, // number, n >= ListingBoxCost (optional)
    listingsToDelete: [] // NFTIndexerListing[] (optional)
  }
);
// sign and send txns if using txnlabs/use-wallet
await signTransactions(
  customR.txns.map(
    (txn: string) => new Uint8Array(Buffer.from(txn, "base64"))
  )
).then(sendTransactions);
```

Return value of `mp.list`

on **failure**

```javascript
{
  success: false;
  error: string;
}
```

on **success**

```
{
  success: true;
  txns: string[]; // base64 encoded txns to sign
  objs: any[]; // can be used as extra txns to ci custom
}
```
