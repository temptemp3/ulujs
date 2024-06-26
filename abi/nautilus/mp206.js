const schema = {
  name: "Nautilus NFT Sales Contract",
  desc: "Smart Contract to facilitate the sale on Nautilus NFT Marketplace",
  methods: [
    {
      name: "_reachp_0",
      args: [{ type: "uint64" }, { type: "uint64" }],
      returns: { type: "void" },
    },
    {
      name: "_reachp_2",
      args: [{ type: "uint64" }, { type: "(byte,byte[216])" }],
      returns: { type: "void" },
    },
    {
      name: "a_admin_grant",
      args: [{ type: "address" }],
      returns: { type: "void" },
    },
    { name: "a_admin_lock", args: [], returns: { type: "void" } },
    {
      name: "a_admin_updateFee",
      args: [{ type: "uint64" }],
      returns: { type: "void" },
    },
    {
      name: "a_sale_buyNet",
      args: [{ type: "uint256" }],
      returns: { type: "void" },
    },
    {
      name: "a_sale_buySC",
      args: [{ type: "uint256" }],
      returns: { type: "void" },
    },
    {
      name: "a_sale_deleteListing",
      args: [{ type: "uint256" }],
      returns: { type: "void" },
    },
    {
      name: "a_sale_listNet",
      args: [
        { type: "uint64" },
        { type: "uint256" },
        { type: "uint64" },
        { type: "uint64" },
        { type: "uint64" },
        { type: "uint64" },
        { type: "uint64" },
        { type: "uint64" },
        { type: "address" },
        { type: "address" },
        { type: "address" },
      ],
      returns: { type: "uint256" },
    },
    {
      name: "a_sale_listSC",
      args: [
        { type: "uint64" },
        { type: "uint256" },
        { type: "uint64" },
        { type: "uint256" },
        { type: "uint64" },
        { type: "uint64" },
        { type: "uint64" },
        { type: "uint64" },
        { type: "uint64" },
        { type: "address" },
        { type: "address" },
        { type: "address" },
      ],
      returns: { type: "uint256" },
    },
    {
      name: "arc200_transfer",
      args: [{ type: "uint64" }, { type: "address" }, { type: "uint256" }],
      returns: { type: "void" },
    },
    {
      name: "constructor",
      args: [],
      returns: { type: "address" },
      readonly: true,
    },
    {
      name: "manager",
      args: [],
      returns: { type: "address" },
      readonly: true,
    },
    { name: "nop", args: [], returns: { type: "void" } },
    {
      name: "state",
      args: [],
      returns: { type: "(address,byte,uint64,uint256)" },
      readonly: true,
    },
    {
      name: "supportsInterface",
      args: [{ type: "byte[4]" }],
      returns: { type: "byte" },
      readonly: true,
    },
    { name: "touch", args: [], returns: { type: "void" } },
    {
      name: "v_sale_listingByIndex",
      args: [{ type: "uint256" }],
      returns: {
        type: "(uint64,uint256,address,(byte,byte[40]),uint64,uint64,uint64,uint64,uint64,uint64,address,address,address)",
      },
    },
    {
      name: "zeroAddress",
      args: [],
      returns: { type: "address" },
      readonly: true,
    },
  ],
  events: [
    {
      name: "e_sale_BuyEvent",
      args: [{ type: "uint256" }, { type: "address" }],
    },
    { name: "e_sale_DeleteListingEvent", args: [{ type: "uint256" }] },
    {
      name: "e_sale_ListEvent",
      args: [
        { type: "uint256" },
        { type: "uint64" },
        { type: "uint256" },
        { type: "address" },
        { type: "(byte,byte[40])" },
        { type: "uint64" },
        { type: "uint64" },
      ],
    },
  ],
};
export default schema;
