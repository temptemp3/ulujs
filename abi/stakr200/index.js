const stakr200Schema = {
  name: "STAKR-200",
  desc: "ARC200 Staking Pool",
  methods: [
    {
      name: "Admin_deletePool",
      args: [
        {
          type: "uint64"
        },
      ],
      returns: {
        type: "(uint64,((uint64),uint64,(uint256),uint64,uint64),address,uint256,(uint256),uint64,(uint256),(uint256))",
      },
    },
    {
      name: "Admin_grant",
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
      name: "Admin_updateFee",
      args: [
        {
          type: "uint64",
        },
      ],
      returns: {
        type: "void",
      },
    },
    {
      name: "Funder_deployPool",
      args: [
        {
          type: "uint64",
        },
        {
          type: "uint64",
        },
        {
          type: "uint256",
        },
        {
          type: "uint64",
        },
        {
          type: "uint64",
        },
      ],
      returns: {
        type: "uint64",
      },
    },
    {
      name: "Info",
      args: [
        {
          type: "uint64",
        },
      ],
      returns: {
        type: "(uint64,((uint64),uint64,(uint256),uint64,uint64),address,uint256,(uint256),uint64,(uint256),(uint256))",
      },
      readonly: true,
    },
    {
      name: "Opts",
      args: [],
      returns: {
        type: "((uint64),uint64,(uint256),uint64,uint64)",
      },
      readonly: true,
    },
    {
      name: "Staker_emergencyWithdraw",
      args: [
        {
          type: "uint64",
        },
      ],
      returns: {
        type: "(uint256,uint256)",
      },
    },
    {
      name: "Staker_harvest",
      args: [
        {
          type: "uint64",
        },
      ],
      returns: {
        type: "((uint256),(uint256))",
      },
    },
    {
      name: "Staker_stake",
      args: [
        {
          type: "uint64",
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
      name: "Staker_withdraw",
      args: [
        {
          type: "uint64",
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
          type: "address",
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
          type: "(byte,byte[64])",
        },
      ],
      returns: {
        type: "void",
      },
    },
    {
      name: "nop",
      args: [],
      returns: {
        type: "void",
      },
    },
    {
      name: "rewardsAvailable",
      args: [
        {
          type: "uint64",
        },
        {
          type: "address",
        },
      ],
      returns: {
        type: "(uint256)",
      },
      readonly: true,
    },
    {
      name: "rewardsAvailableAt",
      args: [
        {
          type: "uint64",
        },
        {
          type: "address",
        },
        {
          type: "uint64",
        },
      ],
      returns: {
        type: "(uint256)",
      },
      readonly: true,
    },
    {
      name: "staked",
      args: [
        {
          type: "uint64",
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
      name: "touch",
      args: [],
      returns: {
        type: "void",
      },
    },
  ],
  events: [
    {
      name: "DeletePool",
      args: [
        {
          type: "uint64",
        },
        {
          type: "address",
        },
      ],
    },
    {
      name: "EmergencyWithdraw",
      args: [
        {
          type: "uint64",
        },
        {
          type: "address",
        },
        {
          type: "uint256",
        },
        {
          type: "(uint256,uint256)",
        },
        {
          type: "address",
        },
      ],
    },
    {
      name: "Harvest",
      args: [
        {
          type: "uint64",
        },
        {
          type: "address",
        },
        {
          type: "((uint256),(uint256))",
        },
        {
          type: "address",
        },
      ],
    },
    {
      name: "Pool",
      args: [
        {
          type: "uint64",
          name: "poolId",
        },
        {
          type: "address",
          name: "who",
        },
        {
          type: "uint64",
          name: "stakeToken",
        },
        {
          type: "(uint64)",
          name: "rewardsToken",
        },
        {
          type: "(uint256)",
          name: "rewards",
        },
        {
          type: "uint64",
          name: "start",
        },
        {
          type: "uint64",
          name: "end",
        },
      ],
    },
    {
      name: "Stake",
      args: [
        {
          type: "uint64",
        },
        {
          type: "address",
        },
        {
          type: "uint256",
        },
        {
          type: "(uint256,uint256)",
        },
      ],
    },
    {
      name: "Withdraw",
      args: [
        {
          type: "uint64",
        },
        {
          type: "address",
        },
        {
          type: "uint256",
        },
        {
          type: "(uint256,uint256)",
        },
        {
          type: "address",
        },
      ],
    },
  ],
};
export default stakr200Schema;
