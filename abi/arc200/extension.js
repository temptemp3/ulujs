const arc200ExtensionSchema = {
  "name": "ARC-200",
  "desc": "Smart Contract Token Nonstandard Interface",
  "methods": [
    {
      "name": "hasBalance",
      "desc": "Transfers tokens from source to destination as approved spender",
      "readonly": true,
      "args": [
        {
          "type": "address",
          "name": "addr",
          "desc": "The source  of the transfer"
        }
      ],
      "returns": { "type": "byte", "desc": "Success" }
    },
    {
      "name": "hasAllowance",
      "desc": "Transfers tokens from source to destination as approved spender",
      "readonly": true,
      "args": [
        { "type": "address", "name": "owner" },
        { "type": "address", "name": "spender" }
      ],
      "returns": { "type": "byte", "desc": "Success" }
    },
    {
      "name": "touch",
      "desc": "Transfers tokens from source to destination as approved spender",
      "args": [],
      "returns": { "type": "void" }
    },
    {
      "name": "state",
      "desc": "",
      "readonly": true,
      "args": [],
      "returns": {
        "type": "(byte[32],byte[8],uint64,uint256,address,address,byte,byte)",
        "desc": ""
      }
    }
  ],
  "events": []
}
export default arc200ExtensionSchema;