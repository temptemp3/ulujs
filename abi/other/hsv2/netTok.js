const netTokSchema = {
  name: "HumbleSwap v2 Net2Tok LP",
  desc: "Provides liquidity for HumbleSwap v2 Net2Tok",
  methods: [
    {
      name: "Provider_deposit",
      args: [
        { type: "uint64", name: "amount0" },
        { type: "uint64", name: "amount1" },
      ],
      returns: {
        type: "uint64",
      },
    },
  ],
  events: [],
};
export default netTokSchema;
