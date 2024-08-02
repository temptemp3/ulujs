import arc200Spec from "../arc200/index.js";
import registerSchema from "../register/index.js";
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
    {
      name: "createBalanceBox",
      args: [
        {
          type: "address",
        },
      ],
      returns: {
        type: "byte",
      },
    },
  ],
  events: [],
};
const arc200Schema = {
  ...nt200Schema,
  methods: [
    ...nt200Schema.methods,
    ...arc200Spec.methods,
    ...registerSchema.methods,
  ],
  events: [
    ...nt200Schema.events,
    ...arc200Spec.events,
    ...registerSchema.events,
  ],
};
export default arc200Schema;
