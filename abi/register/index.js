const registerSchema = {
  name: "Registered",
  desc: "Registered contract interface",
  methods: [
    {
      name: "register",
      desc: "",
      args: [
        { name: "votekey", type: "byte[32]" },
        { name: "selkey", type: "byte[32]" },
        { name: "spkey", type: "byte[64]" },
        { name: "votefst", type: "uint64" },
        { name: "votelst", type: "uint64" },
        { name: "votekd", type: "uint64" },
      ],
      returns: { type: "byte" },
    },
    {
      name: "deregister",
      desc: "",
      args: [],
      returns: { type: "byte" },
    },
  ],
  events: [],
};
export default registerSchema;
