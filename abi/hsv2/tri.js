//_ALGO={ABI:{impure:["Triumvir_propose((byte,byte[96]))byte[0]","Triumvir_support(uint64,(byte,byte[96]))byte[0]","register(uint64,(byte,byte[8]),uint64)(uint64,uint64,uint64,address,byte)"],pure:["Info()(address[3],(byte,byte[96])[3],(uint64,uint64,uint64,address,byte))"],sigs:["Info()(address[3],(byte,byte[96])[3],(uint64,uint64,uint64,address,byte))","Triumvir_propose((byte,byte[96]))byte[0]","Triumvir_support(uint64,(byte,byte[96]))byte[0]","register(uint64,(byte,byte[8]),uint64)(uint64,uint64,uint64,address,byte)"]},
const triSchema = {
  name: "Triumvirate",
  desc: "Multi-sig contract with 3 members and 2/3 consensus for liquidity pool",
  methods: [
    {
      name: "Info",
      args: [],
      returns: {
        type: "(address[3],(byte,byte[129])[3],(uint256,uint256,uint256,address,byte))",
      },
      readonly: true,
    },
    {
      name: "Umvir_propose",
      args: [{ type: "byte" }, { type: "byte[129]" }],
      returns: { type: "byte" },
    },
    {
      name: "Umvir_support",
      args: [{ type: "uint64" }, { type: "(byte,byte[129])" }],
      returns: { type: "byte" },
    },
    {
      name: "_reachp_0",
      args: [
        { type: "uint64" },
        { type: "address[3]" },
        { type: "(uint256,uint256,uint256)" },
      ],
      returns: { type: "void" },
    },
    {
      name: "_reachp_2",
      args: [{ type: "uint64" }, { type: "(byte,byte[138])" }],
      returns: { type: "void" },
    },
    {
      name: "register",
      args: [{ type: "uint64" }, { type: "uint64" }, { type: "uint64" }],
      returns: { type: "(uint256,uint256,uint256,address,byte)" },
    },
  ],
  events: [{ name: "Register", args: [{ type: "(uint64,uint64,uint64)" }] }],
};
export default triSchema;