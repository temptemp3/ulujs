const swap200Schema = {
  name: "SWAP-200",
  desc: "ARC200 Based AMM Interface",
  methods: [
    {
      name: "Info",
      args: [],
      returns: {
        type: "((uint256,uint256),(uint256,uint256),(uint256,uint256,uint256,address,byte),(uint256,uint256),uint64,uint64)",
      },
      readonly: true,
    },
    {
      name: "Protocol_delete",
      args: [],
      returns: {
        type: "void",
      },
    },
    {
      name: "Protocol_harvest",
      args: [
        {
          type: "address",
        },
        {
          type: "(uint256,uint256,uint256,address,byte)",
        },
      ],
      returns: {
        type: "((uint256,uint256),uint64)",
      },
    },
    {
      name: "Provider_deposit",
      args: [
        {
          type: "uint256",
        },
        {
          type: "uint256)",
        },
        {
          type: "uint25",
        },
      ],
      returns: {
        type: "uint256",
      },
    },
    {
      name: "Provider_depositA",
      args: [
        {
          type: "uint256",
        },
      ],
      returns: {
        type: "uint256",
      },
    },
    {
      name: "Provider_depositB",
      args: [
        {
          type: "uint256",
        },
      ],
      returns: {
        type: "uint256",
      },
    },
    {
      name: "Provider_withdraw",
      args: [
        {
          type: "uint256",
        },
        {
          type: "(uint256,uint256)",
        },
      ],
      returns: {
        type: "(uint256,uint256)",
      },
    },
    {
      name: "Provider_withdrawA",
      args: [
        {
          type: "uint256",
        },
      ],
      returns: {
        type: "uint256",
      },
    },
    {
      name: "Provider_withdrawB",
      args: [
        {
          type: "uint256",
        },
      ],
      returns: {
        type: "uint256",
      },
    },
    {
      name: "Trader_exactSwapAForB",
      args: [
        {
          type: "byte",
        },
        {
          type: "uint256",
        },
        {
          type: "uint256",
        },
      ],
      returns: {
        type: "(uint256,uint256)",
      },
    },
    {
      name: "Trader_exactSwapBForA",
      args: [
        {
          type: "byte",
        },
        {
          type: "uint256",
        },
        {
          type: "uint256",
        },
      ],
      returns: {
        type: "(uint256,uint256)",
      },
    },
    {
      name: "Trader_swapAForB",
      args: [
        {
          type: "byte",
        },
        {
          type: "uint256",
        },
        {
          type: "uint256",
        },
      ],
      returns: {
        type: "(uint256,uint256)",
      },
    },
    {
      name: "Trader_swapBForA",
      args: [
        {
          type: "byte",
        },
        {
          type: "uint256",
        },
        {
          type: "uint256",
        },
      ],
      returns: {
        type: "(uint256,uint256)",
      },
    },
    {
      name: "_reachp_0",
      args: [
        {
          type: "uint64",
        },
        {
          type: "(uint64,byte[32],byte[8]),uint64,uint64,uint64,addres)",
        },
      ],
      returns: {
        type: "void",
      },
    },
    {
      name: "_reachp_2",
      args: [
        {
          type: "uint64",
        },
        {
          type: "",
        },
      ],
      returns: {
        type: "void",
      },
    },
    {
      name: "_reachp_3",
      args: [
        {
          type: "uint64",
        },
        {
          type: "(byte,byte[161])",
        },
      ],
      returns: {
        type: "void",
      },
    },
    {
      name: "arc200_allowance",
      args: [
        {
          type: "address",
        },
        {
          type: "address",
        },
      ],
      returns: {
        type: "uint256",
      },
      readonly: true,
    },
    {
      name: "arc200_approve",
      args: [
        {
          type: "address",
        },
        {
          type: "uint256",
        },
      ],
      returns: {
        type: "byte",
      },
    },
    {
      name: "arc200_balanceOf",
      args: [
        {
          type: "address",
        },
      ],
      returns: {
        type: "uint256",
      },
      readonly: true,
    },
    {
      name: "arc200_decimals",
      args: [],
      returns: {
        type: "uint64",
      },
      readonly: true,
    },
    {
      name: "arc200_name",
      args: [],
      returns: {
        type: "byte[32]",
      },
      readonly: true,
    },
    {
      name: "arc200_symbol",
      args: [],
      returns: {
        type: "byte[8]",
      },
      readonly: true,
    },
    {
      name: "arc200_totalSupply",
      args: [],
      returns: {
        type: "uint256",
      },
      readonly: true,
    },
    {
      name: "arc200_transfer",
      args: [
        {
          type: "address",
        },
        {
          type: "uint256",
        },
      ],
      returns: {
        type: "byte",
      },
    },
    {
      name: "arc200_transferFrom",
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
      returns: {
        type: "byte",
      },
    },
    {
      name: "createAllowanceBox",
      args: [
        {
          type: "address",
        },
        {
          type: "address",
        },
      ],
      returns: {
        type: "void",
      },
    },
    {
      name: "createBalanceBoxes",
      args: [
        {
          type: "address",
        },
      ],
      returns: {
        type: "void",
      },
    },
    {
      name: "hasBox",
      args: [
        {
          type: "byte",
        },
        {
          type: "byte[64]",
        },
      ],
      returns: {
        type: "byte",
      },
      readonly: true,
    },
    {
      name: "reserve",
      args: [
        {
          type: "address",
        },
      ],
      returns: {
        type: "(uint256,uint256)",
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
