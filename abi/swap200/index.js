const swap200Schema = {
  name: "SWAP-200",
  desc: "HumbleSwap Voi AMM Interface",
  methods: [
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
  ],
  events: [
    {
      name: "DepositEvent",
      args: [
        {
          type: "(address,(uint256,uint256),uint256,(uint256,uint256),(uint256,uint256))",
        },
      ],
    },
    {
      name: "HarvestEvent",
      args: [
        {
          type: "((uint256,uint256,uint256,address,byte))",
        },
      ],
    },
    {
      name: "SwapEvent",
      args: [
        {
          type: "(address,(uint256,uint256),(uint256,uint256),(uint256,uint256))",
        },
      ],
    },
    {
      name: "WithdrawEvent",
      args: [
        {
          type: "(address,(uint256,uint256))",
        },
      ],
    },
    {
      name: "arc200_Approval",
      args: [
        {
          type: "address",
        },
        {
          type: "address",
        },
        {
          type: "uint256",
        },
      ],
    },
    {
      name: "arc200_Transfer",
      args: [
        {
          type: "address",
        },
        {
          type: "address",
        },
        {
          type: "uint256",
        },
      ],
    },
  ],
};
export default swap200Schema;
