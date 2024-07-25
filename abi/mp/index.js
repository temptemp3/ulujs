// ABI: {
//   impure: [`_reachp_0((uint64,(address)))void`, `_reachp_2((uint64,(byte,byte[48])))void`, `buyNet(uint256)uint256`, `deleteNetListing(uint256)void`, `grant(address)void`, `listNet(uint64,uint256,uint64)uint256`, `lock()void`, `touch()void`],
//   pure: [`listingByIndex(uint256)(uint64,uint256,address,(byte,byte[40]))`, `state()(address,byte,byte,uint256,address,address)`],
//   sigs: [`_reachp_0((uint64,(address)))void`, `_reachp_2((uint64,(byte,byte[48])))void`, `buyNet(uint256)uint256`, `deleteNetListing(uint256)void`, `grant(address)void`, `listNet(uint64,uint256,uint64)uint256`, `listingByIndex(uint256)(uint64,uint256,address,(byte,byte[40]))`, `lock()void`, `state()(address,byte,byte,uint256,address,address)`, `touch()void`]
//   }
const mp206Schema = {
  name: "mp206",
  desc: "mp206",
  methods: [
    // a_sale_listNet(CollectionId, TokenId, ListPrice, EndTime, RoyaltyPoints, CreatePoints1, CreatorPoint2, CreatorPoint3, CreatorAddr1, CreatorAddr2, CreatorAddr3)ListId
    {
      name: "a_sale_listNet",
      args: [
        {
          name: "collectionId",
          type: "uint64",
        },
        {
          name: "tokenId",
          type: "uint256",
        },
        {
          name: "listPrice",
          type: "uint64",
        },
        {
          name: "endTime",
          type: "uint64",
        },
        {
          name: "royalty",
          type: "uint64",
        },
        {
          name: "createPoints1",
          type: "uint64",
        },
        {
          name: "creatorPoint2",
          type: "uint64",
        },
        {
          name: "creatorPoint3",
          type: "uint64",
        },
        {
          name: "creatorAddr1",
          type: "address",
        },
        {
          name: "creatorAddr2",
          type: "address",
        },
        {
          name: "creatorAddr3",
          type: "address",
        },
      ],
      returns: {
        type: "uint256",
      },
    },
    // a_sale_listNet(CollectionId, TokenId, PaymentTokenId, ListPrice, EndTime, RoyaltyPoints, CreatePoints1, CreatorPoint2, CreatorPoint3, CreatorAddr1, CreatorAddr2, CreatorAddr3)ListId
    {
      name: "a_sale_listSC",
      args: [
        {
          name: "collectionId",
          type: "uint64",
        },
        {
          name: "tokenId",
          type: "uint256",
        },
        {
          name: "paymentTokenId",
          type: "uint64",
        },
        {
          name: "listPrice",
          type: "uint256",
        },
        {
          name: "endTime",
          type: "uint64",
        },
        {
          name: "royalty",
          type: "uint64",
        },
        {
          name: "createPoints1",
          type: "uint64",
        },
        {
          name: "creatorPoint2",
          type: "uint64",
        },
        {
          name: "creatorPoint3",
          type: "uint64",
        },
        {
          name: "creatorAddr1",
          type: "address",
        },
        {
          name: "creatorAddr2",
          type: "address",
        },
        {
          name: "creatorAddr3",
          type: "address",
        },
      ],
      returns: {
        type: "uint256",
      },
    },
    // buyNet(uint256)uint256
    {
      name: "buyNet",
      args: [
        {
          name: "listId",
          type: "uint256",
        },
      ],
      returns: {
        name: "tokenId",
        type: "uint256",
      },
    },
    // buySC(uint256)uint256
    {
      name: "a_sale_buySC",
      args: [
        {
          name: "listId",
          type: "uint256",
        },
      ],
      returns: {
        type: "void",
      },
    },
     // buyNet(uint256)uint256
     {
      name: "a_sale_buyNet",
      args: [
        {
          name: "listId",
          type: "uint256",
        },
      ],
      returns: {
        type: "void",
      },
    },
    // a_sale_deleteListing(ListingId)
    {
      name: "a_sale_deleteListing",
      args: [
        {
          type: "uint256",
          name: "listingId",
        },
      ],
      returns: {
        type: "void",
      },
    },
    // listingByIndex(uint256)(uint64,uint256,address,(byte,byte[40]))
    {
      name: "listingByIndex",
      args: [
        {
          type: "uint256",
        },
      ],
      readonly: true,
      returns: {
        type: "(uint64,uint256,address,(byte,byte[40]))",
      },
    },
    // state()(address,byte,byte,uint256,address,address)
    {
      name: "state",
      args: [],
      readonly: true,
      returns: {
        type: "(address,byte,byte,uint256,address,address)",
      },
    },
    // manager()(address)
    {
      name: "manager",
      args: [],
      readonly: true,
      returns: {
        type: "address",
      },
    },
  ],
  // ListEvent: [UInt256, Contract, UInt256, Address, Price], // ListId, CollectionId, CollectionAddress, TokenId, ListPrice
  // BuyEvent: [Contract, UInt256, Address, Price, Address], // CollectionId, TokenId, ListAddr, ListPrice, BuyAddr
  // DeleteNetListingEvent: [UInt256], // ListId
  events: [
    {
      name: "e_sale_ListEvent",
      args: [
        {
          type: "uint256",
          name: "listingId",
        },
        {
          type: "uint64",
          name: "contractId",
        },
        {
          type: "uint256",
          name: "tokenId",
        },
        {
          type: "address",
          name: "listAddr",
        },
        {
          type: "(byte,byte[40])",
          name: "listPrice",
        },
        {
          type: "uint64",
          name: "endTime",
        },
        {
          type: "uint64",
          name: "royalty",
        },
      ],
    },
    {
      name: "e_sale_BuyEvent",
      args: [
        {
          type: "uint256",
          name: "listingId",
        },
        {
          type: "address",
          name: "buyer",
        },
      ],
    },
    {
      name: "e_sale_DeleteListingEvent",
      args: [
        {
          type: "uint256",
          name: "listingId",
        },
      ],
    },
  ],
};
export default mp206Schema;
