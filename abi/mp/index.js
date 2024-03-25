// ABI: {
//   impure: [`_reachp_0((uint64,(address)))void`, `_reachp_2((uint64,(byte,byte[48])))void`, `buyNet(uint256)uint256`, `deleteNetListing(uint256)void`, `grant(address)void`, `listNet(uint64,uint256,uint64)uint256`, `lock()void`, `touch()void`],
//   pure: [`listingByIndex(uint256)(uint64,uint256,address,(byte,byte[40]))`, `state()(address,byte,byte,uint256,address,address)`],
//   sigs: [`_reachp_0((uint64,(address)))void`, `_reachp_2((uint64,(byte,byte[48])))void`, `buyNet(uint256)uint256`, `deleteNetListing(uint256)void`, `grant(address)void`, `listNet(uint64,uint256,uint64)uint256`, `listingByIndex(uint256)(uint64,uint256,address,(byte,byte[40]))`, `lock()void`, `state()(address,byte,byte,uint256,address,address)`, `touch()void`]
//   }
const mp206Schema = {
  name: "mp206",
  desc: "mp206",
  methods: [
    // listNet(uint64,uint256,uint64)uint256
    {
      name: "listNet",
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
      ],
      returns: {
        name: "listId",
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
    // // deleteNetListing(uint256)void
    // {
    //   name: "deleteNetListing",
    //   args: [
    //     {
    //       name: "listId",
    //       type: "uint256",
    //     },
    //   ],
    // },
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
    // },
    // lock()void
    // {
    //   name: "lock",
    // },
    // touch()void
    // {
    //   name: "touch",
    // },
    // grant(address)void
    // {
    //   name: "grant",
    //   args: [
    //     {
    //       name: "newOwner",
    //       type: "address",
    //     },
    //   ],
    // },
  ],
  // ListEvent: [UInt256, Contract, UInt256, Address, Price], // ListId, CollectionId, CollectionAddress, TokenId, ListPrice
  // BuyEvent: [Contract, UInt256, Address, Price, Address], // CollectionId, TokenId, ListAddr, ListPrice, BuyAddr
  // DeleteNetListingEvent: [UInt256], // ListId
  events: [
    {
      "name": "ListEvent",
      "args": [
        {
          "type": "uint256",
          "name": "listingId"
        },
        {
          "type": "uint64",
          "name": "contractId"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        },
        {
          "type": "address",
          "name": "listAddr"
        },
        {
          "type": "(byte,byte[40])",
          "name": "listPrice"
        },
        {
          "type": "uint64",
          "name": "endTime"
        },
        {
          "type": "uint64",
          "name": "royalty"
        }
      ]
    },
    {
      "name": "BuyEvent",
      "args": [
        {
          "type": "uint256",
          "name": "listingId"
        },
        {
          "type": "address",
          "name": "buyer"
        }
      ]
    },
    {
      "name": "DeleteNetListingEvent",
      "args": [
        {
          "type": "uint256",
          "name": "listingId"
        }
      ]
    }
  ],
};
export default mp206Schema;
