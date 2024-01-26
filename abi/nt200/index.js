import arc200Spec from "../arc200/index.js";
const nt200Schema = {
  name: "Wrapped VOI",
  desc: "wVOI",
  methods: [
    {
      name: "withdraw",
      args: [
        {
          name: "amount",
          type: "uint64",
        },
      ],
      returns: {
        type: "uint256",
      },
    },
    {
      name: "touch",
      args: [],
      returns: {
        type: "void",
      },
    },
    {
      name: "deregister",
      args: [],
      returns: {
        type: "byte",
      },
    },
    {
      name: "deposit",
      args: [
        {
          name: "amount",
          type: "uint64",
        },
      ],
      returns: {
        type: "uint256",
      },
    },
  ],
  events: [],
};
const arc200Schema = {
  ...nt200Schema,
  methods: [...nt200Schema.methods, ...arc200Spec.methods],
  events: [...nt200Schema.events, ...arc200Spec.events]
};
export default arc200Schema;
