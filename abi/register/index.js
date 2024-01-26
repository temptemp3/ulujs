const registerSchema = {
  name: "Registered",
  desc: "Registered contract interface",
  methods: [
    // register
    {
      name: "deregister",
      args: [],
      returns: {
        type: "byte",
      },
    },
  ],
  events: [],
};
export default registerSchema;