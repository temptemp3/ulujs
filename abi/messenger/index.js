const messengerSchema = {
  name: "Messenger",
  desc: "Participation key messenger",
  methods: [
    {
      "name": "partkey_broastcast",
      "args": [
        {
          "type": "address",
          "name": "address"
        },
        {
          "type": "byte[32]",
          "name": "vote_k"
        },
        {
          "type": "byte[32]",
          "name": "sel_k"
        },
        {
          "type": "uint64",
          "name": "vote_fst"
        },
        {
          "type": "uint64",
          "name": "vote_lst"
        },
        {
          "type": "uint64",
          "name": "vote_kd"
        },
        {
          "type": "byte[64]",
          "name": "sp_key"
        }
      ],
      "returns": {
        "type": "void"
      }
    },
    {
      "name": "approve_update",
      "args": [
        {
          "type": "bool",
          "name": "approval"
        }
      ],
      "returns": {
        "type": "void"
      }
    },
    {
      "name": "set_version",
      "args": [
        {
          "type": "uint64",
          "name": "contract_version"
        },
        {
          "type": "uint64",
          "name": "deployment_version"
        }
      ],
      "returns": {
        "type": "void"
      }
    }
  ],
  events: [
    {
      name: "PartKeyInfo",
      args: [
        {
          type: "address",
          name: "who",
        },
        {
          type: "address",
          name: "adddress",
        },
        {
          type: "byte[32]",
          name: "vote_k",
        },
        {
          type: "byte[32]",
          name: "sel_k",
        },
        {
          type: "uint64",
          name: "vote_fst",
        },
        {
          type: "uint64",
          name: "vote_lst",
        },
        {
          type: "uint64",
          name: "vote_kd",
        },
        {
          type: "byte[64]",
          name: "sp_key",
        },
      ],
    },
  ],
};
export default swap200Schema;
