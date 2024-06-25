import arc200Schema from "../arc200/index.js";
const swapSchemaHumbleOnlyMethods = [
  {
    name: "_reachp_0",
    args: [
      {
        type: "(uint64,((byte[32],byte[8]),(uint64,uint64,uint64),address))",
      },
    ],
    returns: {
      type: "void",
    },
  },
  {
    name: "Trader_swapAForB",
    args: [{ type: "byte" }, { type: "uint256" }, { type: "uint256" }],
    returns: { type: "(uint256,uint256)" },
  },
  {
    name: "Trader_swapBForA",
    args: [{ type: "byte" }, { type: "uint256" }, { type: "uint256" }],
    returns: { type: "(uint256,uint256)" },
  },
  {
    name: "Info",
    args: [],
    returns: {
      type: "((uint256,uint256),(uint256,uint256),(uint256,uint256,uint256,address,byte),(uint256,uint256),uint64,uint64)",
    },
    readonly: true,
  },
  {
    name: "Provider_deposit",
    args: [
      { type: "byte" },
      { type: "(uint256,uint256)" },
      { type: "uint256" },
    ],
    returns: { type: "uint256" },
  },
];
const swapSchemaMethods = [...swapSchemaHumbleOnlyMethods];
const swapSchemaHumbleOnlyEvents = [
  {
    name: "HarvestEvent",
    args: [
      {
        type: "(uint256,uint256,uint256,address,byte)",
        name: "protoInfo",
        desc: "The protocol information (Humble only)",
      },
    ],
  },
];
const swapSchemaEvents = [
  ...swapSchemaHumbleOnlyEvents,
  ...["Deposit", "DepositEvent"].map((el) => ({
    name: el,
    args: [
      {
        type: "address",
        name: "who",
        desc: "The address of the user who initiated the deposit",
      },
      {
        type: "(uint256,uint256)",
        name: "inBals",
        desc: "The input balances of the deposit",
      },
      {
        type: "uint256",
        name: "lpOut",
        desc: "The amount of LP tokens minted",
      },
      {
        type: "(uint256,uint256)",
        name: "poolBals",
        desc: "The pool balances after the deposit",
      },
    ],
  })),
  ...["Swap", "SwapEvent"].map((el) => ({
    name: el,
    args: [
      {
        type: "address",
        name: "who",
        desc: "The address of the user who initiated the swap",
      },
      {
        type: "(uint256,uint256)",
        name: "inBals",
        desc: "The input balances of the swap",
      },
      {
        type: "(uint256,uint256)",
        name: "outBals",
        desc: "The output balances of the swap",
      },
      {
        type: "(uint256,uint256)",
        name: "poolBals",
        desc: "The pool balances after the swap",
      },
    ],
  })),
  ...["Withdraw", "WithdrawEvent"].map((el) => ({
    name: el,
    args: [
      {
        type: "address",
        name: "who",
        desc: "The address of the user who initiated the withdrawal",
      },
      {
        type: "uint256",
        name: "lpIn",
        desc: "The amount of LP tokens withdrawn",
      },
      {
        type: "(uint256,uint256)",
        name: "outBals",
        desc: "The output balances of the withdrawal",
      },
      {
        type: "(uint256,uint256)",
        name: "poolBals",
        desc: "The pool balances after the withdrawal",
      },
    ],
  })),
];
const swapSchema = {
  name: "Swap ABI",
  desc: "ABI for the HumbleSwap and Nomadex contracts",
  methods: [...arc200Schema.methods, ...swapSchemaMethods],
  events: [...arc200Schema.events, ...swapSchemaEvents],
};
export default swapSchema;
